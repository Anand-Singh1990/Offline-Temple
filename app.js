const statusBar = document.getElementById('statusBar');
const statusMessage = document.getElementById('statusMessage');
const content = document.getElementById('content');

// Breathing Exercise Variables
const breathingCircle = document.getElementById('breathingCircle');
const breathingText = document.getElementById('breathingText');
const breathingBtn = document.getElementById('breathingBtn');
const breathCount = document.getElementById('breathCount');
let breathingActive = false;
let breathingInterval;
let breathCounter = 0;

// Timer Variables
const timerDisplay = document.getElementById('timerDisplay');
const timerBtn = document.getElementById('timerBtn');
const timer5 = document.getElementById('timer5');
const timer10 = document.getElementById('timer10');
const timer15 = document.getElementById('timer15');
let timerActive = false;
let timerInterval;
let timerSeconds = 300; // Default 5 minutes
let selectedMinutes = 5;

// Mantra Counter Variables
const mantraCount = document.getElementById('mantraCount');
const mantraBtn = document.getElementById('mantraBtn');
const resetMantra = document.getElementById('resetMantra');
let mantraCounter = 0;

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

window.addEventListener('load', updateStatus);
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

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
    breathingCircle.classList.add('breathe-in');
    let phase = 0; // 0 = inhale, 1 = hold, 2 = exhale, 3 = hold
    
    breathingInterval = setInterval(() => {
        switch(phase) {
            case 0:
                breathingText.textContent = 'Breathe In';
                breathingCircle.style.transform = 'scale(1.3)';
                phase = 1;
                setTimeout(() => {
                    breathingText.textContent = 'Hold';
                }, 2000);
                break;
            case 1:
                phase = 2;
                break;
            case 2:
                breathingText.textContent = 'Breathe Out';
                breathingCircle.style.transform = 'scale(1)';
                phase = 3;
                setTimeout(() => {
                    breathingText.textContent = 'Hold';
                }, 2000);
                break;
            case 3:
                breathCounter++;
                breathCount.textContent = breathCounter;
                phase = 0;
                break;
        }
    }, 4000);
}

function stopBreathing() {
    breathingActive = false;
    breathingBtn.textContent = 'Start Pranayama';
    breathingCircle.classList.remove('breathe-in');
    breathingCircle.style.transform = 'scale(1)';
    breathingText.textContent = 'Click Start';
    clearInterval(breathingInterval);
}

// Meditation Timer Logic
timer5.addEventListener('click', () => {
    selectedMinutes = 5;
    timerSeconds = 300;
    updateTimerDisplay();
});

timer10.addEventListener('click', () => {
    selectedMinutes = 10;
    timerSeconds = 600;
    updateTimerDisplay();
});

timer15.addEventListener('click', () => {
    selectedMinutes = 15;
    timerSeconds = 900;
    updateTimerDisplay();
});

timerBtn.addEventListener('click', () => {
    if (!timerActive) {
        startTimer();
    } else {
        stopTimer();
    }
});

function startTimer() {
    timerActive = true;
    timerBtn.textContent = 'Stop Timer';
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        if (timerSeconds <= 0) {
            stopTimer();
            timerDisplay.textContent = 'Complete! 🙏';
            setTimeout(() => {
                timerSeconds = selectedMinutes * 60;
                updateTimerDisplay();
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

// Mantra Counter Logic
mantraBtn.addEventListener('click', () => {
    mantraCounter++;
    mantraCount.textContent = mantraCounter;
    
    // Add animation
    mantraCount.style.transform = 'scale(1.2)';
    setTimeout(() => {
        mantraCount.style.transform = 'scale(1)';
    }, 200);
});

resetMantra.addEventListener('click', () => {
    mantraCounter = 0;
    mantraCount.textContent = mantraCounter;
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'));
}
