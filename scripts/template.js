function miniCardTypeOne (pokemonCard, pokemonTypeColor) {

    let typesHtml = filterTypes(pokemonCard);

    return `<div class="card border-success mb-3 poke-mini-card" style=" background-color: ${pokemonTypeColor}"  
                data-bs-toggle="modal" 
                data-bs-target="#exampleModal" 
                data-id="${pokemonCard.id}">

                <div class="card-header bg-transparent border-success  dpf-sb-center w-100">
                    <h5 class="fw-bold m-0">${pokemonCard.name}</h5>
                    <p class="border rounded-pill px-2 py-1 fw-bold m-0">#${pokemonCard.id}</p>
                </div>
                <div class="card-body text-success dpf-flex-column-center w-100">
                    
                    <img src="${pokemonCard.sprites.other['official-artwork'].front_default}" alt="${pokemonCard.name}" class="mini-card-img">
                    
                     <div class="card-body dpf-sb-center gap-2">
                        <img src="./assets/icons/pokemon-type-icons-main/${pokemonCard.types[0].type.name}.svg" alt="${pokemonCard.types[0].type.name}" class="type-logo border rounded-pill">

                         ${typesHtml}
                        
                     </div>
                </div>              
            </div>`
};


function templateModalCard (pokemon, pokemonTypeColor,descriptionText,evolutionChain) {

    // total berechnung mit einer schleife lösen !!!
    let total = pokemon.stats[0].base_stat + pokemon.stats[1].base_stat + pokemon.stats[2].base_stat + pokemon.stats[3].base_stat + pokemon.stats[4].base_stat + pokemon.stats[5].base_stat;
    let maxStat = 255;
    let maxStatTotal = 720;
    let typesHtml = filterTypes(pokemon);
    console.log(pokemon.moves[0])

    return `
        <div class="dpf-fe-center p-2 ">
            <button type="button" class="btn-close p-1" style="height: 16px;" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <section class="card border rounded-3 border-5 w-100 h-100" style="background-color: ${pokemonTypeColor};">
            <div class="modal-header dpf-sb-center">
                    
                <img src="./assets/icons/pokemon-type-icons-main/${pokemon.types[0].type.name}.svg" alt="" class="type-logo-mini border rounded-pill px-0 py-0 m-0">                                
                <div class="dpf-sb-center">
                    <button class="btn" onclick="pokemonBack()" aria-label="Image back button" tabindex="0"> < </button>                 
                    <h1 class="modal-title fs-5 m-0" id="exampleModalLabel">${pokemon.name}</h1>
                    <button class="btn" onclick="pokemonBefore()" aria-label="Image Before button" tabindex="0"> > </button>
                </div>
                <p class="border rounded-pill px-2 py-1 fw-bold m-0">#${pokemon.id}</p>                           
            </div>

            <div class="modal-body ">
                <div class="card-body text-success dpf-center border rounded-top modal-img" style="height: 200px; background-image: url(./assets/img/backgrund-img/${pokemon.types[0].type.name}.jpg) ;">
                    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" class="modal-card-img">  
                </div>
                <div class="card text-center dpf-flex-column-center rounded-top-0 p-2" style="height: 256px;">

                    <nav class="dpf-fs-center lh-1">
                        <div class="nav nav-tabs d-flex" id="nav-tab lh-1" role="tablist">
                            <button class="nav-link active text-dark fw-bold" id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about" type="button" role="tab" aria-controls="nav-about" aria-selected="true">About</button>
                            <button class="nav-link text-secondary fw-bold" id="nav-stats-tab" data-bs-toggle="tab" data-bs-target="#nav-stats" type="button" role="tab" aria-controls="nav-stats" aria-selected="false">Base stats</button>
                            <button class="nav-link text-secondary fw-bold" id="nav-evolution-tab" data-bs-toggle="tab" data-bs-target="#nav-evolution" type="button" role="tab" aria-controls="nav-evolution" aria-selected="false">Evolution</button>
                            <button class="nav-link text-secondary fw-bold" id="nav-moves-tab" data-bs-toggle="tab" data-bs-target="#nav-moves" type="button" role="tab" aria-controls="nav-moves" aria-selected="false">Moves</button>
                        </div>
                    </nav>
                    <div class="tab-content d-flex flex-column vh-100 w-100 m-0" id="nav-tabContent">

                        <div class="tab-pane fade show active w-100 lh-1" id="nav-about" role="tabpanel">
                            <div class="d-flex flex-column gap-2 px-3 py-2 w-100">
                                <!-- Typen -->
                                <div class="dpf-sb-center gap-2">
                                    <p class="fw-bold">Type:</p>
                                    <div class="d-flex gap-1">
                                            ${typesHtml}
                                        
                                    </div>
                                </div>

                                <!-- Größe -->
                                <div class="dpf-sb-center gap-1">
                                    <p class="fw-bold">Height:</p>
                                    <p>${pokemon.height} m</p>
                                </div>

                                <!-- Gewicht -->
                                <div class="dpf-sb-center gap-1">
                                    <p class="fw-bold">Weight:</p>
                                    <p>${pokemon.weight} kg</p>
                                </div>

                                <!-- Beschreibung -->
                                <div class="d-flex flex-column gap-1">
                                    <p class="fw-bold">Description:</p>
                                    <p class="mb-0">${descriptionText}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Basec stats -->
                        <div class="tab-pane fade w-100" id="nav-stats" role="tabpanel" aria-labelledby="nav-stats-tab" tabindex="0">
                            
                            <div class="dpf-flex-column-start gap-1 px-3 py-2 w-100 lh-1">
                                <!-- HP -->
                                <div class="dpf-fs-center gap-1 w-100">
                                    <p class="fw-bold text-start" style="width: 70px;">HP:</p>
                                    <p class=" " style="width: 30px;"> ${pokemon.stats[0].base_stat}</p>
                                    <div class="progress flex-grow-1" style="height: 12px;">
                                        <div class="progress-bar bg-success" style="width: ${(pokemon.stats[0].base_stat / maxStat) * 100}%"></div>
                                    </div>
                                </div>

                                <!-- Attack -->
                                <div class="d-flex align-items-center gap-1 w-100">
                                    <p class="fw-bold text-start" style="width: 70px;">Attack:</p>
                                    <p style="width: 30px;"> ${pokemon.stats[1].base_stat}</p>
                                    <div class="progress flex-grow-1" style="height: 12px;">
                                        <div class="progress-bar bg-danger" style="width: ${(pokemon.stats[1].base_stat / maxStat) * 100}%"></div>
                                    </div>
                                </div>

                                <!-- Defense -->
                                <div class="d-flex align-items-center gap-1 w-100">
                                    <p class="fw-bold text-start" style="width: 70px;">Defense:</p>
                                    <p style="width: 30px;"> ${pokemon.stats[2].base_stat}</p>
                                    <div class="progress flex-grow-1" style="height: 12px;">
                                        <div class="progress-bar bg-warning" style="width: ${(pokemon.stats[2].base_stat / maxStat) * 100}%"></div>
                                    </div>
                                </div>

                                    <!-- Defense -->
                                <div class="d-flex align-items-center gap-1 w-100">
                                    <p class="fw-bold text-start" style="width: 70px;">Sp.Atk:</p>
                                    <p style="width: 30px;"> ${pokemon.stats[3].base_stat}</p>
                                    <div class="progress flex-grow-1" style="height: 12px;">
                                        <div class="progress-bar bg-warning" style="width: ${(pokemon.stats[3].base_stat / maxStat) * 100}%"></div>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-1 w-100">
                                    <p class="fw-bold text-start" style="width: 70px;">Sp.Def:</p>
                                    <p style="width: 30px;"> ${pokemon.stats[4].base_stat}</p>
                                    <div class="progress flex-grow-1" style="height: 12px;">
                                        <div class="progress-bar bg-warning" style="width: ${(pokemon.stats[4].base_stat / maxStat) * 100}%"></div>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-1 w-100">
                                    <p class="fw-bold text-start" style="width: 70px;">Speed:</p>
                                    <p style="width: 30px;"> ${pokemon.stats[5].base_stat}</p>
                                    <div class="progress flex-grow-1" style="height: 12px;">
                                        <div class="progress-bar bg-warning" style="width: ${(pokemon.stats[5].base_stat / maxStat) * 100}%"></div>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-1 w-100">
                                    <p class="fw-bold text-start" style="width: 70px;">Total:</p>
                                    <p style="width: 30px;"> ${total}</p>
                                    <div class="progress flex-grow-1" style="height: 12px;">
                                        <div class="progress-bar bg-warning" style="width: ${(total / maxStatTotal) * 100}%"></div>
                                    </div>
                                </div>
                            </div> 
                        </div>


                        <!-- evolution -->
                        <div class="tab-pane fade" id="nav-evolution" role="tabpanel" aria-labelledby="nav-evolution-tab" tabindex="0">
                            <div class="d-flex flex-column gap-2 px-3 py-2 lh-1">
                                <div class="dpf-center gap-3 rounded p-2">
                                    ${evolutionChain}
                                </div>
                            </div>
                        </div>

                        <!-- Moves -->
                        <div class="tab-pane fade" id="nav-moves" role="tabpanel" aria-labelledby="nav-moves-tab" tabindex="0">   
                            <div class="d-flex flex-column gap-2 px-3 py-2 lh-1">
                                <!-- Move 1 -->
                                <div class="px-3 pt-3">
                                    <div class="d-flex justify-content-between">
                                        <p class="fw-bold">${pokemon.moves[0].move.name}</p>
                                        <p class="badge bg-success">type muss rein</p>
                                    </div>
                                    <div class="d-flex justify-content-between mt-1">
                                        <p>Power: 35</p>
                                        <p>PP: 25</p>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <p>Accuracy: 100%</p>
                                    </div>
                                </div>

                                <div class="px-3 pt-1">
                                    <div class="d-flex justify-content-between">
                                        <p class="fw-bold">${pokemon.moves[1].move.name}</p>
                                        <p class="badge bg-success">Grass</p>
                                    </div>
                                    <div class="d-flex justify-content-between mt-1">
                                        <p>Power: ${pokemon.moves[1].move.power}</p>
                                        <p>PP: 25</p>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <p>Accuracy: ${pokemon.moves[1].move.accuracy}%</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
            </section>`
};

function templateEvolutionSpecies(evolutionLineData) {
  let template = '';
  let templateEvolution = '';
  let evolutionName = ['Basic','Phase 1','Phase 2'];

  for (let index = 0; index < evolutionLineData.length; index++) {
    let phaseLine = evolutionName[index];
    template = `     
      <div class=" dpf-flex-column-center">
          <p class="mb-0 fw-bold">${phaseLine}</p>
          <img src="${evolutionLineData[index].imageUrl}"
              alt="${evolutionLineData[index].name}" class="img-fluid" style="width: 48px;">
          <p class="mb-0 ">#${evolutionLineData[index].id}</p>
          <p class="mb-0 ">${evolutionLineData[index].name}</p>
          <p class="mb-0 ">Level: ${evolutionLineData[index].level}</p>
      </div>`;
      templateEvolution += template;
    if (index < evolutionLineData.length - 1) {
      templateEvolution += '→';
    }
  }
  return templateEvolution
};
