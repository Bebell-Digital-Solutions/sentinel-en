// --- Confetti Library Loader ---
(function loadConfettiLibrary() {
    if (typeof confetti === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
        script.onload = () => {
            console.log('Confetti library loaded');
        };
        document.head.appendChild(script);
    }
})();

// --- Page Loader Logic ---
function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-header">Loading...</div>
        <div class="progress"></div>
    `;
    document.body.appendChild(loader);
    return loader;
}

function initLoader() {
    const loader = showLoader();
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 300);
    }, 1500);
}

// --- Confetti Celebration Functions ---
function triggerConfetti() {
    // Check if confetti function is available
    if (typeof confetti === 'function') {
        // Multiple confetti bursts for celebration
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff5011', '#ff7b4d', '#ff9e7a', '#ffd1c2', '#ffffff']
        });
        
        // Add side bursts after a delay
        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 80,
                origin: { x: 0, y: 0.6 },
                colors: ['#ff5011', '#ff7b4d', '#ff9e7a']
            });
        }, 250);
        
        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 80,
                origin: { x: 1, y: 0.6 },
                colors: ['#ff5011', '#ff7b4d', '#ff9e7a']
            });
        }, 500);
        
        // Show celebration message
        showCelebrationMessage();
    } else {
        // Fallback if confetti library isn't loaded yet
        console.log('Confetti library not loaded yet, trying again...');
        setTimeout(triggerConfetti, 500);
    }
}

function showCelebrationMessage() {
    // Create celebration message if it doesn't exist
    let celebrationMsg = document.getElementById('celebration-message');
    
    if (!celebrationMsg) {
        celebrationMsg = document.createElement('div');
        celebrationMsg.id = 'celebration-message';
        celebrationMsg.innerHTML = `
            <div class="celebration-popup">
                <div class="celebration-content">
                    <i data-lucide="party-popper" class="w-12 h-12 text-primary mb-4"></i>
                    <h3 class="text-2xl font-bold text-text-main mb-2">🎉 Congratulations! 🎉</h3>
                    <p class="text-text-muted mb-4">You've completed all security sections! Your digital life is now significantly more secure.</p>
                    <button id="close-celebration" class="btn-primary">Awesome!</button>
                </div>
            </div>
        `;
        document.body.appendChild(celebrationMsg);
        
        // Initialize the icon
        lucide.createIcons();
        
        // Add close functionality
        document.getElementById('close-celebration').addEventListener('click', () => {
            celebrationMsg.remove();
        });
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (celebrationMsg && celebrationMsg.parentNode) {
                celebrationMsg.remove();
            }
        }, 8000);
    }
}

// --- Dashboard Logic ---
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.dashboard-section');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressContainer = document.querySelector('.progress-container');

const totalActionableSections = 8;
let completedSections = 0;
let wasPreviouslyComplete = false;

// Load progress from localStorage
const savedProgress = JSON.parse(localStorage.getItem('dashboardProgress')) || {};

function updateProgress() {
    completedSections = 0;
    sections.forEach(section => {
        const sectionId = section.id;
        if (sectionId === 'overview') return;

        const checkboxes = section.querySelectorAll(`ul[data-section-id="${sectionId}"] input[type="checkbox"]`);
        if (checkboxes.length > 0) {
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            if (allChecked) {
                completedSections++;
            }
        }
    });

    const percentage = (completedSections / totalActionableSections) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}% Complete (${completedSections}/${totalActionableSections} Sections)`;
    
    // Update lock icon based on progress
    updateLockIcon(percentage);
    
    // Check for completion celebration
    checkCompletionCelebration(percentage);
}

function updateLockIcon(percentage) {
    const closedLockIcon = progressContainer.querySelector('.closed-lock-icon i');
    if (!closedLockIcon) return;
    
    if (percentage >= 100) {
        // Change to open lock when complete
        closedLockIcon.setAttribute('data-lucide', 'lock-keyhole-open');
    } else {
        // Change back to closed lock if not complete
        closedLockIcon.setAttribute('data-lucide', 'lock');
    }
    lucide.createIcons();
}

function checkCompletionCelebration(percentage) {
    if (percentage >= 100) {
        // Mark as complete in localStorage
        localStorage.setItem('progressComplete', 'true');
        
        // Only trigger confetti if it wasn't already complete
        if (!wasPreviouslyComplete) {
            // Small delay for visual effect
            setTimeout(() => {
                triggerConfetti();
            }, 300);
            wasPreviouslyComplete = true;
        }
    } else {
        // If not complete, reset the completion flag
        localStorage.setItem('progressComplete', 'false');
        wasPreviouslyComplete = false;
    }
}

function saveProgress() {
    const currentProgress = {};
    sections.forEach(section => {
        const sectionId = section.id;
        const checkboxes = section.querySelectorAll(`ul[data-section-id="${sectionId}"] input[type="checkbox"]`);
        if (checkboxes.length > 0) {
            currentProgress[sectionId] = Array.from(checkboxes).map(checkbox => checkbox.checked);
        }
    });
    localStorage.setItem('dashboardProgress', JSON.stringify(currentProgress));
    updateProgress();
}

function loadProgress() {
    sections.forEach(section => {
        const sectionId = section.id;
        const checkboxes = section.querySelectorAll(`ul[data-section-id="${sectionId}"] input[type="checkbox"]`);
        if (checkboxes.length > 0 && savedProgress[sectionId]) {
            savedProgress[sectionId].forEach((isChecked, index) => {
                if (checkboxes[index]) {
                    checkboxes[index].checked = isChecked;
                }
            });
        }
    });
    
    // Load previous completion state
    wasPreviouslyComplete = localStorage.getItem('progressComplete') === 'true';
    
    updateProgress();
}

function showSection(id) {
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');

    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const targetNavItem = document.querySelector(`.nav-item[data-section="${id}"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }
    
    // Update Lucide icons for the new section
    setTimeout(() => lucide.createIcons(), 50);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            showSection(sectionId);
        });
    });

    // Checkboxes
    document.querySelectorAll('.dashboard-section input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', saveProgress);
    });

    // Closed lock icon click (triggers confetti at 100%)
    if (progressContainer) {
        const closedLock = progressContainer.querySelector('.closed-lock-icon');
        if (closedLock) {
            closedLock.addEventListener('click', function(e) {
                const totalCheckboxes = document.querySelectorAll('input[type="checkbox"]:not([disabled])').length;
                const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:not([disabled]):checked').length;
                
                if (checkedCheckboxes === totalCheckboxes && totalCheckboxes > 0) {
                    triggerConfetti();
                }
            });
        }
    }
}

// --- Video Player Logic ---
function setupVideoPlayer() {
    const videoContainer = document.getElementById('video-container');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoElement = document.getElementById('overview-video');
    
    if (!videoContainer || !videoThumbnail || !videoElement) return;
    
    // Play video when thumbnail is clicked
    videoThumbnail.addEventListener('click', function() {
        // Hide thumbnail
        videoThumbnail.style.display = 'none';
        
        // Show and play video
        videoElement.classList.remove('hidden');
        videoElement.play();
        
        // Optional: Add loading state
        videoElement.addEventListener('loadeddata', function() {
            videoElement.classList.add('opacity-100');
        });
    });
    
    // Show thumbnail again when video ends
    videoElement.addEventListener('ended', function() {
        videoElement.classList.add('hidden');
        videoThumbnail.style.display = 'flex';
    });
    
    // Optional: Pause video when it goes out of view
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && !videoElement.paused) {
                    videoElement.pause();
                }
            });
        },
        { threshold: 0.5 }
    );
    
    observer.observe(videoContainer);
}

// --- Back to Top Button Logic ---
function setupBackToTopButton() {
    const toTopButton = document.getElementById('back-to-top');
    const mainContent = document.querySelector('.main-content');

    if (!toTopButton || !mainContent) return;

    // Attach scroll listener to mainContent instead of window
    mainContent.addEventListener('scroll', function() {
        if (mainContent.scrollTop > 300) {
            toTopButton.classList.add('show');
        } else {
            toTopButton.classList.remove('show');
        }
    });

    toTopButton.onclick = function() {
        // Smoothly scroll the main content area to the top
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Setup all functionality
    loadProgress();
    showSection('overview');
    setupEventListeners();
    setupVideoPlayer();
    setupBackToTopButton();
});




// --- Carousel Logic ---
function setupCarousel() {
    const carouselContainers = document.querySelectorAll('.carousel-container');
    
    carouselContainers.forEach(container => {
        const track = container.querySelector('.carousel-track');
        const slides = track ? Array.from(track.children) : [];
        const nextButton = container.querySelector('.next-button');
        const prevButton = container.querySelector('.prev-button');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        
        const getSlideWidth = () => {
            return slides[0].getBoundingClientRect().width;
        };
        
        const moveToSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            const slideWidth = getSlideWidth();
            track.style.transform = `translateX(-${slideWidth * index}px)`;
            currentIndex = index;
        };
        
        // Initialize first slide position
        moveToSlide(0);
        
        // Event listeners for buttons
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                moveToSlide(currentIndex - 1);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                moveToSlide(currentIndex + 1);
            });
        }
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    moveToSlide(currentIndex + 1);
                } else {
                    // Swipe right - previous slide
                    moveToSlide(currentIndex - 1);
                }
            }
        });
        
        // Keyboard navigation
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveToSlide(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveToSlide(currentIndex + 1);
            }
        });
        
        // Make carousel focusable for keyboard navigation
        container.setAttribute('tabindex', '0');
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newSlideWidth = getSlideWidth();
                track.style.transition = 'none';
                track.style.transform = `translateX(-${newSlideWidth * currentIndex}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }, 100);
        });
    });
}

// Also update your DOMContentLoaded event listener to load Font Awesome for icons
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    lucide.createIcons();
    loadProgress();
    showSection('overview');
    setupEventListeners();
    setupVideoPlayer();
    setupBackToTopButton();
    setupCarousel();
    
    // Load Font Awesome for carousel icons if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }
});






