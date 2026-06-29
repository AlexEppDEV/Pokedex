
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
    setupCardClickListeners();
    setupEventListeners();
  }
  catch (error) {console.error('Erro onload init:', error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}
};


function setupCardClickListeners() {
  let cards = document.querySelectorAll('.poke-mini-card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', async function() {
      modalId = Number(this.getAttribute('data-id'));
      await renderModalCard(modalId.toString());
    });
  }
};


function setupEventListeners() {
  let modalElement = document.getElementById('exampleModal');
  modalElement.addEventListener('hide.bs.modal', () => {
    if (document.activeElement) document.activeElement.blur();
  });
  modalElement.addEventListener('hidden.bs.modal', () => {
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  });
  let searchInput = document.getElementById('search_Input');
  searchInput.addEventListener('input', filterMiniCards);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
  });
};


async function fetchDateBase(startLimitUrl) {
    let response = await fetch(baseUrl);
    let responseAsJson = await response.json();
    defaultPokeIndex = responseAsJson.results;   
};


async function renderMiniCard() {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    let miniCard = await buildMiniCardsHtml();
    document.getElementById("mini_card").innerHTML = miniCard;
  }
  catch (error) {console.error('Error in renderMiniCard:', error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");} 
};


async function buildMiniCardsHtml() {
  let miniCardHtml =  " ";
  for (let index = 0; index < defaultPokeIndex.length; index++) {
        let indexId = index + 1;
        let cardData = await fetchPokemon(indexId);
        defaultPokeData.push(cardData);
        let pokemonCard = defaultPokeData[index];
        let pokemonTypeColor = colorBackgroundImage[cardData.types[0].type.name].color;
        miniCardHtml += miniCardTypeOne(pokemonCard, pokemonTypeColor);   
    }
    return miniCardHtml;
};


async function loadAllModalData(pokemonId) {
    try {
      document.getElementById("loader").classList.replace("d-none", "d-flex");
      let pokemon = await fetchPokemon(pokemonId);
      let dataSpecies = await fetchSpecies(pokemonId);
      let moveData = await fetchMoveDetails(pokemon);
      let evolutionChain = await EvolutionSpecies(pokemon, dataSpecies);
      let descriptionText = descriptionData(dataSpecies);
      return { pokemon, descriptionText, evolutionChain, moveData };
    } 
    catch (error) {console.error('Error in renderModalCard:', error);} 
    finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}
};


async function renderModalCard(pokemonId) {
  try {
    if (document.activeElement) document.activeElement.blur();
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    let { pokemon, descriptionText, evolutionChain, moveData } = await loadAllModalData(pokemonId);
    let movesDataTemplate = templateMoves(moveData);
    let pokemonTypeColor = colorBackgroundImage[pokemon.types[0].type.name].color;
    let modalCard = templateModalCard(pokemon, pokemonTypeColor, descriptionText, evolutionChain, movesDataTemplate);
    document.getElementById("modal_card").innerHTML = modalCard;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal')).show();
    } 
  catch (error) {console.error('Error in renderModalCard:', error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}
};


function descriptionData(dataSpecies) {
    let description = dataSpecies.flavor_text_entries
      .find(entry => entry.language.name === 'en')
      .flavor_text
      .replace(/\f|\n/g, ' ');
    return description;
};


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
    throw error;
  } 
};


async function fetchSpecies(pokemonId) {
  try {
  let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
  let species = await speciesResponse.json();
  return species;  
  }
  catch (error) {console.error('Erro fetch species PokeAPI :', error);}
};


async function fetchEvolutionChain(dataSpecies) {
  try {
    let evolutionChainUrl = dataSpecies.evolution_chain.url;
    let evolutionResponse = await fetch(evolutionChainUrl);
    let evolutionData = await evolutionResponse.json();
  return evolutionData;  
  }
  catch (error) {console.error('Erro fetchEvolutionChain :', error);}
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
    `;}
  return pokemonTypes;
};


async function getEvolutionChainData(current) {
  let evolutionLineData = [];
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
    return evolutionLineData;
}

async function EvolutionSpecies(pokemon, dataSpecies) {
  try {
    let evolutionData = await fetchEvolutionChain(dataSpecies);
    let lineData = await getEvolutionChainData(evolutionData.chain);
    return templateEvolutionSpecies(lineData);
  } catch (error) {
    console.error('Error EvolutionSpecies:', error);
    return
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
     catch (error) {console.error('Error in pokemonBefore:', error);}
    finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}   
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
  catch (error) {console.error('Error in pokemonBack:', error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}   
};


 async function morePokemon () {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    startLimitUrl = startLimitUrl + 10;
    baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
    defaultPokeIndex = [];
    defaultPokeData = [];
    if (startLimitUrl >= 20) {
      document.getElementById("fewer_button").classList.replace("d-none","d-flex");     
    }
    await init();
  }
  catch (error) {console.error('morePokemon button error:', error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}   
};

async function basePokemon() {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    startLimitUrl = 20;
    document.getElementById("fewer_button").classList.replace("d-flex", "d-none");
    baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
    defaultPokeIndex = [];
    defaultPokeData = [];
    await init();
  } catch (error) { console.error('basePokemon button error:', error); }
  finally { document.getElementById("loader").classList.replace("d-flex", "d-none"); }   
}


async function fewerPokemon () {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
     if (startLimitUrl <= 20) {
      document.getElementById("fewer_button").classList.replace( "d-flex","d-none");
      return
    }
    else {
      startLimitUrl = startLimitUrl - 10;
      baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
      defaultPokeIndex = [];
      defaultPokeData = [];
      await init();
    }
  }
  catch (error) {console.error('morePokemon button error:', error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}   
};


function resetSearch(miniCards, errorMessage) {
  errorMessage.style.display = 'none';
  for (let i = 0; i < miniCards.length; i++) {
    miniCards[i].style.display = 'block';
  }
}

function applySearchFilter(miniCards, searchTerm) {
  let count = 0;
  for (let i = 0; i < miniCards.length; i++) {
    let card = miniCards[i];
    let name = card.querySelector('h5').textContent.toLowerCase();
    let matches = name.includes(searchTerm.toLowerCase());
    card.style.display = matches ? 'block' : 'none';
    if (matches) count++;
  }
  return count;
}

function handleSearchError(errorMessage, targetNumber) {
  if (targetNumber === 0) {
    errorMessage.textContent = 'No Pokémon found!'; // Auf Englisch umgestellt
    errorMessage.style.display = 'block';
    setTimeout(() => errorMessage.style.display = 'none', 2000);
  } else {
    errorMessage.style.display = 'none';
  }
}

function filterMiniCards() {
  let searchTerm = document.getElementById('search_Input').value.trim();
  let errorMessage = document.getElementById('error_message');
  let miniCards = document.querySelectorAll('.poke-mini-card');
  if (searchTerm.length <= 2) {
    resetSearch(miniCards, errorMessage);
    return;
  }
  let targetNumber = applySearchFilter(miniCards, searchTerm);
  handleSearchError(errorMessage, targetNumber);
}