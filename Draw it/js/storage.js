/* ===========================
   LOCAL STORAGE MANAGEMENT
   =========================== */

// Storage keys
const STORAGE_KEYS = {
    USERS: 'drawit_users',
    CURRENT_USER: 'drawit_currentUser',
    DRAWINGS: 'drawit_drawings',
    SETTINGS: 'drawit_settings',
    RECENT_COLORS: 'drawit_recent_colors',
    FAVORITE_COLORS: 'drawit_favorite_colors'
};

// User Management
class UserStorage {
    // Get all users
    static getUsers() {
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    }
    
    // Save users array
    static saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    // Register new user
    static register(userData) {
        const users = this.getUsers();
        
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }
        
        // Check if username already exists
        if (users.some(u => u.username === userData.username)) {
            return { success: false, message: 'Username already taken' };
        }
        
        // Create new user
        const newUser = {
            id: generateId(),
            username: userData.username,
            email: userData.email,
            password: userData.password, // In production, this should be hashed
            avatar: userData.avatar,
            joinedDate: new Date().toISOString(),
            favoriteColor: '#FF70A6',
            totalDrawings: 0
        };
        
        users.push(newUser);
        this.saveUsers(users);
        
        return { success: true, user: newUser };
    }
    
    // Login user
    static login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
            return { success: true, user };
        }
        
        return { success: false, message: 'Invalid email or password' };
    }
    
    // Logout user
    static logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    
    // Get current logged-in user
    static getCurrentUser() {
        const email = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!email) return null;
        
        const users = this.getUsers();
        return users.find(u => u.email === email);
    }
    
    // Update user profile
    static updateUser(updates) {
        const currentEmail = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!currentEmail) return { success: false, message: 'Not logged in' };
        
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === currentEmail);
        
        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }
        
        // Update user data
        users[userIndex] = { ...users[userIndex], ...updates };
        this.saveUsers(users);
        
        // Update current user email if changed
        if (updates.email) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, updates.email);
        }
        
        return { success: true, user: users[userIndex] };
    }
    
    // Update user stats
    static updateStats(stats) {
        const user = this.getCurrentUser();
        if (!user) return;
        
        this.updateUser(stats);
    }
}

// Drawing Management
class DrawingStorage {
    // Get all drawings for current user
    static getDrawings() {
        const user = UserStorage.getCurrentUser();
        if (!user) return [];
        
        const allDrawings = localStorage.getItem(STORAGE_KEYS.DRAWINGS);
        const drawings = allDrawings ? JSON.parse(allDrawings) : [];
        
        return drawings.filter(d => d.userId === user.id);
    }
    
    // Save drawing
    static saveDrawing(drawingData) {
        const user = UserStorage.getCurrentUser();
        if (!user) return { success: false, message: 'Not logged in' };
        
        const allDrawings = localStorage.getItem(STORAGE_KEYS.DRAWINGS);
        const drawings = allDrawings ? JSON.parse(allDrawings) : [];
        
        const newDrawing = {
            id: generateId(),
            userId: user.id,
            title: drawingData.title || 'Untitled',
            imageData: drawingData.imageData,
            thumbnail: drawingData.thumbnail || drawingData.imageData,
            createdDate: new Date().toISOString(),
            type: drawingData.type || 'drawing' // 'drawing' or 'coloring'
        };
        
        drawings.push(newDrawing);
        localStorage.setItem(STORAGE_KEYS.DRAWINGS, JSON.stringify(drawings));
        
        // Update user stats
        UserStorage.updateStats({ totalDrawings: this.getDrawings().length });
        
        return { success: true, drawing: newDrawing };
    }
    
    // Delete drawing
    static deleteDrawing(drawingId) {
        const allDrawings = localStorage.getItem(STORAGE_KEYS.DRAWINGS);
        const drawings = allDrawings ? JSON.parse(allDrawings) : [];
        
        const filteredDrawings = drawings.filter(d => d.id !== drawingId);
        localStorage.setItem(STORAGE_KEYS.DRAWINGS, JSON.stringify(filteredDrawings));
        
        // Update user stats
        UserStorage.updateStats({ totalDrawings: this.getDrawings().length });
        
        return { success: true };
    }
    
    // Get single drawing
    static getDrawing(drawingId) {
        const drawings = this.getDrawings();
        return drawings.find(d => d.id === drawingId);
    }
    
    // Update drawing
    static updateDrawing(drawingId, updates) {
        const allDrawings = localStorage.getItem(STORAGE_KEYS.DRAWINGS);
        const drawings = allDrawings ? JSON.parse(allDrawings) : [];
        
        const drawingIndex = drawings.findIndex(d => d.id === drawingId);
        if (drawingIndex === -1) {
            return { success: false, message: 'Drawing not found' };
        }
        
        drawings[drawingIndex] = { ...drawings[drawingIndex], ...updates };
        localStorage.setItem(STORAGE_KEYS.DRAWINGS, JSON.stringify(drawings));
        
        return { success: true, drawing: drawings[drawingIndex] };
    }
}

// Color Management
class ColorStorage {
    // Get recent colors
    static getRecentColors() {
        const user = UserStorage.getCurrentUser();
        if (!user) return [];
        
        const key = `${STORAGE_KEYS.RECENT_COLORS}_${user.id}`;
        const colors = localStorage.getItem(key);
        return colors ? JSON.parse(colors) : [];
    }
    
    // Add recent color
    static addRecentColor(color) {
        const user = UserStorage.getCurrentUser();
        if (!user) return;
        
        const key = `${STORAGE_KEYS.RECENT_COLORS}_${user.id}`;
        let colors = this.getRecentColors();
        
        // Remove if already exists
        colors = colors.filter(c => c !== color);
        
        // Add to beginning
        colors.unshift(color);
        
        // Keep only last 10
        colors = colors.slice(0, 10);
        
        localStorage.setItem(key, JSON.stringify(colors));
    }
    
    // Get favorite colors
    static getFavoriteColors() {
        const user = UserStorage.getCurrentUser();
        if (!user) return [];
        
        const key = `${STORAGE_KEYS.FAVORITE_COLORS}_${user.id}`;
        const colors = localStorage.getItem(key);
        return colors ? JSON.parse(colors) : [];
    }
    
    // Add favorite color
    static addFavoriteColor(color) {
        const user = UserStorage.getCurrentUser();
        if (!user) return;
        
        const key = `${STORAGE_KEYS.FAVORITE_COLORS}_${user.id}`;
        let colors = this.getFavoriteColors();
        
        if (!colors.includes(color)) {
            colors.push(color);
            localStorage.setItem(key, JSON.stringify(colors));
        }
    }
    
    // Remove favorite color
    static removeFavoriteColor(color) {
        const user = UserStorage.getCurrentUser();
        if (!user) return;
        
        const key = `${STORAGE_KEYS.FAVORITE_COLORS}_${user.id}`;
        let colors = this.getFavoriteColors();
        colors = colors.filter(c => c !== color);
        localStorage.setItem(key, JSON.stringify(colors));
    }
    
    // Update most used color
    static updateFavoriteColor(color) {
        const user = UserStorage.getCurrentUser();
        if (!user) return;
        
        UserStorage.updateStats({ favoriteColor: color });
    }
}

// Settings Management
class SettingsStorage {
    // Get settings
    static getSettings() {
        const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : {
            darkMode: false,
            music: false,
            sound: true,
            autosave: true
        };
    }
    
    // Save settings
    static saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
    
    // Update single setting
    static updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.saveSettings(settings);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UserStorage,
        DrawingStorage,
        ColorStorage,
        SettingsStorage,
        STORAGE_KEYS
    };
}
