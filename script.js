

let startLimitUrl = 20;
let baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;

let defaultPokeIndex = [];

let defaultPokeData = [];

let modalPokeData = [];

let modalId = 0;

async function init() {
    // let startLimitUrl = 20;
    await fetchDateBase();
    await renderMiniCard();

    document.querySelectorAll('.poke-mini-card').forEach(card => {
        card.addEventListener('click', async function() {
            let pokemonId = this.getAttribute('data-id');
            modalId = Number(pokemonId);

            // Modal mit den Daten füllen
            await renderModalCard(pokemonId);
        });
    });
};

async function fetchDateBase(startLimitUrl) {
    let response = await fetch(baseUrl);
    let responseAsJson = await response.json();

    // results = ist key aus objekt aufruf aus api
    defaultPokeIndex = responseAsJson.results;   
};



async function renderMiniCard() {
    let miniCard =  " ";

    for (let index = 0; index < defaultPokeIndex.length; index++) {
        let indexId = index + 1;
        let cardData = await fetchPokemon(indexId);
        defaultPokeData.push(cardData);

        let pokemonCard = defaultPokeData[index];
        let primaryType = pokemonCard.types[0].type.name;
        // Farbe aus colorBackgroundImage-Objekt holen
        let pokemonTypeColor = colorBackgroundImage[primaryType].color;
        miniCard += miniCardTypeOne(pokemonCard, pokemonTypeColor);   
    }
    document.getElementById("mini_card").innerHTML = miniCard;
};


// modal render all
async function renderModalCard(pokemonId) {
    let modalCard =  " ";

        let pokemon = await fetchPokemon(pokemonId);
        let dataSpecies = await fetchSpecies(pokemonId);

        let primaryType = pokemon.types[0].type.name;
        let descriptionText = descriptionData(dataSpecies);
        let evolutionChain = await EvolutionSpecies(pokemon, dataSpecies);
        
        // Farbe aus deinem colorBackgroundImage-Objekt holen
        let pokemonTypeColor = colorBackgroundImage[primaryType].color;
        modalCard = templateModalCard(pokemon,pokemonTypeColor,descriptionText,evolutionChain);
        
        document.getElementById("modal_card").innerHTML = modalCard;   
};

function descriptionData(dataSpecies) {
    //  Englische Beschreibung filtern
    let description = dataSpecies.flavor_text_entries
      .find(entry => entry.language.name === 'en')
      .flavor_text
      .replace(/\f|\n/g, ' '); // Zeilenumbrüche entfernen

    return description

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

// fetch pokeAPI species
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

// fetch pokeAPI species
async function fetchEvolutionChain(dataSpecies) {
  try {

    let evolutionChainUrl = dataSpecies.evolution_chain.url;
    // Evolution-Chain abrufen
    let evolutionResponse = await fetch(evolutionChainUrl);
    let evolutionData = await evolutionResponse.json();

  return evolutionData;  
  }
  catch (error) {
    console.error('Erro fetchEvolutionChain :', error);
  }
};


function filterTypes(pokemon) {
  let pokemonTypes = '';
  let type1 = pokemon.types[0].type.name;
  let type2 = pokemon.types[1]?.type.name;

  if (pokemon.types.length === 1) {
    pokemonTypes = `
      <p class="border rounded-pill px-2 py-1 fw-bold m-0 capitalize"style="background-color: ${colorBackgroundImage[type1].color};">${type1}</p>
    `;
  } else {
    pokemonTypes = `     
      <p class="border rounded-pill px-2 py-1 fw-bold m-0 capitalize" style="background-color: ${colorBackgroundImage[type1].color};">${type1}</p>
      <p class="border rounded-pill px-2 py-1 fw-bold m-0 capitalize" style="background-color: ${colorBackgroundImage[type2].color};"> ${type2}</p>
    `;
  }
  return pokemonTypes
};




// die se funktion muss noch angepasst werden und ein gebaut werden
async function EvolutionSpecies(pokemon, dataSpecies) {
  try {
    let evolutionData = await fetchEvolutionChain(dataSpecies);
    let evolutionLineData = [];
    let current = evolutionData.chain;
    while (current) {
      
      let urlParts = current.species.url.split('/');
      let evolutionId = parseInt(urlParts[urlParts.length - 2]);
      let pokemonData = await fetchPokemon(evolutionId);

      evolutionLineData.push({
        id: evolutionId,
        name: current.species.name,
        level: current.evolution_details?.[0]?.min_level || 1,
        imageUrl: pokemonData.sprites.front_default // Kleine Auflösung
      });

      current = current.evolves_to[0]; // Nächste Evolution
    }
    let evolutionLineTemplate = templateEvolutionSpecies(evolutionLineData);

    return evolutionLineTemplate;

  } catch (error) {
    console.error('Fehler bei Evolution:', error);
  }
};





function pokemonBefore () {
  let indexNumber = modalId;
    if ( indexNumber >= defaultPokeIndex.length) {
        indexNumber = 0;
        }
    indexNumber = indexNumber + 1;
    modalId = indexNumber;
    pokemonId = indexNumber.toString();
    renderModalCard(pokemonId);
};


function pokemonBack () {
  let indexNumber = modalId;
    if ( indexNumber <= 1) {
        indexNumber = defaultPokeIndex.length;
        }
        else {
          indexNumber = indexNumber - 1;
        }
     
    modalId = indexNumber;
    pokemonId = indexNumber.toString();
    renderModalCard(pokemonId);
};


 async function morePokemon () {
  try {
    startLimitUrl = startLimitUrl + 10;
    baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
    defaultPokeIndex = [];
    defaultPokeData = [];
    await init();

  }
  
  catch (error) {
    console.error('morePokemon button error:', error);
  }

};
// vorlagen ----------------------------------------------



async function getMoves(pokemon) {
  
    // let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    // let data = await response.json();
    let pokemonMoves = pokemon;

    let moves = data.moves.slice(0, 3).map(move => ({
      name: move.move.name,
      power: move.move.power || null,
      accuracy: move.move.accuracy || null
    }));
    return moves;
 
}
