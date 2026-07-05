// Preloader Animation Redesign — "The Metamorphosis"

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup SVG paths dynamically by calculating their true length
    const metaPaths = document.querySelectorAll('.metamorphosis-path');
    metaPaths.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    const leafPaths = document.querySelectorAll('.leaf-path');
    leafPaths.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    // 2. Initial States
    gsap.set('.ground-line', { scaleX: 0, transformOrigin: 'center' });
    gsap.set('.leaf-group', { opacity: 0 });
    gsap.set('.preloader-brand-logo', { 
        opacity: 0, 
        scale: 0.95,
        xPercent: -25,
        yPercent: -50,
        left: '50%',
        top: '50%'
    });

    // 3. Dynamically Generate Particles along the outlines
    const bottlePath = document.querySelector('.bottle-path');
    const crease1 = document.querySelector('.bottle-crease-1');
    const crease2 = document.querySelector('.bottle-crease-2');

    const leftLeaf = document.querySelector('.left-leaf');
    const leftVein = document.querySelector('.left-vein');
    const rightLeaf = document.querySelector('.right-leaf');
    const rightVein = document.querySelector('.right-vein');
    const leafStem = document.querySelector('.leaf-stem');

    const startPoints = [];
    const endPoints = [];
    const numParticles = 60;
    const particles = [];
    const particlesContainer = document.querySelector('.particles-container');

    // Helper to sample coordinates along an SVG path
    function samplePoints(path, count, array) {
        if (!path) return;
        const len = path.getTotalLength();
        for (let i = 0; i < count; i++) {
            const t = count > 1 ? (i / (count - 1)) * 0.98 + 0.01 : 0.5;
            const pt = path.getPointAtLength(t * len);
            array.push({ x: pt.x, y: pt.y });
        }
    }

    // Sample 60 starting points along bottle shape & crease details
    samplePoints(bottlePath, 50, startPoints);
    samplePoints(crease1, 5, startPoints);
    samplePoints(crease2, 5, startPoints);

    // Sample 60 ending points along leaf shape & stem details
    samplePoints(leftLeaf, 20, endPoints);
    samplePoints(leftVein, 5, endPoints);
    samplePoints(rightLeaf, 20, endPoints);
    samplePoints(rightVein, 5, endPoints);
    samplePoints(leafStem, 10, endPoints);

    // Create particle elements inside the SVG container
    for (let i = 0; i < numParticles; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '2.5');
        circle.setAttribute('fill', 'var(--ink)');
        circle.setAttribute('opacity', '0');
        particlesContainer.appendChild(circle);

        particles.push({
            element: circle,
            startX: startPoints[i % startPoints.length].x,
            startY: startPoints[i % startPoints.length].y,
            endX: endPoints[i % endPoints.length].x,
            endY: endPoints[i % endPoints.length].y
        });
    }

    // 4. GSAP Timeline setup
    const preloaderTL = gsap.timeline({
        onComplete: () => {
            if (window.startBrandFilm) window.startBrandFilm();
        }
     });

    // --- Beat 1: The Discard (0.0s -> 0.8s) ---
    // Draw ground line
    preloaderTL.to('.ground-line', { scaleX: 1, duration: 0.4, ease: 'power3.out' }, 0);
    // Draw bottle outline and creases
    preloaderTL.to('.bottle-path', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 0.1);
    preloaderTL.to(['.bottle-crease-1', '.bottle-crease-2'], { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 0.4);
    // Squash animation on bottle (crunching feeling)
    preloaderTL.to('.metamorphosis-svg', { scaleY: 0.9, scaleX: 1.05, transformOrigin: 'center bottom', duration: 0.2, ease: 'power1.inOut' }, 0.6);
    preloaderTL.to('.metamorphosis-svg', { scaleY: 1, scaleX: 1, duration: 0.2, ease: 'power1.inOut' }, 0.8);

    // --- Beat 2: The Dissolution (0.8s -> 1.8s) ---
    // Hide bottle drawing
    preloaderTL.to('.metamorphosis-path', { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0.8);
    
    // Counter count up
    preloaderTL.to('.preloader-counter', {
        innerText: 100,
        duration: 2.2,
        snap: { innerText: 1 },
        ease: 'power2.inOut',
        onUpdate: function() {
            const counter = document.querySelector('.preloader-counter');
            if (counter) {
                counter.innerText = Math.round(parseFloat(counter.innerText)) + '%';
            }
        }
    }, 0.8);

    // Particles explode from initial positions
    particles.forEach((p, i) => {
        preloaderTL.set(p.element, { x: p.startX, y: p.startY, opacity: 1 }, 0.8);

        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 40;
        const midX = p.startX + Math.cos(angle) * dist;
        const midY = p.startY + Math.sin(angle) * dist;

        preloaderTL.to(p.element, {
            x: midX,
            y: midY,
            fill: 'var(--sage)',
            duration: 1.0,
            ease: 'power2.out'
        }, 0.8 + (i * 0.004));
    });

    // --- Beat 3: The Rebirth (1.8s -> 3.0s) ---
    // Particles converge to the leaf outline
    particles.forEach((p, i) => {
        preloaderTL.to(p.element, {
            x: p.endX,
            y: p.endY,
            duration: 1.2,
            ease: 'power3.inOut'
        }, 1.8 + (i * 0.004));
    });

    // Reveal vector leaf drawing
    preloaderTL.to('.leaf-group', { opacity: 1, duration: 0.1 }, 2.8);
    preloaderTL.to('.leaf-stem', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 2.8);
    preloaderTL.to('.leaf-shape', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, 2.9);
    preloaderTL.to('.leaf-vein', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 3.2);
    
    // Fill shape with green opacity
    preloaderTL.to('.leaf-shape', { fillOpacity: 1, duration: 0.6, ease: 'power1.inOut' }, 3.3);

    // Fade out particles and ground line as they lock in
    preloaderTL.to('.ground-line', { opacity: 0, duration: 0.4 }, 3.3);
    preloaderTL.to('.particles-container', { opacity: 0, duration: 0.4 }, 3.4);

    // --- Beat 4: The Reveal (3.5s -> 4.5s) ---
    // Cross-fade the animated leaf to the official logo
    preloaderTL.to('.preloader-brand-logo', {
        opacity: 1,
        scale: 1,
        duration: 1.0,
        ease: 'power3.inOut'
    }, 3.5);
    preloaderTL.to('.metamorphosis-svg', { opacity: 0, duration: 0.8 }, 3.5);

    // Curtain wipe reveal to show brand film underneath
    preloaderTL.to('.preloader-section', {
        clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
        duration: 0.8,
        ease: 'power3.inOut',
        delay: 0.2
    }, 4.5);
});
