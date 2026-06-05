/**
 * Visual Interactions & Scroll-Bound Physics Engine
 * Target: Amir Pandit Portfolio
 * Developer: Antigravity
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Intersection Observer for Scroll Reveals
    // ==========================================================================
    const fadeElements = document.querySelectorAll('.fade-in, .footer-massive-text');
    
    const revealOptions = {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once shown to lock state and save CPU cycles
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(revealCallback, revealOptions);
    fadeElements.forEach(element => observer.observe(element));

    // ==========================================================================
    // 2. Header Scroll state (Shrink)
    // ==========================================================================
    const header = document.querySelector('.site-header');
    
    const toggleHeaderState = () => {
        if (window.scrollY > 40) {
            header.classList.add('header-shrink');
        } else {
            header.classList.remove('header-shrink');
        }
    };
    
    window.addEventListener('scroll', toggleHeaderState, { passive: true });
    toggleHeaderState();

    // ==========================================================================
    // 3. Stagger Animations Delay Initialization
    // ==========================================================================
    const staggerContainers = document.querySelectorAll('.hero-details, .experience-list, .projects-grid, .education-timeline, .contact-socials');
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            if (!child.style.transitionDelay) {
                child.style.transitionDelay = `${index * 0.12}s`;
            }
        });
    });

    // ==========================================================================
    // 4. Hero Section Mouse-Move Parallax Canvas
    // ==========================================================================
    const hero = document.getElementById('hero');
    const threadsSvg = document.querySelector('.threads-svg');
    const parallaxGlow = document.querySelector('.parallax-glow');
    
    if (hero && threadsSvg && parallaxGlow) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        const easing = 0.09; // Easing parameter for smooth motion
        
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            // Calculate cursor offset relative to Hero center
            mouseX = e.clientX - rect.left - rect.width / 2;
            mouseY = e.clientY - rect.top - rect.height / 2;
        });

        const heroContainer = document.querySelector('.hero-container');

        // Continuous waving paths math loop (Tangled crossing paths)
        const animateThreads = () => {
            const time = Date.now() * 0.0014; // Animation time factor
            const paths = [
                { 
                    el: document.querySelector('.path-1'), 
                    baseY: (x) => 170 + (x + 100) * 0.13, 
                    amp: 40, freq: 0.0022, speed: 1.0, phase: 0.0 
                },
                { 
                    el: document.querySelector('.path-2'), 
                    baseY: (x) => 360 - (x + 100) * 0.15, 
                    amp: 36, freq: 0.0028, speed: 0.8, phase: 2.1 
                },
                { 
                    el: document.querySelector('.path-3'), 
                    baseY: (x) => 230 + Math.sin((x + 100) * 0.0035) * 80, 
                    amp: 28, freq: 0.0016, speed: 1.3, phase: 4.6 
                }
            ];
            
            paths.forEach((p) => {
                if (!p.el) return;
                const startY = p.baseY(-100) + Math.sin(-100 * p.freq + time * p.speed + p.phase) * p.amp;
                let d = `M -100 ${startY}`;
                const segments = 10;
                const width = 1800;
                const segmentWidth = width / segments;
                
                for (let i = 1; i <= segments; i++) {
                    const x = -100 + i * segmentWidth;
                    // Current coordinate calculation based on sloping baseline
                    const y = p.baseY(x) + Math.sin(x * p.freq + time * p.speed + p.phase) * p.amp;
                    
                    // Previous coordinate calculation based on sloping baseline
                    const prevX = x - segmentWidth;
                    const prevY = p.baseY(prevX) + Math.sin(prevX * p.freq + time * p.speed + p.phase) * p.amp;
                    
                    // Bezier control coordinates
                    const cx = prevX + segmentWidth / 2;
                    const cy = prevY + (y - prevY) / 2;
                    
                    d += ` Q ${cx} ${cy} ${x} ${y}`;
                }
                p.el.setAttribute('d', d);
            });
        };

        // Loop to interpolate displacement smoothly
        const renderParallax = () => {
            currentX += (mouseX - currentX) * easing;
            currentY += (mouseY - currentY) * easing;
            
            const scrollY = window.scrollY;
            
            // Generate continuous organic ripple movement
            animateThreads();
            
            // Apply distinct displacement scales to construct visual parallax depth
            const svgX = currentX * -0.03;
            // Combine cursor offsets and scroll translation to drift threads down as user scrolls
            const svgY = (currentY * -0.03) + (scrollY * 0.15);
            const glowX = currentX * -0.06;
            const glowY = (currentY * -0.06) + (scrollY * 0.12);
            
            threadsSvg.style.transform = `translate3d(${svgX}px, ${svgY}px, 0)`;
            parallaxGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
            
            // Premium scroll fade-out on the hero content elements
            if (heroContainer) {
                if (scrollY < 650) {
                    const opacity = Math.max(0, 1 - scrollY / 500);
                    const translateY = scrollY * 0.15;
                    heroContainer.style.opacity = opacity;
                    heroContainer.style.transform = `translate3d(0, ${translateY}px, 0)`;
                } else {
                    heroContainer.style.opacity = 0;
                }
            }
            
            requestAnimationFrame(renderParallax);
        };
        
        requestAnimationFrame(renderParallax);
    }

    // ==========================================================================
    // 5. Scroll-driven "Antigravity" Monolithic Letters Drift
    // ==========================================================================
    const driftLetters = document.querySelectorAll('.drift-letter');
    const footer = document.querySelector('.site-footer');
    
    if (driftLetters.length > 0 && footer) {
        let ticking = false;
        
        const handleScrollFooter = () => {
            const footerRect = footer.getBoundingClientRect();
            const winHeight = window.innerHeight;
            
            // Detect if footer enters viewport
            if (footerRect.top < winHeight) {
                // Calculate scroll progress percentage (0 = just entering, 1 = fully scrolled past/visible at bottom)
                const scrollRange = winHeight + footerRect.height;
                const enteredDistance = winHeight - footerRect.top;
                const progress = Math.max(0, Math.min(1, enteredDistance / scrollRange));
                
                driftLetters.forEach((letter, index) => {
                    // Staggered max vertical offsets: 'D' floats less, 'I' moderate, 'T' drifts highest
                    const maxDriftY = -55 - (index * 25);
                    const driftY = progress * maxDriftY;
                    
                    // Staggered horizontal sway drift offsets
                    const maxDriftX = 8 - (index * 6);
                    const driftX = progress * maxDriftX;
                    
                    // Hardware accelerated translation
                    letter.style.transform = `translate3d(${driftX}px, ${driftY}px, 0)`;
                });
            } else {
                // Return to baseline when footer is offscreen
                driftLetters.forEach(letter => {
                    letter.style.transform = 'translate3d(0px, 0px, 0px)';
                });
            }
            
            ticking = false;
        };
        
        const progressBar = document.getElementById('progress-bar');
        
        const updateProgressBar = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / (scrollHeight || 1)) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;
        };
        
        // Listen on window scroll with requestAnimationFrame ticking to save thread overhead
        window.addEventListener('scroll', () => {
            updateProgressBar();
            if (!ticking) {
                requestAnimationFrame(handleScrollFooter);
                ticking = true;
            }
        }, { passive: true });
        
        // Initial invocation
        handleScrollFooter();
        updateProgressBar();
    }
});
