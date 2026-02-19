document.addEventListener('DOMContentLoaded', () => {

    /* === SCROLL REVEAL ANIMATION === */
    const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .reveal-text');

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed if you don't want it to re-animate
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealOnScroll.observe(el));

    /* === HERO TEXT SPLIT REVEAL === */
    // Add staggered animation to hero text if needed manually, 
    // but CSS transition on class 'active' handles most.

    setTimeout(() => {
        const heroText = document.querySelector('.hero h1');
        if (heroText) heroText.style.opacity = '1';
        // Add a class for specific initial load animation
        document.body.classList.remove('loading');
    }, 500);


    /* === MOBILE MENU TOGGLE === */
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('open');
            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
            }
        });
    }

    /* === MOUSE TRACKING GLOW EFFECT ON CARDS === */
    const cards = document.querySelectorAll('.bento-card, .btn-primary');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS variables for mouse position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Optional: localized radial gradient via JS if not using ::before mask
            // card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset or fade out effect
            // card.style.background = ''; 
        });
    });

    /* === PARALLAX FOR DECORATIVE BLOBS === */
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const blob1 = document.querySelector('.blob-1');
        const blob2 = document.querySelector('.blob-2');

        if (blob1) blob1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        if (blob2) blob2.style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
    });

    /* === QUOTE MODAL LOGIC === */
    const modal = document.getElementById('quoteModal');
    const modalNameInput = document.getElementById('clientName');
    const modalDescInput = document.getElementById('projectDesc');
    const modalBudgetInput = document.getElementById('clientBudget');
    const closeModalBtn = document.querySelector('.close-modal');
    const quoteForm = document.getElementById('quoteForm');

    // Make function globally available (or attach to window) so inline onclick works, 
    // or better yet, use event delegation or querySelectors.
    // Putting it on window for simplicity with existing button structure if needed, 
    // but preferred approach is adding listeners to buttons.

    window.openQuoteModal = function (serviceName, defaultBudget) {
        if (!modal) return;
        modal.classList.add('active'); // Use CSS class 'active' to show
        // Reset form
        if (quoteForm) quoteForm.reset();

        // Mark active
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.classList.add('active');

        // Set Budget if provided
        if (defaultBudget && modalBudgetInput) {
            modalBudgetInput.value = defaultBudget;
        }

        // Store service
        if (modal) modal.dataset.service = serviceName || 'Proyecto General';
    };

    function closeModal() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close click outside
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    // Form Submission
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = modalNameInput.value.trim();
            const desc = modalDescInput.value.trim();
            const budget = modalBudgetInput.value.trim();
            const service = modal ? modal.dataset.service : 'General';

            if (!name || !desc) return; // Basic validation

            // Construct WhatsApp Message
            let message = `Hola, soy *${name}*.\n`;
            message += `Me interesa cotizar: *${service}*.\n\n`;
            message += `*Detalles del proyecto:* \n${desc}\n`;
            if (budget) message += `\n*Presupuesto Estimado:* ${budget}`;

            const phoneNumber = '51973282798'; // Updated number
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            // Open WhatsApp
            window.open(url, '_blank');

            // Close modal
            closeModal();
        });
    }

    /* === VIDEO MODAL LOGIC === */
    const videoModal = document.getElementById('videoModal');
    const youtubeIframe = document.getElementById('youtubeIframe');

    window.openVideoModal = function (videoId) {
        if (!videoModal || !youtubeIframe) return;
        videoModal.classList.add('active');
        // Usamos youtube-nocookie y simplificamos parámetros para evitar bloqueos
        youtubeIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
    };

    window.closeVideoModal = function () {
        if (!videoModal || !youtubeIframe) return;
        videoModal.classList.remove('active');
        // Stop video
        youtubeIframe.src = '';
    };

    // Close on overlay click
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

});
