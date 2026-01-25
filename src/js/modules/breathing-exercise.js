export class BreathingExercise {
    constructor() {
        this.isActive = false;
        this.pattern = '4-7-8'; // default
        this.patterns = {
            '4-7-8': { inhale: 4, hold: 7, exhale: 8, holdEmpty: 0 },
            'box': { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
            'coherent': { inhale: 6, hold: 0, exhale: 6, holdEmpty: 0 }
        };
        this.timer = null;
        this.cycleCount = 0;
        this.callbacks = {
            onPhaseChange: () => { },
            onUpdate: () => { },
            onStop: () => { }
        };
    }

    setPattern(name) {
        if (this.patterns[name]) {
            this.pattern = name;
            // Set CSS Variable for animation duration
            const p = this.patterns[name];
            // Determine max duration needed or specific phase duration?
            // The ORB animation is mostly about loop time, but let's make it simpler.
            // We'll set a variable --breath-duration for the CSS transition.
            // Actually, CSS relies on fixed keyframes or transitions.
            // The cleanest way is to set the transition duration to match the incoming phase.
            // We'll handle this in the 'start' loop by setting the style on the element directly.
        }
    }

    start(callbacks) {
        if (this.isActive) return;
        this.isActive = true;
        this.callbacks = callbacks || this.callbacks;
        this.cycleCount = 0;
        this.runCycle();
    }

    stop() {
        this.isActive = false;
        clearTimeout(this.timer);
        if (this.callbacks.onStop) this.callbacks.onStop();
    }

    runCycle() {
        if (!this.isActive) return;

        const p = this.patterns[this.pattern];

        // Inhale
        this.callbacks.onPhaseChange('Inhale', p.inhale);
        this.timer = setTimeout(() => {
            if (!this.isActive) return;

            // Hold (Full)
            if (p.hold > 0) {
                this.callbacks.onPhaseChange('Hold', p.hold);
                this.timer = setTimeout(() => this.doExhale(p), p.hold * 1000);
            } else {
                this.doExhale(p);
            }
        }, p.inhale * 1000);
    }

    doExhale(p) {
        if (!this.isActive) return;

        this.callbacks.onPhaseChange('Exhale', p.exhale);
        this.timer = setTimeout(() => {
            if (!this.isActive) return;

            // Hold (Empty)
            if (p.holdEmpty > 0) {
                this.callbacks.onPhaseChange('Hold', p.holdEmpty);
                this.timer = setTimeout(() => this.finishCycle(), p.holdEmpty * 1000);
            } else {
                this.finishCycle();
            }
        }, p.exhale * 1000);
    }

    finishCycle() {
        if (!this.isActive) return;
        this.cycleCount++;
        this.callbacks.onUpdate({ cycles: this.cycleCount });
        this.runCycle();
    }
}
