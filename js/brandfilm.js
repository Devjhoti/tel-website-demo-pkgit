// Brand Film Logic
const brandVideo = document.getElementById('brand-video');
const skipBtn = document.querySelector('.skip-btn');
const muteBtn = document.querySelector('.mute-btn');
const muteText = document.querySelector('.mute-text');
const brandfilmSection = document.querySelector('.brandfilm-section');
const heroSection = document.querySelector('.hero-section');
const scrollRail = document.querySelector('.scroll-rail');

let filmEnded = false;

window.startBrandFilm = () => {
    // Show UI overlay
    gsap.to([skipBtn, muteBtn], { opacity: 1, duration: 1, delay: 0.5 });

    // Ensure video is at 0 and play
    brandVideo.currentTime = 0;
    const playPromise = brandVideo.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay prevented:', error);
        });
    }
};

// Controls
muteBtn.addEventListener('click', () => {
    if (brandVideo.muted) {
        brandVideo.muted = false;
        muteText.textContent = "Mute";
    } else {
        brandVideo.muted = true;
        muteText.textContent = "Unmute";
    }
});

let isTransitioning = false;

brandVideo.addEventListener('timeupdate', () => {
    // Trigger morph exactly at the 9th second of the video
    if (brandVideo.currentTime >= 9.0 && !isTransitioning) {
        startLogoMorph();
    }
});

skipBtn.addEventListener('click', () => {
    if (!isTransitioning) startLogoMorph();
});

brandVideo.addEventListener('ended', () => {
    if (!isTransitioning) startLogoMorph();
});

function startLogoMorph() {
    isTransitioning = true;

    gsap.to([skipBtn, muteBtn], { opacity: 0, duration: 0.5 });

    const endTl = gsap.timeline({
        onComplete: () => {
            brandfilmSection.style.display = 'none';
            scrollRail.classList.add('visible');
            lenis.start();
            ScrollTrigger.refresh();
        }
    });

    // 1. Prepare the hero logo for the morph
    // Mathematically calculate the exact distance to the absolute center of the screen
    const wrapper = document.querySelector('.hero-logo-wrapper');
    const rect = wrapper.getBoundingClientRect();

    // Default position is affected by flex layout. We find its current center.
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Screen center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Set the logo to perfectly overlap the exact center of the screen
    gsap.set('.hero-logo-wrapper', {
        x: (centerX - startX) - 8, // Nudge 8px left
        y: (centerY - startY) + 8, // Nudge 10px down
        scale: 4.15, // Split between 4.2 (too small) and 4.5 (too big)
        opacity: 1
    });

    // 2. Crossfade from 9s to 10s (duration 1s)
    endTl.to(brandfilmSection, {
        opacity: 0,
        duration: 1.0,
        ease: 'power1.inOut'
    }, 0);

    endTl.to(heroSection, {
        opacity: 1,
        duration: 1.0,
        ease: 'power1.inOut'
    }, 0);

    // 3. Morph: Wait for crossfade to finish (at the 10s mark), then scale down to top
    endTl.to('.hero-logo-wrapper', {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.inOut'
    }, 1.0); // Start precisely after the 1.0s crossfade finishes

    // 4. Trigger the rest of the hero content to fade in as the logo arrives
    endTl.call(() => {
        if (window.startHeroAnimation) window.startHeroAnimation(true); // true = skip logo entrance
    }, null, 1.5); // Start text reveal slightly before logo fully lands
}
