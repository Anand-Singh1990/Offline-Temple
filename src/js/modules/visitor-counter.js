export class VisitorCounter {
    constructor() {
        this.NAMESPACE = 'shanti-offline-temple';
        this.KEY = 'visits'; // simple key
        this.STORAGE_KEY = 'shanti_last_visit_ts';
        this.SESSION_TIMEOUT = 1000 * 60 * 60; // 1 hour
    }

    async getCount() {
        try {
            // Check if we should increment or just fetch
            const lastVisit = localStorage.getItem(this.STORAGE_KEY);
            const now = Date.now();
            let shouldIncrement = true;

            if (lastVisit && (now - parseInt(lastVisit) < this.SESSION_TIMEOUT)) {
                shouldIncrement = false;
            }

            // Update timestamp
            // Update timestamp
            localStorage.setItem(this.STORAGE_KEY, now.toString());

            // CounterAPI.dev: /v1/namespace/key/up (increment) or /v1/namespace/key (get)
            const endpoint = shouldIncrement ? 'up' : '';

            // Create a timeout promise
            const timeout = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timed out')), 3000);
            });

            // Fetch promise
            const fetchReq = fetch(`https://api.counterapi.dev/v1/${this.NAMESPACE}/${this.KEY}/${endpoint}`);

            // Race them
            const response = await Promise.race([fetchReq, timeout]);

            if (!response.ok) {
                // If 400 and we were just getting (not incrementing), it means it doesn't exist.
                // We should create it by incrementing.
                if (response.status === 400 && !shouldIncrement) {
                    console.log('Counter not found, creating...');
                    const createParams = {
                        method: 'GET' // /up is a GET in this API typically, or we can just fetch properly
                    };
                    const createReq = fetch(`https://api.counterapi.dev/v1/${this.NAMESPACE}/${this.KEY}/up`);
                    const createRes = await createReq;
                    if (createRes.ok) {
                        const createData = await createRes.json();
                        return createData.count || createData.value;
                    }
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            // CounterAPI usually returns { count: 123 }, but we check 'value' too just in case
            return data.count || data.value;

        } catch (error) {
            console.warn('Visitor counter failed (graceful fallback):', error);
            return null; // Return null effectively hides the counter
        }
    }
}
