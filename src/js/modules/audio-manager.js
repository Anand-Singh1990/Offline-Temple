export class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.activeSounds = new Map();
        this.masterVolume = 0.5;
        this.isMuted = false;
    }

    start() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMasterVolume(value) {
        this.masterVolume = Math.max(0, Math.min(1, value));
        this.activeSounds.forEach(sound => {
            if (sound.gainNode) {
                sound.gainNode.gain.setTargetAtTime(this.masterVolume * sound.individualVolume, this.ctx.currentTime, 0.1);
            }
        });
    }

    toggleSound(type) {
        if (this.activeSounds.has(type)) {
            this.stopSound(type);
            return false;
        } else {
            this.playSound(type);
            return true;
        }
    }

    playSound(type) {
        this.start();

        // Stop if already playing (though toggle handles this, playing directly might separate logic)
        if (this.activeSounds.has(type)) return;

        let soundObj = {
            stop: () => { },
            gainNode: this.ctx.createGain(),
            individualVolume: 0.5 // Default individual volume
        };

        soundObj.gainNode.connect(this.ctx.destination);
        soundObj.gainNode.gain.value = this.masterVolume * soundObj.individualVolume;

        if (type === 'om') {
            this.createOmSound(soundObj);
        } else if (type === 'bell') {
            this.createBellSound(soundObj);
        } else if (type === 'rain') {
            this.createRainSound(soundObj);
        } else if (type === 'forest') {
            this.createForestSound(soundObj); // New sound
        }

        this.activeSounds.set(type, soundObj);
        return true;
    }

    stopSound(type) {
        const sound = this.activeSounds.get(type);
        if (sound) {
            sound.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
            setTimeout(() => {
                sound.stop();
                sound.gainNode.disconnect();
            }, 500);
            this.activeSounds.delete(type);
        }
    }

    stopAll() {
        this.activeSounds.forEach((_, key) => this.stopSound(key));
    }

    createOmSound(soundObj) {
        const osc = this.ctx.createOscillator();
        osc.frequency.value = 136.1; // C#3 - Om frequency
        osc.type = 'sine';

        // Add a second harmonic for richness
        const osc2 = this.ctx.createOscillator();
        osc2.frequency.value = 136.1 * 2;
        osc2.type = 'sine';
        const gain2 = this.ctx.createGain();
        gain2.gain.value = 0.1;

        osc.connect(soundObj.gainNode);
        osc2.connect(gain2);
        gain2.connect(soundObj.gainNode);

        osc.start();
        osc2.start();

        soundObj.stop = () => {
            osc.stop();
            osc2.stop();
        };
    }

    createBellSound(soundObj) {
        // Bell relies on intervals, so we manage that here
        const playBell = () => {
            const freqs = [200, 400, 800, 1200, 1600];
            const gains = [1.0, 0.5, 0.3, 0.2, 0.1];

            freqs.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const nodeGain = this.ctx.createGain();

                osc.frequency.value = freq;
                osc.type = 'sine';

                nodeGain.gain.setValueAtTime(0, this.ctx.currentTime);
                nodeGain.gain.linearRampToValueAtTime(gains[i], this.ctx.currentTime + 0.05);
                nodeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4);

                osc.connect(nodeGain);
                nodeGain.connect(soundObj.gainNode);

                osc.start();
                osc.stop(this.ctx.currentTime + 4);
            });
        };

        playBell();
        const interval = setInterval(playBell, 4500);
        soundObj.stop = () => clearInterval(interval);
    }

    createRainSound(soundObj) {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const bandpass = this.ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1000;
        bandpass.Q.value = 0.5;

        whiteNoise.connect(bandpass);
        bandpass.connect(soundObj.gainNode);
        whiteNoise.start();

        soundObj.stop = () => whiteNoise.stop();
    }

    playChant(callback) {
        this.start();
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Frequencies for Om (C#3)
        osc.frequency.value = 136.1;
        osc2.frequency.value = 136.1 * 0.5; // Sub-octave for depth

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        // ADS Envelope for "Ommm"
        const now = this.ctx.currentTime;
        const duration = 2.5; // Seconds

        // Attack
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.8, now + 0.5);

        // Sustain/Decay
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + duration + 0.1);
        osc2.stop(now + duration + 0.1);

        // Callback when done
        if (callback) {
            setTimeout(callback, duration * 1000);
        }
    }
}
