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

// Kartta: avain = nykyinen polku (ilman domainia), arvo = vastaava polku toisella kielellä.
// Lisää kaikki sivuparit tähän.
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

// Automaattinen polun normalisointi: lisää index.html jos polku on "/" tai tyhjä
function normalizePath(path) {
    if (!path || path === "/") return "/index.html";
    // Poista mahdollinen query-string ja hash
    const p = path.split("?")[0].split("#")[0];
    // Jos päättyy /, lisää index.html
    if (p.endsWith("/")) return p + "index.html";
    return p;
}

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = normalizePath(window.location.pathname);
    const btnFi = document.getElementById("lang-fi");
    const btnEn = document.getElementById("lang-en");

    // Aseta painikkeiden toiminnallisuus: ohjaa vastaavaan polkuun, jos löytyy kartasta
    if (btnFi) {
        btnFi.addEventListener("click", function () {
            // Etsi kohdepolku: jos nykyinen on en -> fi, muuten etsi kartasta
            const target = langMap[currentPath] || "/index.html";
            // Jos target on sama kuin nykyinen, ohjaa juureen suomeksi
            window.location.href = target;
        });
    }

    if (btnEn) {
        btnEn.addEventListener("click", function () {
            const target = langMap[currentPath] || "/en/index.html";
            window.location.href = target;
        });
    }

    // (Valinnainen) Visuaalinen tila: korosta aktiivista kieltä
    function highlightActive() {
        const isEn = currentPath.startsWith("/en/");
        if (btnEn) btnEn.classList.toggle("active-lang", isEn);
        if (btnFi) btnFi.classList.toggle("active-lang", !isEn);
    }
    highlightActive();
});
