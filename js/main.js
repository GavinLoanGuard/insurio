// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Insurio site loaded'); // Debug log
    
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // Animated Counter
    const statsSection = document.getElementById('stats-section');
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let animated = false;

    function animateCounters() {
        if (animated) return;
        animated = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const suffix = stat.dataset.suffix || '';
            const duration = 1500;
            const step = target / (duration / 16);
            let current = 0;

            stat.classList.add('counting');

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                    stat.classList.remove('counting');
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 16);
        });
    }

    // Intersection Observer for stats animation
    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // Sticky CTA - hide when near footer or at top
    const stickyCta = document.querySelector('.sticky-cta');
    const footer = document.querySelector('footer');
    
    if (stickyCta && footer) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const footerTop = footer.getBoundingClientRect().top + window.pageYOffset;
            const windowBottom = currentScroll + window.innerHeight;
            
            // Hide if at top of page (within first 300px)
            if (currentScroll < 300) {
                stickyCta.style.transform = 'translateY(100%)';
                stickyCta.style.opacity = '0';
            }
            // Hide when footer is visible
            else if (windowBottom > footerTop - 100) {
                stickyCta.style.transform = 'translateY(100%)';
                stickyCta.style.opacity = '0';
            }
            // Show otherwise
            else {
                stickyCta.style.transform = 'translateY(0)';
                stickyCta.style.opacity = '1';
            }
            
            lastScroll = currentScroll;
        });
        
        // Initial state - hidden
        stickyCta.style.transform = 'translateY(100%)';
        stickyCta.style.opacity = '0';
        stickyCta.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }

    // FORM SUBMISSION HANDLING - SIMPLE AND BULLETPROOF
    console.log('Setting up form handlers'); // Debug log
    
    // Find all forms that submit to Google Apps Script
    const allForms = document.querySelectorAll('form[action*="script.google.com"]');
    console.log('Found forms:', allForms.length); // Debug log
    
    allForms.forEach(function(form) {
        console.log('Adding listener to form:', form.id); // Debug log
        
        form.addEventListener('submit', function(event) {
            console.log('Form submitted!'); // Debug log
            
            // Find the submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (submitBtn) {
                // Disable and show "Sending..."
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                console.log('Button changed to Sending...'); // Debug log
                
                // After 2 seconds, show success message
                setTimeout(function() {
                    console.log('Showing success message'); // Debug log
                    
                    // Find the form card
                    const formCard = form.closest('.form-card');
                    
                    if (formCard) {
                        formCard.innerHTML = '<div class="form-success" style="text-align:center;padding:60px 20px;"><svg width="64" height="64" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" style="margin:0 auto 24px;display:block;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><h3 style="font-size:28px;margin-bottom:16px;color:#0f1c2e;font-family:\'Outfit\',sans-serif;font-weight:700;">Thank you!</h3><p style="color:#475569;font-size:18px;line-height:1.6;max-width:400px;margin:0 auto;">We\'ve received your submission and will be in touch within 24 hours.</p></div>';
                    }
                }, 2000);
            }
        });
    });
});
