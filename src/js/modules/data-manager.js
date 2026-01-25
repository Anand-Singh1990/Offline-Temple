export class DataManager {
    constructor() {
        this.STORAGE_KEY = 'shanti_data_v1';
        this.data = this.load();

        // Default structure
        if (!this.data) {
            this.data = {
                volume: 0.5,
                breathPattern: '4-7-8',
                mantraTotal: 0,
                lastVisit: Date.now(),
                theme: 'dark' // Future proofing
            };
            this.save();
        }
    }

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn('Failed to load data:', e);
            return null;
        }
    }

    save() {
        try {
            this.data.lastVisit = Date.now();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save data:', e);
        }
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.save();
    }

    incrementMantra(count = 1) {
        this.data.mantraTotal = (this.data.mantraTotal || 0) + count;
        this.save();
        return this.data.mantraTotal;
    }
}
