/* ===========================
   FREE DRAWING PAGE
   =========================== */

// Check authentication
if (!requireAuth()) {
    // Will redirect to login if not authenticated
}

// Canvas and drawing state
let canvas, ctx;
let isDrawing = false;
let currentTool = 'pen';
let currentColor = '#000000';
let brushSize = 5;
let brushOpacity = 1;
let history = [];
let historyStep = -1;
let autosaveInterval;

// Initialize drawing page
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initTools();
    initColorPicker();
    initActions();
    initAutosave();
    setupFullscreen();
});

// Initialize canvas
function initCanvas() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));
    
    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveState();
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

// Resize canvas
function resizeCanvas() {
    const wrapper = document.querySelector('.canvas-wrapper');
    const maxWidth = wrapper.clientWidth - 40;
    const maxHeight = wrapper.clientHeight - 40;
    
    // Maintain aspect ratio
    const aspectRatio = 4 / 3;
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }
    
    // Save current drawing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    canvas.width = width;
    canvas.height = height;
    
    // Restore drawing
    ctx.putImageData(imageData, 0, 0);
}

// Initialize tools
function initTools() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all
            toolButtons.forEach(b => b.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Set current tool
            currentTool = this.dataset.tool;
            
            // Update cursor
            updateCursor();
        });
    });
    
    // Brush size
    const brushSizeSlider = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    
    brushSizeSlider.addEventListener('input', function() {
        brushSize = parseInt(this.value);
        brushSizeValue.textContent = brushSize;
    });
    
    // Brush opacity
    const brushOpacitySlider = document.getElementById('brushOpacity');
    const brushOpacityValue = document.getElementById('brushOpacityValue');
    
    brushOpacitySlider.addEventListener('input', function() {
        brushOpacity = parseFloat(this.value);
        brushOpacityValue.textContent = Math.round(brushOpacity * 100) + '%';
    });
}

// Initialize color picker
function initColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    
    colorPicker.addEventListener('input', function() {
        currentColor = this.value;
        ColorStorage.addRecentColor(currentColor);
    });
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            currentColor = this.dataset.color;
            colorPicker.value = currentColor;
            ColorStorage.addRecentColor(currentColor);
        });
    });
}

// Initialize actions
function initActions() {
    // Undo
    document.getElementById('undoBtn').addEventListener('click', undo);
    
    // Redo
    document.getElementById('redoBtn').addEventListener('click', redo);
    
    // Clear
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    
    // Save
    document.getElementById('saveBtn').addEventListener('click', showSaveDialog);
    
    // Download
    document.getElementById('downloadBtn').addEventListener('click', downloadDrawing);
    
    // Save dialog
    document.getElementById('confirmSaveBtn').addEventListener('click', saveDrawing);
    document.getElementById('cancelSaveBtn').addEventListener('click', hideSaveDialog);
}

// Update cursor based on tool
function updateCursor() {
    if (currentTool === 'eraser') {
        canvas.style.cursor = 'cell';
    } else {
        canvas.style.cursor = 'crosshair';
    }
}

// Start drawing
function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Draw
function draw(e) {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = brushOpacity;
    
    if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        
        if (currentTool === 'rainbow') {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#FF0000');
            gradient.addColorStop(0.17, '#FF7F00');
            gradient.addColorStop(0.33, '#FFFF00');
            gradient.addColorStop(0.5, '#00FF00');
            gradient.addColorStop(0.67, '#0000FF');
            gradient.addColorStop(0.83, '#4B0082');
            gradient.addColorStop(1, '#9400D3');
            ctx.strokeStyle = gradient;
        } else {
            ctx.strokeStyle = currentColor;
        }
    }
    
    // Different drawing styles
    switch(currentTool) {
        case 'pen':
            ctx.lineWidth = brushSize;
            break;
        case 'brush':
            ctx.lineWidth = brushSize * 1.5;
            ctx.globalAlpha = brushOpacity * 0.7;
            break;
        case 'pencil':
            ctx.lineWidth = brushSize * 0.5;
            ctx.globalAlpha = brushOpacity * 0.8;
            break;
        case 'marker':
            ctx.lineWidth = brushSize * 2;
            ctx.globalAlpha = brushOpacity * 0.6;
            break;
    }
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Stop drawing
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        saveState();
    }
}

// Handle touch events
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

// Save state for undo/redo
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
        playSound('click');
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
        playSound('click');
    }
}

// Clear canvas
function clearCanvas() {
    if (confirm('Are you sure you want to clear the canvas? 🗑️')) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
        playSound('click');
    }
}

// Show save dialog
function showSaveDialog() {
    const modal = document.getElementById('saveDialog');
    modal.classList.add('active');
    document.getElementById('drawingName').focus();
}

// Hide save dialog
function hideSaveDialog() {
    const modal = document.getElementById('saveDialog');
    modal.classList.remove('active');
    document.getElementById('drawingName').value = '';
}

// Save drawing
function saveDrawing() {
    const title = document.getElementById('drawingName').value.trim() || 'Untitled Drawing';
    
    const result = DrawingStorage.saveDrawing({
        title: title,
        imageData: canvas.toDataURL('image/png'),
        type: 'drawing'
    });
    
    if (result.success) {
        showNotification('Drawing saved successfully! 🎨');
        playSound('save');
        hideSaveDialog();
    } else {
        showNotification('Failed to save drawing', 'error');
    }
}

// Download drawing
function downloadDrawing() {
    const date = new Date().toISOString().slice(0, 10);
    downloadCanvas(canvas, `drawing-${date}.png`);
}

// Autosave
function initAutosave() {
    const settings = getSettings();
    if (settings.autosave) {
        autosaveInterval = setInterval(() => {
            const autoTitle = 'Auto-saved ' + new Date().toLocaleTimeString();
            DrawingStorage.saveDrawing({
                title: autoTitle,
                imageData: canvas.toDataURL('image/png'),
                type: 'drawing'
            });
        }, 10000); // Every 10 seconds
    }
}

// Fullscreen
function setupFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                fullscreenBtn.textContent = '⛶ Exit Fullscreen';
            } else {
                document.exitFullscreen();
                fullscreenBtn.textContent = '⛶ Fullscreen';
            }
        });
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (autosaveInterval) {
        clearInterval(autosaveInterval);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Z: Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    }
    
    // Ctrl/Cmd + Shift + Z: Redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
    }
    
    // Ctrl/Cmd + S: Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showSaveDialog();
    }
    
    // E: Eraser
    if (e.key === 'e' || e.key === 'E') {
        document.querySelector('[data-tool="eraser"]').click();
    }
    
    // B: Brush
    if (e.key === 'b' || e.key === 'B') {
        document.querySelector('[data-tool="brush"]').click();
    }
    
    // P: Pen
    if (e.key === 'p' || e.key === 'P') {
        document.querySelector('[data-tool="pen"]').click();
    }
});
