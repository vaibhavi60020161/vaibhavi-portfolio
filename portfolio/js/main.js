document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // 2. Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#8b5cf6" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#06b6d4",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "out_mode": "out"
                }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    // 3. Dark/Light Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // Check localStorage
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.className = 'ri-sun-fill';
            themeIcon.style.color = '#f59e0b';
        } else {
            themeIcon.className = 'ri-moon-fill';
            themeIcon.style.color = '#e0e0e0';
        }
    }

    // 4. Preloader logic
    window.addEventListener("load", () => {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
            setTimeout(() => { preloader.style.display = "none"; }, 500);
        }
    });

    // 5. Typing Effect for Subtitle
    const typingTextElement = document.querySelector(".typing-text");
    const phrases = ["Tech Explorer", "Problem Solver", "Data Enthusiast"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typingTextElement) return;
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();

    // 6. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, input, textarea, .glass-panel, .force-pointer').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)";
                cursorFollower.style.backgroundColor = "rgba(139, 92, 246, 0.1)";
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
                cursorFollower.style.backgroundColor = "transparent";
            });
        });
    }

    // 7. Scroll Progress & Back to Top
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.clientHeight;
        const scrollTop = window.scrollY;

        if (scrollProgress) {
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }

        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // 8. Skill Bars Intersection Observer
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent;
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillProgressBars.forEach(bar => skillObserver.observe(bar));

    // 9. Interactive Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success-msg');

    if (contactForm && successMsg) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop actual submission to handle via Fetch API

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Show sending state
            submitBtn.innerHTML = 'Sending...';
            submitBtn.style.opacity = "0.7";
            submitBtn.style.pointerEvents = "none";

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Hide form, show custom success message
                    contactForm.style.opacity = '0';
                    setTimeout(() => {
                        contactForm.style.display = 'none';
                        successMsg.classList.remove('hidden');

                        // Reset form state completely
                        contactForm.reset();
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.style.opacity = "1";
                        submitBtn.style.pointerEvents = "auto";

                        // Reset after 4 seconds (back to form)
                        setTimeout(() => {
                            successMsg.classList.add('hidden');
                            setTimeout(() => {
                                contactForm.style.display = 'flex';
                                contactForm.style.opacity = '1';
                            }, 500);
                        }, 4000);
                    }, 500);
                } else {
                    alert("Oops! There was a problem submitting your form. Please try again.");
                    // Revert button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.opacity = "1";
                    submitBtn.style.pointerEvents = "auto";
                }
            } catch (error) {
                alert("Network error. Please check your connection and try again.");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.opacity = "1";
                submitBtn.style.pointerEvents = "auto";
            }
        });
    }

    // 10. Mobile Nav Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("nav-active");
            hamburger.classList.toggle("toggle");
        });
    }

    // Smooth scrolling links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                if (navLinks.classList.contains("nav-active")) {
                    navLinks.classList.remove("nav-active");
                    hamburger.classList.remove("toggle");
                }
            }
        });
    });
});

// 11. Modal Logic (Global functions)
window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }
}

window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto'; // allow scrolling again
    }
}

// Close modals when clicking outside the content
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
});

// Toggle between two certificates
window.toggleCert = function () {
    const cert1 = document.getElementById('cert-1');
    const cert2 = document.getElementById('cert-2');
    if (cert1 && cert2) {
        if (cert1.style.display === 'none') {
            cert1.style.display = 'block';
            cert2.style.display = 'none';
        } else {
            cert1.style.display = 'none';
            cert2.style.display = 'block';
        }
    }
};
