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
        
        xDot(mouse.x);
        yDot(mouse.y);
        xBlob(mouse.x);
        yBlob(mouse.y);
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

railDots.forEach((dot) => {
    const targetId = dot.getAttribute('data-target');
    
    // Skip the preloader/intro dot. It shares scroll position 0 with Hero,
    // so it is handled manually via initial HTML state.
    if (targetId === 'preloader') return;

    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        ScrollTrigger.create({
            trigger: targetSection,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                if(self.isActive) {
                    railDots.forEach(d => d.classList.remove('active'));
                    dot.classList.add('active');
                }
            }
        });
    }
});

railDots.forEach((dot) => {
    dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if(targetSection) {
            lenis.scrollTo(targetSection, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }
    });
});

// Refresh ScrollTrigger after all assets (images/fonts) load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
