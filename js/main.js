// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Flip);

// Initialize native Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});
window.lenis = lenis;

// Stop lenis initially during preloader & brandfilm
lenis.stop();

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Global Variables
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Magnetic Cursor Logic
if (!isReducedMotion) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorBlob = document.querySelector('.cursor-blob');
    
    let mouse = { x: 0, y: 0 };
    
    const xDot = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
    const yDot = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
    
    const xBlob = gsap.quickTo(cursorBlob, "x", {duration: 0.6, ease: "power3"});
    const yBlob = gsap.quickTo(cursorBlob, "y", {duration: 0.6, ease: "power3"});

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        let targetX = mouse.x;
        let targetY = mouse.y;
        
        let nearestDot = null;
        let minDist = 50; // 50px snap range
        
        const activeRail = document.querySelector('.scroll-rail.visible');
        if (activeRail) {
            const dots = activeRail.querySelectorAll('.scroll-rail-dots li');
            dots.forEach(dot => {
                const rect = dot.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
                if (dist < minDist) {
                    minDist = dist;
                    nearestDot = dot;
                }
            });
        }
        
        if (nearestDot) {
            const rect = nearestDot.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            // Magnetically pull the cursor towards the dot center (75% snap weight)
            targetX = cx + (mouse.x - cx) * 0.25;
            targetY = cy + (mouse.y - cy) * 0.25;
            
            const isDotActive = nearestDot.classList.contains('active');
            
            // Flexibly translate the dot slightly towards the mouse (retaining active scale)
            gsap.to(nearestDot, {
                x: (mouse.x - cx) * 0.35,
                y: (mouse.y - cy) * 0.35,
                scale: isDotActive ? 2.2 : 1,
                duration: 0.2,
                ease: "power2.out",
                overwrite: "auto"
            });
        } else {
            // Reset translations on non-hovered dots (retaining active scale)
            const dots = document.querySelectorAll('.scroll-rail-dots li');
            dots.forEach(dot => {
                if (dot.style.transform && dot.style.transform !== 'none') {
                    const isDotActive = dot.classList.contains('active');
                    gsap.to(dot, { 
                        x: 0, 
                        y: 0, 
                        scale: isDotActive ? 2.2 : 1, 
                        duration: 0.4, 
                        ease: "power2.out", 
                        overwrite: "auto" 
                    });
                }
            });
        }
        
        xDot(targetX);
        yDot(targetY);
        xBlob(targetX);
        yBlob(targetY);
    });

    const setupMagnetics = () => {
        const magnetics = document.querySelectorAll('.magnetic, .scroll-rail-dots li, a, button');
        
        magnetics.forEach((elem) => {
            // Prevent duplicate binding and destroying event listeners
            if (elem.dataset.cursorBound === "true") return;
            elem.dataset.cursorBound = "true";
            
            elem.addEventListener('mouseenter', () => {
                cursorBlob.classList.add('hover-active');
                
                if(elem.classList.contains('magnetic')) {
                    gsap.to(elem, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "back.out(1.7)"
                    });
                }
            });
            
            elem.addEventListener('mousemove', (e) => {
                if(elem.classList.contains('magnetic')) {
                    const rect = elem.getBoundingClientRect();
                    const x = e.clientX - (rect.left + rect.width / 2);
                    const y = e.clientY - (rect.top + rect.height / 2);
                    
                    gsap.to(elem, {
                        x: x * 0.2,
                        y: y * 0.2,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            elem.addEventListener('mouseleave', () => {
                cursorBlob.classList.remove('hover-active');
                
                if(elem.classList.contains('magnetic')) {
                    gsap.to(elem, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: "elastic.out(1, 0.3)"
                    });
                }
            });
        });
    };
    
    setupMagnetics();
    // Expose so we can re-bind after FLIP reparenting
    window.setupMagnetics = setupMagnetics;
}

// Scroll Progress Rail Logic
const railDots = document.querySelectorAll('.scroll-rail-dots li');

const updateActiveIndicator = () => {
    const centerY = window.innerHeight / 2;
    let activeDot = null;

    railDots.forEach((dot) => {
        const targetId = dot.getAttribute('data-target');
        if (targetId === 'preloader') return;

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const rect = targetSection.getBoundingClientRect();
            // Section is active if it covers the vertical center of the screen
            if (rect.top <= centerY && rect.bottom >= centerY) {
                activeDot = dot;
            }
        }
    });

    const railContainer = document.querySelector('.scroll-rail');
    if (activeDot && railContainer) {
        railDots.forEach(d => {
            d.classList.remove('active');
            gsap.to(d, { scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        });
        activeDot.classList.add('active');
        gsap.to(activeDot, { scale: 2.2, duration: 0.4, ease: "power2.out", overwrite: "auto" });

        // Check if the current section is a dark greenish area
        const targetId = activeDot.getAttribute('data-target');
        const isDarkSection = ['sustainability', 'contact'].includes(targetId);
        
        if (isDarkSection) {
            railContainer.classList.add('contrast-theme');
        } else {
            railContainer.classList.remove('contrast-theme');
        }
    }
};

// Track changes on smooth scrolling
lenis.on('scroll', updateActiveIndicator);
// Initial check on load
updateActiveIndicator();

railDots.forEach((dot) => {
    dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        const scrollEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

        if (targetId === 'hero') {
            lenis.scrollTo(0, { duration: 1.5, easing: scrollEasing });
            return;
        }

        // Process is position:sticky — DOM offset APIs are unreliable.
        // Hero = 100vh height + 150vh margin-bottom = 250vh total scroll space.
        // So Process always starts at exactly 2.5× the viewport height.
        if (targetId === 'process') {
            lenis.scrollTo(window.innerHeight * 2.5, { duration: 1.5, easing: scrollEasing });
            return;
        }

        // All other sections: pass the DOM element directly to Lenis.
        // This works reliably for non-sticky sections.
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            lenis.scrollTo(targetSection, { duration: 1.5, easing: scrollEasing });
        }
    });
});

// Refresh ScrollTrigger after all assets (images/fonts) load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
