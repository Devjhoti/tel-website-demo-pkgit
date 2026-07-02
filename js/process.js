// ========== OUR PROCESS — Redesigned Growth Path ==========

// 1. Calculate true vine path length, shadow path, and branches
const vineMain = document.querySelector('.vine-main');
const vineShadow = document.querySelector('.vine-shadow');
const vineBranches = document.querySelectorAll('.vine-branch');

if (vineMain) {
    const vineLength = vineMain.getTotalLength();
    gsap.set(vineMain, { strokeDasharray: vineLength, strokeDashoffset: vineLength });
    gsap.set(vineShadow, { strokeDasharray: vineLength, strokeDashoffset: vineLength });
}

vineBranches.forEach(branch => {
    const length = branch.getTotalLength();
    gsap.set(branch, { strokeDasharray: length, strokeDashoffset: length });
});

// 2. Create the master scroll-scrubbed timeline
const processTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.process-section',
        start: 'top top',
        end: '+=300%',
        scrub: 1.2,
    }
});

// 3. Phase 1: Reveal the header (0% – 10% of scroll)
processTl.to('.process-eyebrow', {
    opacity: 1, y: 0, duration: 0.3, ease: 'power2.out'
}, 0);
processTl.to('.process-title', {
    opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'
}, 0.1);

// 4. Draw the vine progressively across the scroll duration
if (vineMain) {
    processTl.to(vineMain, {
        strokeDashoffset: 0,
        duration: 4,
        ease: 'none'
    }, 0.3);
    
    processTl.to(vineShadow, {
        strokeDashoffset: 0,
        duration: 4,
        ease: 'none'
    }, 0.33);
}

// 5. Draw branch lines and bounce-reveal step pods ("fruit bloom") at waypoints
const steps = document.querySelectorAll('.process-step');
const stepTimings = [0.4, 1.1, 1.8, 2.5, 3.2]; // Timeline positions matching vine draw progress
const branchTimings = [0.35, 1.05, 1.75, 2.45, 3.15];

steps.forEach((step, i) => {
    const pod = step.querySelector('.step-pod');
    const glow = step.querySelector('.step-glow');
    const branch = document.querySelector(`.branch-${i+1}`);
    
    // Draw the tiny connecting branch first
    if (branch) {
        processTl.to(branch, {
            strokeDashoffset: 0,
            duration: 0.3,
            ease: 'power1.out'
        }, branchTimings[i]);
    }
    
    // Bouncy reveal for the card (fruit pod)
    // Starting scaled down and slightly rotated, then pop!
    processTl.to(step, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'elastic.out(1.1, 0.4)', // Juicy bounce feel
    }, stepTimings[i]);
    
    // Pulse the soft inner glow on bloom
    processTl.to(glow, {
        opacity: 0.35,
        duration: 0.3,
        ease: 'power2.out'
    }, stepTimings[i] + 0.1);
    
    processTl.to(glow, {
        opacity: 0.15,
        duration: 0.6,
        ease: 'power1.inOut'
    }, stepTimings[i] + 0.4);
});


// 6. Continuous subtle swinging for the step hangers (infinitely loops)
const hangers = document.querySelectorAll('.step-hanger');
hangers.forEach((hanger, i) => {
    gsap.to(hanger, {
        rotation: (i % 2 === 0 ? 1 : -1) * (1.5 + Math.random() * 1.5), // Swing range 1.5 to 3.0 degrees
        duration: 3 + Math.random() * 2, // Varied speeds (3 to 5s cycles)
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.4 // Staggered phases
    });
});


// 7. Interactive fruit swing on card mouse hover
const pods = document.querySelectorAll('.step-pod');
pods.forEach((pod) => {
    pod.addEventListener('mouseenter', () => {
        // High energy elastic swing when cursor brushes it
        gsap.to(pod, {
            rotation: gsap.utils.random(-18, 18),
            duration: 1.4,
            ease: 'elastic.out(1.2, 0.3)',
            overwrite: 'auto',
            onComplete: () => {
                // Smoothly return to center resting state
                gsap.to(pod, {
                    rotation: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    });
});


// 8. Floating leaf particles — Continuous Background Float
const particles = document.querySelectorAll('.particle');

particles.forEach((p, i) => {
    const driftSpeed = 12 + Math.random() * 10;      // 12–22s travel
    const startDelay = Math.random() * 6;             // Staggered entry
    const swayRange = 40 + Math.random() * 60;        // 40–100px sway
    const swaySpeed = 3 + Math.random() * 3;          // 3–6s sway duration
    const spinRange = (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 120);

    // Initial position reset helper for infinite seamless cycling
    const resetParticle = (el) => {
        gsap.set(el, { y: 0 });
        gsap.to(el, {
            y: -(window.innerHeight + 200),
            duration: driftSpeed,
            ease: 'none',
            onComplete: () => resetParticle(el)
        });
    };

    // Begin infinite drift loop
    gsap.to(p, {
        y: -(window.innerHeight + 200),
        duration: driftSpeed,
        delay: startDelay,
        ease: 'none',
        onComplete: () => resetParticle(p)
    });

    // Horizontal sway
    gsap.to(p, {
        x: `+=${swayRange}`,
        duration: swaySpeed,
        delay: startDelay,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });

    // Gentle rotation
    gsap.to(p, {
        rotation: spinRange,
        duration: swaySpeed * 1.5,
        delay: startDelay,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });
});


// 9. Dynamic Hover Interaction for floating particles
let mousePos = { x: -999, y: -999 };

if (processSection) {
    processSection.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    processSection.addEventListener('mouseleave', () => {
        mousePos.x = -999;
        mousePos.y = -999;
    });

    // Proximity check on the GSAP ticker
    gsap.ticker.add(() => {
        particles.forEach(p => {
            const inner = p.querySelector('.particle-inner');
            if (!inner) return;

            const rect = inner.getBoundingClientRect();
            const px = rect.left + rect.width / 2;
            const py = rect.top + rect.height / 2;
            const dx = px - mousePos.x;
            const dy = py - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 120; // Proximity threshold

            if (dist < radius && dist > 0) {
                // Inside proximity: calculate push direction and force
                const force = (1 - dist / radius) * 45; // Max 45px push
                const angle = Math.atan2(dy, dx);
                
                // Repel the inner SVG away from cursor and rotate it
                gsap.to(inner, {
                    x: Math.cos(angle) * force,
                    y: Math.sin(angle) * force,
                    rotation: (dx > 0 ? 1 : -1) * force * 1.2,
                    scale: 1.25,
                    duration: 0.3,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            } else {
                // Outside proximity: smoothly restore inner element to local coordinates
                gsap.to(inner, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }
        });
    });
}
