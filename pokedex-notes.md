---

### 2. Datei: `pokedex-notes.md`

# Technische Notizen: Pokédex-Projekt

Dieses Dokument hält die wichtigsten Programmierkonzepte, Systemarchitekturen und Problemlösungen fest, die während der Entwicklung des Pokédex-Projekts eingesetzt wurden[cite: 13]. Es dient zudem als Begleitdokument für das Abgabeprojekt bei der Developer Akademie[cite: 13].

---

## 🎓 Akademischer Kontext

Dieses Projekt wurde als **Pflicht-Abgabeprojekt** im Rahmen der Weiterbildung zum **Frontend Developer** an der **Developer Akademie** konzipiert und umgesetzt[cite: 13]. Es demonstriert die praktische Anwendung moderner Webtechnologien unter realen Projektbedingungen und durchläuft einen formellen Review- und Abnahmeprozess durch Fachmentoren[cite: 13].

---

## 1. Benutzeroberfläche & DOM-Architektur

### A. Barrierefreie, semantische Listenstruktur
Die Pokémon-Übersichtskarten werden nicht in unübersichtlichen `<div>`-Wüsten gerendert, sondern nutzen eine semantisch korrekte Listenstruktur (`<ul>` und `<li>`)[cite: 13]. Das ist ein essenzieller Faktor für Screenreader und Suchmaschinenoptimierung (SEO)[cite: 13]:
*   **Container:** `<ul id="mini_card" class="list-unstyled..." aria-label="Pokemon-list">`[cite: 13]
*   **Elemente:** Jedes Pokémon-Badge wird als `<li>` ausgegeben, welches einen interaktiven `<button>` umschließt[cite: 13].

### B. Die native HTML5 Dialog-API
Anstelle von externen JavaScript-Modal-Bibliotheken nutzt dieses Projekt das moderne, native HTML5-Tag `<dialog>`[cite: 13].
*   **Vorteil:** Die Interaktion fängt den Fokus des Nutzers automatisch ein und verdunkelt den Hintergrund nativ über das CSS-Pseudoelement `::backdrop`[cite: 13].
*   **Steuerung über JS:**
    ```javascript
    // Öffnet das Modal als modales Fenster (blockiert den Rest der Seite nativ)
    dialogRef.showModal(); 
    // Schließt das Modal sauber
    dialogRef.close(); 
    ```[cite: 13]

### C. Spezifitäts-Kaskade in CSS (Wichtige Erkenntnis)
Da in der globalen `style.css` ein universeller Reset-Befehl definiert ist (`* { color: black !important; }`)[cite: 13], mussten die dynamischen Textfarben der Pokémon-Typen (z. B. Weißer Text auf lila Geist-Hintergrund) im Template mit einer höheren CSS-Spezifität versehen werden[cite: 13]. Dies wurde elegant durch inline injizierte Styles mit einem eigenen `!important`-Flag gelöst[cite: 13]:
```javascript
style="background-color: ${pokemonTypeColor.color}; color:${pokemonTypeColor.textColor} !important;"
```[cite: 13]

---

## 2. API-Abfragen & Datenfluss (Zwei-Stufen-Architektur)

Um die PokéAPI zu entlasten und die Ladezeiten für den Nutzer auf nahezu Null zu reduzieren, wurde ein intelligentes, zweistufiges Caching-System über den `localStorage` des Browsers implementiert.

### Stufe 1: Basis-Caching beim Laden der Übersicht
Beim ersten Laden werden die Grunddaten (ID, Name, Typen, Bilder, Maße und Stats) vom Server geholt und im Cache gespeichert:
*   **Schlüssel:** `pokemon_data_[ID]`
*   **Inhalt:** Ein Objekt, das die formatierten Basisdaten des Pokémons enthält.

### Stufe 2: Lazy-Loading & Cache-Erweiterung im Modal
Wenn ein Nutzer ein Pokémon anklickt, um das Detail-Modal zu öffnen, greift eine erweiterte Logik (`loadAllModalData`):
1. Es wird geprüft, ob bereits Detail-Daten (wie die Beschreibung) im Cache vorhanden sind.
2. Wenn ja, werden diese direkt geladen (kein API-Abruf!).
3. Wenn nein, werden die zusätzlichen Daten (Spezies, Evolutionen, Moves) via API geholt, an das bereits existierende Basis-Objekt angehängt und der Eintrag im `localStorage` überschrieben.

### Bonus: Globaler Move-Cache (`moves_global`)
Da viele Pokémon dieselben Attacken (Moves) beherrschen, wurde ein globaler Cache für Moves eingerichtet. Wird eine Attacke einmal von der API geladen, wird sie in `moves_global` gespeichert. Jedes weitere Pokémon, das diese Attacke nutzt, lädt sie direkt aus diesem lokalen Speicherobjekt.

---

## 3. Dokumentation der genutzten JavaScript-Methoden

In diesem Projekt wurden moderne und mächtige JavaScript-Befehle verwendet, um Daten effizient zu verarbeiten und zu manipulieren:

### A. Array-Hilfsmethoden (ES6+)
*   **`Array.prototype.reduce()`**
    *   *Verwendung:* Wird in `formatPokemonData` genutzt, um die Summe aller Basis-Statuswerte (HP, Attack, Defense etc.) zu berechnen, um den "Total"-Wert zu ermitteln.
    ```javascript
    let totalValue = dataPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    ```
*   **`Array.prototype.some()`**
    *   *Verwendung:* Prüft in `saveToMyCards`, ob ein Pokémon bereits in der eigenen Sammlung existiert.
    ```javascript
    let alreadyExists = myCollection.some(pokemon => pokemon.id === defaultPokeData.id);
    ```
*   **`Array.prototype.find()`**
    *   *Verwendung:* Sucht in den API-Spezies-Daten gezielt nach dem englischen Beschreibungstext (`'en'`).
    ```javascript
    dataSpecies.flavor_text_entries.find(entry => entry.language.name === 'en')
    ```
*   **`Array.prototype.slice()`**
    *   *Verwendung:* Schneidet ein Array zurecht. Wird genutzt, um standardmäßig nur die ersten 3 Attacken eines Pokémons zu extrahieren.
    ```javascript
    moves: dataPokemon.moves.slice(0, 3)
    ```

### B. String- & Formatierungsoperationen
*   **`String.prototype.replace()` mit Regex**
    *   *Verwendung:* Säubert die rohen Beschreibungstexte der API von störenden Steuerzeichen wie Zeilenumbrüchen (`\n`) und Seitenvorschüben (`\f`), um einen sauberen Fließtext im Modal anzuzeigen.
    ```javascript
    flavor_text.replace(/\f|\n/g, ' ');
    ```
*   **`String.prototype.split()`**
    *   *Verwendung:* Zerschneidet eine URL anhand des Zeichens `/`, um die ID eines Moves oder einer Evolution direkt aus der URL zu extrahieren.
    ```javascript
    let moveUrl = url.split('/');
    let moveId = moveUrl[moveUrl.length - 2];
    ```

---

## 4. Entwicklungsumgebung & Tooling

*   **IDE (VS Code):** Die Entwicklung wurde komplett in Visual Studio Code durchgeführt. Features wie *Live Server* wurden genutzt, um Caching-Mechanismen und API-Abfragen unter realen lokalen Serverbedingungen zu testen.
*   **UI-Framework (Bootstrap 5):** Für ein schnelles, konsistentes Design wurden die Grid-Klassen, Nav-Tabs im Modal sowie die animierten Progress-Bars für die Pokémon-Stats direkt aus Bootstrap geladen.