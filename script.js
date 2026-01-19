      // --- Confetti Library Loader ---
        (function loadConfettiLibrary() {
            if (typeof confetti === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
                document.head.appendChild(script);
            }
        })();

        // --- Core Application ---
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Initialize Icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // 2. Initialize Loader
            const loader = document.createElement('div');
            loader.className = 'page-loader';
            loader.innerHTML = `<div class="loader-header">Loading...</div><div class="progress"></div>`;
            document.body.appendChild(loader);
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 300);
            }, 1000);

            // 3. Define Global Elements
            const navItems = document.querySelectorAll('.nav-item');
            const sections = document.querySelectorAll('.dashboard-section');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            const progressContainer = document.querySelector('.progress-wrapper');

            // 4. Celebration Logic
            function triggerCelebration() {
                if(typeof confetti === 'function') {
                    // Confetti Effect
                    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#ff5011', '#ff7b4d', '#ffffff'] });
                    
                    // Check if popup already exists
                    if(document.getElementById('celebration-message')) return;

                    // Create Popup
                    const msg = document.createElement('div');
                    msg.id = 'celebration-message';
                    msg.innerHTML = `
                        <div class="celebration-popup">
                            <h3 class="text-2xl font-bold text-text-main mb-2">🎉 Congratulations! 🎉</h3>
                            <p class="text-text-muted mb-4">You have secured your digital life!</p>
                            <button id="close-celebration" class="btn-primary">Awesome!</button>
                        </div>`;
                    document.body.appendChild(msg);
                    document.getElementById('close-celebration').addEventListener('click', () => msg.remove());
                }
            }

            // 5. Progress Logic
            const totalActionableSections = 8;
            let savedProgress = {};
            
            try {
                savedProgress = JSON.parse(localStorage.getItem('dashboardProgress')) || {};
            } catch (e) {
                console.error("Error loading progress", e);
                savedProgress = {};
            }

            function updateProgress(checkCelebration = false) {
                let completedSections = 0;
                sections.forEach(section => {
                    const sectionId = section.id;
                    if (sectionId === 'overview' || sectionId.startsWith('demo')) return;

                    const checkboxes = section.querySelectorAll(`ul[data-section-id="${sectionId}"] input[type="checkbox"]`);
                    if (checkboxes.length > 0) {
                        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                        if (allChecked) completedSections++;
                    }
                });

                const percentage = (completedSections / totalActionableSections) * 100;
                if(progressBar) progressBar.style.width = `${percentage}%`;
                if(progressText) progressText.textContent = `${Math.round(percentage)}% Complete`;

                // Lock Icon Logic - Recreate icon to avoid Lucide issues
                const lockWrapper = document.querySelector('.closed-lock-icon');
                if (lockWrapper) {
                    lockWrapper.innerHTML = ''; // Clear existing
                    const newIcon = document.createElement('i');
                    newIcon.className = 'w-5 h-5 text-primary lock-icon';

                    if (percentage >= 100) {
                        newIcon.setAttribute('data-lucide', 'lock-keyhole-open');
                        lockWrapper.style.cursor = 'pointer';
                        lockWrapper.title = "Click for celebration!";
                    } else {
                        newIcon.setAttribute('data-lucide', 'lock');
                        lockWrapper.style.cursor = 'default';
                        lockWrapper.title = "Complete all sections to unlock";
                    }
                    lockWrapper.appendChild(newIcon);
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }

                // Automatic Celebration Trigger
                if (checkCelebration && percentage >= 100) {
                    triggerCelebration();
                }
            }

            function saveProgress() {
                const currentProgress = {};
                sections.forEach(section => {
                    const sectionId = section.id;
                    const checkboxes = section.querySelectorAll(`ul[data-section-id="${sectionId}"] input[type="checkbox"]`);
                    if (checkboxes.length > 0) {
                        currentProgress[sectionId] = Array.from(checkboxes).map(cb => cb.checked);
                    }
                });
                localStorage.setItem('dashboardProgress', JSON.stringify(currentProgress));
                // Pass true to indicate this update is from user interaction
                updateProgress(true);
            }

            // Load Checkbox State
            sections.forEach(section => {
                const sectionId = section.id;
                const checkboxes = section.querySelectorAll(`ul[data-section-id="${sectionId}"] input[type="checkbox"]`);
                if (checkboxes.length > 0 && savedProgress[sectionId]) {
                    savedProgress[sectionId].forEach((isChecked, index) => {
                        if (checkboxes[index]) checkboxes[index].checked = isChecked;
                    });
                }
            });
            // Initial update without celebration (false default)
            updateProgress();

            // 6. Navigation Logic
            function showSection(id) {
                // Hide all sections
                sections.forEach(section => section.classList.add('hidden'));
                
                // Show target section
                const targetSection = document.getElementById(id);
                if (targetSection) {
                    targetSection.classList.remove('hidden');
                }

                // Update Active Nav State
                navItems.forEach(item => item.classList.remove('active'));
                const activeNav = document.querySelector(`.nav-item[data-section="${id}"]`);
                if (activeNav) activeNav.classList.add('active');

                // Re-render icons just in case
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const sectionId = item.dataset.section;
                    showSection(sectionId);
                });
            });

            // Checkbox Listeners
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.addEventListener('change', saveProgress);
            });

            // 7. Manual Celebration Trigger (via Lock Icon)
            const closedLockBtn = document.querySelector('.closed-lock-icon');
            if(closedLockBtn) {
                closedLockBtn.addEventListener('click', () => {
                    // Recalculate percentage to ensure we only trigger at 100%
                    let completed = 0;
                    sections.forEach(section => {
                        const sId = section.id;
                        if (sId === 'overview' || sId.startsWith('demo')) return;
                        const cbs = section.querySelectorAll(`ul[data-section-id="${sId}"] input[type="checkbox"]`);
                        if (cbs.length > 0 && Array.from(cbs).every(cb => cb.checked)) {
                            completed++;
                        }
                    });
                    
                    const pct = (completed / totalActionableSections) * 100;
                    
                    // Only trigger if progress is 100%
                    if(pct >= 100) {
                        triggerCelebration();
                    }
                });
            }

            // 8. Video Player
            const videoThumb = document.getElementById('video-thumbnail');
            const videoElem = document.getElementById('overview-video');
            if(videoThumb && videoElem) {
                videoThumb.addEventListener('click', () => {
                    videoThumb.style.display = 'none';
                    videoElem.classList.remove('hidden');
                    videoElem.play();
                });
            }

            // 9. Carousel Logic
            const track = document.querySelector('.carousel-track');
            if(track) {
                const slides = Array.from(track.children);
                const nextBtn = document.querySelector('.next-button');
                const prevBtn = document.querySelector('.prev-button');
                let currentIndex = 0;

                function moveToSlide(index) {
                    if(index < 0) index = slides.length - 1;
                    if(index >= slides.length) index = 0;
                    const width = slides[0].getBoundingClientRect().width;
                    track.style.transform = `translateX(-${width * index}px)`;
                    currentIndex = index;
                }

                if(nextBtn) nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
                if(prevBtn) prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
                
                // Handle resize
                window.addEventListener('resize', () => moveToSlide(currentIndex));
            }

            // 10. Back to Top
            const toTopBtn = document.getElementById('back-to-top');
            const mainContent = document.querySelector('.main-content');
            if(toTopBtn && mainContent) {
                mainContent.addEventListener('scroll', () => {
                    if (mainContent.scrollTop > 300) toTopBtn.classList.add('show');
                    else toTopBtn.classList.remove('show');
                });
                toTopBtn.onclick = () => mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
