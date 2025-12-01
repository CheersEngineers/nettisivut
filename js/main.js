// main.js
// Pieni skripti navigaation ja kielivalinnan toiminnallisuuteen.
// Kommentti: pidetään skripti mahdollisimman yksinkertaisena ja saavutettavana.

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            if (mobileMenu.hasAttribute('hidden')) {
                mobileMenu.removeAttribute('hidden');
            } else {
                mobileMenu.setAttribute('hidden', '');
            }
        });
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function () {
            // Vaihdetaan englantiin: ohjaa en/index.html
            // Tämä on yksinkertainen toiminto; voit halutessasi tehdä kielenvaihdon serveripuolella.
            window.location.href = 'en/index.html';
        });
    }
});
