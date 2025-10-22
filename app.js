/* ==================== INITIALIZATION ==================== */
const offlinePrompt = document.getElementById('offlinePrompt');
const mainContent = document.getElementById('mainContent');
const progressIndicator = document.getElementById('progressIndicator');
const progressFill = document.getElementById('progressFill');

gsap.registerPlugin(ScrollTrigger);

/* ==================== ONLINE/OFFLINE STATUS ==================== */
function updateStatus() {
    if (navigator.onLine) {
        offlinePrompt.style.display = 'flex';
        mainContent.style.display = 'none';
        progressIndicator.classList.remove('visible');
    } else {
        offlinePrompt.style.display = 'none';
        mainContent.style.display = 'block';
        setTimeout(initAnimations, 100);
    }
}

window.addEventListener('load', updateStatus);
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

/* ==================== TEXT SCRAMBLE EFFECT ==================== */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span style="color: var(--accent)">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}



/* ==================== ANIMATIONS INITIALIZATION ==================== */
function initAnimations() {
    // Hero animations
    gsap.from('.om-huge', { 
        opacity: 0, 
        scale: 0.8, 
        duration: 1.8, 
        ease: 'power3.out' 
    });
    
    const heroTitle = document.querySelector('.hero-h1');
    const heroScramble = new TextScramble(heroTitle);
    setTimeout(() => heroScramble.setText('Shanti'), 800);
    
    gsap.from('.hero-p', { 
        opacity: 0, 
        y: 20, 
        duration: 1, 
        delay: 1.5, 
        ease: 'power2.out' 
    });
    
    // Setup verse rotation
    setupVerseRotation();
    
    // Setup progress indicator
    setupProgressIndicator();
}

/* ==================== VERSE ROTATION WITH SCRAMBLE ==================== */
function setupVerseRotation() {
    const verses = [
        { main: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत', sub: 'Whenever dharma declines' },
        { main: 'In silence we find truth', sub: '' },
        { main: 'योगश्चित्तवृत्तिनिरोधः', sub: 'Yoga stills the mind' },
        { main: 'Peace', sub: 'शान्तिः शान्तिः शान्तिः' }
    ];
    
    const footerTexts = [
        'May peace be with you',
        'Om Shanti Shanti Shanti',
        'Find stillness within',
        'Embrace the silence',
        'Peace begins here'
    ];
    
    const verseDisplay = document.getElementById('verseDisplay');
    const verseSub = document.getElementById('verseSub');
    const footerText = document.getElementById('footerText');
    
    if (!verseDisplay || !footerText) return;
    
    const verseScrambler = new TextScramble(verseDisplay);
    const subScrambler = new TextScramble(verseSub);
    const footerScrambler = new TextScramble(footerText);
    
    let verseIndex = 0;
    let footerIndex = 0;
    
    // Rotate verses every 5 seconds
    setInterval(() => {
        verseIndex = (verseIndex + 1) % verses.length;
        verseScrambler.setText(verses[verseIndex].main);
        
        if (verses[verseIndex].sub) {
            setTimeout(() => subScrambler.setText(verses[verseIndex].sub), 400);
        } else {
            verseSub.textContent = '';
        }
    }, 5000);
    
    // Rotate footer every 4.5 seconds
    setInterval(() => {
        footerIndex = (footerIndex + 1) % footerTexts.length;
        footerScrambler.setText(footerTexts[footerIndex]);
    }, 4500);
}

/* ==================== PROGRESS INDICATOR ==================== */
function setupProgressIndicator() {
    const sections = document.querySelectorAll('.snap-section');
    const dots = document.querySelectorAll('.dot');
    
    mainContent.addEventListener('scroll', () => {
        const scrollTop = mainContent.scrollTop;
        const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        // Update progress fill
        progressFill.style.height = scrollPercent + '%';
        
        // Show/hide indicator
        if (scrollTop > 100) {
            progressIndicator.classList.add('visible');
        } else {
            progressIndicator.classList.remove('visible');
        }
        
        // Update active dot based on current section
        let currentSection = 0;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                currentSection = index;
            }
        });
        
        dots.forEach((dot, index) => {
            if (index === currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });
    
    // Click dots to scroll to section
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* ==================== VOLUME CONTROL ==================== */
document.getElementById('volumeSlider').addEventListener('input', (e) => {
    document.getElementById('sliderActive').style.width = e.target.value + '%';
    if (currentAudio && currentAudio.gainNode) {
        currentAudio.gainNode.gain.value = e.target.value / 100;
    }
});

/* ==================== SOUND SYSTEM ==================== */
let currentAudio = null;
let currentSoundBtn = null;

document.getElementById('omSound').addEventListener('click', function() {
    playSound('om', this);
});

document.getElementById('bellSound').addEventListener('click', function() {
    playSound('bell', this);
});

document.getElementById('rainSound').addEventListener('click', function() {
    playSound('rain', this);
});

function playSound(type, button) {
    // Stop current audio if playing
    if (currentAudio) {
        if (currentAudio.stop) currentAudio.stop();
        if (currentAudio.audioContext) currentAudio.audioContext.close();
        currentAudio = null;
        if (currentSoundBtn) currentSoundBtn.classList.remove('active');
    }
    
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const volume = document.getElementById('volumeSlider').value / 100;
    
    if (type === 'om') {
        // Om sound - 136.1 Hz (OM frequency)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.value = 136.1;
        osc.type = 'sine';
        gain.gain.value = volume;
        
        osc.start();
        currentAudio = { 
            stop: () => osc.stop(), 
            audioContext: ctx, 
            gainNode: gain 
        };
        
    } else if (type === 'bell') {
        // Bell sound - Multiple harmonic frequencies
        const freqs = [200, 400, 800, 1200, 1600];
        const gains = [1.0, 0.5, 0.3, 0.2, 0.1];
        const masterGain = ctx.createGain();
        masterGain.gain.value = volume * 0.3;
        masterGain.connect(ctx.destination);
        
        const playBell = () => {
            freqs.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(
                    gains[i] * (document.getElementById('volumeSlider').value / 100) * 0.3, 
                    ctx.currentTime
                );
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 3);
            });
        };
        
        playBell(); // First ring
        const interval = setInterval(() => {
            if (!currentAudio) {
                clearInterval(interval);
                return;
            }
            playBell();
        }, 3500);
        
        currentAudio = { 
            stop: () => clearInterval(interval),
            audioContext: ctx,
            gainNode: masterGain
        };
        
    } else if (type === 'rain') {
        // Rain sound - White noise with bandpass filter
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1000;
        bandpass.Q.value = 0.5;
        
        const gain = ctx.createGain();
        gain.gain.value = volume * 0.2;
        
        whiteNoise.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start();
        
        currentAudio = { 
            stop: () => whiteNoise.stop(),
            audioContext: ctx,
            gainNode: gain
        };
    }
    
    button.classList.add('active');
    currentSoundBtn = button;
    document.getElementById('stopSound').style.display = 'block';
}

document.getElementById('stopSound').addEventListener('click', () => {
    if (currentAudio) {
        if (currentAudio.stop) currentAudio.stop();
        if (currentAudio.audioContext) currentAudio.audioContext.close();
        currentAudio = null;
    }
    if (currentSoundBtn) currentSoundBtn.classList.remove('active');
    document.getElementById('stopSound').style.display = 'none';
});

/* ==================== BREATHING EXERCISE ==================== */
let breathingActive = false;
let breathCounter = 0;
let breathTimeSeconds = 0;
let breathTimeInterval;

document.getElementById('breathBtn').addEventListener('click', function() {
    if (!breathingActive) {
        startBreathing();
        this.textContent = 'Stop';
    } else {
        stopBreathing();
        this.textContent = 'Start';
    }
});

function startBreathing() {
    breathingActive = true;
    breathTimeSeconds = 0;
    
    breathTimeInterval = setInterval(() => {
        breathTimeSeconds++;
        const m = Math.floor(breathTimeSeconds / 60);
        const s = breathTimeSeconds % 60;
        document.getElementById('breathTime').textContent = 
            `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
    
    breatheCycle();
}

function breatheCycle() {
    const orb = document.getElementById('breathOrb');
    const text = document.getElementById('breathText');
    
    if (!breathingActive) return;
    
    // Inhale phase
    text.textContent = 'Inhale';
    orb.classList.add('in');
    orb.classList.remove('out');
    
    setTimeout(() => {
        if (!breathingActive) return;
        text.textContent = 'Hold';
        
        setTimeout(() => {
            if (!breathingActive) return;
            // Exhale phase
            text.textContent = 'Exhale';
            orb.classList.add('out');
            orb.classList.remove('in');
            
            setTimeout(() => {
                if (!breathingActive) return;
                text.textContent = 'Hold';
                
                setTimeout(() => {
                    if (!breathingActive) return;
                    breathCounter++;
                    document.getElementById('breathCount').textContent = breathCounter;
                    breatheCycle(); // Continue cycle
                }, 4000);
            }, 4000);
        }, 4000);
    }, 4000);
}

function stopBreathing() {
    breathingActive = false;
    document.getElementById('breathOrb').classList.remove('in', 'out');
    document.getElementById('breathText').textContent = 'Begin';
    clearInterval(breathTimeInterval);
}

/* ==================== MEDITATION TIMER ==================== */
let timerActive = false;
let timerInterval;
let timerSeconds = 300;
let selectedMinutes = 5;
let totalSeconds = 300;

function setTimer(mins, btn) {
    if (timerActive) return;
    
    selectedMinutes = mins;
    timerSeconds = mins * 60;
    totalSeconds = mins * 60;
    updateTimerDisplay();
    updateTimerProgress();
    
    document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

document.getElementById('timer5').addEventListener('click', function() { setTimer(5, this); });
document.getElementById('timer10').addEventListener('click', function() { setTimer(10, this); });
document.getElementById('timer15').addEventListener('click', function() { setTimer(15, this); });
document.getElementById('timer20').addEventListener('click', function() { setTimer(20, this); });

document.getElementById('timerBtn').addEventListener('click', function() {
    if (!timerActive) {
        startTimer();
        this.textContent = 'Pause';
    } else {
        stopTimer();
        this.textContent = 'Start';
    }
});

function startTimer() {
    timerActive = true;
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        updateTimerProgress();
        
        if (timerSeconds <= 0) {
            stopTimer();
            const display = document.getElementById('timerDisplay');
            const scrambler = new TextScramble(display);
            scrambler.setText('Done 🙏');
            document.getElementById('timerBtn').textContent = 'Start';
            
            // Reset after 3 seconds
            setTimeout(() => {
                timerSeconds = selectedMinutes * 60;
                totalSeconds = selectedMinutes * 60;
                updateTimerDisplay();
                updateTimerProgress();
            }, 3000);
        }
    }, 1000);
}

function stopTimer() {
    timerActive = false;
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimerProgress() {
    const circ = 2 * Math.PI * 110;
    const prog = (totalSeconds - timerSeconds) / totalSeconds;
    const off = circ * (1 - prog);
    document.getElementById('timerProgress').style.strokeDashoffset = off;
}

// Initialize timer progress
updateTimerProgress();

/* ==================== MANTRA COUNTER ==================== */
let mantraCounter = 0;

document.getElementById('mantraBtn').addEventListener('click', () => {
    mantraCounter++;
    
    const mantraNum = document.getElementById('mantraCount');
    const scrambler = new TextScramble(mantraNum);
    scrambler.setText(mantraCounter.toString());
    
    const prog = Math.min((mantraCounter / 108) * 100, 100);
    document.getElementById('malaProgress').style.width = prog + '%';
    document.getElementById('malaRemaining').textContent = Math.max(108 - mantraCounter, 0);
    
    // Completion celebration
    if (mantraCounter === 108) {
        setTimeout(() => {
            const mantraTxt = document.querySelector('.mantra-txt');
            const txtScrambler = new TextScramble(mantraTxt);
            txtScrambler.setText('Complete! 🎉');
            setTimeout(() => txtScrambler.setText('Om Shanti'), 2000);
        }, 200);
    }
});

document.getElementById('resetMantra').addEventListener('click', () => {
    mantraCounter = 0;
    
    const mantraNum = document.getElementById('mantraCount');
    const scrambler = new TextScramble(mantraNum);
    scrambler.setText('0');
    
    document.getElementById('malaProgress').style.width = '0%';
    document.getElementById('malaRemaining').textContent = '108';
    
    // Reset text
    const mantraTxt = document.querySelector('.mantra-txt');
    const txtScrambler = new TextScramble(mantraTxt);
    txtScrambler.setText('Om Shanti');
});

/* ==================== WISDOM QUOTES ==================== */
const quotes = [
    "The mind is everything. What you think, you become.",
    "Yoga is the journey of the self, through the self, to the self.",
    "When meditation is mastered, the mind is unwavering.",
    "In chaos, keep stillness inside of you.",
    "Quiet the mind, and the soul will speak.",
    "Peace comes from within.",
    "Silence is the absence of self.",
    "Be present in all things and thankful for all things.",
    "The present moment is all you ever have.",
    "Meditation is not evasion; it is a serene encounter with reality."
];

// Initialize with first quote (already set in HTML)
document.getElementById('newQuote').addEventListener('click', () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('dailyQuote');
    const scrambler = new TextScramble(quoteEl);
    scrambler.setText(randomQuote);
});

/* ==================== SERVICE WORKER ==================== */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

/* ==================== PERFORMANCE OPTIMIZATION ==================== */
// Prevent scroll jank
let ticking = false;
mainContent.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (currentAudio) {
        if (currentAudio.stop) currentAudio.stop();
        if (currentAudio.audioContext) currentAudio.audioContext.close();
    }
    if (breathingActive) {
        stopBreathing();
    }
    if (timerActive) {
        stopTimer();
    }
});
