/* ===========================
   HOME PAGE
   =========================== */

// Check authentication
if (!requireAuth()) {
    // Will redirect to login if not authenticated
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupLogout();
});

// Load user data
function loadUserData() {
    const user = UserStorage.getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const totalDrawings = document.getElementById('totalDrawings');
    const favoriteColor = document.getElementById('favoriteColor');
    
    if (userName) {
        userName.textContent = user.username;
    }
    
    if (userAvatar) {
        userAvatar.textContent = getAvatarEmoji(user.avatar);
    }
    
    // Get user drawings
    const drawings = DrawingStorage.getDrawings();
    
    if (totalDrawings) {
        totalDrawings.textContent = drawings.length;
    }
    
    if (favoriteColor) {
        favoriteColor.textContent = user.favoriteColor || '🎨';
        favoriteColor.style.color = user.favoriteColor || '#FF70A6';
    }
    
    // Animate stats
    animateStats();
}

// Animate stats counter
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 50);
    });
}

// Setup logout button
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Confirm logout
            if (confirm('Are you sure you want to logout? 👋')) {
                UserStorage.logout();
                showNotification('Logged out successfully! See you soon! 🎨');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
}

// Add hover effects to menu cards
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Welcome animation
window.addEventListener('load', () => {
    const welcomeSection = document.querySelector('.welcome-section');
    const menuCards = document.querySelectorAll('.menu-card');
    
    if (welcomeSection) {
        welcomeSection.style.animation = 'fadeIn 0.5s ease';
    }
    
    menuCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'slideInTop 0.5s ease';
        }, index * 100);
    });
});
