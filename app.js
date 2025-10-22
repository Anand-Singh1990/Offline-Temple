const offlinePrompt = document.getElementById('offlinePrompt');
const mainContent = document.getElementById('mainContent');

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in sections
document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
});

// Online/Offline Status
function updateStatus() {
    if (navigator.onLine) {
        offlinePrompt.style.display = 'flex';
        mainContent.style.display = 'none';
    } else {
        offlinePrompt.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Re-observe sections when going offline
        setTimeout(() => {
            document.querySelectorAll('.fade-in-section').forEach(section => {
                observer.observe(section);
            });
        }, 100);
    }
}

window.addEventListener('load', updateStatus);
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

// Sound Variables
let currentAudio = null;
let currentSoundBtn = null;

// Breathing Variables
let breathingActive = false;
let breathCounter = 0;
let breathTimeSeconds = 0;
let breathTimeInterval;

// Timer Variables
let timerActive = false;
let timerInterval;
let timerSeconds = 300;
let selectedMinutes = 5;
let totalSeconds = 300;

// Mantra Variables
let mantraCounter = 0;

// Quotes
const quotes = [
    "The mind is everything. What you think, you become.",
    "Yoga is the journey of the self, through the self, to the self.",
    "When meditation is mastered, the mind is unwavering like a flame.",
    "In the midst of movement and chaos, keep stillness inside of you.",
    "Quiet the mind, and the soul will speak.",
    "Meditation brings wisdom; lack of meditation leaves ignorance.",
    "Peace comes from within. Do not seek it without.",
    "The present moment is filled with joy and happiness.",
    "Silence is not the absence of sound, but the absence of self."
];

// Sound Functions
document.getElementById('omSound').addEventListener('click', function() {
    playSound('om', this);
});

function playSound(type, button) {
    if (currentAudio) {
        currentAudio.stop();
        if (currentSoundBtn) currentSoundBtn.classList.remove('active');
    }
    
    if (type === 'om') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 136.1;
        oscillator.type = 'sine';
        gainNode.gain.value = document.getElementById('volumeSlider').value / 100;
        
        oscillator.start();
        currentAudio = { stop: () => oscillator.stop(), audioContext, gainNode };
        button.classList.add('active');
        currentSoundBtn = button;
        document.getElementById('stopSound').style.display = 'block';
    }
}

document.getElementById('stopSound').addEventListener('click', () => {
    if (currentAudio) {
        currentAudio.stop();
        if (currentAudio.audioContext) currentAudio.audioContext.close();
        currentAudio = null;
    }
    if (currentSoundBtn) currentSoundBtn.classList.remove('active');
    document.getElementById('stopSound').style.display = 'none';
});

document.getElementById('volumeSlider').addEventListener('input', (e) => {
    if (currentAudio && currentAudio.gainNode) {
        currentAudio.gainNode.gain.value = e.target.value / 100;
    }
});

// Breathing Exercise
document.getElementById('breathBtn').addEventListener('click', function() {
    if (!breathingActive) {
        startBreathing();
        this.textContent = 'Stop';
    } else {
        stopBreathing();
        this.textContent = 'Start Breathing';
    }
});

function startBreathing() {
    breathingActive = true;
    breathTimeSeconds = 0;
    
    breathTimeInterval = setInterval(() => {
        breathTimeSeconds++;
        const mins = Math.floor(breathTimeSeconds / 60);
        const secs = breathTimeSeconds % 60;
        document.getElementById('breathTime').textContent = 
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
    breatheCycle();
}

function breatheCycle() {
    const circle = document.getElementById('breathCircle');
    const text = document.getElementById('breathText');
    
    if (!breathingActive) return;
    
    text.textContent = 'Breathe In';
    circle.classList.add('breathe-in');
    circle.classList.remove('breathe-out');
    
    setTimeout(() => {
        if (!breathingActive) return;
        text.textContent = 'Hold';
        
        setTimeout(() => {
            if (!breathingActive) return;
            text.textContent = 'Breathe Out';
            circle.classList.add('breathe-out');
            circle.classList.remove('breathe-in');
            
            setTimeout(() => {
                if (!breathingActive) return;
                text.textContent = 'Hold';
                
                setTimeout(() => {
                    if (!breathingActive) return;
                    breathCounter++;
                    document.getElementById('breathCount').textContent = breathCounter;
                    breatheCycle();
                }, 4000);
            }, 4000);
        }, 4000);
    }, 4000);
}

function stopBreathing() {
    breathingActive = false;
    document.getElementById('breathCircle').classList.remove('breathe-in', 'breathe-out');
    document.getElementById('breathText').textContent = 'Begin';
    clearInterval(breathTimeInterval);
}

// Timer
function setTimer(mins, button) {
    if (timerActive) return;
    selectedMinutes = mins;
    timerSeconds = mins * 60;
    totalSeconds = mins * 60;
    updateTimerDisplay();
    updateProgressRing();
    
    document.querySelectorAll('.timer-option').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
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
        this.textContent = 'Start Meditation';
    }
});

function startTimer() {
    timerActive = true;
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        updateProgressRing();
        
        if (timerSeconds <= 0) {
            stopTimer();
            document.getElementById('timerDisplay').textContent = 'Complete 🙏';
            document.getElementById('timerBtn').textContent = 'Start Meditation';
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
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateProgressRing() {
    const circumference = 2 * Math.PI * 90;
    const progress = (totalSeconds - timerSeconds) / totalSeconds;
    const offset = circumference * (1 - progress);
    document.getElementById('progressCircle').style.strokeDashoffset = offset;
}

updateProgressRing();

// Mantra Counter
document.getElementById('mantraBtn').addEventListener('click', () => {
    mantraCounter++;
    const countEl = document.getElementById('mantraCount');
    countEl.textContent = mantraCounter;
    countEl.style.transform = 'scale(1.1)';
    setTimeout(() => countEl.style.transform = 'scale(1)', 150);
    
    const progress = Math.min((mantraCounter / 108) * 100, 100);
    document.getElementById('malaProgress').style.width = progress + '%';
    document.getElementById('malaRemaining').textContent = Math.max(108 - mantraCounter, 0);
    
    if (mantraCounter === 108) {
        setTimeout(() => alert('🎉 Mala complete! 108 mantras chanted 🙏'), 200);
    }
});

document.getElementById('resetMantra').addEventListener('click', () => {
    mantraCounter = 0;
    document.getElementById('mantraCount').textContent = '0';
    document.getElementById('malaProgress').style.width = '0%';
    document.getElementById('malaRemaining').textContent = '108';
});

// Quotes
function showRandomQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('dailyQuote').textContent = quote;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
showRandomQuote();

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('SW registered'))
        .catch(err => console.log('SW failed'));
}
