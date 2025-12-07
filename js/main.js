// main.js
document.addEventListener('DOMContentLoaded', function () {
    // --- Menu / mobile overlay (aiemmin annettu logiikka) ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const firstLink = mobileMenu.querySelector('a');
        function openMenu() {
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.removeAttribute('hidden');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (firstLink) firstLink.focus();
        }
        function closeMenu() {
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('hidden', '');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            menuToggle.focus();
        }
        menuToggle.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            if (expanded) closeMenu(); else openMenu();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu && mobileMenu.getAttribute('aria-hidden') === 'false') closeMenu();
        });
        mobileMenu.addEventListener('click', function (e) { if (e.target === mobileMenu) closeMenu(); });
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
    }

    // --- Language switch mapping (root-relative paths) ---
    const langMap = {
        // Finnish -> English
        "/index.html": "/en/index.html",
        "/fi/palvelut.html": "/en/services.html",
        "/fi/minusta.html": "/en/about.html",
        "/fi/referenssit.html": "/en/case-studies.html",
        "/fi/yhteys.html": "/en/contact.html",
        "/fi/faq.html": "/en/faq.html",

        // English -> Finnish
        "/en/index.html": "/index.html",
        "/en/services.html": "/fi/palvelut.html",
        "/en/about.html": "/fi/minusta.html",
        "/en/case-studies.html": "/fi/referenssit.html",
        "/en/contact.html": "/fi/yhteys.html",
        "/en/faq.html": "/fi/faq.html"
    };

    function normalizePath(path) {
        if (!path || path === "/") return "/index.html";
        const p = path.split("?")[0].split("#")[0];
        if (p.endsWith("/")) return p + "index.html";
        return p;
    }

    const currentPath = normalizePath(window.location.pathname);
    const btnFi = document.getElementById('lang-fi');
    const btnEn = document.getElementById('lang-en');

    if (btnFi) {
        btnFi.addEventListener('click', function () {
            // Jos nykyinen on englanti, ohjaa suomen vastaavaan; muuten ohjaa juureen suomeksi
            const target = langMap[currentPath] || "/index.html";
            window.location.href = target;
        });
    }

    if (btnEn) {
        btnEn.addEventListener('click', function () {
            const target = langMap[currentPath] || "/en/index.html";
            window.location.href = target;
        });
    }

    // Korostus aktiiviselle kielelle
    function highlightActive() {
        const isEn = currentPath.startsWith("/en/");
        if (btnEn) btnEn.classList.toggle("active-lang", isEn);
        if (btnFi) btnFi.classList.toggle("active-lang", !isEn);
    }
    highlightActive();

    // Highlight current page in navigation
    function highlightCurrentPage() {
        const navLinks = document.querySelectorAll('.main-nav a, .mobile-menu a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && normalizePath(href) === currentPath) {
                link.setAttribute('data-current', 'true');
            } else {
                link.removeAttribute('data-current');
            }
        });
    }
    highlightCurrentPage();

    // Simple form validation with error messages
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
        
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
            });
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });

        // Remove error class on input
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('invalid');
            });
        });
    }
});
