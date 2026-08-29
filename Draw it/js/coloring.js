/* ===========================
   COLORING BOOK PAGE
   =========================== */

// Check authentication
if (!requireAuth()) {
    // Will redirect to login if not authenticated
}

// Coloring templates by category
const templates = {
    fruits: [
        { name: 'Apple', icon: '🍎' },
        { name: 'Orange', icon: '🍊' },
        { name: 'Banana', icon: '🍌' },
        { name: 'Grapes', icon: '🍇' },
        { name: 'Mango', icon: '🥭' },
        { name: 'Strawberry', icon: '🍓' }
    ],
    animals: [
        { name: 'Cat', icon: '🐱' },
        { name: 'Dog', icon: '🐶' },
        { name: 'Lion', icon: '🦁' },
        { name: 'Elephant', icon: '🐘' },
        { name: 'Rabbit', icon: '🐰' },
        { name: 'Bird', icon: '🐦' }
    ],
    objects: [
        { name: 'Car', icon: '🚗' },
        { name: 'House', icon: '🏠' },
        { name: 'Rocket', icon: '🚀' },
        { name: 'Train', icon: '🚂' },
        { name: 'Airplane', icon: '✈️' },
        { name: 'Boat', icon: '⛵' }
    ],
    flowers: [
        { name: 'Rose', icon: '🌹' },
        { name: 'Sunflower', icon: '🌻' },
        { name: 'Tulip', icon: '🌷' },
        { name: 'Daisy', icon: '🌼' },
        { name: 'Hibiscus', icon: '🌺' },
        { name: 'Blossom', icon: '🌸' }
    ],
    kids: [
        { name: 'Boy', icon: '👦' },
        { name: 'Girl', icon: '👧' },
        { name: 'Baby', icon: '👶' },
        { name: 'Princess', icon: '👸' },
        { name: 'Superhero', icon: '🦸' },
        { name: 'Fairy', icon: '🧚' }
    ],
    festivals: [
        { name: 'Christmas', icon: '🎄' },
        { name: 'Diwali', icon: '🪔' },
        { name: 'Halloween', icon: '🎃' },
        { name: 'Easter', icon: '🐰' },
        { name: 'Birthday', icon: '🎂' },
        { name: 'Fireworks', icon: '🎆' }
    ]
};

// Canvas and coloring state
let canvas, ctx;
let isColoring = false;
let currentTool = 'brush';
let currentColor = '#FF0000';
let brushSize = 20;
let currentTemplate = null;
let history = [];
let historyStep = -1;

// Initialize coloring page
document.addEventListener('DOMContentLoaded', () => {
    initCategories();
    loadTemplates('fruits');
});

// Initialize category tabs
function initCategories() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Load templates
            loadTemplates(this.dataset.category);
            
            playSound('click');
        });
    });
}

// Load templates for category
function loadTemplates(category) {
    const grid = document.getElementById('templatesGrid');
    grid.innerHTML = '';
    
    const categoryTemplates = templates[category] || [];
    
    categoryTemplates.forEach(template => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
            <div class="template-preview">${template.icon}</div>
            <div class="template-name">${template.name}</div>
        `;
        
        card.addEventListener('click', () => {
            openColoringCanvas(template, category);
        });
        
        grid.appendChild(card);
    });
}

// Open coloring canvas
function openColoringCanvas(template, category) {
    currentTemplate = { ...template, category };
    
    // Hide template view
    document.getElementById('templateView').style.display = 'none';
    
    // Show coloring view
    document.getElementById('coloringView').style.display = 'block';
    
    // Initialize canvas
    initCanvas();
    
    // Draw template outline
    drawTemplate(template);
    
    playSound('click');
}

// Initialize canvas
function initCanvas() {
    canvas = document.getElementById('coloringCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    
    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Initialize tools
    initTools();
    initColorPicker();
    initActions();
    
    // Mouse events
    canvas.addEventListener('mousedown', startColoring);
    canvas.addEventListener('mousemove', color);
    canvas.addEventListener('mouseup', stopColoring);
    canvas.addEventListener('mouseout', stopColoring);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopColoring);
    
    // Save initial state
    setTimeout(() => saveState(), 100);
}

// Resize canvas
function resizeCanvas() {
    const wrapper = document.querySelector('.canvas-wrapper');
    const maxWidth = wrapper.clientWidth - 40;
    const maxHeight = wrapper.clientHeight - 40;
    
    canvas.width = Math.min(maxWidth, 800);
    canvas.height = Math.min(maxHeight, 600);
}

// Draw template outline
function drawTemplate(template) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw large icon
    ctx.font = `${canvas.height * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(template.icon, canvas.width / 2, canvas.height / 2);
    
    // Convert to outline (simple approach)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.font = `${canvas.height * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(template.icon, canvas.width / 2, canvas.height / 2);
}

// Initialize tools
function initTools() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toolButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.dataset.tool;
        });
    });
    
    // Brush size
    const brushSizeSlider = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    
    if (brushSizeSlider) {
        brushSizeSlider.addEventListener('input', function() {
            brushSize = parseInt(this.value);
            brushSizeValue.textContent = brushSize;
        });
    }
}

// Initialize color picker
function initColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    
    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            currentColor = this.value;
        });
    }
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            currentColor = this.dataset.color;
            if (colorPicker) colorPicker.value = currentColor;
        });
    });
}

// Initialize actions
function initActions() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const backBtn = document.getElementById('backBtn');
    
    if (undoBtn) undoBtn.addEventListener('click', undo);
    if (redoBtn) redoBtn.addEventListener('click', redo);
    if (clearBtn) clearBtn.addEventListener('click', clearCanvas);
    if (saveBtn) saveBtn.addEventListener('click', saveColoring);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadColoring);
    if (backBtn) backBtn.addEventListener('click', backToTemplates);
}

// Start coloring
function startColoring(e) {
    isColoring = true;
    color(e);
}

// Color
function color(e) {
    if (!isColoring && currentTool !== 'bucket') return;
    
    const pos = getMousePos(e);
    
    if (currentTool === 'bucket') {
        // Fill tool (simple implementation)
        floodFill(Math.floor(pos.x), Math.floor(pos.y), currentColor);
        saveState();
    } else if (currentTool === 'brush') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
}

// Stop coloring
function stopColoring() {
    if (isColoring) {
        isColoring = false;
        saveState();
    }
}

// Simple flood fill
function floodFill(x, y, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixelColor(imageData, x, y);
    const fillColorRgb = hexToRgb(fillColor);
    
    if (colorsMatch(targetColor, fillColorRgb)) return;
    
    const stack = [[x, y]];
    const visited = new Set();
    
    while (stack.length > 0) {
        const [currentX, currentY] = stack.pop();
        const key = `${currentX},${currentY}`;
        
        if (visited.has(key)) continue;
        if (currentX < 0 || currentX >= canvas.width || currentY < 0 || currentY >= canvas.height) continue;
        
        const currentColor = getPixelColor(imageData, currentX, currentY);
        if (!colorsMatch(currentColor, targetColor)) continue;
        
        visited.add(key);
        setPixelColor(imageData, currentX, currentY, fillColorRgb);
        
        // Limit flood fill to prevent browser freeze
        if (visited.size > 10000) break;
        
        stack.push([currentX + 1, currentY]);
        stack.push([currentX - 1, currentY]);
        stack.push([currentX, currentY + 1]);
        stack.push([currentX, currentY - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Helper functions for flood fill
function getPixelColor(imageData, x, y) {
    const index = (y * imageData.width + x) * 4;
    return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3]
    };
}

function setPixelColor(imageData, x, y, color) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = 255;
}

function colorsMatch(c1, c2) {
    return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Handle touch
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

// Get mouse position
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

// Save state
function saveState() {
    historyStep++;
    if (historyStep < history.length) {
        history.length = historyStep;
    }
    history.push(canvas.toDataURL());
}

// Undo
function undo() {
    if (historyStep > 0) {
        historyStep--;
        const img = new Image();
        img.src = history[historyStep];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

// Redo
function redo() {
    if (historyStep < history.length - 1) {
        historyStep++;
        const img = new Image();
        img.src = history[historyStep];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

// Clear canvas
function clearCanvas() {
    if (confirm('Clear and start over? 🗑️')) {
        drawTemplate(currentTemplate);
        saveState();
    }
}

// Save coloring
function saveColoring() {
    const title = `${currentTemplate.name} - Colored`;
    
    const result = DrawingStorage.saveDrawing({
        title: title,
        imageData: canvas.toDataURL('image/png'),
        type: 'coloring'
    });
    
    if (result.success) {
        showNotification('Coloring saved! 🎨');
        playSound('save');
    }
}

// Download coloring
function downloadColoring() {
    const filename = `${currentTemplate.name.toLowerCase()}-colored.png`;
    downloadCanvas(canvas, filename);
}

// Back to templates
function backToTemplates() {
    document.getElementById('coloringView').style.display = 'none';
    document.getElementById('templateView').style.display = 'block';
    
    // Reset state
    history = [];
    historyStep = -1;
}
