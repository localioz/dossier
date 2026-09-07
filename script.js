const greetings = [
    "Hello!",
    "¡Hola!",
    "Bonjour!",
    "안녕하세요!",
    "こんにちは!",
    "你好!",
    "Hallo!",
    "Kumusta!",
    "Ciao!"
];

const greetingElement = document.getElementById('greeting-flash');
const splashScreen = document.getElementById('splash-screen');
let currentIndex = 0;
let flashInterval = null;
let isLoaded = false;

// Check if the splash has already been shown in this session
const hasVisited = sessionStorage.getItem('site_initialized');

if (hasVisited) {
    // Skip splash immediately if already visited
    if (splashScreen) {
        splashScreen.style.display = 'none';
    }
    document.body.classList.add('loaded');
    const navContainer = document.querySelector('.top-nav-container');
    if (navContainer) navContainer.classList.add('visible');
    isLoaded = true;
} else {
    // Start cycling greetings on initial fresh load
    if (greetingElement) {
        flashInterval = setInterval(() => {
            greetingElement.style.opacity = 0;
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % greetings.length;
                greetingElement.textContent = greetings[currentIndex];
                greetingElement.style.opacity = 1;
            }, 100);
        }, 300);
    }
}

function dismissSplashScreen() {
    if (isLoaded) return;
    isLoaded = true;

    if (flashInterval) clearInterval(flashInterval);
    
    // Mark session as initialized so returning home skips this
    sessionStorage.setItem('site_initialized', 'true');

    setTimeout(() => {
        document.body.classList.add('fade-out-splash');
        setTimeout(() => {
            document.body.classList.add('loaded');
            const navContainer = document.querySelector('.top-nav-container');
            if (navContainer) navContainer.classList.add('visible');
        }, 600);
    }, 400);
}

window.addEventListener('load', () => {
    if (!hasVisited) {
        setTimeout(dismissSplashScreen, 1200);
    }
});

// --- DYNAMIC SYSTEM STATUS FULL DATE ---
const statusTextElement = document.getElementById('system-status-text');
if (statusTextElement) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    statusTextElement.textContent = `SYS_ONLINE // ${year}.${month}.${day}`;
}

// --- 3D INTERACTIVE COORDINATE LOCK (Desktop & Mobile) ---
const coordX = document.getElementById('coord-x');
const coordY = document.getElementById('coord-y');
const coordZ = document.getElementById('coord-z');

window.addEventListener('mousemove', (e) => {
    if (coordX && coordY && coordZ) {
        coordX.textContent = String(e.clientX).padStart(4, '0');
        coordY.textContent = String(e.clientY).padStart(4, '0');
        let zVal = Math.round(Math.abs(window.innerWidth / 2 - e.clientX) / 10);
        coordZ.textContent = String(zVal).padStart(3, '0');
    }
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0 && coordX && coordY && coordZ) {
        let touch = e.touches[0];
        coordX.textContent = String(Math.round(touch.clientX)).padStart(4, '0');
        coordY.textContent = String(Math.round(touch.clientY)).padStart(4, '0');
        let zVal = Math.round(Math.abs(window.innerWidth / 2 - touch.clientX) / 10);
        coordZ.textContent = String(zVal).padStart(3, '0');
    }
}, { passive: true });

window.addEventListener('deviceorientation', (e) => {
    if (coordX && coordY && coordZ && e.beta !== null && e.gamma !== null) {
        coordX.textContent = String(Math.round(e.gamma * 10)).padStart(4, '0');
        coordY.textContent = String(Math.round(e.beta * 10)).padStart(4, '0');
        coordZ.textContent = String(Math.round((e.alpha || 0))).padStart(3, '0');
    }
}, true);

// --- MULTI-TONE ACOUSTIC FEEDBACK ENGINE (Web Audio API) ---
let audioCtx = null;

function playAudioCue(type) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;

        if (type === 'hover') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(850, now);
            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
            osc.start(now);
            osc.stop(now + 0.02);
        } else if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(240, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'blueprint') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        }
    } catch (e) {
        // Suppress browser audio policy warnings
    }
}

// --- BLUEPRINT WIREFRAME TOGGLE ---
const blueprintBtn = document.getElementById('blueprint-toggle');
if (blueprintBtn) {
    blueprintBtn.addEventListener('click', () => {
        document.body.classList.toggle('blueprint-mode');
        const isBlueprint = document.body.classList.contains('blueprint-mode');
        blueprintBtn.style.borderColor = isBlueprint ? '#06b6d4' : 'rgba(255, 255, 255, 0.2)';
        playAudioCue('blueprint');
    });
}

document.querySelectorAll('nav a, .workshop-btn, .utility-btn').forEach(el => {
    el.addEventListener('mouseenter', () => playAudioCue('hover'));
    el.addEventListener('click', () => playAudioCue('click'));
});

const nicknames = ["Linus", "Anton", "Yuan"]; // Add your nicknames here
const nicknameElement = document.getElementById('hero-nickname');

let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeWriter() {
    const currentWord = nicknames[currentWordIndex];

    if (isDeleting) {
        nicknameElement.textContent = currentWord.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 75; // Faster speed when deleting
    } else {
        nicknameElement.textContent = currentWord.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 150; // Normal typing speed
    }

    // If word is completely typed out
    if (!isDeleting && currentCharIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at the fully typed word before deleting
    } 
    // If word is completely deleted
    else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % nicknames.length;
        typingSpeed = 500; // Pause before typing the next word
    }

    setTimeout(typeWriter, typingSpeed);
}

// Start the typewriter effect on page load
document.addEventListener('DOMContentLoaded', () => {
    if (nicknameElement) {
        setTimeout(typeWriter, 500);
    }
});

// JavaScript to completely remove the loading screen element from DOM after transition completes
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    setTimeout(() => {
        if (loader) {
            loader.remove();
        }
    }, 4000); // Matches total animation timing
});

/* Add this snippet to your profile script to clear the loader instantly */
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
        // Cut the timeout down or remove it entirely for an instant entry
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300); // Clean up DOM quickly after fade
        }, 200); // 200ms flash instead of a long delay
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const navLinksContainer = document.getElementById('nav-links-container');

    if (hamburgerToggle && navLinksContainer) {
        hamburgerToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburgerToggle.classList.toggle('active');
        });

        // Automatically close menu when selecting any link
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                hamburgerToggle.classList.remove('active');
            });
        });
    }
});