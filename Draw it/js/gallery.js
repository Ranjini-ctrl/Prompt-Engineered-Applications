/* ===========================
   GALLERY PAGE
   =========================== */

// Check authentication
if (!requireAuth()) {
    // Will redirect to login if not authenticated
}

// Current viewing drawing
let currentDrawing = null;

// Initialize gallery page
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    setupModal();
});

// Load gallery
function loadGallery() {
    const drawings = DrawingStorage.getDrawings();
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyGallery = document.getElementById('emptyGallery');
    const galleryCount = document.getElementById('galleryCount');
    
    // Update count
    if (galleryCount) {
        galleryCount.textContent = drawings.length;
    }
    
    // Show empty state or gallery
    if (drawings.length === 0) {
        emptyGallery.style.display = 'block';
        galleryGrid.style.display = 'none';
    } else {
        emptyGallery.style.display = 'none';
        galleryGrid.style.display = 'grid';
        
        // Clear grid
        galleryGrid.innerHTML = '';
        
        // Sort by date (newest first)
        drawings.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        
        // Create gallery items
        drawings.forEach((drawing, index) => {
            const item = createGalleryItem(drawing);
            
            // Add staggered animation
            setTimeout(() => {
                item.style.animation = 'zoomIn 0.5s ease';
            }, index * 50);
            
            galleryGrid.appendChild(item);
        });
    }
}

// Create gallery item
function createGalleryItem(drawing) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.className = 'gallery-thumbnail';
    img.src = drawing.thumbnail || drawing.imageData;
    img.alt = drawing.title;
    
    const info = document.createElement('div');
    info.className = 'gallery-info';
    
    const title = document.createElement('div');
    title.className = 'gallery-title';
    title.textContent = drawing.title;
    
    const date = document.createElement('div');
    date.className = 'gallery-date';
    date.textContent = formatDateTime(drawing.createdDate);
    
    const actions = document.createElement('div');
    actions.className = 'gallery-actions';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'icon-btn';
    viewBtn.innerHTML = '👁️ View';
    viewBtn.onclick = (e) => {
        e.stopPropagation();
        viewDrawing(drawing);
    };
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'icon-btn';
    downloadBtn.innerHTML = '⬇️ Download';
    downloadBtn.onclick = (e) => {
        e.stopPropagation();
        downloadDrawing(drawing);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn';
    deleteBtn.innerHTML = '🗑️ Delete';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteDrawing(drawing);
    };
    
    actions.appendChild(viewBtn);
    actions.appendChild(downloadBtn);
    actions.appendChild(deleteBtn);
    
    info.appendChild(title);
    info.appendChild(date);
    info.appendChild(actions);
    
    item.appendChild(img);
    item.appendChild(info);
    
    // Click to view
    item.onclick = () => viewDrawing(drawing);
    
    return item;
}

// View drawing
function viewDrawing(drawing) {
    currentDrawing = drawing;
    
    const modal = document.getElementById('viewModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    
    modalImage.src = drawing.imageData;
    modalTitle.textContent = drawing.title;
    modalDate.textContent = 'Created on: ' + formatDateTime(drawing.createdDate);
    
    modal.classList.add('active');
    playSound('click');
}

// Download drawing
function downloadDrawing(drawing) {
    const link = document.createElement('a');
    link.download = `${drawing.title.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = drawing.imageData;
    link.click();
    
    showNotification('Download started! 📥');
    playSound('success');
}

// Delete drawing
function deleteDrawing(drawing) {
    if (confirm(`Delete "${drawing.title}"? This cannot be undone. 🗑️`)) {
        const result = DrawingStorage.deleteDrawing(drawing.id);
        
        if (result.success) {
            showNotification('Drawing deleted successfully');
            playSound('click');
            
            // Reload gallery
            setTimeout(() => {
                loadGallery();
            }, 300);
        } else {
            showNotification('Failed to delete drawing', 'error');
        }
    }
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('viewModal');
    const closeBtn = document.getElementById('closeModal');
    const downloadModalBtn = document.getElementById('downloadModalBtn');
    const deleteModalBtn = document.getElementById('deleteModalBtn');
    
    // Close modal
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('active');
        };
    }
    
    // Download from modal
    if (downloadModalBtn) {
        downloadModalBtn.onclick = () => {
            if (currentDrawing) {
                downloadDrawing(currentDrawing);
            }
        };
    }
    
    // Delete from modal
    if (deleteModalBtn) {
        deleteModalBtn.onclick = () => {
            if (currentDrawing) {
                deleteDrawing(currentDrawing);
                modal.classList.remove('active');
            }
        };
    }
    
    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
}

// Filter gallery (future feature)
function filterGallery(type) {
    const drawings = DrawingStorage.getDrawings();
    const filtered = type === 'all' ? drawings : drawings.filter(d => d.type === type);
    
    // Re-render with filtered drawings
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    
    filtered.forEach((drawing, index) => {
        const item = createGalleryItem(drawing);
        setTimeout(() => {
            item.style.animation = 'zoomIn 0.5s ease';
        }, index * 50);
        galleryGrid.appendChild(item);
    });
}

// Search gallery (future feature)
function searchGallery(query) {
    const drawings = DrawingStorage.getDrawings();
    const results = drawings.filter(d => 
        d.title.toLowerCase().includes(query.toLowerCase())
    );
    
    // Re-render with search results
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    
    if (results.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No drawings found</p>';
    } else {
        results.forEach((drawing, index) => {
            const item = createGalleryItem(drawing);
            setTimeout(() => {
                item.style.animation = 'zoomIn 0.5s ease';
            }, index * 50);
            galleryGrid.appendChild(item);
        });
    }
}
