# 🕉️ Shanti - Offline Temple

> **A peaceful offline sanctuary for meditation and mindfulness**

Shanti (Sanskrit: शान्ति, meaning "peace") is a progressive web app that encourages digital detox by requiring users to go offline to access its meditation features. Built with an offline-first architecture, it provides a complete mindfulness experience without internet dependency.

---

## ✨ Features

### 🎵 Procedural Audio Engine
- **Om Chant** - 136.1 Hz (C#3) sacred frequency with harmonics
- **Singing Bowl** - Multi-layered bell tones with natural decay
- **Rain Ambience** - Procedurally generated white noise with bandpass filter
- **Forest Sounds** - Deep brown noise with subtle bird chirps
- **Sound Mixing** - Play multiple sounds simultaneously
- **No Audio Files** - All sounds generated using Web Audio API

### 🧘 Meditation Tools
- **Pranayama** - Guided breathing exercises with 3 patterns:
  - Relaxing (4-7-8)
  - Box Breathing (4-4-4-4)
  - Coherent Breathing (6-6)
- **Dhyana** - Meditation timer (5, 10, 15, 20 minutes)
- **Japa Mala** - Digital mantra counter (108 repetitions)
- **Auto-Chant** - Synchronized audio for mantra practice
- **Daily Wisdom** - Rotating philosophical quotes

### 🌐 Offline-First Architecture
- **Full PWA** - Install on any device
- **Service Worker** - CacheFirst strategy with stale-while-revalidate
- **True Offline** - Works completely without internet after first visit
- **No Server Required** - Pure client-side application
- **Mobile Optimized** - iOS and Android support with audio unlock

### 🎨 Premium UI/UX
- **Glassmorphism** - Frosted glass card effects
- **Divine Animations** - Glowing Om symbol with particle nebula (online mode)
- **Smooth Scrolling** - Snap sections with progress indicator
- **Text Scramble** - Cyberpunk-style counter animations
- **Haptic Feedback** - Vibration on supported devices
- **Dark Theme** - Easy on the eyes for meditation

---

## 🚀 Quick Start

### Online Demo
Visit the live demo: [Your deployment URL here]

### Local Development
```bash
# Clone the repository
git clone https://github.com/Anand-Singh1990/Offline-Temple.git
cd Offline-Temple

# Serve locally (required for ES6 modules & Service Worker)
npx http-server -p 8080

# Open http://localhost:8080
```

### Using the App
1. **First Visit**: Load the page while **online** to cache all assets
2. **Go Offline**: Turn off WiFi or enable airplane mode
3. **Start Meditating**: The app automatically switches to meditation mode
4. **Offline Forever**: Once cached, works completely offline (even after closing browser)

---

## 🛠️ Technology Stack

- **HTML5** - Semantic structure
- **Vanilla CSS** - No frameworks, pure glassmorphism
- **Vanilla JavaScript (ES6 Modules)** - No dependencies
- **Web Audio API** - Procedural sound synthesis
- **Service Worker API** - Offline-first caching
- **GSAP** - Smooth animations (only external dependency, also cached)
- **LocalStorage** - Data persistence

### Architecture
```
Offline-Temple/
├── index.html              # Main entry point
├── sw.js                   # Service Worker (CacheFirst)
├── manifest.json           # PWA manifest
└── src/
    ├── css/
    │   └── style.css       # All styles
    └── js/
        ├── app.js          # Main application logic
        └── modules/
            ├── audio-manager.js      # Web Audio synthesis
            ├── breathing-exercise.js # Pranayama patterns
            ├── meditation-timer.js   # Dhyana timer
            ├── mantra-counter.js     # Japa counter
            ├── data-manager.js       # LocalStorage wrapper
            ├── online-manager.js     # Online mode effects
            ├── ui-effects.js         # GSAP animations
            └── daily-wisdom.js       # Quote rotation
```

---

## 🌟 Key Concepts

### Offline-First Philosophy
The app embraces the concept of **digital detox** by requiring users to disconnect from the internet. This isn't just a technical feature—it's the core philosophy:

> *True peace requires disconnection from the always-on digital world.*

### Procedural Audio
Instead of loading audio files, all sounds are generated in real-time using the Web Audio API:
- **Lightweight** - No large audio files to download
- **Infinite** - Sounds never repeat or loop noticeably
- **Dynamic** - Can be mixed and modulated in real-time

### Service Worker Strategy
Uses **CacheFirst** with **stale-while-revalidate**:
1. Serve from cache immediately (instant load)
2. Update cache in background from network
3. New version ready on next visit

---

## 📱 Mobile Support

### iOS
- Tap screen once to unlock AudioContext
- Add to Home Screen for full-screen PWA experience
- Black translucent status bar

### Android
- Auto-unlock on first interaction
- Install prompt for native app experience
- Works with Chrome, Firefox, Edge

---

## 🎯 Roadmap

- [ ] More breathing patterns (Wim Hof, Alternate Nostril)
- [ ] Binaural beats generation
- [ ] Custom mantra text input
- [ ] Session history and statistics
- [ ] Guided meditation scripts (text-based)
- [ ] Themes (Light mode, Nature, Space)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Tips
1. Use a local server (Service Workers require HTTPS or localhost)
2. Check DevTools → Application → Service Workers for debugging
3. Hard refresh (Cmd+Shift+R) when updating Service Worker
4. Test on iOS Safari for mobile audio issues

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by ancient meditation practices
- Web Audio API examples from MDN
- GSAP for smooth animations
- The concept of digital minimalism

---

## 💬 Philosophy

> "In the midst of movement and chaos, keep stillness inside of you." — Deepak Chopra

This app is a reminder that sometimes the best way to connect with ourselves is to disconnect from everything else.

**May peace be with you. 🕉️**