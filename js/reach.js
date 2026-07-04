// ========== GLOBAL REACH — Scroll-linked Spinning Globe & Vines ==========

const initGlobalReachSection = () => {
    const section = document.querySelector('.reach-section');
    if (!section) return;

    const mapGroup = document.querySelector('.globe-map-group');
    const routeLines = document.querySelectorAll('.reach-route-line');
    const pins = document.querySelectorAll('.reach-pin-g');
    const tooltip = document.querySelector('.reach-tooltip');
    const statNums = document.querySelectorAll('.reach-stats .stat-num');
    const cards = document.querySelectorAll('.reach-card');

    // Tooltip data map for standard pins
    const hubDetails = {
        bd: {
            title: "TEL Plastics HQ (Dhaka)",
            body: "Central processing & production hub. Upcycling 18M+ KGs of post-consumer polymers annually."
        },
        eu: {
            title: "European Circular Net",
            body: "High-grade HDPE export partner. Certified compliant with strict European eco-standards."
        },
        me: {
            title: "GCC Eco Logistics",
            body: "Eco-essential housewares supply chain serving green retail networks across the Gulf."
        },
        ea: {
            title: "East Asia Smart Loop",
            body: "Precision modular storage and eco-utility sets supplied to sustainable smart-city grids."
        },
        au: {
            title: "Oceania Eco-Furniture",
            body: "Molded lounge benches and communal tables designed for public parks and reserves."
        },
        af: {
            title: "African Circular Loop",
            body: "Cooperative sourcing and modular utilities distribution helping local communities."
        }
    };

    // 1. Set initial states of path lengths for drawing animation
    routeLines.forEach(line => {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    });

    // Stagger hide pin components
    pins.forEach(pin => {
        const dots = pin.querySelectorAll('.pin-dot, .pin-inner-dot');
        const text = pin.querySelector('.pin-svg-label');
        const pulse = pin.querySelector('.pin-pulse');
        gsap.set([dots, text], { scale: 0, opacity: 0, transformOrigin: 'center center' });
        gsap.set(pulse, { opacity: 0 });
    });

    // Hide stat numbers (set value 0 initially)
    statNums.forEach(num => {
        num.innerText = "0";
    });

    let mm = gsap.matchMedia();

    // ==========================================
    // DESKTOP & TABLET: Pinned scroll-linked spin
    // ==========================================
    mm.add("(min-width: 769px)", () => {
        // Init map horizontal translation: Americas Copy 1 centered (X=350 -> transform x = -150)
        gsap.set(mapGroup, { x: -150 });

        // Set initial invisible states for entrance reveals
        gsap.set(section.querySelectorAll('.reach-reveal'), { y: 30, opacity: 0 });
        gsap.set('.globe-frame', { scale: 0.85, opacity: 0 });
        gsap.set('.reach-stats .stat-card', { y: 30, opacity: 0 });
        gsap.set(cards, { scale: 0, opacity: 0 });

        // 1. Entrance reveal (triggered as soon as section approaches the viewport)
        const entranceTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        entranceTl.to(section.querySelectorAll('.reach-reveal'), {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: 'back.out(1.2)'
        }, 0);

        entranceTl.to('.globe-frame', {
            scale: 1,
            opacity: 1,
            duration: 1.0,
            ease: 'elastic.out(1.15, 0.45)'
        }, 0.1);

        entranceTl.to('.reach-stats .stat-card', {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: 'back.out(1.2)'
        }, 0.2);

        // 2. Pinned scroll-linked timeline (scrubbed, extended duration for 4 revolutions)
        const reachTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=350%', // Pinned scroll travel duration
                pin: true,
                scrub: 1.2
            }
        });

        // REVOLUTION 1: Spin to Europe (X=700 -> x = -500)
        reachTimeline.to(mapGroup, { x: -500, duration: 0.20, ease: 'power1.inOut' }, 0.0);
        // Reveal Card 1 (Right side - Europe)
        reachTimeline.to('.rc-1', {
            scale: 1,
            opacity: 1,
            duration: 0.06,
            ease: 'elastic.out(1.15, 0.45)'
        }, 0.18);

        // REVOLUTION 2: Spin to North America (X=1350 -> x = -1150)
        reachTimeline.to(mapGroup, { x: -1150, duration: 0.22, ease: 'power1.inOut' }, 0.24);
        // Reveal Card 2 (Left side - North America)
        reachTimeline.to('.rc-2', {
            scale: 1,
            opacity: 1,
            duration: 0.06,
            ease: 'elastic.out(1.15, 0.45)'
        }, 0.42);

        // REVOLUTION 3: Spin to Australia (X=2050 -> x = -1850)
        reachTimeline.to(mapGroup, { x: -1850, duration: 0.22, ease: 'power1.inOut' }, 0.48);
        // Reveal Card 3 (Right side - Oceania)
        reachTimeline.to('.rc-3', {
            scale: 1,
            opacity: 1,
            duration: 0.06,
            ease: 'elastic.out(1.15, 0.45)'
        }, 0.66);

        // REVOLUTION 4: Spin to Bangladesh HQ (X=2850 -> x = -2650)
        reachTimeline.to(mapGroup, { x: -2650, duration: 0.22, ease: 'power1.inOut' }, 0.72);
        // Reveal Card 4 (Left side - Bangladesh HQ)
        reachTimeline.to('.rc-4', {
            scale: 1,
            opacity: 1,
            duration: 0.06,
            ease: 'elastic.out(1.15, 0.45)'
        }, 0.90);

        // Pop central Bangladesh pin at final stop
        const bdPin = document.querySelector('.pin-bd');
        reachTimeline.to(bdPin.querySelectorAll('.pin-dot, .pin-inner-dot'), 
            { scale: 1, opacity: 1, duration: 0.05, ease: 'elastic.out(1.1, 0.4)' }, 
            0.90
        );

        // Draw export routes radiating outward (since Bangladesh HQ is in copy 3)
        // Destinations are on Copy 3: Europe (2720), Middle East (2780), East Asia (2960), Africa (2700), Australia (3010)
        const routeMappings = [
            { pinSelector: '.pin-eu', lineSelector: '.route-eu', start: 0.90, duration: 0.06 },
            { pinSelector: '.pin-me', lineSelector: '.route-me', start: 0.91, duration: 0.06 },
            { pinSelector: '.pin-ea', lineSelector: '.route-ea', start: 0.92, duration: 0.06 },
            { pinSelector: '.pin-af', lineSelector: '.route-af', start: 0.93, duration: 0.06 },
            { pinSelector: '.pin-au', lineSelector: '.route-au', start: 0.94, duration: 0.06 }
        ];

        routeMappings.forEach(mapping => {
            const line = document.querySelector(mapping.lineSelector);
            const pin = document.querySelector(mapping.pinSelector);
            if (line && pin) {
                // 1. Draw route vine line
                reachTimeline.to(line, { strokeDashoffset: 0, duration: mapping.duration, ease: 'power1.out' }, mapping.start);
                
                // 2. Pop destination pin at the end of route drawing
                const dots = pin.querySelectorAll('.pin-dot');
                const text = pin.querySelector('.pin-svg-label');
                const pulse = pin.querySelector('.pin-pulse');
                const popTime = mapping.start + mapping.duration;

                reachTimeline.to(dots, { scale: 1, opacity: 1, duration: 0.04, ease: 'elastic.out(1.2, 0.4)' }, popTime);
                reachTimeline.to(text, { opacity: 0.7, duration: 0.03 }, popTime + 0.02);
                reachTimeline.to(pulse, { opacity: 0.7, duration: 0.02 }, popTime + 0.02);
            }
        });

        // Step C: Count up stats numbers
        statNums.forEach(num => {
            const finalVal = parseInt(num.getAttribute('data-val'));
            const suffix = num.getAttribute('data-val') === '100' ? '%' : (num.getAttribute('data-val') === '18' ? 'M+' : '+');
            const countObj = { value: 0 };
            
            reachTimeline.to(countObj, {
                value: finalVal,
                duration: 0.12,
                ease: 'power2.out',
                onUpdate: () => {
                    num.innerText = Math.floor(countObj.value) + suffix;
                }
            }, 0.88);
        });
    });

    // ==========================================
    // MOBILE: Stacked static content triggers
    // ==========================================
    mm.add("(max-width: 768px)", () => {
        // Set map immediately centered on Bangladesh Copy 3 (X=2850 -> x = -2650)
        gsap.set(mapGroup, { x: -2650 });

        // Build one single scroll triggered entrance
        const mobileTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.reach-globe-stage',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Reveal Globe and Headline
        mobileTimeline.fromTo('.globe-frame', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' })
                      .fromTo(section.querySelectorAll('.reach-reveal'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, 0.2);

        // Draw vines & pop all pins
        routeLines.forEach(line => {
            mobileTimeline.to(line, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.out' }, 0.4);
        });

        pins.forEach(pin => {
            const dots = pin.querySelectorAll('.pin-dot, .pin-inner-dot');
            const text = pin.querySelector('.pin-svg-label');
            const pulse = pin.querySelector('.pin-pulse');
            mobileTimeline.to(dots, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1.1, 0.45)' }, 0.7)
                          .to([text, pulse], { opacity: 0.7, duration: 0.3 }, 0.9);
        });

        // Reveal stacked cards
        gsap.fromTo(cards, 
            { y: 30, opacity: 0 }, 
            { 
                y: 0, 
                opacity: 1, 
                stagger: 0.12, 
                duration: 0.6, 
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: '.reach-globe-stage',
                    start: 'bottom 85%'
                }
            }
        );

        // Count up stats cards
        gsap.fromTo('.reach-stats .stat-card', 
            { y: 30, opacity: 0 }, 
            { 
                y: 0, 
                opacity: 1, 
                stagger: 0.1, 
                duration: 0.5, 
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.reach-stats',
                    start: 'top 90%'
                }
            }
        );

        statNums.forEach(num => {
            const finalVal = parseInt(num.getAttribute('data-val'));
            const suffix = num.getAttribute('data-val') === '100' ? '%' : (num.getAttribute('data-val') === '18' ? 'M+' : '+');
            const countObj = { value: 0 };
            
            gsap.to(countObj, {
                value: finalVal,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.reach-stats',
                    start: 'top 90%'
                },
                onUpdate: () => {
                    num.innerText = Math.floor(countObj.value) + suffix;
                }
            });
        });
    });

    // 2. Interactive Tooltip hover trigger logic for small pins
    pins.forEach(pin => {
        pin.addEventListener('mouseenter', () => {
            const hub = pin.getAttribute('data-hub');
            const details = hubDetails[hub];
            if (!details) return;

            // Update tooltip text
            tooltip.querySelector('.tooltip-title').innerText = details.title;
            tooltip.querySelector('.tooltip-body').innerText = details.body;

            // Measure pin center coordinates relative to globe-frame container
            const frameRect = document.querySelector('.globe-frame').getBoundingClientRect();
            
            // Get local coordinates of the transform group
            const transformAttribute = pin.getAttribute('transform');
            const translateValues = transformAttribute.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (!translateValues) return;

            const localX = parseFloat(translateValues[1]);
            const localY = parseFloat(translateValues[2]);

            // Map SVG coordinate space (400x400) to actual globe-frame screen width/height
            const scaleX = frameRect.width / 400;
            const scaleY = frameRect.height / 400;

            // Apply horizontal map group offset
            const mapGroupX = gsap.getProperty(mapGroup, "x");
            const mappedX = (localX + mapGroupX) * scaleX;
            const mappedY = localY * scaleY;

            // Position tooltip center-aligned above pin
            tooltip.style.left = `${mappedX}px`;
            tooltip.style.top = `${mappedY}px`;

            // Active transition class
            tooltip.classList.add('active');

            // Scale active pin dot elastically on hover
            gsap.to(pin.querySelectorAll('.pin-dot'), {
                r: 10,
                fill: 'var(--sage)',
                duration: 0.3,
                ease: 'back.out(2.5)'
            });
        });

        pin.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');

            // Revert pin size
            const isBD = pin.getAttribute('data-hub') === 'bd';
            gsap.to(pin.querySelectorAll('.pin-dot'), {
                r: isBD ? 8 : 6,
                fill: 'var(--forest)',
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });

    // Flanking cards mouse tilts (3D perspective feel)
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 769) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const tiltX = (yc - y) / 8;
            const tiltY = (x - xc) / 8;

            gsap.to(card, {
                rotateX: tiltX,
                rotateY: tiltY,
                transformPerspective: 600,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: 'elastic.out(1.2, 0.45)',
                overwrite: 'auto'
            });
        });
    });

    // Tilt Globe frame slightly on mousemove (3D perspective feel)
    const globeFrame = document.querySelector('.globe-frame');
    globeFrame.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 769) return;
        const rect = globeFrame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;

        const tiltX = (yc - y) / 10;
        const tiltY = (x - xc) / 10;

        gsap.to(globeFrame, {
            rotateX: tiltX,
            rotateY: tiltY,
            transformPerspective: 800,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });

    globeFrame.addEventListener('mouseleave', () => {
        gsap.to(globeFrame, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'elastic.out(1.2, 0.45)',
            overwrite: 'auto'
        });
    });
};

// Initialize on page load
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGlobalReachSection();
} else {
    window.addEventListener('load', initGlobalReachSection);
}
