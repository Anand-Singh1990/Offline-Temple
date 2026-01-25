export class DailyWisdom {
    constructor() {
        this.quotes = [
            { text: "The mind is everything. What you think, you become.", author: "Buddha" },
            { text: "Yoga is the journey of the self, through the self, to the self.", author: "Bhagavad Gita" },
            { text: "Silence is the language of God, all else is poor translation.", author: "Rumi" },
            { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
            { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
            { text: "When you move amidst the world of sense, free from attachment and aversion alike, there comes the peace in which all sorrow ends.", author: "Bhagavad Gita" },
            { text: "Meditation is the dissolution of thoughts in Eternal awareness.", author: "Voltaire" },
            { text: "Look within. Be still.", author: "Dao De Jing" }
        ];
    }

    getQuoteForToday() {
        // Use the date string as a seed so it changes everyday but is consistent for that day
        const today = new Date().toDateString();
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = today.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash) % this.quotes.length;
        return this.quotes[index];
    }
}
