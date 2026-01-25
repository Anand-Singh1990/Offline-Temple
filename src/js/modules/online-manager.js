import { DataManager } from './data-manager.js';

export class OnlineManager {
    constructor() {
        this.container = document.querySelector('.airplane-container');
        this.card = document.querySelector('.prompt-card');
        this.particleCount = 50;
        this.isOnline = navigator.onLine; // Default
        this.dataManager = new DataManager(); // Init local instance to read stats
        this.init();
    }

    init() {
        this.createNebula();
        this.addParallax();
        this.showStats();
        window.addEventListener('online', () => this.handleStatusChange(true));
        window.addEventListener('offline', () => this.handleStatusChange(false));
    }

    showStats() {
        const total = this.dataManager.get('mantraTotal') || 0;
        if (total > 0) {
            const stats = document.createElement('div');
            stats.className = 'online-stats';
            stats.innerHTML = `<span style="font-size: 12px; opacity: 0.6; display:block; margin-top:20px;">Total Mantras Chanted</span><span style="font-size: 24px; font-weight: 700; color: var(--accent);">${total}</span>`;

            // Append to card if not already there
            if (!this.card.querySelector('.online-stats')) {
                this.card.appendChild(stats);
            }
        }
    }

    handleStatusChange(status) {
        this.isOnline = status;
        if (status) {
            // Online specific logic if needed
        }
    }

    createNebula() {
        // Create a container for the background if it doesn't exist
        let bg = document.getElementById('online-bg');
        if (!bg) {
            bg = document.createElement('div');
            bg.id = 'online-bg';
            bg.className = 'online-bg';
            document.querySelector('.offline-prompt').prepend(bg);
        }

        // Add stars/particles
        for (let i = 0; i < this.particleCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 3 + 1;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;

            bg.appendChild(star);
        }
    }

    addParallax() {
        if (!this.container || !this.card) return;

        document.addEventListener('mousemove', (e) => {
            if (!this.isOnline) return; // Only process when online prompt is visible

            const x = (window.innerWidth / 2 - e.pageX) / 25;
            const y = (window.innerHeight / 2 - e.pageY) / 25;

            // Move the airplane container
            this.container.style.transform = `translate(${x}px, ${y}px)`;

            // Subtle tilt for the card
            this.card.style.transform = `rotateY(${x * 0.05}deg) rotateX(${y * -0.05}deg)`;
        });
    }
}
