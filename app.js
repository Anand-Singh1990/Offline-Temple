const statusBar = document.getElementById('statusBar');
const statusMessage = document.getElementById('statusMessage');
const content = document.getElementById('content');

// Sound Variables
const omSoundBtn = document.getElementById('omSound');
const bellSoundBtn = document.getElementById('bellSound');
const rainSoundBtn = document.getElementById('rainSound');
const stopSoundBtn = document.getElementById('stopSound');
const volumeSlider = document.getElementById('volumeSlider');
let currentAudio = null;
let currentSoundBtn = null;

// Breathing Exercise Variables
const breathingCircle = document.getElementById('breathingCircle');
const breathingText = document.getElementById('breathingText');
const breathingBtn = document.getElementById('breathingBtn');
const breathCount = document.getElementById('breathCount');
const breathTime = document.getElementById('breathTime');
let breathingActive = false;
let breathingInterval;
let breathCounter = 0;
let breathTimeSeconds = 0;
let breathTimeInterval;

// Timer Variables
const timerDisplay = document.getElementById('timerDisplay');
const timerBtn = document.getElementById('timerBtn');
const timer5 = document.getElementById('timer5');
const timer10 = document.getElementById('timer10');
const timer15 = document.getElementById('timer15');
const timer20 = document.getElementById('timer20');
const progressCircle = document.getElementById('progressCircle');
let timerActive = false;
let timerInterval;
let timerSeconds = 300;
let selectedMinutes = 5;
let totalSeconds = 300;

// Mantra Counter Variables
const mantraCount = document.getElementById('mantraCount');
const mantraBtn = document.getElementById('mantraBtn');
const resetMantra = document.getElementById('resetMantra');
const malaProgress = document.getElementById('malaProgress');
const malaRemaining = document.getElementById('malaRemaining');
let mantraCounter = 0;

// Quote Variables
const dailyQuote = document.getElementById('dailyQuote');
const newQuoteBtn = document.getElementById('newQuote');

const quotes = [
    "The mind is everything. What you think, you become. - Buddha",
    "Yoga is the journey of the self, through the self, to the self. - Bhagavad Gita",
    "When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place. - Bhagavad Gita",
    "In the midst of movement and chaos, keep stillness inside of you. - Deepak Chopra",
    "The soul that sees beauty may sometimes walk alone. - Goethe",
    "Quiet the mind, and the soul will speak. - Ma Jaya Sati Bhagavati",
    "Meditation brings wisdom; lack of meditation leaves ignorance. - Buddha",
    "Peace comes from within. Do not seek it without. - Buddha",
    "The present moment is filled with joy and happiness. If you are attentive, you will see it. - Thich Nhat Hanh",
    "Silence is not the absence of sound, but the absence of self. - Anthony de Mello"
];

// Online/Offline Status
function updateStatus() {
    if (navigator.onLine) {
        statusBar.style.display = 'block';
        statusBar.style.backgroundColor = '#ff6b6b';
        statusMessage.textContent = '🌐 Please turn on flight mode or disconnect from the internet to begin';
        content.style.display = 'none';
    } else {
        statusBar.style.display = 'block';
        statusBar.style.backgroundColor = '#2d5016';
        statusMessage.textContent = '✈️ You are offline - Welcome to your sanctuary';
        content.style.display = 'block';
        
        setTimeout(() => {
            statusBar.style.display = 'none';
        }, 3000);
    }
}

window.addEventListener('load', () => {
    updateStatus();
    displayRandomQuote();
});
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

// Sound Functions
function playSound(soundType) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        if (currentSoundBtn) {
            currentSoundBtn.classList.remove('active');
        }
    }
    
    // Create Web Audio API oscillator for Om sound
    if (soundType === 'om') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 136.1; // Om frequency (C# / 136.1 Hz)
        oscillator.type = 'sine';
        gainNode.gain.value = volumeSlider.value / 100;
        
        oscillator.start();
        currentAudio = { stop: () => oscillator.stop(), audioContext, gainNode };
        omSoundBtn.classList.add('active');
        currentSoundBtn = omSoundBtn;
        stopSoundBtn.style.display = 'inline-block';
    }
}

omSoundBtn.addEventListener('click', () => playSound('om'));

stopSoundBtn.addEventListener('click', () => {
    if (currentAudio) {
        if (currentAudio.stop) currentAudio.stop();
        if (currentAudio.audioContext) currentAudio.audioContext.close();
        currentAudio = null;
    }
    if (currentSoundBtn) {
        currentSoundBtn.classList.remove('active');
    }
    stopSoundBtn.style.display = 'none';
});

volumeSlider.addEventListener('input', () => {
    if (currentAudio && currentAudio.gainNode) {
        currentAudio.gainNode.gain.value = volumeSlider.value / 100;
    }
});

// Note: Bell and Rain sounds would require actual audio files
// For now, they're disabled but buttons remain visible

// Breathing Exercise Logic
breathingBtn.addEventListener('click', () => {
    if (!breathingActive) {
        startBreathing();
    } else {
        stopBreathing();
    }
});

function startBreathing() {
    breathingActive = true;
    breathingBtn.textContent = 'Stop';
    breathTimeSeconds = 0;
    
    breathTimeInterval = setInterval(() => {
        breathTimeSeconds++;
        const mins = Math.floor(breathTimeSeconds / 60);
        const secs = breathTimeSeconds % 60;
        breathTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
    function breatheCycle() {
        // Inhale (4 seconds)
        breathingText.textContent = 'Breathe In...';
        breathingCircle.classList.add('breathe-in');
        breathingCircle.classList.remove('breathe-out');
        
        setTimeout(() => {
            if (!breathingActive) return;
            // Hold (4 seconds)
            breathingText.textContent = 'Hold...';
            
            setTimeout(() => {
                if (!breathingActive) return;
                // Exhale (4 seconds)
                breathingText.textContent = 'Breathe Out...';
                breathingCircle.classList.add('breathe-out');
                breathingCircle.classList.remove('breathe-in');
                
                setTimeout(() => {
                    if (!breathingActive) return;
                    // Hold (4 seconds)
                    breathingText.textContent = 'Hold...';
                    
                    setTimeout(() => {
                        if (!breathingActive) return;
                        breathCounter++;
                        breathCount.textContent = breathCounter;
                        breatheCycle();
                    }, 4000);
                }, 4000);
            }, 4000);
        }, 4000);
    }
    
    breatheCycle();
}

function stopBreathing() {
    breathingActive = false;
    breathingBtn.textContent = 'Start Pranayama';
    breathingCircle.classList.remove('breathe-in', 'breathe-out');
    breathingText.textContent = 'Click Start';
    clearInterval(breathTimeInterval);
}

// Meditation Timer Logic
function setTimerMinutes(minutes, button) {
    if (timerActive) return;
    
    selectedMinutes = minutes;
    timerSeconds = minutes * 60;
    totalSeconds = minutes * 60;
    updateTimerDisplay();
    
    // Update active button
    document.querySelectorAll('.timer-controls .btn-small').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

timer5.addEventListener('click', () => setTimerMinutes(5, timer5));
timer10.addEventListener('click', () => setTimerMinutes(10, timer10));
timer15.addEventListener('click', () => setTimerMinutes(15, timer15));
timer20.addEventListener('click', () => setTimerMinutes(20, timer20));

timerBtn.addEventListener('click', () => {
    if (!timerActive) {
        startTimer();
    } else {
        stopTimer();
    }
});

function startTimer() {
    timerActive = true;
    timerBtn.textContent = 'Pause';
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        updateProgressRing();
        
        if (timerSeconds <= 0) {
            stopTimer();
            timerDisplay.textContent = 'Complete! 🙏';
            setTimeout(() => {
                timerSeconds = selectedMinutes * 60;
                totalSeconds = selectedMinutes * 60;
                updateTimerDisplay();
                updateProgressRing();
            }, 3000);
        }
    }, 1000);
}

function stopTimer() {
    timerActive = false;
    timerBtn.textContent = 'Start Meditation';
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressRing() {
    const circumference = 2 * Math.PI * 54; // r=54
    const progress = (totalSeconds - timerSeconds) / totalSeconds;
    const offset = circumference * (1 - progress);
    progressCircle.style.strokeDashoffset = offset;
}

// Initialize progress ring
updateProgressRing();

// Mantra Counter Logic
mantraBtn.addEventListener('click', () => {
    mantraCounter++;
    mantraCount.textContent = mantraCounter;
    
    // Update mala progress (108 beads)
    const progress = Math.min((mantraCounter / 108) * 100, 100);
    malaProgress.style.width = progress + '%';
    
    const remaining = Math.max(108 - mantraCounter, 0);
    malaRemaining.textContent = remaining;
    
    // Add animation
    mantraCount.style.transform = 'scale(1.15)';
    setTimeout(() => {
        mantraCount.style.transform = 'scale(1)';
    }, 150);
    
    // Celebrate completion of 108
    if (mantraCounter === 108) {
        setTimeout(() => {
            alert('🎉 Congratulations! You completed a full mala of 108 mantras! 🙏');
        }, 200);
    }
});

resetMantra.addEventListener('click', () => {
    mantraCounter = 0;
    mantraCount.textContent = mantraCounter;
    malaProgress.style.width = '0%';
    malaRemaining.textContent = '108';
});

// Quote Functions
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    dailyQuote.textContent = quotes[randomIndex];
}

newQuoteBtn.addEventListener('click', displayRandomQuote);

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'));
}
