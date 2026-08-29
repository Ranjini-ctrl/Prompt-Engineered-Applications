/* ===========================
   UTILITY FUNCTIONS
   =========================== */

// Sound Effects (optional)
const sounds = {
    click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPDTgjMGHm7A7+OZSA0PVqzn77FeGgsyiNXwzH0pBSF0w+rZkEILElyz6OyrWhgJRZ7f8sFuIwUldcrv14Q2Bhxqvu3mmEoODlOp5/C2Yh0IMIbU8ct8KgUfdsPq2Y9DChFbsufrrV0bCTyZ3PC/bSQFJHPG79aFNwYbaLvt5ZdLDg1RqOXwtWEeCi6E0vHJeysEHXfE6dqPRAoQWrLm7K1eGwk8mNvwv20kBSRzxu/WhTcGG2i77eWXSw4NUajl8LVhHgougdDxx3orBB12w+jajkQJD1iw5eysXBoJO5fZ8L5sIwUjccXu1IQzBhlmuezkl0kNC0+m5O+0YRsLLX/M7sh6JwMddcPn2Y5CCg5WrOPqqloYCDqU1+67bCAEIm/E7NKCMgQZY7fr45ZICQxNoePusV8aCS18yuyXQwwPUKXh6KhYFQc0jdTpunAhBSBuxd7RgDIFF2S46+STRwkMS6Dh7q9eGQkrdMXpy38xBBxttOnZ",
    save: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
    success: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
};

// Play sound effect
function playSound(soundName) {
    try {
        const soundSettings = getSettings();
        if (!soundSettings.sound) return;
        
        if (sounds[soundName]) {
            const audio = new Audio(sounds[soundName]);
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Silently fail if autoplay is blocked
        }
    } catch (error) {
        console.log('Sound playback not available');
    }
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Format date with time
function formatDateTime(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #7AE582, #70D6FF)' : 'linear-gradient(135deg, #FF6B6B, #FF8E8E)'};
        color: white;
        border-radius: 25px;
        font-family: 'Fredoka', cursive;
        font-size: 1.1rem;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Confetti animation
function createConfetti() {
    const canvas = document.getElementById('confetti');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    const pieces = [];
    const numberOfPieces = 200;
    const colors = ['#FF70A6', '#70D6FF', '#FFD670', '#7AE582', '#A685FF'];
    
    for (let i = 0; i < numberOfPieces; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            rotation: Math.random() * 360,
            speed: Math.random() * 3 + 2,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        pieces.forEach((piece, index) => {
            piece.y += piece.speed;
            piece.rotation += 2;
            
            if (piece.y > canvas.height) {
                pieces.splice(index, 1);
            }
            
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            ctx.restore();
        });
        
        if (pieces.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
    playSound('success');
}

// Get settings from localStorage
function getSettings() {
    const defaultSettings = {
        darkMode: false,
        music: false,
        sound: true,
        autosave: true
    };
    
    const saved = localStorage.getItem('drawit_settings');
    return saved ? {...defaultSettings, ...JSON.parse(saved)} : defaultSettings;
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem('drawit_settings', JSON.stringify(settings));
}

// Apply dark mode
function applyDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('drawit_currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const userEmail = localStorage.getItem('drawit_currentUser');
    if (!userEmail) return null;
    
    const users = JSON.parse(localStorage.getItem('drawit_users') || '[]');
    return users.find(u => u.email === userEmail);
}

// Redirect to login if not logged in
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Download canvas as image
function downloadCanvas(canvas, filename = 'drawing.png') {
    try {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification('Downloaded successfully! 🎉');
        playSound('success');
    } catch (error) {
        showNotification('Download failed', 'error');
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get avatar emoji
function getAvatarEmoji(avatarType) {
    const avatars = {
        boy: '👦',
        girl: '👧',
        cat: '🐱',
        rabbit: '🐰',
        fox: '🦊',
        panda: '🐼'
    };
    return avatars[avatarType] || '👦';
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password (at least 6 characters)
function isValidPassword(password) {
    return password.length >= 6;
}

// Show/hide element
function show(element) {
    element.style.display = 'block';
}

function hide(element) {
    element.style.display = 'none';
}

// Smooth scroll to element
function smoothScroll(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Initialize tooltips
function initTooltips() {
    document.querySelectorAll('[title]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 0.85rem;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.bottom + 10 + 'px';
            
            this._tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved settings
    const settings = getSettings();
    applyDarkMode(settings.darkMode);
    
    // Add button click sounds
    document.querySelectorAll('.btn, button').forEach(btn => {
        btn.addEventListener('click', () => playSound('click'));
    });
    
    // Initialize tooltips
    initTooltips();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save (prevent default browser save)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) saveBtn.click();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
