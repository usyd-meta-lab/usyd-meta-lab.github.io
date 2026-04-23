// ============================================
// USYD Meta Lab — Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollReveal();
    initStatCounters();
    initSmoothScroll();
    initTaskCarousel();
    initNewsCarousel();
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

// --- Task Gallery Carousel ---
function initTaskCarousel() {
    const carousel = document.querySelector('[data-task-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('.task-carousel-track');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dotsContainer = carousel.querySelector('[data-carousel-dots]');
    const tasks = [
        {
            slug: 'meta-dprime',
            title: "Meta-d' Perceptual Task",
            domain: 'Metacognition',
            ability: 'Metacognitive Efficiency',
            color: '#4A7C9E',
            preview: 'meta-dprime'
        },
        {
            slug: 'matrix-reasoning',
            title: 'Matrix Reasoning',
            domain: 'Reasoning',
            ability: 'Fluid Intelligence',
            color: '#7B6CA8',
            preview: 'matrix'
        },
        {
            slug: 'category-learning',
            title: 'Beetle Classification',
            domain: 'Memory & Learning',
            ability: 'Rule Discovery',
            color: '#5A8C6A',
            preview: 'beetle'
        },
        {
            slug: 'meta-emotion',
            title: 'Meta-Emotion Task',
            domain: 'Emotion',
            ability: 'Emotional Clarity',
            color: '#B85C5C',
            preview: 'meta-emotion'
        },
        {
            slug: 'beer-game',
            title: 'Beer Distribution Game',
            domain: 'Reasoning',
            ability: 'Systems Thinking',
            color: '#7B6CA8',
            preview: 'beer'
        },
        {
            slug: 'latin-square',
            title: 'Latin Square Task',
            domain: 'Executive Function',
            ability: 'Working Memory / Rule Learning',
            color: '#C4874A',
            preview: 'latin'
        },
        {
            slug: 'emotional-intelligence',
            title: 'Emotional Intelligence',
            domain: 'Emotion',
            ability: 'Emotional Intelligence',
            color: '#B85C5C',
            preview: 'emotion-intel'
        },
        {
            slug: 'complex-problem-solving',
            title: 'Complex Problem Solving',
            domain: 'Reasoning',
            ability: 'Complex Problem Solving',
            color: '#7B6CA8',
            preview: 'complex'
        },
        {
            slug: 'tower-of-hanoi',
            title: 'Tower of Hanoi',
            domain: 'Executive Function',
            ability: 'Planning & Problem Solving',
            color: '#C4874A',
            preview: 'hanoi'
        },
        {
            slug: 'relational-monitoring',
            title: 'Relational Monitoring',
            domain: 'Metacognition',
            ability: 'Metacognitive Monitoring',
            color: '#4A7C9E',
            preview: 'relational'
        },
        {
            slug: 'analogical-reasoning',
            title: 'Analogical Reasoning',
            domain: 'Reasoning',
            ability: 'Relational Reasoning',
            color: '#7B6CA8',
            preview: 'analogical'
        },
        {
            slug: 'task-switching',
            title: 'Task Switching',
            domain: 'Executive Function',
            ability: 'Cognitive Flexibility',
            color: '#C4874A',
            preview: 'switching'
        }
    ];
    let activeIndex = 0;
    let visibleCount = getVisibleCount();

    track.innerHTML = tasks.map(task => createTaskTile(task)).join('');
    dotsContainer.innerHTML = '';

    const slides = Array.from(track.querySelectorAll('[data-slide]'));
    initMetaDprimeCanvases(track);

    const dots = tasks.map((task, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'task-carousel-dot';
        dot.setAttribute('aria-label', `Show ${task.title}`);
        dot.addEventListener('click', () => setActive(index));
        dotsContainer.appendChild(dot);
        return dot;
    });

    const setActive = (index) => {
        activeIndex = (index + tasks.length) % tasks.length;
        const maxIndex = Math.max(0, tasks.length - visibleCount);
        const transformIndex = Math.min(activeIndex, maxIndex);
        track.style.transform = `translateX(-${transformIndex * (100 / visibleCount)}%)`;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', slideIndex >= transformIndex && slideIndex < transformIndex + visibleCount ? 'false' : 'true');
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    prevBtn.addEventListener('click', () => setActive(activeIndex - 1));
    nextBtn.addEventListener('click', () => setActive(activeIndex + 1));

    carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') setActive(activeIndex - 1);
        if (event.key === 'ArrowRight') setActive(activeIndex + 1);
    });

    let touchStartX = null;
    carousel.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
        if (touchStartX === null) return;
        const diff = touchStartX - event.changedTouches[0].clientX;
        if (Math.abs(diff) > 48) {
            setActive(activeIndex + (diff > 0 ? 1 : -1));
        }
        touchStartX = null;
    }, { passive: true });

    window.addEventListener('resize', () => {
        visibleCount = getVisibleCount();
        setActive(activeIndex);
    });

    setActive(0);
}

function getVisibleCount() {
    if (window.matchMedia('(max-width: 700px)').matches) return 1;
    if (window.matchMedia('(max-width: 1100px)').matches) return 2;
    return 3;
}

function createTaskTile(task) {
    return `
        <a class="task-slide" data-slide href="/task-gallery/tasks/${task.slug}/" style="--task-color: ${task.color}">
            <div class="task-preview-shell">
                <div class="task-preview-visual task-preview-${task.preview}">
                    ${getTaskPreviewMarkup(task.preview)}
                </div>
                <div class="task-preview-play" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
                        <polygon points="6,3 18,10 6,17"></polygon>
                    </svg>
                </div>
            </div>
            <div class="task-slide-info">
                <span class="task-domain">${task.domain}</span>
                <h3>${task.title}</h3>
                <p>${task.ability}</p>
            </div>
        </a>
    `;
}

function getTaskPreviewMarkup(type) {
    const gridItems = [
        ['circle', '#7B6CA8'], ['triangle', '#7B6CA8'], ['square', '#7B6CA8'],
        ['circle', '#7B6CA8'], ['triangle', '#7B6CA8'], ['square', '#7B6CA8'],
        ['circle', '#7B6CA8'], ['triangle', '#7B6CA8'], ['triangle faint', '#7B6CA8']
    ];
    const latinItems = ['red-dot', 'blue-square', 'green-triangle', 'gold-diamond', 'green-triangle', 'gold-diamond', 'red-dot', 'blue-square', 'blue-square', 'red-dot', 'gold-diamond', 'green-triangle', 'gold-diamond', 'green-triangle', 'blue-square', 'gold-diamond faint'];

    const shapeSvg = (shape, color) => {
        if (shape.includes('circle')) return `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="6.5" fill="${color}"/></svg>`;
        if (shape.includes('triangle')) return `<svg viewBox="0 0 20 20"><polygon points="10,3 3,17 17,17" fill="${color}"/></svg>`;
        return `<svg viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" fill="${color}"/></svg>`;
    };

    if (type === 'meta-dprime') {
        return `<div class="preview-stack"><canvas class="meta-dprime-canvas" width="170" height="84"></canvas><div class="confidence-bars"><span>1</span><span>2</span><span>3</span><span>4</span></div></div>`;
    }
    if (type === 'matrix') {
        return `<div class="preview-grid matrix-grid">${gridItems.map(([shape, color]) => `<div class="${shape.includes('faint') ? 'is-faint' : ''}">${shapeSvg(shape, color)}</div>`).join('')}</div>`;
    }
    if (type === 'beetle') {
        return `<div class="preview-stack"><svg class="beetle-svg" viewBox="0 0 70 80"><ellipse cx="35" cy="51" rx="16" ry="21" fill="#5A8C6A" opacity=".72"/><circle cx="35" cy="24" r="9" fill="#5A8C6A" opacity=".86"/><line class="antenna-left" x1="30" y1="17" x2="16" y2="0" stroke="#5A8C6A" stroke-width="2"/><line class="antenna-right" x1="40" y1="17" x2="54" y2="0" stroke="#5A8C6A" stroke-width="2"/><line x1="20" y1="38" x2="8" y2="35" stroke="#5A8C6A"/><line x1="50" y1="38" x2="62" y2="35" stroke="#5A8C6A"/><line x1="20" y1="48" x2="8" y2="46" stroke="#5A8C6A"/><line x1="50" y1="48" x2="62" y2="46" stroke="#5A8C6A"/><line x1="20" y1="58" x2="8" y2="61" stroke="#5A8C6A"/><line x1="50" y1="58" x2="62" y2="61" stroke="#5A8C6A"/></svg><span class="preview-pill">Species B</span></div>`;
    }
    if (type === 'meta-emotion') {
        return `<div class="preview-stack"><div class="emotion-image"></div><svg class="emotion-grid" viewBox="0 0 70 70"><rect width="70" height="70" fill="#fafaf8" stroke="#E8E6E0" rx="2"/><line x1="35" y1="0" x2="35" y2="70" stroke="#E8E6E0"/><line x1="0" y1="35" x2="70" y2="35" stroke="#E8E6E0"/><circle class="emotion-dot" cx="22" cy="54" r="4" fill="#B85C5C"/><text x="4" y="9" font-size="5" fill="#6B6B65">excited</text><text x="4" y="66" font-size="5" fill="#6B6B65">calm</text></svg></div>`;
    }
    if (type === 'beer') {
        return `<svg class="beer-svg" viewBox="0 0 170 76"><line x1="14" y1="36" x2="156" y2="36" stroke="#E8E6E0" stroke-width="4"/>${['Factory', 'Dist.', 'Whole.', 'Retail'].map((label, i) => `<g><rect x="${i * 42 + 8}" y="24" width="25" height="25" rx="4" fill="#7B6CA830" stroke="#7B6CA8"/><text x="${i * 42 + 20.5}" y="68" text-anchor="middle" font-size="6" fill="#6B6B65">${label}</text></g>`).join('')}<rect class="crate crate-a" x="42" y="32" width="8" height="10" rx="1" fill="#7B6CA8"/><rect class="crate crate-b" x="84" y="32" width="8" height="10" rx="1" fill="#7B6CA8"/><rect class="crate crate-c" x="126" y="32" width="8" height="10" rx="1" fill="#7B6CA8"/></svg>`;
    }
    if (type === 'latin') {
        return `<div class="preview-grid latin-grid">${latinItems.map(item => `<div><span class="${item}"></span></div>`).join('')}</div>`;
    }
    if (type === 'emotion-intel') {
        return `<div class="preview-stack"><div class="face-preview">:)</div><div class="emotion-bars">${['Happy', 'Sad', 'Fear', 'Anger', 'Surpr.'].map((label, i) => `<span style="--bar:${i + 2}"><b></b><small>${label}</small></span>`).join('')}</div></div>`;
    }
    if (type === 'complex') {
        return `<div class="problem-bars"><span></span><span></span><span></span></div>`;
    }
    if (type === 'hanoi') {
        return `<svg class="hanoi-svg" viewBox="0 0 150 76"><line x1="28" y1="18" x2="28" y2="64" stroke="#E8E6E0" stroke-width="3"/><line x1="75" y1="18" x2="75" y2="64" stroke="#E8E6E0" stroke-width="3"/><line x1="122" y1="18" x2="122" y2="64" stroke="#E8E6E0" stroke-width="3"/><line x1="10" y1="64" x2="140" y2="64" stroke="#E8E6E0" stroke-width="3"/><rect class="disc disc-large" width="34" height="8" rx="3" fill="#B87333"/><rect class="disc disc-mid" width="26" height="8" rx="3" fill="#C4874A"/><rect class="disc disc-small" width="18" height="8" rx="3" fill="#C9A84C"/></svg>`;
    }
    if (type === 'relational') {
        return `<div class="preview-stack relational-preview"><div>A &gt; B<br>B &gt; C<br><strong>Who is smallest?</strong></div><div class="confidence-bars"><span>1</span><span>2</span><span>3</span><span>4</span></div></div>`;
    }
    if (type === 'analogical') {
        return `<div class="preview-grid analogical-grid"><div>${shapeSvg('circle', '#7B6CA8')}</div><div><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#7B6CA8"/></svg></div><div>${shapeSvg('square', '#7B6CA8')}</div><div class="missing">${shapeSvg('square', '#7B6CA8')}</div></div>`;
    }
    return `<div class="preview-stack"><div class="switch-card"><span>7</span></div><strong class="switch-label">Odd / Even</strong></div>`;
}

function initMetaDprimeCanvases(root) {
    const canvases = root.querySelectorAll('.meta-dprime-canvas');
    const draw = () => {
        canvases.forEach((canvas) => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const phase = Math.floor(Date.now() / 900) % 4;
            const centerX = phase < 2 ? 52 : 118;
            const count = phase < 2 ? 30 : 38;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 28;
                ctx.beginPath();
                ctx.arc(centerX + Math.cos(angle) * radius, 42 + Math.sin(angle) * radius, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#4A7C9E';
                ctx.fill();
            }
        });
    };
    draw();
    window.setInterval(draw, 900);
}

// --- News Carousel ---
function initNewsCarousel() {
    const carousel = document.querySelector('[data-news-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('.news-carousel-track');
    const slides = Array.from(carousel.querySelectorAll('[data-news-slide]'));
    const prevBtn = carousel.querySelector('[data-news-prev]');
    const nextBtn = carousel.querySelector('[data-news-next]');
    const dotsContainer = carousel.querySelector('[data-news-dots]');
    let activeIndex = 0;

    const dots = slides.map((slide, index) => {
        const dot = document.createElement('button');
        const title = slide.querySelector('h3')?.textContent || `News story ${index + 1}`;
        dot.type = 'button';
        dot.className = 'news-carousel-dot';
        dot.setAttribute('aria-label', `Show ${title}`);
        dot.addEventListener('click', () => setActive(index));
        dotsContainer.appendChild(dot);
        return dot;
    });

    const setActive = (index) => {
        activeIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeIndex * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    prevBtn.addEventListener('click', () => setActive(activeIndex - 1));
    nextBtn.addEventListener('click', () => setActive(activeIndex + 1));

    carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') setActive(activeIndex - 1);
        if (event.key === 'ArrowRight') setActive(activeIndex + 1);
    });

    let touchStartX = null;
    carousel.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
        if (touchStartX === null) return;
        const diff = touchStartX - event.changedTouches[0].clientX;
        if (Math.abs(diff) > 48) {
            setActive(activeIndex + (diff > 0 ? 1 : -1));
        }
        touchStartX = null;
    }, { passive: true });

    setActive(0);
}

// --- Publications from the same snapshot used by publications.html ---
async function loadPublications() {
    const container = document.getElementById('publicationsList');
    if (!container) return;

    container.innerHTML = '';

    try {
        const publications = await fetchRecentPublications();
        if (!publications.length) {
            container.innerHTML = '<div class="publication-loading">No publications available.</div>';
            return;
        }

        publications.forEach((pub, index) => {
            container.appendChild(createPublicationItem(pub, index));
        });
    } catch (error) {
        console.error('Failed to load homepage publications', error);
        container.innerHTML = '<div class="publication-loading">Unable to load publications at this time.</div>';
    }
}

async function fetchRecentPublications() {
    const snapshotPaths = [
        '../files/publications-orcid-snapshot.json',
        '../files/publications-local.json'
    ];

    for (const path of snapshotPaths) {
        try {
            const response = await fetch(path, { cache: 'no-cache' });
            if (!response.ok) continue;

            const data = await response.json();
            const records = Array.isArray(data) ? data : (data.records || []);
            if (!records.length) continue;

            return records
                .map((record, index) => ({ ...record, sourceIndex: index }))
                .sort((a, b) => {
                    const yearDiff = parsePublicationYear(b.year) - parsePublicationYear(a.year);
                    return yearDiff || a.sourceIndex - b.sourceIndex;
                })
                .slice(0, 10);
        } catch (error) {
            console.warn(`Failed to load publication snapshot at ${path}`, error);
        }
    }

    return [];
}

function createPublicationItem(pub, index) {
    const item = document.createElement('div');
    item.className = 'publication-item';
    item.style.animationDelay = `${index * 0.08}s`;

    const year = document.createElement('span');
    year.className = 'publication-year';
    year.textContent = pub.year || 'No Year';

    const info = document.createElement('div');
    info.className = 'publication-info';

    const title = document.createElement('h4');
    title.textContent = pub.title || 'Untitled';

    const meta = document.createElement('p');
    meta.append(document.createTextNode(pub.authors || 'Unknown authors'));
    if (pub.journal) {
        meta.append(document.createTextNode(' — '));
        const journal = document.createElement('em');
        journal.innerHTML = pub.journal;
        meta.append(journal);
    }

    info.append(title, meta);
    item.append(year, info);

    const doiUrl = getPublicationUrl(pub);
    if (doiUrl) {
        const link = document.createElement('a');
        link.href = doiUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.className = 'publication-link';
        link.textContent = 'View →';
        item.appendChild(link);
    }

    return item;
}

function parsePublicationYear(year) {
    const parsed = parseInt(year, 10);
    return Number.isFinite(parsed) ? parsed : 0;
}

function getPublicationUrl(pub) {
    if (!pub.doi) return '';
    if (/^https?:\/\//i.test(pub.doi)) return pub.doi;
    return `https://doi.org/${pub.doi}`;
}
