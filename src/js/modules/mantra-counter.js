import { TextScramble } from './ui-effects.js';

export class MantraCounter {
    constructor() {
        this.count = 0;
        this.target = 108;
    }

    increment() {
        this.count++;
        return this.count;
    }

    reset() {
        this.count = 0;
        return this.count;
    }

    getProgress() {
        return Math.min((this.count / this.target) * 100, 100);
    }

    getRemaining() {
        return Math.max(this.target - this.count, 0);
    }

    isComplete() {
        return this.count >= this.target;
    }

    startAuto(callback, interval = 2000) {
        this.stopAuto();
        this.autoInterval = setInterval(() => {
            if (this.isComplete()) {
                this.stopAuto();
            }
            callback(this.increment());
        }, interval);
    }

    stopAuto() {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }
}
