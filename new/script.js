// ============================================
// USYD Meta Lab — Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollReveal();
    initStatCounters();
    initSmoothScroll();
    loadPublications();
});

// --- Navigation ---
function initNav() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        nav.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// --- Scroll Reveal (Claura-style staggered) ---
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// --- Animated Number Counters ---
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);

    function update() {
        current += step;
        if (current >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// --- Smooth Scroll ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// --- Publications from ORCID ---
async function loadPublications() {
    const container = document.getElementById('publicationsList');

    // Known publications from the MetaLab site (2025)
    const publications = [
        {
            year: 2025,
            title: "Emotional intelligence and interpersonal relationship quality",
            authors: "Xiao, Y., Double, K. S., & MacCann, C.",
            journal: "Personal Relationships",
            doi: "https://doi.org/10.1177/02654075251399696"
        },
        {
            year: 2025,
            title: "Test preparation and metacognitive sensitivity in educational assessment",
            authors: "Hao, J., Double, K. S., & Birney, D.",
            journal: "Review of Educational Research",
            doi: "https://doi.org/10.3102/00346543251360775"
        },
        {
            year: 2025,
            title: "Rule-based learning and confidence calibration",
            authors: "Choo, H., Double, K. S., & Don, H.",
            journal: "Thinking & Reasoning",
            doi: "https://doi.org/10.1080/13546783.2025.2542252"
        },
        {
            year: 2025,
            title: "Teacher effectiveness assessment and metacognitive beliefs",
            authors: "Don, H., Double, K. S., & Walker, S.",
            journal: "International Journal of Educational Research",
            doi: "https://doi.org/10.1016/j.ijer.2025.102719"
        },
        {
            year: 2025,
            title: "Happiness, well-being, and metacognitive emotion regulation",
            authors: "Double, K. S., Birney, D., & MacCann, C.",
            journal: "Journal of Happiness Studies",
            doi: "https://doi.org/10.1007/s10902-025-00914-3"
        },
        {
            year: 2025,
            title: "Metacognitive sensitivity in memory and cognition",
            authors: "Double, K. S., & Don, H.",
            journal: "Memory & Cognition",
            doi: "https://doi.org/10.3758/s13421-025-01737-6"
        },
        {
            year: 2025,
            title: "Spatial navigation and individual differences in metacognition",
            authors: "Tran, D., Double, K. S., et al.",
            journal: "International Journal of Obesity",
            doi: "https://www.nature.com/articles/s41366-025-01776-8"
        },
        {
            year: 2025,
            title: "Confidence rating methods in behavioral research",
            authors: "Double, K. S.",
            journal: "Behavior Research Methods",
            doi: "https://link.springer.com/article/10.3758/s13428-025-02621-6"
        },
        {
            year: 2025,
            title: "Emotional intelligence and emotion regulation strategies",
            authors: "MacCann, C., Double, K. S., et al.",
            journal: "Emotion",
            doi: "https://doi.org/10.1037/emo0001459"
        }
    ];

    container.innerHTML = '';

    publications.forEach((pub, index) => {
        const item = document.createElement('div');
        item.className = 'publication-item';
        item.style.animationDelay = `${index * 0.08}s`;
        item.innerHTML = `
            <span class="publication-year">${pub.year}</span>
            <div class="publication-info">
                <h4>${pub.title}</h4>
                <p>${pub.authors} &mdash; <em>${pub.journal}</em></p>
            </div>
            <a href="${pub.doi}" target="_blank" rel="noopener" class="publication-link">View &rarr;</a>
        `;
        container.appendChild(item);
    });
}
