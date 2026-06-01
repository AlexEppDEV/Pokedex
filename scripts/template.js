function templateMiniCard (pokemon, pokemonTypeColor) {
    return `<div class="card border-success mb-3 poke-mini-card" style=" background-color: ${pokemonTypeColor}"  data-bs-toggle="modal" data-bs-target="#exampleModal">
                <div class="card-header bg-transparent border-success  dpf-sb-center w-100">
                    <h5 class="fw-bold m-0">${pokemon.name}</h5>
                    <p class="border rounded-pill px-2 py-1 fw-bold m-0">#${pokemon.id}</p>
                </div>
                <div class="card-body text-success dpf-flex-column-center w-100">
                    
                    <img src="${pokemon.imageUrl}" alt="" class="mini-card-img">
                    
                     <div class="card-body dpf-sb-center gap-2">
                        <!-- <h5 class="fw-bold">Type</h5> -->
                        <img src="./assets/icons/pokemon-type-icons-main/${pokemon.types[0]}.svg" alt="" class="type-logo p-1">

                        <p class="border rounded-pill px-2 py-1 fw-bold  m-0">${pokemon.types[0]}</p>
                        <p class="border rounded-pill px-2 py-1 fw-bold  m-0">${pokemon.types[1]}</p>
                     </div>
                </div>              
            </div>`
};