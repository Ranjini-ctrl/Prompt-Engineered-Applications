/* ===========================
   PROFILE PAGE
   =========================== */

// Check authentication
if (!requireAuth()) {
    // Will redirect to login if not authenticated
}

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    setupSettings();
    setupModals();
    setupLogout();
});

// Load profile data
function loadProfile() {
    const user = UserStorage.getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    document.getElementById('profileAvatar').textContent = getAvatarEmoji(user.avatar);
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    
    // Get drawings count
    const drawings = DrawingStorage.getDrawings();
    document.getElementById('totalDrawings').textContent = drawings.length;
    
    // Display favorite color
    const favoriteColorEl = document.getElementById('favoriteColor');
    favoriteColorEl.textContent = user.favoriteColor || '#FF70A6';
    favoriteColorEl.style.color = user.favoriteColor || '#FF70A6';
    
    // Display joined date
    document.getElementById('joinedDate').textContent = formatDate(user.joinedDate);
}

// Setup settings toggles
function setupSettings() {
    const settings = SettingsStorage.getSettings();
    
    // Dark mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.checked = settings.darkMode;
    darkModeToggle.addEventListener('change', function() {
        SettingsStorage.updateSetting('darkMode', this.checked);
        applyDarkMode(this.checked);
        showNotification(`Dark mode ${this.checked ? 'enabled' : 'disabled'}`);
    });
    
    // Music
    const musicToggle = document.getElementById('musicToggle');
    musicToggle.checked = settings.music;
    musicToggle.addEventListener('change', function() {
        SettingsStorage.updateSetting('music', this.checked);
        showNotification(`Music ${this.checked ? 'enabled' : 'disabled'}`);
    });
    
    // Sound effects
    const soundToggle = document.getElementById('soundToggle');
    soundToggle.checked = settings.sound;
    soundToggle.addEventListener('change', function() {
        SettingsStorage.updateSetting('sound', this.checked);
        showNotification(`Sound effects ${this.checked ? 'enabled' : 'disabled'}`);
    });
    
    // Autosave
    const autosaveToggle = document.getElementById('autosaveToggle');
    autosaveToggle.checked = settings.autosave;
    autosaveToggle.addEventListener('change', function() {
        SettingsStorage.updateSetting('autosave', this.checked);
        showNotification(`Auto-save ${this.checked ? 'enabled' : 'disabled'}`);
    });
}

// Setup modals
function setupModals() {
    // Avatar modal
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarModal = document.getElementById('avatarModal');
    const closeAvatarModal = document.getElementById('closeAvatarModal');
    const avatarOptions = document.querySelectorAll('#avatarModal .avatar-option');
    
    changeAvatarBtn.addEventListener('click', () => {
        avatarModal.classList.add('active');
    });
    
    closeAvatarModal.addEventListener('click', () => {
        avatarModal.classList.remove('active');
    });
    
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            const newAvatar = this.dataset.avatar;
            
            // Update user avatar
            const result = UserStorage.updateUser({ avatar: newAvatar });
            
            if (result.success) {
                document.getElementById('profileAvatar').textContent = getAvatarEmoji(newAvatar);
                showNotification('Avatar updated! 🎨');
                avatarModal.classList.remove('active');
            }
        });
    });
    
    // Edit profile modal
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editModal = document.getElementById('editModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const editProfileForm = document.getElementById('editProfileForm');
    
    editProfileBtn.addEventListener('click', () => {
        const user = UserStorage.getCurrentUser();
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        editModal.classList.add('active');
    });
    
    closeEditModal.addEventListener('click', () => {
        editModal.classList.remove('active');
    });
    
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newUsername = document.getElementById('editUsername').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();
        
        if (!newUsername) {
            showNotification('Username cannot be empty', 'error');
            return;
        }
        
        if (!isValidEmail(newEmail)) {
            showNotification('Invalid email address', 'error');
            return;
        }
        
        // Update user
        const result = UserStorage.updateUser({
            username: newUsername,
            email: newEmail
        });
        
        if (result.success) {
            showNotification('Profile updated successfully! ✨');
            loadProfile();
            editModal.classList.remove('active');
        } else {
            showNotification(result.message, 'error');
        }
    });
    
    // Close modals on background click
    avatarModal.addEventListener('click', (e) => {
        if (e.target === avatarModal) {
            avatarModal.classList.remove('active');
        }
    });
    
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.classList.remove('active');
        }
    });
}

// Setup logout
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout? 👋')) {
            UserStorage.logout();
            showNotification('Logged out successfully! See you soon! 🎨');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    });
}

// Add animations on load
window.addEventListener('load', () => {
    const profileCard = document.querySelector('.profile-card');
    const settingsCard = document.querySelector('.settings-card');
    
    if (profileCard) {
        profileCard.style.animation = 'fadeIn 0.5s ease';
    }
    
    if (settingsCard) {
        setTimeout(() => {
            settingsCard.style.animation = 'slideInLeft 0.5s ease';
        }, 200);
    }
});
