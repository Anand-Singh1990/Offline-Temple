const offlinePrompt = document.getElementById('offlinePrompt');
const mainContent = document.getElementById('mainContent');

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Online/Offline Status
function updateStatus() {
    if (navigator.onLine) {
        offlinePrompt.style.display = 'flex';
        mainContent.style.display = 'none';
    } else {
        offlinePrompt.style.display = 'none';
        mainContent.style.display = 'block';
        setTimeout(initAnimations, 100);
    }
}

window.addEventListener('load', updateStatus);
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

// GSAP Animations
function initAnimations() {
    // Fade in main content
    gsap.to(mainContent, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    });
    
    // Hero animations
    const heroTl = gsap.timeline();
    heroTl
        .to('.om-large', { opacity: 0.15, scale: 1, duration: 1.5, ease: 'power3.out' })
        .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=1')
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.7');
    
    // Pinned intro with fade
    gsap.timeline({
        scrollTrigger: {
            trigger: '.pinned-intro',
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 1
        }
    })
    .to('.intro-content', { opacity: 1, scale: 1, duration: 0.5 })
    .to('.intro-content', { opacity: 0, scale: 0.9, duration: 0.5 }, '+=0.3');
    
    // Feature cards - scale and fade in
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1
            },
            opacity: 1,
            scale: 1,
            ease: 'power2.out'
        });
    });
    
    // Philosophy pins with crossfade
    gsap.utils.toArray('.philosophy-pin').forEach((pin, index) => {
        const card = pin.querySelector('.verse-card');
        
        gsap.timeline({
            scrollTrigger: {
                trigger: pin,
                start: 'top top',
                end: '+=100%',
                pin: true,
                scrub: 1
            }
        })
        .to(card, { opacity: 1, scale: 1, duration: 0.3 })
        .to(card, { opacity: 0, scale: 0.95, duration: 0.3 }, '+=0.4');
    });
}

// Volume slider fill
document.getElementById('volumeSlider').addEventListener('input', (e) => {
    document.getElementById('sliderFill').style.width = e.target.value + '%';
    if (currentAudio && currentAudio.gainNode) {
        currentAudio.gainNode.gain.value = e.target.value / 100;
    }
});

// Sound system
let currentAudio = null;
let currentSoundBtn = null;

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

// Breathing
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
    
    text.textContent = 'Inhale';
    circle.classList.add('breathe-in');
    circle.classList.remove('breathe-out');
    
    setTimeout(() => {
        if (!breathingActive) return;
        text.textContent = 'Hold';
        
        setTimeout(() => {
            if (!breathingActive) return;
            text.textContent = 'Exhale';
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
let timerActive = false;
let timerInterval;
let timerSeconds = 300;
let selectedMinutes = 5;
let totalSeconds = 300;

function setTimer(mins, button) {
    if (timerActive) return;
    selectedMinutes = mins;
    timerSeconds = mins * 60;
    totalSeconds = mins * 60;
    updateTimerDisplay();
    updateProgressRing();
    
    document.querySelectorAll('.time-pill').forEach(b => b.classList.remove('active'));
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
            document.getElementById('timerDisplay').textContent = 'Complete';
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
    const circumference = 2 * Math.PI * 100;
    const progress = (totalSeconds - timerSeconds) / totalSeconds;
    const offset = circumference * (1 - progress);
    document.getElementById('progressCircle').style.strokeDashoffset = offset;
}

updateProgressRing();

// Mantra
let mantraCounter = 0;

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
        setTimeout(() => alert('🎉 108 mantras complete! 🙏'), 200);
    }
});

document.getElementById('resetMantra').addEventListener('click', () => {
    mantraCounter = 0;
    document.getElementById('mantraCount').textContent = '0';
    document.getElementById('malaProgress').style.width = '0%';
    document.getElementById('malaRemaining').textContent = '108';
});

// Quotes
const quotes = [
    "The mind is everything. What you think, you become.",
    "Yoga is the journey of the self, through the self, to the self.",
    "When meditation is mastered, the mind is unwavering like a flame.",
    "In the midst of movement and chaos, keep stillness inside of you.",
    "Quiet the mind, and the soul will speak.",
    "Peace comes from within. Do not seek it without.",
    "Silence is not the absence of sound, but the absence of self."
];

function showRandomQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('dailyQuote').textContent = quote;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
showRandomQuote();

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
