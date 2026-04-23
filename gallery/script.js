// Gallery Data - Using Picsum Photos API for demonstration
const galleryData = [
    // Nature
    { id: 1, title: 'Mountain Landscape', category: 'nature', image: 'https://picsum.photos/400/300?random=1', caption: 'Beautiful mountain scenery with snow-capped peaks' },
    { id: 2, title: 'Forest Path', category: 'nature', image: 'https://picsum.photos/400/300?random=2', caption: 'A serene walking path through the green forest' },
    { id: 3, title: 'Ocean Wave', category: 'nature', image: 'https://picsum.photos/400/300?random=3', caption: 'Powerful waves crashing on the sandy beach' },
    { id: 4, title: 'Sunset Meadow', category: 'nature', image: 'https://picsum.photos/400/300?random=4', caption: 'Golden hour at the meadow with wildflowers' },

    // Urban
    { id: 5, title: 'City Skyline', category: 'urban', image: 'https://picsum.photos/400/300?random=5', caption: 'Modern city skyline at night with bright lights' },
    { id: 6, title: 'Street Photography', category: 'urban', image: 'https://picsum.photos/400/300?random=6', caption: 'Candid street photography capturing urban life' },
    { id: 7, title: 'Architecture', category: 'urban', image: 'https://picsum.photos/400/300?random=7', caption: 'Contemporary architectural design and patterns' },
    { id: 8, title: 'Urban Bridge', category: 'urban', image: 'https://picsum.photos/400/300?random=8', caption: 'Modern bridge connecting two city districts' },

    // Abstract
    { id: 9, title: 'Color Gradient', category: 'abstract', image: 'https://picsum.photos/400/300?random=9', caption: 'Beautiful color gradient composition' },
    { id: 10, title: 'Geometric Shapes', category: 'abstract', image: 'https://picsum.photos/400/300?random=10', caption: 'Abstract geometric pattern and shapes' },
    { id: 11, title: 'Artistic Paint', category: 'abstract', image: 'https://picsum.photos/400/300?random=11', caption: 'Artistic painting with vibrant colors' },
    { id: 12, title: 'Light Art', category: 'abstract', image: 'https://picsum.photos/400/300?random=12', caption: 'Light and shadow creating artistic effect' }
];

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCaption = document.getElementById('lightboxCaption');
const loadingSpinner = document.getElementById('loadingSpinner');
const currentImageSpan = document.getElementById('currentImage');
const totalImagesSpan = document.getElementById('totalImages');

// State
let currentFilter = 'all';
let currentLightboxIndex = 0;
let filteredGallery = [];

// Initialize
renderGallery();
setupEventListeners();

// Setup event listeners
function setupEventListeners() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.category;
            renderGallery();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') previousImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') closeLightbox();
    });
}

// Render gallery
function renderGallery() {
    // Filter images
    filteredGallery = currentFilter === 'all' 
        ? galleryData 
        : galleryData.filter(item => item.category === currentFilter);

    totalImagesSpan.textContent = filteredGallery.length;

    // Clear grid
    galleryGrid.innerHTML = '';

    // Add images with animation
    filteredGallery.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.animation = `fadeIn ${0.3 + index * 0.05}s ease`;

        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        `;

        galleryItem.addEventListener('click', () => openLightbox(index));

        galleryGrid.appendChild(galleryItem);
    });

    // Show loading spinner briefly
    showLoadingSpinner();
}

// Open lightbox
function openLightbox(index) {
    currentLightboxIndex = index;
    const item = filteredGallery[index];

    lightboxImage.src = item.image;
    lightboxTitle.textContent = item.title;
    lightboxCaption.textContent = item.caption;
    currentImageSpan.textContent = index + 1;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Previous image
function previousImage() {
    currentLightboxIndex = currentLightboxIndex === 0 
        ? filteredGallery.length - 1 
        : currentLightboxIndex - 1;
    openLightbox(currentLightboxIndex);
}

// Next image
function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredGallery.length;
    openLightbox(currentLightboxIndex);
}

// Show loading spinner
function showLoadingSpinner() {
    loadingSpinner.classList.add('active');
    setTimeout(() => {
        loadingSpinner.classList.remove('active');
    }, 300);
}

// Close lightbox when clicking outside image
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        closeLightbox();
    }
});

// Prevent drag on images in lightbox
lightboxImage.addEventListener('dragstart', (e) => {
    e.preventDefault();
});
