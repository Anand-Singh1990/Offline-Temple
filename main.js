<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Go Offline</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">

    <style>
        /* All the CSS is identical to the previous version */
        body {
            font-family: 'Montserrat', sans-serif;
            font-weight: 300;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: #333;
            text-align: center;
        }
        .container {
            position: relative; width: 90%; max-width: 600px;
            min-height: 400px; padding: 2rem; background-color: #ffffff;
            border-radius: 12px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
            display: flex; justify-content: center; align-items: center;
            overflow: hidden;
        }
        #online-content, #offline-content {
            position: absolute; width: 80%;
            transition: opacity 0.7s ease-in-out, visibility 0.7s;
        }
        #online-content { opacity: 1; visibility: visible; }
        #offline-content { opacity: 0; visibility: hidden; }
        .is-offline #online-content { opacity: 0; visibility: hidden; }
        .is-offline #offline-content { opacity: 1; visibility: visible; }
        h1 { font-weight: 500; color: #2c3e50; }
        p { font-size: 1.1rem; line-height: 1.6; color: #555; }
        #dynamic-quote {
            font-style: italic;
            font-size: 1.2rem;
            font-weight: 400;
            color: #333;
        }
        /* NEW: Added a smaller element for the author */
        #dynamic-author {
            font-size: 1rem;
            font-weight: 500;
            color: #555;
            margin-top: 10px;
        }
        #dynamic-image {
            max-width: 100%; height: auto; border-radius: 8px;
            margin-top: 20px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>

    <div class="container">
        <div id="online-content">
            <h1>A Space for You</h1>
            <p>To enter this place of focus, you must first disconnect.</p>
            <p>Please turn on Airplane Mode or disconnect from your Wi-Fi.</p>
        </div>

        <div id="offline-content">
            <h1 id="dynamic-greeting"></h1>
            <p id="dynamic-quote"></p>
            <h2 id="dynamic-author"></h2>
            <img id="dynamic-image" src="" alt="A peaceful scene">
        </div>

    </div>

    <script>
        // --- 1. LOCAL DYNAMIC CONTENT (Still hard-coded) ---
        const greetings = [
            "Welcome.", "Peace.", "Clarity.", "Stillness.", "Breathe."
        ];
        
        // Add the file names of the images you have uploaded
        const images = [
            "temple1.jpg", "landscape.jpg", "mountain.jpg", "ocean.jpg"
        ];
        // ----------------------------------------------------


        // --- 2. GET HTML ELEMENTS TO UPDATE ---
        const greetingElement = document.getElementById('dynamic-greeting');
        const quoteElement = document.getElementById('dynamic-quote');
        const authorElement = document.getElementById('dynamic-author');
        const imageElement = document.getElementById('dynamic-image');
        
        const QUOTES_API_URL = "https://api.quotable.io/quotes/random?limit=50";
        let cachedQuotes = []; // This will hold our quotes

        // --- 3. NEW: API FETCHING & CACHING ---
        async function fetchAndCacheQuotes() {
            // This function runs when the user is ONLINE
            console.log("Fetching new quotes from API...");
            try {
                const response = await fetch(QUOTES_API_URL);
                const data = await response.json();
                
                // Save the data to our variable
                cachedQuotes = data; 
                
                // Save to the browser's local storage to use next time
                // We must convert the JSON object to a string to save it
                localStorage.setItem('cachedQuotes', JSON.stringify(data));
                console.log("Successfully fetched and cached " + data.length + " quotes.");

            } catch (error) {
                console.error("Error fetching new quotes:", error);
                // If the API fails, we do nothing and just wait
            }
        }

        // --- 4. NEW: FUNCTION TO LOAD FROM CACHE ---
        function loadQuotesFromCache() {
            // Check if we already have quotes saved in storage
            const savedQuotes = localStorage.getItem('cachedQuotes');
            if (savedQuotes) {
                console.log("Loading quotes from browser cache.");
                // If we do, parse the string back into an object
                cachedQuotes = JSON.parse(savedQuotes);
            } else {
                // If not, this is a first-time visit. We'll fetch them.
                fetchAndCacheQuotes();
            }
        }

        // --- 5. UPDATED: DYNAMIC CONTENT FUNCTION ---
        function updateDynamicContent() {
            // This function runs when the user is OFFLINE
            
            // --- Part A: Get random Greeting & Image (from local list) ---
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            const randomImage = images[Math.floor(Math.random() * images.length)];
            
            greetingElement.innerText = randomGreeting;
            imageElement.src = randomImage;

            // --- Part B: Get random Quote (from cached API list) ---
            if (cachedQuotes.length > 0) {
                const randomQuoteData = cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)];
                
                quoteElement.innerText = `"${randomQuoteData.content}"`;
                authorElement.innerText = `- ${randomQuoteData.author}`;
            } else {
                // Fallback in case the API failed and cache is empty
                quoteElement.innerText = '"The quieter you become, the more you can hear."';
                authorElement.innerText = "- Ram Dass";
            }
        }

        // --- 6. UPDATED: MAIN STATUS CHECKER ---
        function checkOnlineStatus() {
            if (navigator.onLine) {
                // User is ONLINE
                document.body.classList.remove('is-offline');
                // While they are online, let's use this time to re-fetch quotes
                // This ensures the quotes are fresh for their *next* offline session
                fetchAndCacheQuotes();
            } else {
                // User is OFFLINE
                // FIRST, update the content from our cache
                updateDynamicContent(); 
                // THEN, add the class to trigger the fade-in
                document.body.classList.add('is-offline');
            }
        }

        // --- 7. RUN ON PAGE LOAD ---
        loadQuotesFromCache(); // Load any previously-saved quotes
        checkOnlineStatus();   // Check the user's current status

        // Listen for when the user's connection status changes
        window.addEventListener('online', checkOnlineStatus);
        window.addEventListener('offline', checkOnlineStatus);
    </script>

</body>
</html>
