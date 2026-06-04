function miniCardTypeOne (pokemon, pokemonTypeColor) {
    return `<div class="card border-success mb-3 poke-mini-card" style=" background-color: ${pokemonTypeColor}"  
                data-bs-toggle="modal" 
                data-bs-target="#exampleModal" 
                data-id="${pokemon.id}">

                <div class="card-header bg-transparent border-success  dpf-sb-center w-100">
                    <h5 class="fw-bold m-0">${pokemon.name}</h5>
                    <p class="border rounded-pill px-2 py-1 fw-bold m-0">#${pokemon.id}</p>
                </div>
                <div class="card-body text-success dpf-flex-column-center w-100">
                    
                    <img src="${pokemon.imageUrl}" alt="${pokemon.name}" class="mini-card-img">
                    
                     <div class="card-body dpf-sb-center gap-2">
                        <img src="./assets/icons/pokemon-type-icons-main/${pokemon.types[0]}.svg" alt="${pokemon.types[0]}" class="type-logo border rounded-pill">

                        <p class="border rounded-pill px-2 py-1 fw-bold  m-0">${pokemon.types[0]}</p>
                        
                     </div>
                </div>              
            </div>`
};

function miniCardTypeTwo (pokemon, pokemonTypeColor, secondaryTypeColor) {
    return `<div class="card border-success mb-3 poke-mini-card" style=" background-color: ${pokemonTypeColor}"  
                data-bs-toggle="modal" 
                data-bs-target="#exampleModal" 
                data-id="${pokemon.id}">

                <div class="card-header bg-transparent border-success  dpf-sb-center w-100">
                    <h5 class="fw-bold m-0">${pokemon.name}</h5>
                    <p class="border rounded-pill px-2 py-1 fw-bold m-0">#${pokemon.id}</p>
                </div>
                <div class="card-body text-success dpf-flex-column-center w-100">
                    
                    <img src="${pokemon.imageUrl}" alt="${pokemon.name}" class="mini-card-img">
                    
                     <div class="card-body dpf-sb-center gap-2">
                        <img src="./assets/icons/pokemon-type-icons-main/${pokemon.types[0]}.svg" alt="${pokemon.types[0]},${pokemon.types[1]} " class=" border rounded-pill type-logo">

                        <p class="border rounded-pill px-2 py-1 fw-bold  m-0">${pokemon.types[0]}</p>
                        <p class="border rounded-pill px-2 py-1 fw-bold  m-0" style="background-color: ${secondaryTypeColor};" >${pokemon.types[1]}</p>
                     </div>
                </div>              
            </div>`
};


function templateModalCard (pokemon, pokemonTypeColor) {

    // total berechnung mit einer schleife lösen !!!
    let total = pokemon.stats[0].base_stat + pokemon.stats[1].base_stat + pokemon.stats[2].base_stat + pokemon.stats[3].base_stat + pokemon.stats[4].base_stat + pokemon.stats[5].base_stat;
    let maxStat = 255;
    let maxStatTotal = 720;


    // let baseStats = {
    //   types: data.types.map(type => type.type.name),
    // };

    console.log(pokemon.stats[0].base_stat);
    return `
    <div class="dpf-fe-center p-2">
                        <button type="button" class="btn-close p-1" style="height: 16px;" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <section class="card border rounded-3 border-5 w-100 h-100" style="background-color: ${pokemonTypeColor};">
                        <div class="modal-header dpf-sb-center">
                            <p class="border rounded-pill px-2 py-1 m-0"> 
                                <img src="./assets/icons/pokemon-type-icons-main/${pokemon.types[0].type.name}.svg" alt="" class="type-logo-mini"> 
                                <b>BASIC</b>
                            </p>                          
                            <h1 class="modal-title fs-5 m-0" id="exampleModalLabel">${pokemon.name}</h1>
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
                                                    <p class="border-end px-1 py-1 m-0">${pokemon.types[0].type.name}</p>
                                                    <p class=" px-1 py-1 m-0">Poison</p>
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
                                                <p class="mb-0">"A strange seed was planted on its back at birth.</p>
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
                                                    <div class="progress-bar bg-success" style="width: ${(pokemon.stats[0].base_stat / maxStat) * 100}%"> ${Math.round((pokemon.stats[0].base_stat / maxStat) * 100)}%</div>
                                                </div>
                                            </div>

                                            <!-- Attack -->
                                            <div class="d-flex align-items-center gap-1 w-100">
                                                <p class="fw-bold text-start" style="width: 70px;">Attack:</p>
                                                <p style="width: 30px;"> ${pokemon.stats[1].base_stat}</p>
                                                <div class="progress flex-grow-1" style="height: 12px;">
                                                    <div class="progress-bar bg-danger" style="width: ${(pokemon.stats[1].base_stat / maxStat) * 100}%"> ${Math.round((pokemon.stats[1].base_stat / maxStat) * 100)}%</div>
                                                </div>
                                            </div>

                                            <!-- Defense -->
                                            <div class="d-flex align-items-center gap-1 w-100">
                                                <p class="fw-bold text-start" style="width: 70px;">Defense:</p>
                                                <p style="width: 30px;"> ${pokemon.stats[2].base_stat}</p>
                                                <div class="progress flex-grow-1" style="height: 12px;">
                                                    <div class="progress-bar bg-warning" style="width: ${(pokemon.stats[2].base_stat / maxStat) * 100}%"> ${Math.round((pokemon.stats[2].base_stat / maxStat) * 100)}%</div>
                                                </div>
                                            </div>

                                               <!-- Defense -->
                                            <div class="d-flex align-items-center gap-1 w-100">
                                                <p class="fw-bold text-start" style="width: 70px;">Sp.Atk:</p>
                                                <p style="width: 30px;"> ${pokemon.stats[3].base_stat}</p>
                                                <div class="progress flex-grow-1" style="height: 12px;">
                                                    <div class="progress-bar bg-warning" style="width: ${(pokemon.stats[3].base_stat / maxStat) * 100}%"> ${Math.round((pokemon.stats[3].base_stat / maxStat) * 100)}%</div>
                                                </div>
                                            </div>

                                            <div class="d-flex align-items-center gap-1 w-100">
                                                <p class="fw-bold text-start" style="width: 70px;">Sp.Def:</p>
                                                <p style="width: 30px;"> ${pokemon.stats[4].base_stat}</p>
                                                <div class="progress flex-grow-1" style="height: 12px;">
                                                    <div class="progress-bar bg-warning" style="width: ${(pokemon.stats[4].base_stat / maxStat) * 100}%"> ${Math.round((pokemon.stats[4].base_stat / maxStat) * 100)}%</div>
                                                </div>
                                            </div>

                                            <div class="d-flex align-items-center gap-1 w-100">
                                                <p class="fw-bold text-start" style="width: 70px;">Speed:</p>
                                                <p style="width: 30px;"> ${pokemon.stats[5].base_stat}</p>
                                                <div class="progress flex-grow-1" style="height: 12px;">
                                                    <div class="progress-bar bg-warning" style="width: ${(pokemon.stats[5].base_stat / maxStat) * 100}%"> ${Math.round((pokemon.stats[5].base_stat / maxStat) * 100)}%</div>
                                                </div>
                                            </div>

                                            <div class="d-flex align-items-center gap-1 w-100">
                                                <p class="fw-bold text-start" style="width: 70px;">Total:</p>
                                                <p style="width: 30px;"> ${total}</p>
                                                <div class="progress flex-grow-1" style="height: 12px;">
                                                    <div class="progress-bar bg-warning" style="width: ${(total / maxStatTotal) * 100}%"> ${Math.round((total / maxStatTotal) * 100)}%</div>
                                                </div>
                                            </div>
                                        </div> 
                                    </div>


                                    <!-- evolution -->
                                    <div class="tab-pane fade" id="nav-evolution" role="tabpanel" aria-labelledby="nav-evolution-tab" tabindex="0">
                                        <div class="d-flex flex-column gap-2 px-3 py-2 lh-1">
                                            <div class="dpf-center gap-3 rounded p-2">
                                                <div class=" dpf-flex-column-center">
                                                    <p class="mb-0 fw-bold">Basic</p>
                                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
                                                        alt="Bulbasaur" class="img-fluid" style="width: 48px;">
                                                    <p class="mb-0 ">#001 Bulbasaur</p>
                                                    <p class="mb-0 "> Level 16</p>
                                                </div>→
                                                <div class=" dpf-flex-column-center">
                                                    <p class="mb-0 fw-bold">Phase 1</p>
                                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png"
                                                        alt="Ivysaur" class="img-fluid" style="width: 48px;">
                                                    <p class="mb-0 ">#002 Ivysaur</p>
                                                    <p class="mb-0 "> Level 32</p>
                                                </div>→

                                                <div class=" dpf-flex-column-center">
                                                    <p class="mb-0 fw-bold">Phase 2</p>
                                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png"
                                                        alt="Ivysaur" class="img-fluid" style="width: 48px;">
                                                    <p class="mb-0 ">#003 Venusaur</p>
                                                    <p class="mb-0 "> Max. Level</p>
                                                </div>
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
                                                    <p class="badge bg-success">Grass</p>
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
                                                    <p>Power: 35</p>
                                                    <p>PP: 25</p>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <p>Accuracy: 100%</p>
                                                </div>
                                            </div>

                                        <!-- Weitere Moves hier einfügen -->
                                        </div>

                                    </div>
                                </div>
                     </section>
                     <div class="modal-footer dpf-center-x border-0 p-1">                                      
                        <button class="btn" onclick="imageBack()" aria-label="Image back button" tabindex="0"> < </button>
                        <!-- <p id="imageNumber" class="pictureNumber" aria-label="Image Number" ></p>-->
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button class="btn" onclick="imageBefore()" aria-label="Image Before button" tabindex="0"> > </button>                                                              
                    </div>`
};
