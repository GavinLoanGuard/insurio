// Mobile Menu Toggle - DIAGNOSTIC VERSION with console logging
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DIAGNOSTIC: Script loaded');
    
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    console.log('🔍 DIAGNOSTIC: menuToggle found:', menuToggle);
    console.log('🔍 DIAGNOSTIC: mobileNav found:', mobileNav);

    if (menuToggle && mobileNav) {
        console.log('✅ DIAGNOSTIC: Both elements found, attaching events');
        
        // Function to toggle menu
        function toggleMenu(e) {
            console.log('🔍 DIAGNOSTIC: toggleMenu called', e.type);
            e.preventDefault();
            e.stopPropagation();
            
            const wasActive = menuToggle.classList.contains('active');
            console.log('🔍 DIAGNOSTIC: Menu was active:', wasActive);
            
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            const isNowActive = menuToggle.classList.contains('active');
            console.log('🔍 DIAGNOSTIC: Menu is now active:', isNowActive);
        }
        
        // Add both click and touch events
        menuToggle.addEventListener('click', function(e) {
            console.log('🔍 DIAGNOSTIC: Click event fired');
            toggleMenu(e);
        });
        
        menuToggle.addEventListener('touchstart', function(e) {
            console.log('🔍 DIAGNOSTIC: Touchstart event fired');
        });
        
        menuToggle.addEventListener('touchend', function(e) {
            console.log('🔍 DIAGNOSTIC: Touchend event fired');
            e.preventDefault();
            toggleMenu(e);
        });

        // Close menu when clicking a link
        mobileNav.querySelectorAll('a').forEach(link => {
            const closeMenu = () => {
                console.log('🔍 DIAGNOSTIC: Closing menu from link click');
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('menu-open');
            };
            
            link.addEventListener('click', closeMenu);
            link.addEventListener('touchend', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                if (mobileNav.classList.contains('active')) {
                    console.log('🔍 DIAGNOSTIC: Closing menu from outside click');
                    menuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            }
        });
        
        // Also handle touch events for closing
        document.addEventListener('touchend', function(e) {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                if (mobileNav.classList.contains('active')) {
                    console.log('🔍 DIAGNOSTIC: Closing menu from outside touch');
                    menuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            }
        });
        
        console.log('✅ DIAGNOSTIC: All event listeners attached');
    } else {
        console.error('❌ DIAGNOSTIC: Elements not found!');
        if (!menuToggle) console.error('❌ menuToggle is missing');
        if (!mobileNav) console.error('❌ mobileNav is missing');
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

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    form.innerHTML = `
                        <div class="form-success">
                            <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <h3>Thank you!</h3>
                            <p>We've received your message and will be in touch within 24 hours.</p>
                        </div>
                    `;
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Show error message
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Add error message if not already present
                let errorMsg = form.querySelector('.form-error');
                if (!errorMsg) {
                    errorMsg = document.createElement('p');
                    errorMsg.className = 'form-error';
                    errorMsg.textContent = 'Something went wrong. Please try again or email us directly.';
                    submitBtn.parentNode.insertBefore(errorMsg, submitBtn.nextSibling);
                }
            }
        });
    });
    
    // Force email visibility (prevent obfuscation)
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        // If link has data-email attribute, use that as text
        if (link.dataset.email) {
            link.textContent = link.dataset.email;
        }
        
        // If link text is empty or obfuscated, extract email from href
        if (!link.textContent || link.textContent.includes('[email') || link.textContent.includes('protected')) {
            const email = link.href.replace('mailto:', '');
            if (email && email.includes('@')) {
                link.textContent = email;
            }
        }
        
        // Ensure link is clickable
        link.style.pointerEvents = 'auto';
    });
    
    console.log('✅ DIAGNOSTIC: Script finished loading');
});
