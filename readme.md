# 🌟 Highly Optimized Vanilla JS Pokédex

Ein moderner, hochgradig optimierter und barrierefreier Pokédex, angebunden an die offizielle [PokéAPI](https://pokeapi.co/). Das Projekt wurde komplett mit **Nativem JavaScript (Vanilla JS)**, HTML5, CSS3 und Bootstrap 5 realisiert. Es verzichtet bewusst auf schwere Frameworks, um die mächtigen Kernkonzepte moderner Web-APIs und intelligenter Caching-Strategien zu demonstrieren.

---

## 🎓 Projekt-Kontext & Weiterbildung

Dieses Projekt ist ein offizielles **Pflicht-Abgabeprojekt** im Rahmen meiner Weiterbildung zum **Frontend Developer** bei der **Developer Akademie**. Es dient als wichtiges Prüfungs- und Praxisprojekt, welches von den Mentoren und Tutoren der Akademie fachlich abgenommen und bewertet wird. 

Es demonstriert den sicheren und eigenständigen Umgang mit:
*   Asynchronem JavaScript (API-Integration)
*   Clientseitigem Caching und Datenmanagement (`localStorage`)
*   Semantischem HTML5 und modernem, responsivem UI-Design mit Bootstrap.

---

## 🚀 Key Features

*   **⚡ Mehrstufiges Caching (Performance-First):**
    *   **Stufe 1 (Übersicht):** Basis-Metadaten werden beim ersten Laden im `localStorage` gesichert. Beim Scrollen oder Limit-Wechsel entstehen dadurch keinerlei redundante Netzwerkanfragen.
    *   **Stufe 2 (Lazy-Loading im Detail-Modal):** Aufwendige Zusatzdaten (Entwicklungsstufen, Fähigkeiten und Flavour-Texte) werden erst bei Bedarf angefordert und transparent in den bestehenden lokalen Cache integriert.
    *   **Globaler Move-Cache (`moves_global`):** Gleiche Attacken verschiedener Pokémon werden global abgefangen, um wiederholte Requests für identische Ressourcen zu eliminieren.
*   **🔤 Semantisches HTML5 & Barrierefreiheit (A11y):**
    *   Die Karten-Übersicht nutzt eine strikt semantische Listen-Architektur (`<ul>` und `<li>`) sowie strukturierte `aria-label`-Attribute für Screenreader.
    *   **Dynamische Kontrast-Steuerung:** Das System liest den Pokémon-Typen aus und wählt über ein O(1)-Lookup-Objekt automatisch die passende kontraststarke Textfarbe (Schwarz/Weiß), um die WCAG-Richtlinien für Lesbarkeit zu erfüllen.
*   **🎭 Native Dialog-Komponente:** Volle Ausnutzung des modernen HTML5 `<dialog>`-Elements inklusive nativer Fokus-Sperre und Backdrop-Anpassung via CSS.
*   **🔍 Dynamisches UI-Sicherheitsnetz:** Bei der integrierten Echtzeit-Suche filtert die App das Grid direkt im DOM. Um Fehlbedienungen zu vermeiden, wird die Footer-Navigation während der Suche dynamisch aus- und eingeblendet.
*   **📱 Responsive Grid Layout:** Durch ein optimiertes Zusammenspiel aus Bootstrap 5 und einer eigenen Utility-Klassen-Bibliothek (`dpf-flex-utils.css`) passt sich das Interface flüssig an jede Bildschirmgröße an.

---

## 🛠️ Tech Stack & Tooling

*   **Entwicklungsumgebung:** Visual Studio Code (VS Code)
*   **UI-Framework:** Bootstrap 5 (Responsive Grid, Nav-Tabs, Progress-Bars)
*   **HTML5 & CSS3:** Semantische Strukturierung und eigene Flexbox-Erweiterungen (`dpf-flex-utils.css`)
*   **Vanilla JavaScript (ES6+):** Asynchroner Datenabruf (`fetch`, `async/await`, `Promise.all`) und lokales Caching (`localStorage`)

---

## ⚙️ Architektur & Code-Highlights

### 1. Regex-Datenbereinigung
Die Originaltexte der PokéAPI enthalten oft historische Steuerzeichen aus alten Nintendo-Systemen (wie Seitenvorschübe `\f` oder Zeilenumbrüche `\n`). Der Code bereinigt diese vollautomatisch mittels Regular Expressions vor dem Rendern im Modal:
```javascript
function descriptionData(dataSpecies) {
  return dataSpecies.flavor_text_entries
    .find(entry => entry.language.name === 'en')
    .flavor_text
    .replace(/\f|\n/g, ' ');
}