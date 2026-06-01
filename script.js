
const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=30&offset=0";
// let pokemonId = 1; // Beispiel: Bulbasaur

let basePokeIndex = [

];

let basePokeData = [

];

async function init() {

    await fetchDateBase();
    await renderMiniCard();
    // fetchDateBase();
    // console.log(basePokeIndex);
};

async function fetchDateBase() {

    let response = await fetch(baseUrl);
    let responseAsJson = await response.json();

    // results = ist kay aus objekt aufruf aus api
    basePokeIndex = responseAsJson.results;
    
};

async function renderMiniCard() {
    let miniCard =  " ";

    for (let index = 0; index < basePokeIndex.length; index++) {
        let indexId = index + 1;
        
        let aboutData = await getAbout(indexId);
        basePokeData.push(aboutData);

        let pokemon = basePokeData[index];

        let primaryType = pokemon.types[0];

        // Farbe aus deinem colorBackgroundImage-Objekt holen
        let pokemonTypeColor = colorBackgroundImage[primaryType].color;

        miniCard += templateMiniCard(pokemon, pokemonTypeColor);
        
        
    }
//    console.log(basePokeData);

    document.getElementById("mini_card").innerHTML = miniCard;
};


async function getAbout(pokemonId) {
  try {
    // Basis-Daten abrufen
    let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let pokemonData = await pokemonResponse.json();

    // Beschreibung abrufen
    let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    let speciesData = await speciesResponse.json();

    // Englische Beschreibung filtern
    let description = speciesData.flavor_text_entries
      .find(entry => entry.language.name === 'en')
      .flavor_text
      .replace(/\f|\n/g, ' '); // Zeilenumbrüche entfernen

    // About-Objekt zusammenbauen
    let about = {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types.map(type => type.type.name),
      height: pokemonData.height / 10, // in Meter
      weight: pokemonData.weight / 10, // in kg
      imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
      description: description
    };


    return about;
  } catch (error) {
    console.error('Fehler bei About:', error);
  }
};













// Vorlage

// let inputDataTitle = "film";
// let inputData = " Star trek";



// function init10() {
//     console.log("Testen PokiAPI");
//     fetchDateBase("/name", {"star": "Treck"});
//     postDateBase("/name", {"star": "Treck"});
//     deleteDateBase("/name/",{"serie": "star wars"});
//     putDateBase("/name/Film",{[inputDataTitle] : inputData});
// };

// function allRender10() {

// }



// function userContentInput () {
//     let valueKeyInput = document.getElementById("key_input").value;
//     let valueContentInput = document.getElementById("content_input").value;
//     console.log(valueContentInput, valueKeyInput);
//    postDateBase("/name/Film",{[valueKeyInput] : valueContentInput});
// };


// async function putDateBase(path="", data={}) {

//     let response = await fetch(BASE_URL + path + ".json",{
//         method : "PUT",
//         headers: {
//             "Content-Type" : "application/json",
//         },
//         body : JSON.stringify(data)
//     });
//     return responseToJson = await response.json();
//     console.log(responseToJson);
// };




// mit POST sendet man daten in die datenbank wichtig auf dem path aufpssen das der richtig ist 

// async function postDateBase(path="", data={}) {

//     let response = await fetch(BASE_URL + path + ".json",{
//         method : "POST",
//         headers: {
//             "Content-Type" : "application/json",
//         },
//         body : JSON.stringify(data)
//     });
//     return responseToJson = await response.json();
//     console.log(responseToJson);
// };

// async function fetchDateBase(path="") {
//     let response = await fetch(BASE_URL + path + ".json");
//     return responseToJson = await response.json();
//     console.log(responseToJson); 
// };

// inhalt von datenbank  löschen wichtig kein leer path eingeben sonst wir alles gelöscht
// einzelne padte/id angeben zum löschen
// async function deleteDateBase(path="", data={}) {

//     let response = await fetch(BASE_URL + path + ".json",{
//         method : "DELETE",
//     });
//     return responseToJson = await response.json();
//     console.log(responseToJson);  
// };





