/* ===========================
   AUTHENTICATION
   =========================== */

// Check if on signup page
if (window.location.pathname.includes('signup.html')) {
    initSignup();
}

// Check if on login page
if (window.location.pathname.includes('login.html')) {
    initLogin();
}

// Signup Page
function initSignup() {
    const signupForm = document.getElementById('signupForm');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const selectedAvatarInput = document.getElementById('selectedAvatar');
    
    // Avatar selection
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selection from all
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked
            this.classList.add('selected');
            
            // Set hidden input value
            selectedAvatarInput.value = this.dataset.avatar;
            
            playSound('click');
        });
    });
    
    // Form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const avatar = selectedAvatarInput.value;
        
        // Validation
        if (!username) {
            showNotification('Please enter a username', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }
        
        if (!isValidPassword(password)) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (!avatar) {
            showNotification('Please select an avatar', 'error');
            return;
        }
        
        // Register user
        const result = UserStorage.register({
            username,
            email,
            password,
            avatar
        });
        
        if (result.success) {
            // Auto login
            UserStorage.login(email, password);
            
            // Show confetti
            createConfetti();
            
            // Show success message
            showNotification('Account created successfully! 🎉');
            
            // Redirect to home after a delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        } else {
            showNotification(result.message, 'error');
        }
    });
}

// Login Page
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const forgotLink = document.querySelector('.forgot-link');
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validation
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }
        
        if (!password) {
            showNotification('Please enter your password', 'error');
            return;
        }
        
        // Login user
        const result = UserStorage.login(email, password);
        
        if (result.success) {
            // Save remember me preference
            if (rememberMe) {
                localStorage.setItem('drawit_remember', 'true');
            } else {
                localStorage.removeItem('drawit_remember');
            }
            
            // Show success animation
            const btn = loginForm.querySelector('.btn-primary');
            btn.textContent = 'Success! 🎉';
            btn.style.background = 'linear-gradient(135deg, #7AE582, #70D6FF)';
            
            // Show notification
            showNotification(`Welcome back, ${result.user.username}! 🎨`);
            
            // Redirect to home
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            showNotification(result.message, 'error');
            
            // Shake the form
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    });
    
    // Forgot password (dummy)
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Password reset feature coming soon! 🔐');
        });
    }
}

// Auto-fill remembered user (if any)
window.addEventListener('load', () => {
    if (window.location.pathname.includes('login.html')) {
        const remember = localStorage.getItem('drawit_remember');
        if (remember === 'true') {
            const currentUser = localStorage.getItem('drawit_currentUser');
            if (currentUser) {
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    emailInput.value = currentUser;
                    document.getElementById('rememberMe').checked = true;
                }
            }
        }
    }
});
