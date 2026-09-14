/* ===========================================================================================
   This file handles the mobile menu, current-page navigation state and footer date.
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

    const normalizePath = (path) => {
        if (!path || path === '/') return '/index.html';
        const p = path.split('?')[0].split('#')[0];
        if (p.endsWith('/')) return p + 'index.html';
        return p;
    };

    const currentPath = normalizePath(window.location.pathname);

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

            // Filename fallback for equivalent same-folder pages.
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

    /* ======================================
       GALLERY LIGHTBOX: full-size images
       ====================================== */
    const galleryItems = Array.from(document.querySelectorAll('.gallery-page .gallery-item'));
    const lightbox = document.getElementById('gallery-lightbox');

    if (galleryItems.length && lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox__image');
        const lightboxCaption = lightbox.querySelector('.lightbox__caption');
        const closeLightboxButton = lightbox.querySelector('.lightbox__close');
        const previousButton = lightbox.querySelector('.lightbox__control--previous');
        const nextButton = lightbox.querySelector('.lightbox__control--next');
        let activeGalleryIndex = 0;
        let lightboxFocusReturn = null;

        const showImage = (index) => {
            activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
            const item = galleryItems[activeGalleryIndex];
            const image = item.querySelector('img');
            const caption = item.closest('figure').querySelector('figcaption');

            lightboxImage.src = image.currentSrc || image.src;
            lightboxImage.alt = image.alt;
            lightboxCaption.textContent = caption ? caption.textContent : image.alt;
        };

        const openLightbox = (index) => {
            lightboxFocusReturn = document.activeElement;
            showImage(index);
            lightbox.removeAttribute('hidden');
            document.body.classList.add('is-lightbox-open');
            closeLightboxButton.focus();
        };

        const closeLightbox = () => {
            lightbox.setAttribute('hidden', '');
            document.body.classList.remove('is-lightbox-open');
            if (lightboxFocusReturn instanceof HTMLElement) {
                lightboxFocusReturn.focus();
            }
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeLightboxButton.addEventListener('click', closeLightbox);
        previousButton.addEventListener('click', () => showImage(activeGalleryIndex - 1));
        nextButton.addEventListener('click', () => showImage(activeGalleryIndex + 1));

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (event) => {
            if (lightbox.hasAttribute('hidden')) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showImage(activeGalleryIndex - 1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                showImage(activeGalleryIndex + 1);
            } else if (event.key === 'Tab') {
                const focusable = [closeLightboxButton, previousButton, nextButton];
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
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

/* =============================================================================================
       VIIMEKSI PÄIVITETTY -PÄIVÄMÄÄRÄ (FOOTER)
       - Hakee tiedoston viimeisimmän muokkauspäivämäärän ja näyttää sen footerissa
       ============================================================================================= */
const updatedElem = document.getElementById('paivitetty');
if (updatedElem) {
    const lastModified = new Date(document.lastModified);
    if (!isNaN(lastModified.getTime())) {
        const formattedDate = lastModified.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
        updatedElem.textContent = formattedDate;
        updatedElem.setAttribute('datetime', lastModified.toISOString().split('T')[0]);
        }
    }
});
