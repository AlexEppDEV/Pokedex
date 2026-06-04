
const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=30&offset=0";
// let pokemonId = 1; // Beispiel: Bulbasaur

let defaultPokeIndex = [

];

let defaultPokeData = [

];

let modalPokeData = [

];

async function init() {
    await fetchDateBase();
    await renderMiniCard();
    // fetchDateBase();
    // console.log(defaultPokeData);

    document.querySelectorAll('.poke-mini-card').forEach(card => {
        card.addEventListener('click', async function() {
            // ID aus dem data-id-Attribut holen
            let pokemonId = this.getAttribute('data-id');
            console.log("Geklickte Pokémon-ID:", pokemonId); // Testausgabe

            // Modal mit den Daten füllen
            await renderModalCard(pokemonId);
        });
    });
};

async function fetchDateBase() {
    let response = await fetch(baseUrl);
    let responseAsJson = await response.json();

    // results = ist key aus objekt aufruf aus api
    defaultPokeIndex = responseAsJson.results;   
};


// To Do: type mit einer schleife lösen  abfrage ein oder zwei
async function renderMiniCard() {
    let miniCard =  " ";

    for (let index = 0; index < defaultPokeIndex.length; index++) {
        let indexId = index + 1;
        
        let aboutData = await fetchMiniCard(indexId);
        defaultPokeData.push(aboutData);

        let pokemon = defaultPokeData[index];

        let primaryType = pokemon.types[0];

        // Farbe aus deinem colorBackgroundImage-Objekt holen
        let pokemonTypeColor = colorBackgroundImage[primaryType].color;
        
        // das muss ich mit einem p tag lösen und mit span tag : eine variable schreben vo beides drin ist
        if (pokemon.types.length <= 1) {
          miniCard += miniCardTypeOne(pokemon, pokemonTypeColor);
        } else {
          let secondaryTypeColor = colorBackgroundImage[pokemon.types[1]].color;
          miniCard += miniCardTypeTwo(pokemon, pokemonTypeColor, secondaryTypeColor);
        }
         
    }
//    console.log(defaultPokeData);
    document.getElementById("mini_card").innerHTML = miniCard;
};


document.querySelectorAll('.poke-mini-card').forEach(card => {
        card.addEventListener('click', async function() {
            // ID aus dem data-id-Attribut holen
            let pokemonId = this.getAttribute('data-id');
            console.log("Geklickte Pokémon-ID:", pokemonId); // Testausgabe

            // Modal mit den Daten füllen
            await renderModalCard(pokemonId);
        });
    });
  

// fetch anfrage mini card
async function fetchMiniCard(pokemonId) {
  try {
    // Basis-Daten abrufen
    let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let pokemonData = await pokemonResponse.json();
    // About-Objekt zusammenbauen
    let fetchData = {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types.map(type => type.type.name),
      imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
    };
    return fetchData;
  } 
  catch (error) {
    console.error('Fehler bei About:', error);
  }
};


// modal render all
async function renderModalCard(pokemonId) {
    let modalCard =  " ";

        let pokemon = await fetchPokemon(pokemonId);
        let dataSpecies = await fetchSpecies(pokemonId);
        let primaryType = pokemon.types[0].type.name;

        // Farbe aus deinem colorBackgroundImage-Objekt holen
        let pokemonTypeColor = colorBackgroundImage[primaryType].color;
        modalCard = templateModalCard(pokemon, pokemonTypeColor);
        
        document.getElementById("modal_card").innerHTML = modalCard;   
//    console.log(defaultPokeData);
};

// fetch pokeAPI
async function fetchPokemon(pokemonId) {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let dataPokemon = await response.json();
    return dataPokemon;
  }
   catch (error) {
    console.error('Erro fetch PokeAPI:', error);
  }
};


async function fetchSpecies(pokemonId) {
  try {
  let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
  let species = await speciesResponse.json();
  return species;  
  }
  catch (error) {
    console.error('Erro fetch species PokeAPI :', error);
  }
};

// die se funktion muss noch angepasst werden und ein gebaut werden
async function fetchEvolutionSpecies(pokemonId) {
  try {
    // Evolution-Chain-URL abrufen
    let speciesData = await fetchSpecies(pokemonId);

    let evolutionChainUrl = speciesData.evolution_chain.url;

    // Evolution-Chain abrufen
    let evolutionResponse = await fetch(evolutionChainUrl);
    let evolutionData = await evolutionResponse.json();

    let evolutionLine = [];
    let current = evolutionData.chain;

    while (current) {
      // ID aus der URL extrahieren
      let urlParts = current.species.url.split('/');
      let evolutionId = parseInt(urlParts[urlParts.length - 2]);

      // Bild-URL abrufen
      let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionId}`);
      let pokemonData = await pokemonResponse.json();

      evolutionLine.push({
        id: evolutionId,
        name: current.species.name,
        level: current.evolution_details?.[0]?.min_level || null,
        imageUrl: pokemonData.sprites.front_default // Kleine Auflösung
      });

      current = current.evolves_to[0]; // Nächste Evolution
    }
    return evolutionLine;
  } catch (error) {
    console.error('Fehler bei Evolution:', error);
  }
}





// vorlagen ----------------------------------------------
async function getAbout(pokemonId) {
  try {
    // Basis-Daten abrufen
    let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let pokemonData = await pokemonResponse.json();

    // Beschreibung abrufen
    // let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    // let speciesData = await speciesResponse.json();

    // Englische Beschreibung filtern
    // let description = speciesData.flavor_text_entries
    //   .find(entry => entry.language.name === 'en')
    //   .flavor_text
    //   .replace(/\f|\n/g, ' '); // Zeilenumbrüche entfernen

    // About-Objekt zusammenbauen
    let about = {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types.map(type => type.type.name),
      // height: pokemonData.height / 10, // in Meter
      // weight: pokemonData.weight / 10, // in kg
      imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
      // description: description
    };


    return about;
  } catch (error) {
    console.error('Fehler bei About:', error);
  }
};




async function getBaseStats(pokemonId) {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let data = await response.json();

    // Beschreibung abrufen
    let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    let speciesData = await speciesResponse.json();

    // Englische Beschreibung filtern
    let description = speciesData.flavor_text_entries
      .find(entry => entry.language.name === 'en')
      .flavor_text
      .replace(/\f|\n/g, ' '); // Zeilenumbrüche entfernen

    let total = data.stats[0].base_stat + data.stats[1].base_stat + data.stats[2].base_stat + data.stats[3].base_stat + data.stats[4].base_stat + data.stats[5].base_stat;

    let baseStats = {
      height: data.height / 10, // in Meter
      weight: data.weight / 10, // in kg
      description: description,
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat ,
      defense: data.stats[2].base_stat ,
      spAtk: data.stats[3].base_stat ,
      spDef: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
      total 
    };
    return baseStats;
  } catch (error) {
    console.error('Fehler bei Base Stats:', error);
  }
}


async function getEvolution(pokemonId) {
  try {
    // Evolution-Chain-URL abrufen
    let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    let speciesData = await speciesResponse.json();
    let evolutionChainUrl = speciesData.evolution_chain.url;

    // Evolution-Chain abrufen
    let evolutionResponse = await fetch(evolutionChainUrl);
    let evolutionData = await evolutionResponse.json();

    let evolutionLine = [];
    let current = evolutionData.chain;

    while (current) {
      // ID aus der URL extrahieren
      let urlParts = current.species.url.split('/');
      let evolutionId = parseInt(urlParts[urlParts.length - 2]);

      // Bild-URL abrufen
      let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionId}`);
      let pokemonData = await pokemonResponse.json();

      evolutionLine.push({
        id: evolutionId,
        name: current.species.name,
        level: current.evolution_details?.[0]?.min_level || null,
        imageUrl: pokemonData.sprites.front_default // Kleine Auflösung
      });

      current = current.evolves_to[0]; // Nächste Evolution
    }
    return evolutionLine;
  } catch (error) {
    console.error('Fehler bei Evolution:', error);
  }
}


async function getMoves(pokemonId) {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let data = await response.json();

    let moves = data.moves.slice(0, 3).map(move => ({
      name: move.move.name,
      power: move.move.power || null,
      accuracy: move.move.accuracy || null
    }));
    return moves;
  } catch (error) {
    console.error('Fehler bei Moves:', error);
  }
}
