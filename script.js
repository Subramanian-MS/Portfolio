/* ============================================
   Portfolio — Interactive Scripts
   ============================================ */

(function () {
    'use strict';

    // ──── Scroll Progress ────
    const progressBar = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');

    function updateScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';

        // Navbar background
        navbar.classList.toggle('scrolled', scrollTop > 60);
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    // ──── Mobile Nav Toggle ────
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ──── Scroll Reveal ────
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger siblings
                    const delay = i * 100;
                    setTimeout(() => entry.target.classList.add('visible'), delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));

    // ──── Typing Effect (Hero Subtitle) ────
    const heroTitle = document.getElementById('heroTitle');
    const roles = [
        'Application Support Analyst',
        'Microsoft Dynamics 365',
        'Power BI Developer',
        'SQL & Data Analytics'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = roles[roleIndex];
        if (isDeleting) {
            heroTitle.textContent = current.substring(0, charIndex--);
            if (charIndex < 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 35);
        } else {
            heroTitle.textContent = current.substring(0, charIndex++);
            if (charIndex > current.length) {
                isDeleting = true;
                setTimeout(type, 1800);
                return;
            }
            setTimeout(type, 70);
        }
    }
    setTimeout(type, 1200);

    // ──── Smooth Scroll for anchor links ────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
