// main.js
document.addEventListener('DOMContentLoaded', function () {
    // --- Menu / mobile overlay ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const firstLink = mobileMenu.querySelector('a');

        function openMenu() {
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.removeAttribute('hidden');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Focus the active link if present, otherwise focus the first link
            const activeLink = mobileMenu.querySelector('a[data-current="true"]');
            const toFocus = activeLink || firstLink;
            if (toFocus) toFocus.focus();
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
            if (e.key === 'Escape' && mobileMenu && mobileMenu.getAttribute('aria-hidden') === 'false') {
                closeMenu();
            }
        });

        mobileMenu.addEventListener('click', function (e) {
            if (e.target === mobileMenu) closeMenu();
        });

        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
    }

    // --- Language switch mapping (root-relative paths) ---
    const langMap = {
        "/index.html": "/en/index.html",
        "/fi/palvelut.html": "/en/services.html",
        "/fi/minusta.html": "/en/about.html",
        "/fi/referenssit.html": "/en/case-studies.html",
        "/fi/yhteys.html": "/en/contact.html",
        "/fi/faq.html": "/en/faq.html",
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

    function highlightActive() {
        const isEn = currentPath.startsWith("/en/");
        if (btnEn) btnEn.classList.toggle("active-lang", isEn);
        if (btnFi) btnFi.classList.toggle("active-lang", !isEn);
    }
    highlightActive();

    // Robust highlightCurrentPage with language-aware filename fallback
    function highlightCurrentPage() {
        const navLinks = document.querySelectorAll('.main-nav a, .mobile-menu a');
        const current = normalizePath(window.location.pathname);

        // helper: top-level segment (e.g., "/fi", "/en", or "/" for root)
        function topSegment(path) {
            const parts = path.split('/').filter(Boolean); // removes empty
            return parts.length ? `/${parts[0]}` : '/';
        }

        const currentTop = topSegment(current);

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) {
                link.removeAttribute('data-current');
                return;
            }

            let linkPath;
            try {
                linkPath = normalizePath(new URL(href, location.origin).pathname);
            } catch (err) {
                linkPath = normalizePath(href);
            }

            // Exact match wins
            if (linkPath === current) {
                link.setAttribute('data-current', 'true');
                return;
            }

            // Language-aware filename fallback:
            // Only match by filename if both paths share the same top-level segment
            const linkTop = topSegment(linkPath);
            const currentFile = current.split('/').pop();
            const linkFile = linkPath.split('/').pop();

            if (currentFile && linkFile && currentFile === linkFile) {
                // allow fallback only when both are root or both share same top-level segment
                const bothRoot = (currentTop === '/' && linkTop === '/');
                if (bothRoot || currentTop === linkTop) {
                    link.setAttribute('data-current', 'true');
                    return;
                }
            }

            // No match
            link.removeAttribute('data-current');
        });
    }
    highlightCurrentPage();

    // Simple form validation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');

        contactForm.addEventListener('submit', function (e) {
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

        inputs.forEach(input => {
            input.addEventListener('input', function () {
                this.classList.remove('invalid');
            });
        });
    }
});
