function miniCardType(pokemonCard, pokemonTypeColor) {
  return `
          <li>
            <button class="card mb-3 poke-mini-card" style="background-color: ${pokemonTypeColor}"       
                    data-id="${pokemonCard.id}" aria-label="${pokemonCard.name}, number ${pokemonCard.id}">        
                <div class="card-header bg-transparent dpf-sb-center w-100">
                    <h5 class="fw-bold m-0 capitalize">${pokemonCard.name}</h5>
                    <p class="border rounded-pill px-2 py-1 fw-bold m-0">#${pokemonCard.id}</p>
                </div>
                <div class="card-body text-success dpf-flex-column-center w-100">                   
                    <img src="${pokemonCard.sprites}" alt="${pokemonCard.name}" class="mini-card-img">                   
                    <div class="card-body dpf-sb-center gap-2">
                        <img src="./assets/icons/pokemon-type-icons-main/${pokemonCard.types[0].type.name}.svg" alt="${pokemonCard.types[0].type.name}" class="type-logo border rounded-pill">
                        ${filterTypes(pokemonCard)}   
                    </div>
                </div>
            </button>
          </li>
        `;
}

function templateModalCard(
  pokemon,
  pokemonTypeColor,
  descriptionText,
  evolutionChain,
  movesDataTemplate,
) {
  return `
    <div class="card border rounded-3 border-5 w-100 h-100" style="background-color: ${pokemonTypeColor};">
      <div class="modal-header dpf-sb-center w-100 p-1">
        <button type="button" onclick="closePokemonModal()" class="btn-close position-absolute top-0 start-50 translate-middle-x m-0 rounded-5 rounded-top-0 bg-white border border-2 border-dark"
          aria-label="Close" style="font-size: 0.6rem; padding: 0.3rem; z-index: 10;">
        </button>
        <img src="./assets/icons/pokemon-type-icons-main/${pokemon.types[0].type.name}.svg" alt="" class="type-logo-mini border rounded-pill px-0 py-0 m-0">
        <div class="dpf-sb-center">
        
          <button class="btn" onclick="mapsPokemon('back')" aria-label="Image back button" tabindex="0"> < </button>
          <h1 class="modal-title fs-5 m-0 capitalize" id="exampleModalLabel">${pokemon.name}</h1>
          <button class="btn" onclick="mapsPokemon('before')" aria-label="Image Before button" tabindex="0"> > </button>
        </div>
        <p class="border rounded-pill px-2 py-1 fw-bold m-0">#${pokemon.id}</p>
      </div>
      <div class="modal-body p-1">
        <div class="card-body text-success dpf-center border rounded-top modal-img" style="height: 200px; background-image: url(./assets/img/backgrund-img/${pokemon.types[0].type.name}.jpg);">
          <img src="${pokemon.sprites}" alt="${pokemon.name}" class="modal-card-img">
        </div>
        <div class="card text-center dpf-flex-column-center rounded-top-0 p-2" style="height: 256px;">
          <nav class="dpf-fs-center lh-1 h-auto w-100">
            <div class="nav nav-tabs d-flex flex-nowrap lh-1 " id="nav-tab" role="tablist">
              <button class="nav-link active text-dark fw-bold flex-grow-1 p-1 border-3" id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about" type="button" role="tab" aria-controls="nav-about" aria-selected="true">About</button>
              <button class="nav-link text-secondary fw-bold flex-grow-1 p-1 border-3" id="nav-stats-tab" data-bs-toggle="tab" data-bs-target="#nav-stats" type="button" role="tab" aria-controls="nav-stats" aria-selected="false">Stats</button>
              <button class="nav-link text-secondary fw-bold flex-grow-1 p-1 border-3" id="nav-evolution-tab" data-bs-toggle="tab" data-bs-target="#nav-evolution" type="button" role="tab" aria-controls="nav-evolution" aria-selected="false">Evolution</button>
              <button class="nav-link text-secondary fw-bold flex-grow-1 p-1 border-3" id="nav-moves-tab" data-bs-toggle="tab" data-bs-target="#nav-moves" type="button" role="tab" aria-controls="nav-moves" aria-selected="false">Moves</button>
            </div>
          </nav>
          <div class="tab-content d-flex flex-column flex-grow-1 w-100 m-0" id="nav-tabContent" style="min-height: 0;">
            <div class="tab-pane fade show active h-100 w-100 lh-1 border-top border-2 overflow-y-auto" id="nav-about" role="tabpanel">
              <div class="d-flex flex-column gap-2 px-3 py-2 w-100">
                <div class="dpf-sb-center gap-2">
                  <p class="fw-bold">Type:</p>
                  <div class="d-flex gap-1">${filterTypes(pokemon)}</div>
                </div>
                <div class="dpf-sb-center gap-1">
                  <p class="fw-bold">Height:</p>
                  <p>${pokemon.height / 10} m</p>
                </div>
                <div class="dpf-sb-center gap-1">
                  <p class="fw-bold">Weight:</p>
                  <p>${pokemon.weight / 10} kg</p>
                </div>
                <div class="d-flex flex-column gap-1">
                  <p class="fw-bold">Description:</p>
                  <p class="mb-0">${descriptionText}</p>
                </div>
              </div>
            </div>
            <div class="tab-pane fade h-100 w-100 border-top border-2" id="nav-stats" role="tabpanel" aria-labelledby="nav-stats-tab" tabindex="0">
              <div class="dpf-flex-column-start gap-1 px-3 py-2 w-100 lh-1">
                <div class="dpf-fs-center gap-1 w-100">
                  <p class="fw-bold text-start" style="width: 70px;">HP:</p>
                  <p style="width: 30px;">${pokemon.stats.hp}</p>
                  <div class="progress flex-grow-1" style="height: 12px;">
                    <div class="progress-bar bg-success" style="width: ${(pokemon.stats.hp / 255) * 100}%"></div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-1 w-100">
                  <p class="fw-bold text-start" style="width: 70px;">Attack:</p>
                  <p style="width: 30px;">${pokemon.stats.attack}</p>
                  <div class="progress flex-grow-1" style="height: 12px;">
                    <div class="progress-bar bg-danger" style="width: ${(pokemon.stats.attack / 255) * 100}%"></div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-1 w-100">
                  <p class="fw-bold text-start" style="width: 70px;">Defense:</p>
                  <p style="width: 30px;">${pokemon.stats.defense}</p>
                  <div class="progress flex-grow-1" style="height: 12px;">
                    <div class="progress-bar bg-primary" style="width: ${(pokemon.stats.defense / 255) * 100}%"></div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-1 w-100">
                  <p class="fw-bold text-start" style="width: 70px;">Sp.Atk:</p>
                  <p style="width: 30px;">${pokemon.stats.spAtk}</p>
                  <div class="progress flex-grow-1" style="height: 12px;">
                    <div class="progress-bar bg-danger-subtle" style="width: ${(pokemon.stats.spAtk / 255) * 100}%"></div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-1 w-100">
                  <p class="fw-bold text-start" style="width: 70px;">Sp.Def:</p>
                  <p style="width: 30px;">${pokemon.stats.spDef}</p>
                  <div class="progress flex-grow-1" style="height: 12px;">
                    <div class="progress-bar bg-primary-subtle" style="width: ${(pokemon.stats.spDef / 255) * 100}%"></div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-1 w-100">
                  <p class="fw-bold text-start" style="width: 70px;">Speed:</p>
                  <p style="width: 30px;">${pokemon.stats.speed}</p>
                  <div class="progress flex-grow-1" style="height: 12px;">
                    <div class="progress-bar bg-info" style="width: ${(pokemon.stats.speed / 255) * 100}%"></div>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-1 w-100">
                  <p class="fw-bold text-start" style="width: 70px;">Total:</p>
                  <p style="width: 30px;">${pokemon.stats.total}</p>
                  <div class="progress flex-grow-1" style="height: 12px;">
                    <div class="progress-bar bg-warning" style="width: ${(pokemon.stats.total / 720) * 100}%"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade h-100 w-100 border-top border-2" id="nav-evolution" role="tabpanel" aria-labelledby="nav-evolution-tab" tabindex="0">
              <div class="d-flex flex-column gap-2 px-2 py-2 lh-1 w-100">
                <div class="dpf-sa-center rounded">${evolutionChain}</div>
              </div>
            </div>
            <div class="tab-pane fade h-100 w-100 border-top border-2" id="nav-moves" role="tabpanel" aria-labelledby="nav-moves-tab" tabindex="0">
              <div class="d-flex flex-column gap-2 px-3 py-2 lh-1 h-100 overflow-y-auto ">${movesDataTemplate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function templateEvolutionBlock(evolutionLine, phaseLine) {
  return `     
      <div class=" dpf-flex-column-center">
          <p class="mb-0 fw-bold">${phaseLine}</p>
          <img src="${evolutionLine.imageUrl}"
              alt="${evolutionLine.name}" class="img-fluid" style="width: 48px;">
          <p class="mb-0 ">#${evolutionLine.id}</p>
          <p class="mb-0 capitalize">${evolutionLine.name}</p>
          <p class="mb-0 ">Level: ${evolutionLine.level}</p>
      </div>`; 
}

function templateMovesBlock(moveData) {
  return ` 
            <div class=" px-2 pt-1">
                <div class="dpf-flex-start mt-1" >
                    <img src="./assets/icons/pokemon-type-icons-main/${moveData.type.name}.svg" alt="${moveData.type.name}" class="type-logo-mini-move border rounded-pill px-0 py-0 m-0">
                    <p class="fw-bold capitalize p-1 px-1" >${moveData.name}</p>                 
                </div>
                <div class="w-100 " style="font-size: 0.9rem;">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="text-secondary fw-medium">Power</span>
                        <span class="fw-bold text-dark">${moveData.power || "—"}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                        <span class="text-secondary fw-medium">PP</span>
                        <span class="fw-bold text-dark">${moveData.pp || "—"}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span class="text-secondary fw-medium">Accuracy</span>
                        <span class="fw-bold text-dark">${moveData.accuracy ? moveData.accuracy + "%" : "—"}</span>
                    </div>
                </div>               
            </div>
        `;
}