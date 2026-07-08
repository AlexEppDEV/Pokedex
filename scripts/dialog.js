function toggleDialog() {
  dialogRef.classList.toggle('opened');
  if (dialogRef.open) {
    dialogRef.close();
  } else {
    dialogRef.showModal();
  }
}

function closePokemonModal() {
  toggleDialog();
}

async function renderModalCard(pokemonId) {
  try {

    if (document.activeElement) document.activeElement.blur();
    document.getElementById('modal_card').innerHTML = '';
    toggleLoader(true);
    let { pokemon, descriptionText, evolutionChain, moveData } = await loadAllModalData(pokemonId);
    let movesDataTemplate = templateMoves(moveData);
    let pokemonTypeColor = colorBackgroundImage[pokemon.types[0].type.name].color;
    let modalCard = templateModalCard(pokemon, pokemonTypeColor, descriptionText, evolutionChain, movesDataTemplate);
    document.getElementById("modal_card").innerHTML = modalCard;
    if (!dialogRef.open) {toggleDialog();}
  } catch (error) {console.error('Error in renderModalCard:', error);}
  finally {toggleLoader(false);}
}

async function loadAllModalData(pokemonId) {
    let cachedData = localStorage.getItem('pokemon_' + pokemonId);
    if (cachedData) {return JSON.parse(cachedData);}
    return await fetchAndCachePokemonData(pokemonId);    
}

async function fetchAndCachePokemonData(pokemonId) {
  let cached = localStorage.getItem('pokemon_data_' + pokemonId);
  let baseObject = cached ? JSON.parse(cached) : { pokemon: await fetchPokemon(pokemonId) };


  let dataSpecies = await fetchSpecies(pokemonId);
  let moveData = await fetchMoveDetails(baseObject.pokemon);
  let evolutionChain = await EvolutionSpecies(baseObject.pokemon, dataSpecies);
  let descriptionText = descriptionData(dataSpecies);

  baseObject.descriptionText = descriptionText;
  baseObject.evolutionChain = evolutionChain;
  baseObject.moveData = moveData;

  // let cacheData = {pokemon, descriptionText, evolutionChain, moveData};
  // localStorage.setItem('pokemon_' + pokemonId, JSON.stringify(cacheData));
  localStorage.setItem('pokemon_data_' + pokemonId, JSON.stringify(baseObject));
  return baseObject;
}

function descriptionData(dataSpecies) {
  return dataSpecies.flavor_text_entries
    .find(entry => entry.language.name === 'en')
    .flavor_text
    .replace(/\f|\n/g, ' ');
}

async function fetchSpecies(pokemonId) {
  try {
    let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    return await speciesResponse.json();  
  } catch (error) {console.error('Error fetchSpecies PokeAPI :', error);}
}

async function fetchEvolutionChain(dataSpecies) {
  try {
    let evolutionChainUrl = dataSpecies.evolution_chain.url;
    let evolutionResponse = await fetch(evolutionChainUrl);
    return await evolutionResponse.json();  
  } catch (error) {console.error('Error fetchEvolutionChain :', error);}
}

async function fetchMoveDetails(pokemon) {
  try {
    let moveMaxNumber = Math.min(3, pokemon.moves.length);
    let movesDetails = [];
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
    name: data.name, type: { name: data.type.name }, 
    power: data.power, pp: data.pp, accuracy: data.accuracy
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
    return;
  }
}

function mapsPokemon(direction) {
  let indexNumber = modalId;
  if (direction === 'before') {
    if (indexNumber >= defaultPokeIndex.length) {indexNumber = 0;}
    indexNumber = indexNumber + 1;
  } else if (direction === 'back') {
    if (indexNumber <= 1) {indexNumber = defaultPokeIndex.length;}
    else {indexNumber = indexNumber - 1;}   
  } 
  updatePokemonModal(indexNumber, direction);
}

async function updatePokemonModal(indexNumber, direction) {
  try {
    toggleLoader(true);
    modalId = indexNumber;
    let pokemonId = indexNumber.toString();
    await renderModalCard(pokemonId);
  } catch (error) {console.error(`MapsPokemon error (${direction}):`, error);}
  finally {toggleLoader(false);} 
}

function templateEvolutionSpecies(evolutionLineData) {
  let templateEvolution = "";
  let evolutionName = ["Basic", "Phase 1", "Phase 2"];
  for (let index = 0; index < evolutionLineData.length; index++) {
    let phaseLine = evolutionName[index];
    let evolutionLine = evolutionLineData[index];
    templateEvolution += templateEvolutionBlock(evolutionLine, phaseLine);
    if (index < evolutionLineData.length - 1) {templateEvolution += "→";}
  }
  return templateEvolution;
}

function templateMoves(moveData) {
  let templateData = "";
  for (let index = 0; index < moveData.length; index++) {
    templateData += templateMovesBlock(moveData[index]);
  }
  return templateData;
}

function filterTypes(pokemon) {
  let pokemonTypes = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    let typeColor = colorBackgroundImage[typeName].color;
    pokemonTypes += `
      <p class="border rounded-pill px-2 py-1 fw-bold m-0 capitalize" style="background-color: ${typeColor};">${typeName}</p>
    `;
  }
  return pokemonTypes;
}