// Preloader Animation Redesign

// Setup SVG paths dynamically by calculating their true length
const sproutPaths = document.querySelectorAll('.sprout-path');
sproutPaths.forEach(path => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
});

// Initial States
gsap.set('.ground-line', { scaleX: 0, transformOrigin: 'center' });
// Seed starts high up, stretched vertically for falling motion
gsap.set('.seed-element', { y: -250, scaleY: 1.2, scaleX: 0.8, transformOrigin: 'center bottom' });
// Logo is hidden with a 0-width clip-path
gsap.set('.preloader-logo', { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', opacity: 0 });

const preloaderTL = gsap.timeline({
    onComplete: () => {
        if (window.startBrandFilm) window.startBrandFilm();
    }
});

// 1. Draw the ground line
preloaderTL.to('.ground-line', { scaleX: 1, duration: 0.4, ease: 'power3.out' }, 0);

// 2. The seed falls
preloaderTL.to('.seed-element', { 
    y: 0, 
    duration: 0.5, 
    ease: 'power2.in' 
}, 0.2);

// Seed hits the ground: squash down, then bounce back to normal shape
preloaderTL.to('.seed-element', {
    scaleY: 0.6,
    scaleX: 1.4,
    duration: 0.15,
    ease: 'power1.out'
}, 0.7);
preloaderTL.to('.seed-element', {
    scaleY: 1,
    scaleX: 1,
    duration: 0.3,
    ease: 'elastic.out(1.5, 0.4)'
}, 0.85);

// 3. The sprout grows while the counter runs
// Counter animation
preloaderTL.to('.preloader-counter', {
    innerText: 100,
    duration: 1.8,
    snap: { innerText: 1 },
    ease: 'power2.inOut'
}, 1.0);

// Sprout stem shoots up
preloaderTL.to('.sprout-stem', {
    strokeDashoffset: 0,
    duration: 1.0,
    ease: 'power2.inOut'
}, 1.0);

// Leaves sprout out staggeredly
preloaderTL.to('.sprout-leaf', {
    strokeDashoffset: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.2
}, 1.4);

// 4. Reveal the logo with a smooth left-to-right clip-path wipe
preloaderTL.to('.preloader-logo', {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    opacity: 1,
    duration: 1.2,
    ease: 'power3.inOut'
}, 1.2);

// 5. Wipe away the entire preloader section
preloaderTL.to('.preloader-section', {
    clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
    duration: 0.8,
    ease: 'power3.inOut',
    delay: 0.2
});
