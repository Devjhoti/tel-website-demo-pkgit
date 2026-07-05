// 1. Initialize Pinned Horizontal Scroll
const track = document.querySelector('.products-track');
const productsSection = document.querySelector('.products-section');

let productsTl;

const initHorizontalScroll = () => {
    if (!track || !productsSection) return;

    // Destroy existing timeline on resize if it exists
    if (productsTl) {
        productsTl.kill();
    }

    const totalScrollWidth = track.scrollWidth - window.innerWidth;

    // Main horizontal scroll timeline scrubbed by vertical scroll
    productsTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".products-section",
            pin: true,
            start: "top top",
            end: () => `+=${totalScrollWidth}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: self => {
                // Keep the track moving smoothly
            }
        }
    });

    productsTl.to(track, {
        x: () => -totalScrollWidth,
        ease: "none"
    });

    // 2. Staggered Card Assembly Bloom Reveal (linked to horizontal scroll)
    const cards = gsap.utils.toArray('.product-card');
    cards.forEach((card) => {
        const media = card.querySelector('.product-media-wrapper');
        const pedestal = card.querySelector('.pedestal-glow');
        const info = card.querySelector('.product-info');

        // Set initial invisible state for reveal
        gsap.set(card, { opacity: 0, scale: 0.82 });
        gsap.set(pedestal, { scale: 0 });
        gsap.set(media, { y: 40, opacity: 0 });
        gsap.set(info, { y: 25, opacity: 0 });

        gsap.timeline({
            scrollTrigger: {
                trigger: card,
                containerAnimation: productsTl,
                start: "left 92%",
                toggleActions: "play none none none"
            }
        })
        .to(card, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.9, 
            ease: "back.out(1.3)" 
        })
        .to(pedestal, { 
            scale: 1, 
            duration: 0.7, 
            ease: "elastic.out(1.1, 0.4)" 
        }, "-=0.5")
        .to(media, { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            ease: "power2.out" 
        }, "-=0.5")
        .to(info, { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            ease: "power2.out" 
        }, "-=0.5");
    });
};

// 3. Staggered Water-Lily Bobbing (Independent local coordinate drift)
const initIdleBobbing = () => {
    const cards = gsap.utils.toArray('.product-card');
    cards.forEach((card, i) => {
        // Random drift factors to avoid synchrony
        const yDrift = gsap.utils.random(10, 16);
        const xDrift = gsap.utils.random(5, 8);
        const rotDrift = gsap.utils.random(1.2, 2.0);
        const cycleDuration = gsap.utils.random(4, 6);

        gsap.to(card, {
            y: `+=${yDrift}`,
            x: `+=${xDrift}`,
            rotation: i % 2 === 0 ? rotDrift : -rotDrift,
            duration: cycleDuration,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.3
        });
    });
};

// 4. Real-Time 3D Card Proximity Tilt Mapping
const init3DTilt = () => {
    const cards = gsap.utils.toArray('.product-card');
    
    cards.forEach((card) => {
        // We track hover coordinates on mousemove
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Calculate cursor offset from center of the card
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            
            // Value normalized between -1 and 1
            const normalizedX = (e.clientX - cardCenterX) / (rect.width / 2);
            const normalizedY = (e.clientY - cardCenterY) / (rect.height / 2);
            
            // Max tilt limits
            const maxTiltY = 12; // rotate around Y (look left/right)
            const maxTiltX = 12; // rotate around X (look up/down)
            
            const inner = card.querySelector('.card-inner');
            
            // Tilts the inner frame, keeping the outer wrapper running the float loop
            gsap.to(inner, {
                rotateY: normalizedX * maxTiltY,
                rotateX: -normalizedY * maxTiltX, // inverted Y axis
                x: normalizedX * 8, // subtle slide toward cursor
                y: normalizedY * 8,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        // Smooth springy reset on mouseleave
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.card-inner');
            gsap.to(inner, {
                rotateY: 0,
                rotateX: 0,
                x: 0,
                y: 0,
                duration: 1.0,
                ease: "elastic.out(1.1, 0.4)",
                overwrite: "auto"
            });
        });
    });
};

// Run initializations with matchMedia
const initProducts = () => {
    let mm = gsap.matchMedia();

    // DESKTOP & TABLET: Pinned horizontal scroll track with 3D tilts and bobbing
    mm.add("(min-width: 769px)", () => {
        initHorizontalScroll();
        initIdleBobbing();
        init3DTilt();
    });

    // MOBILE: Vertical stack reveal with simple scroll triggers and no pinning
    mm.add("(max-width: 768px)", () => {
        const cards = gsap.utils.toArray('.product-card');
        
        cards.forEach((card) => {
            const media = card.querySelector('.product-media-wrapper');
            const pedestal = card.querySelector('.pedestal-glow');
            const info = card.querySelector('.product-info');

            gsap.set(card, { opacity: 0, scale: 0.85, y: 50 });
            if (pedestal) gsap.set(pedestal, { scale: 0 });
            if (media) gsap.set(media, { y: 30, opacity: 0 });
            if (info) gsap.set(info, { y: 20, opacity: 0 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            })
            .to(card, { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                duration: 0.7, 
                ease: "power2.out" 
            })
            .to(pedestal, { 
                scale: 1, 
                duration: 0.6, 
                ease: "back.out(1.2)" 
            }, "-=0.3")
            .to(media, { 
                y: 0, 
                opacity: 1, 
                duration: 0.5 
            }, "-=0.3")
            .to(info, { 
                y: 0, 
                opacity: 1, 
                duration: 0.5 
            }, "-=0.3");
        });
    });

    if (window.setupMagnetics) {
        window.setupMagnetics();
    }
    ScrollTrigger.refresh();
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initProducts();
} else {
    window.addEventListener('load', initProducts);
}

// Re-adjust elements on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
});
