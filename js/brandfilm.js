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
    if(brandVideo.muted) {
        brandVideo.muted = false;
        muteText.textContent = "Mute";
    } else {
        brandVideo.muted = true;
        muteText.textContent = "Unmute";
    }
});

skipBtn.addEventListener('click', endBrandFilm);
brandVideo.addEventListener('ended', endBrandFilm);

function endBrandFilm() {
    if(filmEnded) return;
    filmEnded = true;
    
    gsap.to([skipBtn, muteBtn], { opacity: 0, duration: 0.5 });

    const endTl = gsap.timeline({
        onComplete: () => {
            brandfilmSection.style.display = 'none';
            scrollRail.classList.add('visible');
            lenis.start();
            
            // Layout is finalized, ensure triggers are perfectly calculated
            ScrollTrigger.refresh();
        }
    });

    // Scale down video container for the cinematic pull-away effect
    endTl.to('.video-container', {
        scale: 0.85,
        duration: 1.5,
        ease: 'power3.inOut'
    }, 0);

    // Fade out the entire brand film section
    endTl.to(brandfilmSection, {
        opacity: 0,
        duration: 1.5,
        ease: 'power3.inOut'
    }, 0);

    // Fade in the hero section underneath it
    endTl.to(heroSection, {
        opacity: 1,
        duration: 1.5,
        ease: 'power3.inOut'
    }, 0);

    // Trigger hero content reveal slightly before the video fully fades out
    // This makes the transition feel perfectly integrated
    endTl.call(() => {
        if (window.startHeroAnimation) window.startHeroAnimation();
    }, null, 0.6);
}
