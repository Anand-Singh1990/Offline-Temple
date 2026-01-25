export class MeditationTimer {
    constructor() {
        this.isActive = false;
        this.seconds = 300;
        this.totalSeconds = 300;
        this.interval = null;
        this.onTick = () => { };
        this.onComplete = () => { };
    }

    setDuration(minutes) {
        if (this.isActive) return;
        this.seconds = minutes * 60;
        this.totalSeconds = minutes * 60;
    }

    start(onTick, onComplete) {
        if (this.isActive) return;
        this.isActive = true;
        this.onTick = onTick;
        this.onComplete = onComplete;

        this.interval = setInterval(() => {
            this.seconds--;
            this.onTick(this.seconds, this.totalSeconds);
            if (this.seconds <= 0) {
                this.complete();
            }
        }, 1000);
    }

    stop() {
        this.isActive = false;
        clearInterval(this.interval);
    }

    complete() {
        this.stop();
        if (this.onComplete) this.onComplete();
    }

    getFormattedTime() {
        const m = Math.floor(this.seconds / 60);
        const s = this.seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}
