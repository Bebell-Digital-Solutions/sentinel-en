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

            // 4. Progress Logic
            const totalActionableSections = 8;
            let savedProgress = {};
            
            try {
                savedProgress = JSON.parse(localStorage.getItem('dashboardProgress')) || {};
            } catch (e) {
                console.error("Error loading progress", e);
                savedProgress = {};
            }

            function updateProgress() {
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

                // Lock Icon Logic
                const closedLockIcon = document.querySelector('.closed-lock-icon i');
                if (closedLockIcon) {
                    if (percentage >= 100) {
                        closedLockIcon.setAttribute('data-lucide', 'lock-keyhole-open');
                    } else {
                        closedLockIcon.setAttribute('data-lucide', 'lock');
                    }
                    if (typeof lucide !== 'undefined') lucide.createIcons();
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
                updateProgress();
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
            updateProgress();

            // 5. Navigation Logic (The Fix)
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

            // 6. Confetti Logic
            const closedLockBtn = document.querySelector('.closed-lock-icon');
            if(closedLockBtn) {
                closedLockBtn.addEventListener('click', () => {
                    if(typeof confetti === 'function') {
                        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#ff5011', '#ff7b4d', '#ffffff'] });
                        // Create Popup
                        let msg = document.getElementById('celebration-message');
                        if(!msg) {
                            msg = document.createElement('div');
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
                });
            }

            // 7. Video Player
            const videoThumb = document.getElementById('video-thumbnail');
            const videoElem = document.getElementById('overview-video');
            if(videoThumb && videoElem) {
                videoThumb.addEventListener('click', () => {
                    videoThumb.style.display = 'none';
                    videoElem.classList.remove('hidden');
                    videoElem.play();
                });
            }

            // 8. Carousel Logic
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

            // 9. Back to Top
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
