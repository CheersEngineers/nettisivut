# 📚 Harjoitustyön ohjeet

## Yleistä
- Tämä on **yksilötyö**
- Jokainen tekee www-sivut sellaisesta aiheesta mikä kiinnostaa
- Sivustossa tulee olla noin **7 sivua**
- Käytä **ulkopuolista CSS-tyylitiedostoa** – älä kirjoita tyylejä suoraan HTML-tiedostoihin
- Rakenna sivusto niin, että se on **standardien mukainen, responsiivinen ja helppokäyttöinen**
- Pisteitä saa max **50**
- Harjoitustyöstä on saatava vähintään **20 pistettä**
- Harjoitustyö pitää palauttaa viimeistään **8.12**

---

## ✅ Vinkkejä ja muistilista

### 1. Sivun rakenne ja semanttisuus
- Käytä HTML5-rakenteisia elementtejä:  
  `<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>`
- Huolehdi otsikkohierarkiasta (vain yksi `<h1>` per sivu, sen jälkeen loogisesti `<h2>, <h3>` jne.)
- Älä rakenna kaikkea pelkillä `<div>`- ja `<span>`-tageilla

### 2. Responsiivisuus
- Sivun tulee toimia mobiilissa, tabletissa ja tietokoneella
- Käytä **flexboxia** ja/tai **CSS-gridiä**
- Testaa eri näytönleveydet (esim. 360px ja 1200px)
- Älä jätä sivulle vaakasuoraa vieritystä mobiilissa

### 3. Layout ja navigaatio
- Käytä yhtenäistä typografiaa, värejä ja marginaaleja
- Tee selkeä navigointivalikko, joka toimii kaikilla sivuilla
- Huomioi mobiilikäyttö (hamburger-menu tms.)

### 4. Validaatio
- Aja sivu HTML- ja CSS-validaattorin läpi: [validator.w3.org](https://validator.w3.org)
- Korjaa virheet (pienet varoitukset eivät haittaa, mutta kriittiset virheet pitää korjata)

### 5. Media
- Käytä kuvia, videoita tai ääntä
- Lisää **alt-tekstit** kuville
- Optimoi kuvat sopivaan kokoon (ei liian raskaita)
- Tee mediasta responsiivisia (`max-width: 100%`)
- Määrittele kuvien koot HTML-koodissa

### 6. Lomake
Lisää lomake, jossa on monipuolisia kenttiä:
- Tekstikenttä
- Sähköposti (`type="email"`)
- Numero (`type="number"`)
- Valinta (checkbox/radio)
- Alasvetovalikko (`<select>`)
- Tekstialue (`<textarea>`)
- Päivämäärä (`type="date"`)

**Muista:**
- Käytä validointia (`required`, `min`, `max`)
- Liitä kenttiin `<label>`-elementit

### 7. HTML-elementtien monipuolisuus
- Käytä listoja (`<ul>, <ol>, <dl>`)
- Tee taulukko
- Käytä `<figure>` ja `<figcaption>` kuville tarvittaessa

### 8. Kommentointi ja tiedostojen nimeäminen
- Lisää selittävät kommentit sekä HTML- että CSS-tiedostoihin
- Nimeä tiedostot ja luokat loogisesti (esim. `style.css`, `main-nav`, ei `uusi1.html`)
- Käytä yhtenäistä nimeämistapaa

### 9. Saavutettavuus
- Varmista, että kontrastit ovat riittävät (teksti erottuu taustasta)
- Lisää alt-tekstit kuviin
- Linkkitekstit kuvaavia (“Lue lisää kurssista” eikä “Klikkaa tästä”)
- Näytä käyttäjälle, mikä kenttä on aktiivinen (**focus-tila näkyvissä**)

### 10. Tekniset ja käytännön vaatimukset
**Hakemistorakenne:**
index.html
/css/style.css
/img/ (kuvat)


**Meta-tagit:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Sivuston kuvaus">
```

### 10. Tekniset ja käytännön vaatimukset
- Lisää **favikon**
- Lisää footerissa sivun **päivityspäivä**

---

## 📝 Tarkistuslista ennen palautusta
- Kaikki sivut toimivat ja linkit johtavat oikeaan paikkaan  
- Sivusto toimii mobiilissa ja tietokoneella  
- Validaattorit eivät näytä virheitä  
- Kuvilla on alt-tekstit  
- Navigaatio toimii loogisesti  
- Lomakkeessa on vähintään 4 erilaista kenttätyyppiä  
- CSS on ulkoisessa tiedostossa  
- Tiedostonimet ja luokkanimet ovat loogisia  
- Sivulla on yhtenäinen tyyli ja rakenne  
- Kommentit löytyvät sekä HTML- että CSS-tiedostosta  

