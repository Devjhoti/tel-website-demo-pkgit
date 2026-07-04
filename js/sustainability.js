// ========== SUSTAINABILITY — Progressive Sprouting Roots ==========

const initSustainabilitySection = () => {
    const section = document.querySelector('.sustain-section');
    const mainPath = document.querySelector('.sustain-root-main');
    const shadowPath = document.querySelector('.sustain-root-shadow');

    // 1. Title & Eyebrow Entrance Animation
    const headerReveals = document.querySelectorAll('.sustain-header .sustain-reveal');
    if (headerReveals.length > 0) {
        gsap.to(headerReveals, {
            scrollTrigger: {
                trigger: '.sustain-header',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'back.out(1.4)'
        });
    }

    // 2. Progressive Winding Root & Card Sprouting GSAP Animations
    const card1 = document.querySelector('.sustain-card.card-1');
    const card2 = document.querySelector('.sustain-card.card-2');
    const card3 = document.querySelector('.sustain-card.card-3');
    const card4 = document.querySelector('.sustain-card.card-4');

    const sprout1 = document.querySelector('.sustain-sprout-1');
    const sprout2 = document.querySelector('.sustain-sprout-2');
    const sprout3 = document.querySelector('.sustain-sprout-3');
    const sprout4 = document.querySelector('.sustain-sprout-4');

    // Sub-elements initial scale 0 for stagger reveals
    const hideSVGInner = (card) => {
        if (card) {
            const elements = card.querySelectorAll('.sustain-infographic-box svg > *');
            gsap.set(elements, { scale: 0, opacity: 0, transformOrigin: 'center center' });
        }
    };

    hideSVGInner(card1);
    hideSVGInner(card2);
    hideSVGInner(card3);
    hideSVGInner(card4);

    const initSprout = (sprout) => {
        if (sprout) {
            const len = sprout.getTotalLength();
            gsap.set(sprout, { strokeDasharray: len, strokeDashoffset: len });
        }
    };

    let mm = gsap.matchMedia();

    // ==========================================
    // DESKTOP & TABLET: Winding Vine scroll-scrub
    // ==========================================
    mm.add("(min-width: 769px)", () => {
        if (mainPath && shadowPath && section) {
            const mainLength = mainPath.getTotalLength();
            gsap.set(mainPath, { strokeDasharray: mainLength, strokeDashoffset: mainLength });
            gsap.set(shadowPath, { strokeDasharray: mainLength, strokeDashoffset: mainLength });

            initSprout(sprout1);
            initSprout(sprout2);
            initSprout(sprout3);
            initSprout(sprout4);

            gsap.set([card1, card2, card3, card4], { 
                opacity: 0, 
                scale: 0.6, 
                rotationX: -12, 
                transformPerspective: 800,
                y: 0
            });

            const rootTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 20%',
                    end: 'bottom 80%',
                    scrub: 1.5
                }
            });

            // Progressive root growth
            rootTimeline.to(mainPath, { strokeDashoffset: 0, ease: 'none' }, 0);
            rootTimeline.to(shadowPath, { strokeDashoffset: 0, ease: 'none' }, 0.02);

            // Level 1: Card 1 (Left) (Waypoint ~8% to ~25% scroll progress)
            if (sprout1 && card1) {
                rootTimeline.to(sprout1, { strokeDashoffset: 0, duration: 0.08, ease: 'none' }, 0.08);
                rootTimeline.to(card1, { opacity: 1, scale: 1, rotationX: 0, duration: 0.12, ease: 'elastic.out(1.1, 0.45)' }, 0.16);
                rootTimeline.to(card1.querySelectorAll('.sustain-infographic-box svg > *'), {
                    scale: 1,
                    opacity: 1,
                    duration: 0.08,
                    stagger: 0.02,
                    ease: 'back.out(1.5)'
                }, 0.22);
            }

            // Level 2: Card 2 (Right) (Waypoint ~32% to ~49% scroll progress)
            if (sprout2 && card2) {
                rootTimeline.to(sprout2, { strokeDashoffset: 0, duration: 0.08, ease: 'none' }, 0.32);
                rootTimeline.to(card2, { opacity: 1, scale: 1, rotationX: 0, duration: 0.12, ease: 'elastic.out(1.1, 0.45)' }, 0.40);
                rootTimeline.to(card2.querySelectorAll('.sustain-infographic-box svg > *'), {
                    scale: 1,
                    opacity: 1,
                    duration: 0.08,
                    stagger: 0.02,
                    ease: 'back.out(1.5)'
                }, 0.46);
            }

            // Level 3: Card 3 (Left) (Waypoint ~56% to ~73% scroll progress)
            if (sprout3 && card3) {
                rootTimeline.to(sprout3, { strokeDashoffset: 0, duration: 0.08, ease: 'none' }, 0.56);
                rootTimeline.to(card3, { opacity: 1, scale: 1, rotationX: 0, duration: 0.12, ease: 'elastic.out(1.1, 0.45)' }, 0.64);
                rootTimeline.to(card3.querySelectorAll('.sustain-infographic-box svg > *'), {
                    scale: 1,
                    opacity: 1,
                    duration: 0.08,
                    stagger: 0.02,
                    ease: 'back.out(1.5)'
                }, 0.70);
            }

            // Level 4: Card 4 (Right) (Waypoint ~78% to ~95% scroll progress)
            if (sprout4 && card4) {
                rootTimeline.to(sprout4, { strokeDashoffset: 0, duration: 0.08, ease: 'none' }, 0.78);
                rootTimeline.to(card4, { opacity: 1, scale: 1, rotationX: 0, duration: 0.12, ease: 'elastic.out(1.1, 0.45)' }, 0.86);
                rootTimeline.to(card4.querySelectorAll('.sustain-infographic-box svg > *'), {
                    scale: 1,
                    opacity: 1,
                    duration: 0.08,
                    stagger: 0.02,
                    ease: 'back.out(1.5)'
                }, 0.92);
            }
        }
    });

    // ==========================================
    // MOBILE: Normal stacked bouncy triggers
    // ==========================================
    mm.add("(max-width: 768px)", () => {
        const cards = [card1, card2, card3, card4];
        cards.forEach(card => {
            if (card) {
                gsap.set(card, { opacity: 0, scale: 0.85, rotationX: 0, y: 40 });
                
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });

                tl.to(card, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' })
                  .to(card.querySelectorAll('.sustain-infographic-box svg > *'), {
                      scale: 1,
                      opacity: 1,
                      duration: 0.4,
                      stagger: 0.06,
                      ease: 'back.out(1.5)'
                  }, '-=0.25');
            }
        });
    });

    // 3. Tactile 3D Hover Tilt Logic on cards (Desktop/Tablet only)
    const interactiveItems = document.querySelectorAll('.sustain-card');
    interactiveItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 769) return;
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const angleX = (yc - y) / 8;
            const angleY = (x - xc) / 8;

            gsap.to(item, {
                rotateX: angleX,
                rotateY: angleY,
                transformPerspective: 800,
                ease: 'power2.out',
                duration: 0.3,
                overwrite: 'auto'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotateX: 0,
                rotateY: 0,
                ease: 'elastic.out(1.2, 0.4)',
                duration: 0.8,
                overwrite: 'auto'
            });
        });
    });

    // Re-bind cursor magnetics
    if (window.setupMagnetics) {
        window.setupMagnetics();
    }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initSustainabilitySection();
} else {
    window.addEventListener('load', initSustainabilitySection);
}
