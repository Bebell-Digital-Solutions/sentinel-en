

document.addEventListener('DOMContentLoaded', function() {
    const pageLoader = document.getElementById('pageLoader');
    const carouselTrack = document.getElementById('carouselTrack');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    let currentSlide = 0;
    const totalSlides = carouselSlides.length;
    
    // Hide loader after 1.5 seconds
    setTimeout(() => {
        pageLoader.classList.add('hidden');
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 300);
    }, 1500);
    
    // Initialize Carousel
    function initCarousel() {
        // Clear existing content
        carouselTrack.innerHTML = '';
        
        // Create slides
        carouselSlides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'carousel-slide';
            slideElement.dataset.index = index;
            
            slideElement.innerHTML = `
                <img src="${slide.image}" alt="${slide.title}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"300\" viewBox=\"0 0 400 300\"></svg>
            `;
            
            carouselTrack.appendChild(slideElement);
        });
        
        updateCarousel();
    }
    
    // Update carousel position
    function updateCarousel() {
        const trackWidth = carouselTrack.offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentSlide * trackWidth}px)`;
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // Loop back to first slide
        }
        updateCarousel();
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1; // Loop to last slide
        }
        updateCarousel();
    }
    
    // Event listeners for carousel
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Auto-advance carousel
    let autoSlideInterval;
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto-slide on load
    startAutoSlide();
    
    // Pause auto-slide on hover
    carouselTrack.addEventListener('mouseenter', stopAutoSlide);
    carouselTrack.addEventListener('mouseleave', startAutoSlide);
    
    // Initialize carousel
    initCarousel();
    

    
    // Image error handling for step images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            if (!this.src.includes('data:image/svg+xml')) {
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231a1a1a"/><text x="200" y="150" font-family="Arial" font-size="16" fill="%23808080" text-anchor="middle">Image not available</text></svg>';
            }
        });
    });
    
    // Resize handler for carousel
    window.addEventListener('resize', updateCarousel);
    


    });








    









    
    
