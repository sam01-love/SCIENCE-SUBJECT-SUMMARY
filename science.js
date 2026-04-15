// ── Subject data for sidebar ──
const subjects = {
    chem: [
        { id: 'chem-atomic', label: 'Atomic Structure' },
        { id: 'chem-periodic', label: 'Periodic Table' },
        { id: 'chem-bonding', label: 'Chemical Bonding' },
        { id: 'chem-acids', label: 'Acids, Bases & pH' },
        { id: 'chem-organic', label: 'Organic Chemistry' },
    ],
    bio: [
        { id: 'bio-cell', label: 'Cell Biology' },
        { id: 'bio-genetics', label: 'Genetics & Inheritance' },
        { id: 'bio-photosynthesis', label: 'Photosynthesis' },
        { id: 'bio-human', label: 'Human Body Systems' },
        { id: 'bio-evolution', label: 'Evolution' },
    ],
    phys: [
        { id: 'phys-mechanics', label: 'Mechanics & Motion' },
        { id: 'phys-electricity', label: 'Electricity & Circuits' },
        { id: 'phys-waves', label: 'Waves & Sound' },
        { id: 'phys-nuclear', label: 'Radioactivity & Nuclear' },
        { id: 'phys-thermo', label: 'Thermal Physics' },
    ]
};

const labels = { chem: 'Chemistry', bio: 'Biology', phys: 'Physics' };
let currentSubject = 'chem';

function buildSidebar(sub) {
    const sb = document.getElementById('sidebar');
    sb.innerHTML = '';
    Object.keys(subjects).forEach(key => {
        const secEl = document.createElement('div');
        secEl.className = 'sidebar-section';
        const title = document.createElement('span');
        title.className = 'sidebar-title';
        title.textContent = labels[key];
        secEl.appendChild(title);
        subjects[key].forEach(item => {
            const el = document.createElement('div');
            el.className = `sidebar-item ${key}-link`;
            el.id = 'nav-' + item.id;
            el.innerHTML = `<span class="si-dot"></span>${item.label}`;
            el.onclick = () => {
                switchSubject(key);
                setTimeout(() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            };
            secEl.appendChild(el);
        });
        sb.appendChild(secEl);
    });
}

function switchSubject(sub) {
    currentSubject = sub;
    document.querySelectorAll('.subject-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(sub + '-panel').classList.add('active');
    document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
    document.querySelector(`.stab.${sub}`).classList.add('active');
    // Update hero glow
    const root = document.documentElement;
    const colors = { chem: '52,211,153', bio: '251,146,60', phys: '96,165,250' };
    document.querySelector('.hero-bg').style.background = `radial-gradient(ellipse 70% 80% at 50% 0%, rgba(${colors[sub]},0.08) 0%, transparent 60%)`;
    buildSidebar(sub);
    updateActiveSidebarLink();
}

function toggle(header) {
    const card = header.closest('.topic-card');
    card.classList.toggle('open');
}

function revealAns(btn) {
    const ans = btn.nextElementSibling;
    const isOpen = ans.style.display === 'block';
    ans.style.display = isOpen ? 'none' : 'block';
    btn.textContent = isOpen ? '▷ Show Answer' : '▽ Hide Answer';
}

// ── Scroll progress bar ──
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('prog').style.width = (scrolled / total * 100) + '%';
    document.getElementById('top-btn').classList.toggle('show', scrolled > 400);
    updateActiveSidebarLink();
});

function updateActiveSidebarLink() {
    const cards = document.querySelectorAll(`#${currentSubject}-panel .topic-card`);
    let activeId = null;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.4) activeId = card.id;
    });
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.toggle('active-link', el.id === 'nav-' + activeId);
    });
}

// ── Open first card of each panel by default ──
document.querySelectorAll('.subject-panel').forEach(panel => {
    const first = panel.querySelector('.topic-card');
    if (first) first.classList.add('open');
});

// ── Init ──
buildSidebar('chem');

// ── Animate cards on scroll ──
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.topic-card').forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(24px)';
    c.style.transition = `opacity .5s ease ${i * 0.05}s, transform .5s ease ${i * 0.05}s, border-color .3s`;
    io.observe(c);
});