
let startLimitUrl = 20;
let baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
let defaultPokeIndex = [];
let defaultPokeData = [];
let modalPokeData = [];
let modalId = 0;
let dialogRef = document.getElementById('exampleModal');

async function init() {
  try {
    toggleLoader(true);
    await loadOverviewCards();
    setupCardClickListeners();
    setupEventListeners();
  }
  catch (error) {
    console.error('Error onload init:', error);}
  finally {
  toggleLoader(false);}
}

function toggleLoader(show) {
  let loader = document.getElementById("loader");
  if (show) loader.classList.replace("d-none", "d-flex");
  else loader.classList.replace("d-flex", "d-none");
}

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
  let searchInput = document.getElementById('search_Input');
  searchInput.addEventListener('input', filterMiniCards);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
  });
  dialogRef.addEventListener("click", function(event) {
    if (event.target === dialogRef) {toggleDialog();}
});
};

function toggleDialog() {
  dialogRef.classList.toggle('opened')
  if (dialogRef.open) {
    dialogRef.close()
  }
  else {
     dialogRef.showModal();
  }
};

async function loadOverviewCards() {
  try {
    toggleLoader(true);
    let cachedOverview = localStorage.getItem('pokemonOverview');
    let cachedData = cachedOverview ? JSON.parse(cachedOverview) : null;
    if (cachedData && cachedData.length === startLimitUrl) {loadPokemonFromCache(cachedData);} 
    else {
      await fetchDateBase();
      await renderMiniCard();
      localStorage.setItem('pokemonOverview', JSON.stringify(defaultPokeData));
    }
  } catch (error) {console.error('Error in renderMiniCard:', error);}
  finally {toggleLoader(false);}
}

function loadPokemonFromCache(cachedData) {
  defaultPokeData = cachedData;
  defaultPokeIndex = defaultPokeData.map(pokemon => {
    return { name: pokemon.name, url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/` };
  });
  let miniCardHtml = buildCachedMiniCardsHtml(defaultPokeData);
  document.getElementById("mini_card").innerHTML = miniCardHtml;
}

function buildCachedMiniCardsHtml(dataArray) {
  let miniCardHtml = " "; 
  for (let index = 0; index < dataArray.length; index++) {
    let pokemonCard = dataArray[index];
    let pokemonTypeColor = colorBackgroundImage[pokemonCard.types[0].type.name].color;      
    miniCardHtml += miniCardType(pokemonCard, pokemonTypeColor);   
  }
  return miniCardHtml;
}

async function fetchDateBase(startLimitUrl) {
    let response = await fetch(baseUrl);
    let responseAsJson = await response.json();
    defaultPokeIndex = responseAsJson.results;   
};

async function renderMiniCard() {
  try {
    toggleLoader(true);
    let miniCard = await buildMiniCardsHtml();
    document.getElementById("mini_card").innerHTML = miniCard;
  }
  catch (error) {console.error('Error in renderMiniCard:', error);}
  finally {toggleLoader(false);} 
};

async function buildMiniCardsHtml() {
  let miniCardHtml =  " ";
  for (let index = 0; index < defaultPokeIndex.length; index++) {
        let indexId = index + 1;
        let cardData = await fetchPokemon(indexId);
        defaultPokeData.push(cardData);
        let pokemonCard = defaultPokeData[index];
        let pokemonTypeColor = colorBackgroundImage[cardData.types[0].type.name].color;      
        miniCardHtml += miniCardType(pokemonCard, pokemonTypeColor);   
    }
    return miniCardHtml;
};

function saveToMyCards(defaultPokeData) {
  let myCollection = localStorage.getItem('myCards') ? JSON.parse(localStorage.getItem('myCards')) : [];
  let alreadyExists = myCollection.some(pokemon => pokemon.id === defaultPokeData.id);
  if (!alreadyExists) {
    myCollection.push(defaultPokeData); 
    localStorage.setItem('myCards', JSON.stringify(myCollection));
    console.log(`${defaultPokeData.name} has been saved to your cards!`);
  } else {
    console.log(`${defaultPokeData.name} is already in your collection.`);
  }
}

async function renderModalCard(pokemonId) {
  try {
    if (document.activeElement) document.activeElement.blur();
    toggleLoader(true);
    let { pokemon, descriptionText, evolutionChain, moveData } = await loadAllModalData(pokemonId);
    let movesDataTemplate = templateMoves(moveData);
    let pokemonTypeColor = colorBackgroundImage[pokemon.types[0].type.name].color;
    let modalCard = templateModalCard(pokemon, pokemonTypeColor, descriptionText, evolutionChain, movesDataTemplate);
    document.getElementById("modal_card").innerHTML = modalCard;
    if (!dialogRef.open) {toggleDialog();}
    } 
  catch (error) {console.error('Error in renderModalCard:', error);}
  finally {toggleLoader(false);}
};



async function loadAllModalData(pokemonId) {
    try {
      document.getElementById('modal_card').innerHTML = '';
      toggleLoader(true);
      let cachedData = localStorage.getItem('pokemon_' + pokemonId);
      if (cachedData) {return JSON.parse(cachedData);}
      return await fetchAndCachePokemonData(pokemonId);    
    } 
    catch (error) {console.error('Error in loadAllModalData:', error);} 
    finally {toggleLoader(false);}
  };

async function fetchAndCachePokemonData(pokemonId) {
  let pokemon = await fetchPokemon(pokemonId);
  let dataSpecies = await fetchSpecies(pokemonId);
  let moveData = await fetchMoveDetails(pokemon);
  let evolutionChain = await EvolutionSpecies(pokemon, dataSpecies);
  let descriptionText = descriptionData(dataSpecies);
  let cacheData = {pokemon, descriptionText, evolutionChain, moveData};
  localStorage.setItem('pokemon_' + pokemonId, JSON.stringify(cacheData));
  return cacheData;
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
      throw new Error(`Pokémon ID/Name "${pokemonId}" not found.`);
    }
    let dataPokemon = await response.json();
    return formatPokemonData(dataPokemon);
  }
  catch (error) {console.error('Error fetchPokemon:', error);
  throw error;
  } 
};

function formatPokemonData(dataPokemon) {
let totalValue = dataPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  return {
    id: dataPokemon.id,
    name: dataPokemon.name,
    sprites: dataPokemon.sprites.other['official-artwork'].front_default,
    pixelSprite: dataPokemon.sprites.front_default,
    types: dataPokemon.types,
    moves: dataPokemon.moves.slice(0, 3),
    height: dataPokemon.height,
    weight: dataPokemon.weight,
    stats: extractStats(dataPokemon.stats, totalValue)
  };
}

function extractStats(statsArray, total) {
  return {
    hp: statsArray[0].base_stat,
    attack: statsArray[1].base_stat,
    defense: statsArray[2].base_stat,
    spAtk: statsArray[3].base_stat,
    spDef: statsArray[4].base_stat,
    speed: statsArray[5].base_stat,
    total: total
  };
}

async function fetchSpecies(pokemonId) {
  try {
  let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
  let species = await speciesResponse.json();
  return species;  
  }
  catch (error) {console.error('Error fetchSpecies PokeAPI :', error);}
};

async function fetchEvolutionChain(dataSpecies) {
  try {
    let evolutionChainUrl = dataSpecies.evolution_chain.url;
    let evolutionResponse = await fetch(evolutionChainUrl);
    let evolutionData = await evolutionResponse.json();
  return evolutionData;  
  }
  catch (error) {console.error('Error fetchEvolutionChain :', error);}
};

async function fetchMoveDetails(pokemon) {
  try {
    let moveMaxNumber = Math.min(3, pokemon.moves.length);
    let movesDetails = [ ];
    for (let index = 0; index < moveMaxNumber; index++) {   
      let cleanedMove = await fetchSingleMove(pokemon.moves[index].move.url);
      movesDetails.push(cleanedMove);
    } 
    return movesDetails;
  } catch (error) {
    console.error("Error fetchMoveDetails:", error);
    return [];
  }
}

async function fetchSingleMove(url) {
  let response = await fetch(url);
  let data = await response.json();
  return {
    name: data.name,
    type: { name: data.type.name }, 
    power: data.power, 
    pp: data.pp, 
    accuracy: data.accuracy
  };
}

async function getEvolutionChainData(current) {
  let evolutionLineData = [];
  while (current) {
      let urlParts = current.species.url.split('/');
      let evolutionId = parseInt(urlParts[urlParts.length - 2]);
      let pokemonData = await fetchPokemon(evolutionId);
      evolutionLineData.push({id: evolutionId, name: current.species.name, 
        level: current.evolution_details?.[0]?.min_level || 1, 
        imageUrl: pokemonData.pixelSprite 
      });
      current = current.evolves_to[0];
    } return evolutionLineData;
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

function mapsPokemon(direction) {
  let indexNumber = modalId;
  if (direction === 'before') {
    if ( indexNumber >= defaultPokeIndex.length) {indexNumber = 0;}
    indexNumber = indexNumber + 1;
    } else if (direction === 'back') {
      if ( indexNumber <= 1) {indexNumber = defaultPokeIndex.length;}
      else {indexNumber = indexNumber - 1;}   
    } 
    updatePokemonModal(indexNumber, direction);
}

async function updatePokemonModal(indexNumber, direction) {
   try {
    toggleLoader(true);
    modalId = indexNumber;
    pokemonId = indexNumber.toString();
    await renderModalCard(pokemonId);
  } catch (error) {console.error(`MapsPokemon error (${direction}):`, error);}
    finally {toggleLoader(false);} 
}

async function changePokemonLimit(action) {
  if (action === 'fewer' && startLimitUrl <= 20) {return}
  if (action === 'more') {startLimitUrl = startLimitUrl + 10;}
  else if (action === 'base') {startLimitUrl = 20;}
  else if (action === 'fewer') {startLimitUrl = startLimitUrl - 10;}
  await reloadPokemonData(action);
}

async function reloadPokemonData(action) {
    try {
    toggleLoader(true);
    updateFewerButton(); 
      baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
      defaultPokeIndex = [];
      defaultPokeData = [];
      await init();
  } catch (error) {console.error(`changePokemonLimit error (${action}):`, error);}
  finally {toggleLoader(false);} 
}

function updateFewerButton() {
  let fewerButton = document.getElementById("fewer_button");
  if (startLimitUrl <= 20) {
    fewerButton.classList.replace("d-flex", "d-none");
  } else {
    fewerButton.classList.replace("d-none", "d-flex");
  }
}

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
    errorMessage.textContent = 'No Pokémon found!';
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

function closePokemonModal() {
    toggleDialog();
}