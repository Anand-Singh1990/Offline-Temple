import { DataManager } from './modules/data-manager.js';
import { AudioManager } from './modules/audio-manager.js';
import { BreathingExercise } from './modules/breathing-exercise.js';
import { MeditationTimer } from './modules/meditation-timer.js';
import { MantraCounter } from './modules/mantra-counter.js';
import { OnlineManager } from './modules/online-manager.js';
import { DailyWisdom } from './modules/daily-wisdom.js';
import { TextScramble, initAnimations } from './modules/ui-effects.js';

// --- State & Modules ---
const dataManager = new DataManager(); // Init first to get settings
const audioManager = new AudioManager();
const breathExercise = new BreathingExercise();
const flowTimer = new MeditationTimer();
const mantraCounter = new MantraCounter();
const onlineManager = new OnlineManager();
const dailyWisdom = new DailyWisdom();

// --- Init Settings from DataManager ---
// Volume
const savedVol = dataManager.get('volume');
if (savedVol !== undefined) {
    audioManager.setMasterVolume(savedVol);
} else {
    audioManager.setMasterVolume(0.5); // Default
}

const volSlider = document.getElementById('volumeSlider');
if (volSlider) {
    const currentVol = savedVol !== undefined ? savedVol : 0.5;
    volSlider.value = currentVol * 100;
    document.getElementById('sliderActive').style.width = (currentVol * 100) + '%';

    volSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        const vol = val / 100;
        audioManager.setMasterVolume(vol);
        dataManager.set('volume', vol);
        document.getElementById('sliderActive').style.width = val + '%';
    });
}

// Breath Pattern
const savedPattern = dataManager.get('breathPattern');
if (savedPattern) {
    breathExercise.setPattern(savedPattern);
    const patSelect = document.getElementById('breathPattern');
    if (patSelect) patSelect.value = savedPattern;
}

// --- Connectivity & Offline Prompt ---
function checkConnectivity() {
    const isOnline = navigator.onLine;
    const offlinePrompt = document.getElementById('offlinePrompt');
    const mainContent = document.getElementById('mainContent');
    const progressIndicator = document.getElementById('progressIndicator');

    if (isOnline) {
        offlinePrompt.style.display = 'flex';
        mainContent.style.display = 'none';
        progressIndicator.classList.remove('visible');
        if (onlineManager) onlineManager.showStats();
    } else {
        offlinePrompt.style.display = 'none';
        mainContent.style.display = 'block';
        setTimeout(initAnimations, 100);
        mainContent.scrollTop = 0;
    }
}

window.addEventListener('online', checkConnectivity);
window.addEventListener('offline', checkConnectivity);
window.addEventListener('load', () => {
    checkConnectivity();
    setupProgressIndicator();
});

// --- Sound Section ---
document.querySelectorAll('.tile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.id.replace('Sound', '');
        const isPlaying = audioManager.toggleSound(type);

        if (isPlaying) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
});

// --- Breathing Section ---
const breathBtn = document.getElementById('breathBtn');
if (breathBtn) {
    breathBtn.addEventListener('click', () => {
        if (!breathExercise.isActive) {
            breathBtn.textContent = 'Stop';
            breathExercise.start({
                onPhaseChange: (phase, duration) => {
                    document.getElementById('breathText').textContent = phase;
                    const orb = document.getElementById('breathOrb');

                    if (phase === 'Inhale') {
                        orb.style.setProperty('--breath-duration', duration + 's');
                        orb.classList.add('in');
                        orb.classList.remove('out');
                    } else if (phase === 'Exhale') {
                        orb.style.setProperty('--breath-duration', duration + 's');
                        orb.classList.add('out');
                        orb.classList.remove('in');
                    }
                    // Hold usually maintains state, maybe pulse?
                },
                onUpdate: (data) => {
                    const scrambler = new TextScramble(document.getElementById('breathCount'));
                    scrambler.setText(data.cycles.toString());
                },
                onStop: () => {
                    document.getElementById('breathText').textContent = 'Begin';
                    document.getElementById('breathOrb').classList.remove('in', 'out');
                }
            });

            // Start local timer for display
            let seconds = 0;
            breathExercise.displayInterval = setInterval(() => {
                seconds++;
                const m = Math.floor(seconds / 60);
                const s = seconds % 60;
                document.getElementById('breathTime').textContent =
                    `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }, 1000);

        } else {
            breathBtn.textContent = 'Start';
            breathExercise.stop();
            clearInterval(breathExercise.displayInterval);
        }
    });

    // Pattern Selection (New Feature)
    const patternSelect = document.getElementById('breathPattern');
    if (patternSelect) {
        patternSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            breathExercise.setPattern(val);
            dataManager.set('breathPattern', val);
            // If active, restart or just set for next cycle? Restarting is safer.
            if (breathExercise.isActive) {
                breathBtn.click(); // Stop
                setTimeout(() => breathBtn.click(), 100); // Start
            }
        });
    }
}

// --- Timer Section ---
const timerBtn = document.getElementById('timerBtn');
if (timerBtn) {
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (flowTimer.isActive) return;
            const mins = parseInt(btn.id.replace('timer', ''));
            flowTimer.setDuration(mins);

            document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            updateTimerDisplay(flowTimer.getFormattedTime());
            updateTimerProgress(0); // 0 progress
        });
    });

    timerBtn.addEventListener('click', () => {
        if (!flowTimer.isActive) {
            flowTimer.start(
                (seconds, total) => {
                    updateTimerDisplay(flowTimer.getFormattedTime());
                    const prog = (total - seconds) / total;
                    updateTimerProgress(prog);
                },
                () => { // On Complete
                    timerBtn.textContent = 'Start';
                    new TextScramble(document.getElementById('timerDisplay')).setText('Done 🙏');
                    audioManager.playSound('bell'); // Ding!
                    setTimeout(() => audioManager.stopSound('bell'), 4000);
                }
            );
            timerBtn.textContent = 'Pause';
        } else {
            flowTimer.stop();
            timerBtn.textContent = 'Resume'; // Or Start
        }
    });
}

function updateTimerDisplay(text) {
    document.getElementById('timerDisplay').textContent = text;
}

function updateTimerProgress(prog) { // 0 to 1
    const circ = 2 * Math.PI * 110;
    const off = circ * (1 - prog);
    document.getElementById('timerProgress').style.strokeDashoffset = off;
}

// --- Mantra Section ---
const mantraBtn = document.getElementById('mantraBtn');
if (mantraBtn) {
    mantraBtn.addEventListener('click', () => {
        const count = mantraCounter.increment();
        dataManager.incrementMantra(1); // Persist total
        new TextScramble(document.getElementById('mantraCount')).setText(count.toString());

        document.getElementById('malaProgress').style.width = mantraCounter.getProgress() + '%';
        document.getElementById('malaRemaining').textContent = mantraCounter.getRemaining();

        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(10);

        if (mantraCounter.isComplete()) {
            new TextScramble(document.querySelector('.mantra-txt')).setText('Complete! 🎉');
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        }
    });

    document.getElementById('resetMantra').addEventListener('click', () => {
        mantraCounter.reset();
        mantraCounter.stopAuto(); // Stop auto if active
        document.getElementById('autoMantra').checked = false;
        new TextScramble(document.getElementById('mantraCount')).setText('0');
        document.getElementById('malaProgress').style.width = '0%';
        document.getElementById('malaRemaining').textContent = '108';
        new TextScramble(document.querySelector('.mantra-txt')).setText('Om Shanti');
    });

    const autoSwitch = document.getElementById('autoMantra');
    if (autoSwitch) {
        autoSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                mantraCounter.startAuto((count) => {
                    // Update main count
                    document.getElementById('mantraCount').innerText = count;
                    // Update stats
                    dataManager.incrementMantra(1);

                    document.getElementById('malaProgress').style.width = mantraCounter.getProgress() + '%';
                    document.getElementById('malaRemaining').textContent = mantraCounter.getRemaining();

                    if (mantraCounter.isComplete()) {
                        document.getElementById('autoMantra').checked = false;
                        new TextScramble(document.querySelector('.mantra-txt')).setText('Complete! 🎉');
                        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                    }
                });
            } else {
                mantraCounter.stopAuto();
            }
        });
    }
}

// --- Progress Indicator ---
function setupProgressIndicator() {
    const mainContent = document.getElementById('mainContent');
    const progressFill = document.getElementById('progressFill');
    const indicator = document.getElementById('progressIndicator');
    const sections = document.querySelectorAll('.snap-section');
    const dots = document.querySelectorAll('.dot');

    mainContent.addEventListener('scroll', () => {
        const scrollTop = mainContent.scrollTop;
        const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        progressFill.style.height = scrollPercent + '%';

        if (scrollTop > 100) indicator.classList.add('visible');
        else indicator.classList.remove('visible');

        let currentSection = 0;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                currentSection = index;
            }
        });

        dots.forEach((dot, index) => {
            if (index === currentSection) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// --- Daily Wisdom ---
const quote = dailyWisdom.getQuoteForToday();
const quoteEl = document.getElementById('dailyQuote');
if (quoteEl) {
    quoteEl.innerHTML = `"${quote.text}"<br><span style="font-size: 0.6em; opacity: 0.7; display: block; margin-top: 10px;">— ${quote.author}</span>`;
}
