// ========== CONTACT & CTA — Sourcing Form, Tags & Sprout Success ==========

const initContactSection = () => {
    const section = document.querySelector('.contact-section');
    if (!section) return;

    const form = document.getElementById('contact-form');
    const tags = document.querySelectorAll('.inquiry-tag');
    const msgInput = document.getElementById('form-msg');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const orgInput = document.getElementById('form-org');

    // Message templates corresponding to each tag
    const messageTemplates = {
        general: "Hi TEL team, I would like to learn more about your recycled polymer capacities, product ranges, and certifications.",
        sourcing: "Hi TEL Sourcing Hub, we are looking to procure post-consumer HDPE / PP flakes for our packaging lines. Please share custom specifications, testing logs, and quote guidelines.",
        export: "Hi TEL Export Hub, we are interested in establishing a green supply chain channel for molded eco-utilities and circular wares in our region.",
        careers: "Hi TEL Careers, I am inspired by your circular design philosophy and would love to connect about opportunities in the engineering and material science labs."
    };

    // Set default initial template value
    if (msgInput) {
        msgInput.value = messageTemplates.general;
    }

    // 1. Tag deck category selector
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            tags.forEach(t => t.classList.remove('active'));
            // Add active to current tag
            tag.classList.add('active');

            // Pre-populate message text area
            const category = tag.getAttribute('data-inquiry');
            const templateText = messageTemplates[category];
            if (templateText && msgInput) {
                // Animate textarea text replacement smoothly
                gsap.to(msgInput, {
                    opacity: 0,
                    y: 5,
                    duration: 0.15,
                    onComplete: () => {
                        msgInput.value = templateText;
                        gsap.to(msgInput, { opacity: 1, y: 0, duration: 0.25 });
                        msgInput.focus();
                    }
                });
            }
        });
    });

    // 2. Form submission sprout visualization
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check
            let isFormValid = true;
            const requiredFields = [nameInput, emailInput, msgInput];

            requiredFields.forEach(field => {
                if (field && !field.value.trim()) {
                    isFormValid = false;
                    // Trigger shake animation on invalid field wrapper
                    gsap.fromTo(field.parentElement, 
                        { x: -6 }, 
                        { x: 0, duration: 0.4, ease: 'rough({template: none, strength: 8, points: 10, taper: none, randomize: true})' }
                    );
                }
            });

            if (!isFormValid) return;

            // Fade out form elements
            gsap.to(form, {
                opacity: 0,
                y: -10,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    form.style.display = 'none';
                    triggerSproutAnimation();
                }
            });
        });
    }

    // GSAP Sprout Success state
    const triggerSproutAnimation = () => {
        const successWrapper = document.querySelector('.success-sprout-wrapper');
        if (!successWrapper) return;

        successWrapper.classList.add('active');

        // Stem path dash offset draw
        gsap.fromTo('.sprout-stem', 
            { strokeDashoffset: 200 }, 
            { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' }
        );

        // Leaves scale reveals (elastic spring effect)
        gsap.fromTo('.sprout-leaf', 
            { scale: 0 }, 
            { 
                scale: 1, 
                stagger: 0.18, 
                duration: 0.9, 
                ease: 'elastic.out(1.15, 0.45)', 
                delay: 0.7 
            }
        );

        // Success messaging text slide up
        gsap.to('.success-title', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'back.out(1.5)',
            delay: 1.4
        });

        gsap.to('.success-body', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 1.6
        });
    };

    // 3. Scroll entrance reveal animations
    gsap.set('.contact-reveal', { y: 30, opacity: 0 });

    gsap.fromTo('.contact-reveal', 
        { y: 35, opacity: 0 }, 
        {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: 'back.out(1.15)',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
};

// Initialize on load
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initContactSection();
} else {
    window.addEventListener('load', initContactSection);
}
