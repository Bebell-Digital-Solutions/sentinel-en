

document.addEventListener('DOMContentLoaded', function() {
    const pageLoader = document.getElementById('pageLoader');
    const carouselTrack = document.getElementById('carouselTrack');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const printGuideBtn = document.getElementById('printGuideBtn');
    
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
    
    // Print Guide Button
    printGuideBtn.addEventListener('click', function() {
        window.print();
    });
    
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
    
    // Add step counter for printing
    const stepContainers = document.querySelectorAll('.step-container');
    stepContainers.forEach((container, index) => {
        const stepNumber = container.querySelector('.step-number');
        if (stepNumber) {
            stepNumber.textContent = index + 1;
        }
    });








    const now = new Date();
    const month = now.getMonth() + 1;
    
    if (month === 12 || month === 1 || month === 2) {
        const snow = document.createElement('div');
        snow.className = 'snowflakes-blurry';
        document.body.appendChild(snow);
    }




        


<!-- Widget BACK-TO-TOP -->

// Create Back-to-Top Button Dynamically
document.addEventListener("DOMContentLoaded", function () {
    // Create the button container
    const backToTop = document.createElement("div");
    backToTop.id = "back-to-top";
    backToTop.style.position = "fixed";
    backToTop.style.bottom = "20px";
    backToTop.style.right = "20px";
    backToTop.style.display = "none";
    backToTop.style.cursor = "pointer";
    backToTop.style.zIndex = "9999";

    // Create the image inside the button
    const backToTopImg = document.createElement("img");
    backToTopImg.src = "https://bucket.mlcdn.com/a/3336/3336910/images/972c5065cffe83955d5322557dcdce28eca170e5.png";
    backToTopImg.alt = "Volver arriba";
    backToTopImg.style.width = "40px";
    backToTopImg.style.height = "40px";

    // Append image to the button
    backToTop.appendChild(backToTopImg);

    // Append button to the body
    document.body.appendChild(backToTop);

    // Scroll Event Listener
    window.addEventListener("scroll", function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    // Click Event for Scrolling to Top
    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

<!-- End Widget BACK-TO-TOP -->












    
    
