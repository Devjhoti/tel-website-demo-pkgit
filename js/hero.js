// Split the headline immediately so CSS hides the characters before any animation
const headline = new SplitType('.hero-headline', { types: 'words, chars' });

// Create the pinned timeline ON LOAD so ScrollTrigger calculates document height correctly from the start.
// This prevents pinning failures and layout jumps.
const heroScrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '+=150%',
        scrub: 1,
    }
});

// Bouncy breeze animation (runs continuously)
gsap.to('.bush-leaf-1 .breeze-group', { rotation: 6, duration: 1.8, yoyo: true, repeat: -1, ease: 'back.inOut(1.2)' });
gsap.to('.bush-leaf-2 .breeze-group', { rotation: -5, duration: 2.1, yoyo: true, repeat: -1, ease: 'back.inOut(1.1)', delay: 0.2 });
gsap.to('.bush-leaf-3 .breeze-group', { rotation: 7, duration: 1.6, yoyo: true, repeat: -1, ease: 'back.inOut(1.3)', delay: 0.5 });
gsap.to('.bush-leaf-4 .breeze-group', { rotation: -6, duration: 1.9, yoyo: true, repeat: -1, ease: 'back.inOut(1.2)', delay: 0.7 });

// Scrubbed scroll animations - fanning the bushes outward
heroScrollTl.to('.bush-leaf-1', { rotation: "-=15", scale: 1.05, ease: 'none' }, 0);
heroScrollTl.to('.bush-leaf-2', { rotation: "+=15", scale: 0.95, ease: 'none' }, 0);
heroScrollTl.to('.bush-leaf-3', { rotation: "+=25", scale: 0.8, ease: 'none' }, 0);
heroScrollTl.to('.bush-leaf-4', { rotation: "+=35", scale: 0.65, ease: 'none' }, 0);
heroScrollTl.to('.hero-bush', { opacity: 0.8, y: -40, ease: 'none' }, 0);

// Fade out the hero content parent on scroll
heroScrollTl.to('.hero-content', {
    y: -150,
    opacity: 0,
    ease: 'power1.in'
}, 0);

// Animate the actual img (.hero-logo) on scroll, not the wrapper!
// This avoids overwriting conflicts with the entrance timeline which animates the wrapper.
heroScrollTl.to('.hero-logo', {
    y: -50,
    opacity: 0,
    ease: 'power1.in'
}, 0);


// Hero Section Entrance Animation - Triggered after Brand Film
window.startHeroAnimation = (skipLogo = false) => {
    // Enter animation for the wrapper and children elements
    const enterTl = gsap.timeline();
    
    if (!skipLogo) {
        enterTl.to('.hero-logo-wrapper', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    }
    
    const nextOffset = skipLogo ? 0 : '-=0.6';
    
    enterTl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, nextOffset)
           .to(headline.chars, {
               opacity: 1,
               y: 0,
               duration: 0.8,
               stagger: 0.015,
               ease: 'back.out(1.5)'
           }, '-=0.4')
           .to('.hero-subheadline-wrapper', {
               opacity: 1,
               y: 0,
               duration: 1,
               ease: 'power3.out'
           }, '-=0.4');
};

// Hero CTA scrolling
document.querySelectorAll('.hero-ctas button').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if(target) {
            lenis.scrollTo(target, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }
    });
});
