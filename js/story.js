// ========== OUR STORY / CRAFTSMANSHIP SECTION REFINE ==========

// Global states
let activeVideoIndex = 1;
let isMutedGlobal = true;

// 1. Initial State Setup for Video Stack
const videoWrappers = document.querySelectorAll('.story-video-wrapper');
const videos = document.querySelectorAll('.story-video');

const setupVideoStack = () => {
    videoWrappers.forEach((wrapper, index) => {
        const video = wrapper.querySelector('video');
        if (index === 0) {
            // First video starts active
            wrapper.classList.add('active-video');
            gsap.set(wrapper, { opacity: 1, scale: 1, rotation: 0, zIndex: 2 });
            if (video) {
                video.play().catch(() => {});
                video.muted = isMutedGlobal;
            }
        } else {
            // Others start hidden
            wrapper.classList.remove('active-video');
            gsap.set(wrapper, { opacity: 0, scale: 0.65, rotation: -3, zIndex: 1 });
            if (video) {
                video.muted = true;
            }
        }
    });
};

// Function to switch active video with bouncy reveal animation
const switchVideo = (targetIndex) => {
    if (activeVideoIndex === targetIndex) return;

    const oldWrapper = document.querySelector(`.story-video-wrapper[data-video-index="${activeVideoIndex}"]`);
    const newWrapper = document.querySelector(`.story-video-wrapper[data-video-index="${targetIndex}"]`);

    if (oldWrapper && newWrapper) {
        const oldVideo = oldWrapper.querySelector('video');
        const newVideo = newWrapper.querySelector('video');

        // 1. Inactivate old wrapper: scale down, rotate, fade out
        oldWrapper.classList.remove('active-video');
        gsap.to(oldWrapper, {
            opacity: 0,
            scale: 0.65,
            rotation: -3,
            zIndex: 1,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
                // Keep video playing in background but muted
                if (oldVideo) oldVideo.muted = true;
            }
        });

        // 2. Activate new wrapper: pop up with elastic bounce
        newWrapper.classList.add('active-video');
        gsap.fromTo(newWrapper, 
            { opacity: 0, scale: 0.5, rotation: 4, zIndex: 2 },
            {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1.0,
                ease: 'elastic.out(1.1, 0.45)', // Juicy bouncy pop reveal
                onStart: () => {
                    if (newVideo) {
                        newVideo.play().catch(() => {});
                        newVideo.muted = isMutedGlobal; // inherit global mute state
                    }
                }
            }
        );

        activeVideoIndex = targetIndex;
    }
};

// 2. ScrollTriggers for Text Reveals & Video Switching
const initStoryTriggers = () => {
    // Reveal header elements
    const header = document.querySelector('.story-header');
    if (header) {
        const headerReveals = header.querySelectorAll('.story-reveal');
        gsap.to(headerReveals, {
            scrollTrigger: {
                trigger: header,
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

    const articles = document.querySelectorAll('.story-article');

    articles.forEach((article) => {
        const index = parseInt(article.getAttribute('data-article-index'), 10);
        const reveals = article.querySelectorAll('.story-reveal');

        // Reveal text lines staggeredly as article enters viewport
        gsap.to(reveals, {
            scrollTrigger: {
                trigger: article,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'back.out(1.4)'
        });

        // Coordinate active video based on scroll focus on each article
        ScrollTrigger.create({
            trigger: article,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: self => {
                if (self.isActive) {
                    switchVideo(index);
                }
            }
        });
    });
};

// 3. Winding Progress Vine SVG Draw Animation
const initWindingVine = () => {
    const mainPath = document.querySelector('.story-vine-path-main');
    const shadowPath = document.querySelector('.story-vine-path-shadow');
    const section = document.querySelector('.story-section');

    if (mainPath && shadowPath && section) {
        const mainLength = mainPath.getTotalLength();
        gsap.set(mainPath, { strokeDasharray: mainLength, strokeDashoffset: mainLength });
        gsap.set(shadowPath, { strokeDasharray: mainLength, strokeDashoffset: mainLength });

        // Draw main and shadow vine in sync with section scroll progress
        const vineTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 30%',
                end: 'bottom 90%',
                scrub: 1.5
            }
        });

        vineTimeline.to(mainPath, { strokeDashoffset: 0, ease: 'none' }, 0);
        vineTimeline.to(shadowPath, { strokeDashoffset: 0, ease: 'none' }, 0.02);

        // Branch paths sprouting dynamically at matching scroll offsets
        const branch1 = document.querySelector('.story-branch-1');
        const branch2 = document.querySelector('.story-branch-2');
        const branch3 = document.querySelector('.story-branch-3');

        if (branch1) {
            const len = branch1.getTotalLength();
            gsap.set(branch1, { strokeDasharray: len, strokeDashoffset: len });
            vineTimeline.to(branch1, { strokeDashoffset: 0, duration: 0.25, ease: 'power1.out' }, 0.12);
        }
        if (branch2) {
            const len = branch2.getTotalLength();
            gsap.set(branch2, { strokeDasharray: len, strokeDashoffset: len });
            vineTimeline.to(branch2, { strokeDashoffset: 0, duration: 0.25, ease: 'power1.out' }, 0.48);
        }
        if (branch3) {
            const len = branch3.getTotalLength();
            gsap.set(branch3, { strokeDasharray: len, strokeDashoffset: len });
            vineTimeline.to(branch3, { strokeDashoffset: 0, duration: 0.25, ease: 'power1.out' }, 0.82);
        }
    }
};

// 4. Global Mute Button Setup
const initMuteToggle = () => {
    const muteBtn = document.querySelector('.story-mute-btn');
    const muteText = document.querySelector('.story-mute-text');

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            isMutedGlobal = !isMutedGlobal;
            
            // Apply new mute state to current video
            const currentVideo = document.querySelector(`.story-video-wrapper[data-video-index="${activeVideoIndex}"] video`);
            if (currentVideo) {
                currentVideo.muted = isMutedGlobal;
            }

            // Update text label
            if (muteText) {
                muteText.textContent = isMutedGlobal ? "Unmute" : "Mute";
            }
        });
    }
};

// 5. Ambient Floating Leaf Particles near video frame
const initAmbientParticles = () => {
    const particles = document.querySelectorAll('.story-frame-particle');
    particles.forEach((p, i) => {
        gsap.to(p, {
            y: gsap.utils.random(-15, 15),
            x: gsap.utils.random(-8, 8),
            rotation: gsap.utils.random(-20, 20),
            duration: gsap.utils.random(3.5, 5.5),
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: i * 0.7
        });
    });
};

// 6. Bootstrap everything cleanly
const initStorySection = () => {
    setupVideoStack();
    initStoryTriggers();
    initWindingVine();
    initMuteToggle();
    initAmbientParticles();
    
    // Bind magnetic cursor hover to mute btn
    if (window.setupMagnetics) {
        window.setupMagnetics();
    }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initStorySection();
} else {
    window.addEventListener('load', initStorySection);
}
