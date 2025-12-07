/* ===========================================================================================
   Tämä tiedosto käsittelee sivuston interaktiot: mobiilivalikon, kielivalinnan,
   aktiivisen sivun korostuksen ja yksinkertaisen lomakevalidoinnin.
   =========================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    /* ======================================
       MOBIILIVALIKKO: avaus / sulku / fokus
       ====================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        const firstLink = mobileMenu.querySelector('a');

        const openMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.removeAttribute('hidden');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Fokusoi aktiivinen linkki tai ensimmäinen linkki
            const activeLink = mobileMenu.querySelector('a[data-current="true"]');
            const toFocus = activeLink || firstLink;
            if (toFocus) toFocus.focus();

            // Aloita fokusin rajoitus (simple focus trap)
            trapFocus(mobileMenu);
        };

        const closeMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('hidden', '');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            menuToggle.focus();

            // Poista mahdollinen fokuskuuntelija
            releaseFocusTrap();
        };

        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            if (expanded) closeMenu();
            else openMenu();
        });

        // Sulje Esc:llä
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
                closeMenu();
            }
        });

        // Sulje klikkaamalla overlayia
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMenu();
        });

        // Sulje valikko kun linkkiä klikataan
        mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => closeMenu()));
    }

    /* ===============================
       KIELIVALINNAT: kartta ja navigointi
       =============================== */
    const langMap = {
        '/index.html': '/en/index.html',
        '/fi/palvelut.html': '/en/services.html',
        '/fi/minusta.html': '/en/about.html',
        '/fi/referenssit.html': '/en/case-studies.html',
        '/fi/yhteys.html': '/en/contact.html',
        '/fi/faq.html': '/en/faq.html',
        '/en/index.html': '/index.html',
        '/en/services.html': '/fi/palvelut.html',
        '/en/about.html': '/fi/minusta.html',
        '/en/case-studies.html': '/fi/referenssit.html',
        '/en/contact.html': '/fi/yhteys.html',
        '/en/faq.html': '/fi/faq.html'
    };

    const normalizePath = (path) => {
        if (!path || path === '/') return '/index.html';
        const p = path.split('?')[0].split('#')[0];
        if (p.endsWith('/')) return p + 'index.html';
        return p;
    };

    const currentPath = normalizePath(window.location.pathname);
    const btnFi = document.getElementById('lang-fi');
    const btnEn = document.getElementById('lang-en');

    if (btnFi) {
        btnFi.addEventListener('click', () => {
            const target = langMap[currentPath] || '/index.html';
            window.location.href = target;
        });
    }

    if (btnEn) {
        btnEn.addEventListener('click', () => {
            const target = langMap[currentPath] || '/en/index.html';
            window.location.href = target;
        });
    }

    /* =============================================================================================
       AKTIIVISEN LINKIN KOROSTUS
       - Yrittää täsmäosumaa, ja tarvittaessa tiedostonimen perusteella kielitietoinen fallback
       ============================================================================================= */
    const highlightActive = () => {
        const isEn = currentPath.startsWith('/en/');
        if (btnEn) btnEn.classList.toggle('active-lang', isEn);
        if (btnFi) btnFi.classList.toggle('active-lang', !isEn);
    };
    highlightActive();

    const highlightCurrentPage = () => {
        const navLinks = document.querySelectorAll('.main-nav a, .mobile-menu a');
        const current = normalizePath(window.location.pathname);

        const topSegment = (path) => {
            const parts = path.split('/').filter(Boolean);
            return parts.length ? `/${parts[0]}` : '/';
        };

        const currentTop = topSegment(current);
        const currentFile = current.split('/').pop();

        navLinks.forEach((link) => {
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

            // Täsmäosuma
            if (linkPath === current) {
                link.setAttribute('data-current', 'true');
                return;
            }

            // Kielitietoinen tiedostonimen fallback
            const linkTop = topSegment(linkPath);
            const linkFile = linkPath.split('/').pop();

            if (currentFile && linkFile && currentFile === linkFile) {
                const bothRoot = currentTop === '/' && linkTop === '/';
                if (bothRoot || currentTop === linkTop) {
                    link.setAttribute('data-current', 'true');
                    return;
                }
            }

            link.removeAttribute('data-current');
        });
    };
    highlightCurrentPage();

    /* =============================================================================================
       YKSINKERTAINEN LOMAKEVALIDOINTI
       - Tarkistaa vaaditut kentät ja näyttää yksinkertaisen ilmoituksen
       ============================================================================================= */
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');

        contactForm.addEventListener('submit', (e) => {
            let isValid = true;
            inputs.forEach((input) => {
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

        inputs.forEach((input) => {
            input.addEventListener('input', function () {
                this.classList.remove('invalid');
            });
        });
    }

    /* =============================================================================================
       APUFUNKTIOT: fokus-silmukka (simple focus trap)
       - Rajoittaa Tab-navigoinnin mobiilivalikon sisälle kun se on auki.
       ============================================================================================= */
    let focusTrapHandler = null;

    function trapFocus(container) {
        const focusable = Array.from(container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
            .filter((el) => !el.hasAttribute('disabled'));
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        focusTrapHandler = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', focusTrapHandler);
    }

    function releaseFocusTrap() {
        if (focusTrapHandler) {
            document.removeEventListener('keydown', focusTrapHandler);
            focusTrapHandler = null;
        }
    }
});
