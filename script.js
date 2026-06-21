let startLimitUrl = 20;
let baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
let defaultPokeIndex = [];
let defaultPokeData = [];
let modalPokeData = [];
let modalId = 0;

async function init() {
  try {
     document.getElementById("loader").classList.replace("d-none", "d-flex");
    await fetchDateBase();
    await renderMiniCard();
    document.querySelectorAll('.poke-mini-card').forEach(card => {
        card.addEventListener('click', async function() {
            let pokemonId = this.getAttribute('data-id');
            modalId = Number(pokemonId);
            await renderModalCard(pokemonId);
        });
    });
    
  }
    catch (error) {
    console.error('Erro onload init:', error);
  }
  finally {
  document.getElementById("loader").classList.replace("d-flex", "d-none");
  }
  // Event-Listener für das Schließen des Modals
let modalElement = document.getElementById('exampleModal');
modalElement.addEventListener('hidden.bs.modal', () => {
  // Stelle sicher, dass das Ladesymbol ausgeblendet ist
  document.getElementById("loader").classList.replace("d-flex", "d-none");
});
};


async function fetchDateBase(startLimitUrl) {
    let response = await fetch(baseUrl);
    let responseAsJson = await response.json();
    // results = ist key aus objekt aufruf aus api
    defaultPokeIndex = responseAsJson.results;   
};


async function renderMiniCard() {
  console.log("🔄 Mini-Cards werden neu gerendert!"); // Debugging
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
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
  }
  catch (error) {
    console.error('Error in renderMiniCard:', error);
  }
  finally {
     document.getElementById("loader").classList.replace("d-flex", "d-none");
  } 
};


// modal render all
async function renderModalCard(pokemonId) {
  try {
     document.getElementById("loader").classList.replace("d-none", "d-flex");
    let modalCard =  " ";
    let pokemon = await fetchPokemon(pokemonId);
    //  console.log(pokemon)
    let dataSpecies = await fetchSpecies(pokemonId);
    let moveData = await fetchMoveDetails(pokemon);
    // console.log(moveData);
    let movesDataTemplate = templateMoves(moveData);
    
    let primaryType = pokemon.types[0].type.name;
    let descriptionText = descriptionData(dataSpecies);
    let evolutionChain = await EvolutionSpecies(pokemon, dataSpecies);
    
    // Farbe aus deinem colorBackgroundImage-Objekt holen
    let pokemonTypeColor = colorBackgroundImage[primaryType].color;
    modalCard = templateModalCard(pokemon,pokemonTypeColor,descriptionText,evolutionChain,movesDataTemplate);
    document.getElementById("modal_card").innerHTML = modalCard;
    let modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
  }
  catch (error) {
    console.error('Error in renderModalCard:', error);
  }

  finally {
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  }     
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
    if (!response.ok) {
      throw new Error(`Pokémon mit ID/Name "${pokemonId}" nicht gefunden.`);
    }
    let dataPokemon = await response.json();
    return dataPokemon;
  }
   catch (error) {
    console.error('Erro fetch PokeAPI:', error);
    throw error; // WICHTIG: Fehler weiterleiten, damit renderModalCard() ihn fängt!
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


// fetch pokeAPI Moves
async function fetchMoveDetails(pokemon) {
  try {
    let moveMaxNumber = 3 ;
    let movesDetails = [ ];
    for (let index = 0; index < moveMaxNumber; index++) {
      
      let dataMoveUrl = pokemon.moves[index].move.url;
      let response = await fetch(dataMoveUrl);
      let data = await response.json();
      movesDetails.push(data) ;
    }
    return movesDetails;
  } catch (error) {
    console.error("Error fetchMoveDetails:", error);
    return null;
  }
};


function filterTypes(pokemon) {
  let pokemonTypes = '';
  let type1 = pokemon.types[0].type.name;
  let type2 = pokemon.types[1]?.type.name;
  if (pokemon.types.length === 1) {
    pokemonTypes = `
      <p class="border rounded-pill px-2 py-1 fw-bold m-0 capitalize" style="background-color: ${colorBackgroundImage[type1].color};">${type1}</p>
    `;
  } else {
    pokemonTypes = `     
      <p class="border rounded-pill px-2 py-1 fw-bold m-0 capitalize" style="background-color: ${colorBackgroundImage[type1].color};">${type1}</p>
      <p class="border rounded-pill px-2 py-1 fw-bold m-0 capitalize" style="background-color: ${colorBackgroundImage[type2].color};"> ${type2}</p>
    `;
  }
  return pokemonTypes
};


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
        imageUrl: pokemonData.sprites.front_default 
      });
      current = current.evolves_to[0];
    }
    let evolutionLineTemplate = templateEvolutionSpecies(evolutionLineData);
    return evolutionLineTemplate;
  } catch (error) {
    console.error('Error EvolutionSpecies:', error);
  }
};


function pokemonBefore () {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    let indexNumber = modalId;
    if ( indexNumber >= defaultPokeIndex.length) {
        indexNumber = 0;
        }
    indexNumber = indexNumber + 1;
    modalId = indexNumber;
    pokemonId = indexNumber.toString();
    renderModalCard(pokemonId);
  }
     catch (error) {
    console.error('Error in pokemonBefore:', error);
  }
    finally {
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  }   
};


function pokemonBack () {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
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
  }
  catch (error) {
    console.error('Error in pokemonBack:', error);
  }
    finally {
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  }   
};


 async function morePokemon () {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    startLimitUrl = startLimitUrl + 10;
    baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
    defaultPokeIndex = [];
    defaultPokeData = [];
    await init();
  }
  catch (error) {
    console.error('morePokemon button error:', error);
  }
  finally {
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  }   
};


async function basePokemon () {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    startLimitUrl = 20;
    baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
    defaultPokeIndex = [];
    defaultPokeData = [];
    await init();
  }
  catch (error) {
    console.error('morePokemon button error:', error);
  }
  finally {
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  }   
};

 async function searchPokemon() {
  try {
    // 1. Wert aus dem Suchfeld auslesen
    let searchTerm = document.getElementById('search_Input').value.trim().toLowerCase();
    if (!searchTerm) {
      alert('Bitte gib einen Pokémon-Namen oder eine ID ein!');
      return;
    }

    // 2. Modal-Lader anzeigen
    document.getElementById("loader").classList.replace("d-none", "d-flex");

    // 3. Pokémon-Daten abrufen und Modal rendern
    await renderModalCard(searchTerm);

  } catch (error) {
    console.error('Fehler in searchPokemon:', error);
    alert(`Pokémon nicht gefunden: ${error.message}`);
  } finally {
    // 4. Lader ausblenden (auch bei Fehlern!)
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  }
  
}

// vorlagen ----------------------------------------------


function testLoader() {
  // Ladesymbol anzeigen
  document.getElementById("loader").classList.replace("d-none", "d-flex");

  // Nach 3 Sekunden ausblenden
  setTimeout(() => {
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  }, 3000);
}
