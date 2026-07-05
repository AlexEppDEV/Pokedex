
let startLimitUrl = 20;
let baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
let defaultPokeIndex = [];
let defaultPokeData = [];
let modalPokeData = [];
let modalId = 0;
let dialogRef = document.getElementById('exampleModal');

async function init() {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    await loadOverviewCards();
    setupCardClickListeners();
    setupEventListeners();
  }
  catch (error) {
    console.error('Error onload init:', error);
  }
  finally {
    document.getElementById("loader").classList.replace("d-flex", "d-none");
  }
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
    if (event.target === dialogRef) {
        dialogClose();
    }
});
};

async function loadOverviewCards() {
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    let cachedOverview = localStorage.getItem('pokemonOverview');
    let cachedData = cachedOverview ? JSON.parse(cachedOverview) : null;
    if (cachedData && cachedData.length === startLimitUrl) {
      defaultPokeData = cachedData;
      defaultPokeIndex = defaultPokeData.map(pokemon => {
        return { name: pokemon.name, url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/` };
      });
      let miniCardHtml = buildCachedMiniCardsHtml(defaultPokeData);
      document.getElementById("mini_card").innerHTML = miniCardHtml;
    } else {
      await fetchDateBase();
      await renderMiniCard();
      localStorage.setItem('pokemonOverview', JSON.stringify(defaultPokeData));
    }
  }
  catch (error) {console.error('Error in renderMiniCard:', error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}
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
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    let { pokemon, descriptionText, evolutionChain, moveData } = await loadAllModalData(pokemonId);
    let movesDataTemplate = templateMoves(moveData);
    let pokemonTypeColor = colorBackgroundImage[pokemon.types[0].type.name].color;
    let modalCard = templateModalCard(pokemon, pokemonTypeColor, descriptionText, evolutionChain, movesDataTemplate);
    document.getElementById("modal_card").innerHTML = modalCard;
    dialogOpen();
    } 
  catch (error) {console.error('Error in renderModalCard:', error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}
};

function dialogOpen() {
    dialogRef.showModal();        
    dialogRef.classList.add('opened');
}

function dialogClose() {
    dialogRef.close();                
    dialogRef.classList.remove('opened'); 
}

async function loadAllModalData(pokemonId) {
    try {
      document.getElementById('modal_card').innerHTML = '';
      document.getElementById("loader").classList.replace("d-none", "d-flex");
      let cachedData = localStorage.getItem('pokemon_' + pokemonId);
      if (cachedData) {return JSON.parse(cachedData);}   
        let pokemon = await fetchPokemon(pokemonId);
        let dataSpecies = await fetchSpecies(pokemonId);
        let moveData = await fetchMoveDetails(pokemon);
        let evolutionChain = await EvolutionSpecies(pokemon, dataSpecies);
        let descriptionText = descriptionData(dataSpecies);
        let cacheData = { 
          pokemon,
          descriptionText, 
          evolutionChain, 
          moveData 
        };
        localStorage.setItem('pokemon_' + pokemonId, JSON.stringify(cacheData));
        return cacheData;    
    } catch (error) {console.error('Error in loadAllModalData:', error);} 
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
      throw new Error(`Pokémon ID/Name "${pokemonId}" not found.`);
    }
    let dataPokemon = await response.json();
    let totalValue = 0;
    for (let i = 0; i < dataPokemon.stats.length; i++) {totalValue += dataPokemon.stats[i].base_stat; }
    let limitedMoves = dataPokemon.moves.slice(0, 3);
    let defaultPokemon = {
        id: dataPokemon.id,
        name: dataPokemon.name,
        sprites: dataPokemon.sprites.other['official-artwork'].front_default,
        pixelSprite: dataPokemon.sprites.front_default,
        types: dataPokemon.types,
        moves: limitedMoves,
        height: dataPokemon.height,
        weight: dataPokemon.weight,
        stats: {
            hp: dataPokemon.stats[0].base_stat,
            attack: dataPokemon.stats[1].base_stat,
            defense: dataPokemon.stats[2].base_stat,
            spAtk: dataPokemon.stats[3].base_stat,
            spDef: dataPokemon.stats[4].base_stat,
            speed: dataPokemon.stats[5].base_stat,
            total: totalValue}         
      }; 
    return defaultPokemon;
  }
  catch (error) {console.error('Error fetchPokemon:', error);
  throw error;
  } 
};

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
      let dataMoveUrl = pokemon.moves[index].move.url;
      let response = await fetch(dataMoveUrl);
      let data = await response.json();
      let cleanedMove = {
        name: data.name,
        type: {name: data.type.name},
        power: data.power,
        pp: data.pp,
        accuracy: data.accuracy
      };
      movesDetails.push(cleanedMove) ;
    } return movesDetails;
  } catch (error) {
    console.error("Error fetchMoveDetails:", error);
    return [];}};

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

async function mapsPokemon(direction) {
  let indexNumber = modalId;
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");
    if (direction === 'before') {
    if ( indexNumber >= defaultPokeIndex.length) {indexNumber = 0;}
    indexNumber = indexNumber + 1;
    } else if (direction === 'back') {
      if ( indexNumber <= 1) {indexNumber = defaultPokeIndex.length;}
      else {indexNumber = indexNumber - 1;}   
    }
    modalId = indexNumber;
    pokemonId = indexNumber.toString();
    renderModalCard(pokemonId);
  } catch (error) {console.error(`MapsPokemon error (${direction}):`, error);}
    finally {document.getElementById("loader").classList.replace("d-flex", "d-none");} 
}

async function changePokemonLimit(action) {
  if (action === 'more') {startLimitUrl = startLimitUrl + 10;}
  else if (action === 'base') {
    startLimitUrl = 20;
    document.getElementById("fewer_button").classList.replace("d-flex", "d-none");
  } else if (action === 'fewer') {
      if (startLimitUrl <= 20) {
      document.getElementById("fewer_button").classList.replace( "d-flex","d-none");
      return}
    startLimitUrl = startLimitUrl - 10;
  }
  try {
    document.getElementById("loader").classList.replace("d-none", "d-flex");    
    if (startLimitUrl <= 20) {document.getElementById("fewer_button").classList.replace( "d-flex","d-none");}
    else  {document.getElementById("fewer_button").classList.replace( "d-none","d-flex");}
      baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${startLimitUrl}&offset=0`;
      defaultPokeIndex = [];
      defaultPokeData = [];
      await init();
  } catch (error) {console.error(`changePokemonLimit error (${action}):`, error);}
  finally {document.getElementById("loader").classList.replace("d-flex", "d-none");}   
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
    let dialog = document.getElementById('exampleModal');
    dialog.close();
}