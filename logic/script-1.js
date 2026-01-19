
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
            setTimeout(() => loader.remove(), 300); // Remove after fade out
        }, 1500); // Adjust duration as needed
    }

    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
        // Initialize Lucide Icons
        lucide.createIcons();
    });

    // --- Dashboard Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const totalActionableSections = 8; // All sections except Overview
    let completedSections = 0;

    // Load progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('dashboardProgress')) || {};

    function updateProgress() {
        completedSections = 0;
        sections.forEach(section => {
            const sectionId = section.id;
            if (sectionId === 'overview') return; // Overview does not count towards progress

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
        document.querySelector(`.nav-item[data-section="${id}"]`).classList.add('active');
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            showSection(sectionId);
        });
    });

    // Add event listeners for all checkboxes to update and save progress
    document.querySelectorAll('.dashboard-section input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', saveProgress);
    });

    // Initial load
    document.addEventListener('DOMContentLoaded', () => {
        loadProgress();
        showSection('overview'); // Show overview by default
    });

    // --- Back to Top Button Logic ---
    const toTopButton = document.getElementById('back-to-top');
    const mainContent = document.querySelector('.main-content');

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








document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.getElementById('video-container');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoElement = document.getElementById('overview-video');
    
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
    
    // Optional: Show thumbnail again when video ends
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
});




