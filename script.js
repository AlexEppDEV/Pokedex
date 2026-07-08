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
  } catch (error) {
    console.error('Error onload init:', error);
  } finally {
    toggleLoader(false);
  }
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
}

function setupEventListeners() {
  let searchInput = document.getElementById('search_Input');
  searchInput.addEventListener('input', filterMiniCards);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
  });
  dialogRef.addEventListener("click", function(event) {
    if (event.target === dialogRef) {toggleDialog();}
  });
}

async function loadOverviewCards() {
  try {
    toggleLoader(true);
      await fetchDateBase();
      await renderMiniCard();   
  } catch (error) {
    console.error('Error in loadOverviewCards:', error);
  }
  finally {
    toggleLoader(false);
  }
}

// function loadPokemonFromCache(cachedData) {
//   defaultPokeData = cachedData;
//   defaultPokeIndex = defaultPokeData.map(pokemon => {
//     return { name: pokemon.name, url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/` };
//   });
//   let miniCardHtml = buildCachedMiniCardsHtml(defaultPokeData);
//   document.getElementById("mini_card").innerHTML = miniCardHtml;
// }

// function buildCachedMiniCardsHtml(dataArray) {
//   let miniCardHtml = " "; 
//   for (let index = 0; index < dataArray.length; index++) {
//     let pokemonCard = dataArray[index];
//     let pokemonTypeColor = colorBackgroundImage[pokemonCard.types[0].type.name].color;      
//     miniCardHtml += miniCardType(pokemonCard, pokemonTypeColor);   
//   }
//   return miniCardHtml;
// }


async function fetchDateBase(startLimitUrl) {
  let response = await fetch(baseUrl);
  let responseAsJson = await response.json();
  defaultPokeIndex = responseAsJson.results;   
}

async function renderMiniCard() {
  try {
    toggleLoader(true);
    let miniCard = await buildMiniCardsHtml();
    document.getElementById("mini_card").innerHTML = miniCard;
  } catch (error) {console.error('Error in renderMiniCard:', error);}
  finally {toggleLoader(false);} 
}

async function buildMiniCardsHtml() {
  let miniCardHtml = " ";
  for (let index = 0; index < defaultPokeIndex.length; index++) {
    let indexId = index + 1;
    let cardData = await fetchPokemon(indexId);
    defaultPokeData.push(cardData);
    let pokemonCard = defaultPokeData[index];
    let pokemonTypeColor = colorBackgroundImage[cardData.types[0].type.name].color;      
    miniCardHtml += miniCardType(pokemonCard, pokemonTypeColor);   
  }
  return miniCardHtml;
}

function saveToMyCards(defaultPokeData) {
  let myCollection = localStorage.getItem('myCards') ? JSON.parse(localStorage.getItem('myCards')) : [];
  let alreadyExists = myCollection.some(pokemon => pokemon.id === defaultPokeData.id);
  if (!alreadyExists) {
    myCollection.push(defaultPokeData); 
    // localStorage.setItem('myCards', JSON.stringify(myCollection));
    console.log(`${defaultPokeData.name} has been saved to your cards!`);
  } else {
    console.log(`${defaultPokeData.name} is already in your collection.`);
  }
}

async function fetchPokemon(pokemonId) {
    let cachedData = localStorage.getItem('pokemon_base_' + pokemonId);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return await fetchPokemonFromApi(pokemonId);
}

async function fetchPokemonFromApi(pokemonId) {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) throw new Error(`Pokémon ID/Name "${pokemonId}" not found.`);
    let data = await response.json();
    let formatted = formatPokemonData(data);
    localStorage.setItem('pokemon_base_' + pokemonId, JSON.stringify(formatted));
    return formatted;
  } catch (error) {
    console.error('Error fetchPokemon:', error);
    throw error;
  } 
}

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

async function changePokemonLimit(action) {
  if (action === 'fewer' && startLimitUrl <= 20) return;
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