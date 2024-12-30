
// Obtener elementos del DOM
const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('.search-btn');
let URL = "https://pokeapi.co/api/v2/pokemon/";

// Llamara a  151 Pokémon
for (let i = 1; i <= 200; i++) {
  fetch(URL + i)
    .then((response) => response.json())
    .then(data => mostrarPokemon(data));
}


// Mostrar un Pokémon en la lista
function mostrarPokemon(poke) {
  let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');
  let pokeId = poke.id.toString().padStart(3, "0"); // Formatear el ID a 3 dígitos
  
  const div = document.createElement("div");
  div.classList.add("pokemon");

  // Agregar la clase basada en el tipo principal
  const tipoPrincipal = poke.types[0].type.name;
  div.classList.add(tipoPrincipal);

  div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
      <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
      <div class="nombre-contenedor">
        <p class="pokemon-id">#${pokeId}</p>
        <h2 class="pokemon-nombre">${poke.name}</h2>
      </div>
      <div class="pokemon-tipos">
        ${tipos}
      </div>
      <div class="pokemon-stats">
        <p class="stat">${poke.height}m</p>
        <p class="stat">${poke.weight}kg</p>
        <div class="movimientos">
          <button class="mostrar">Mostrar más...</button>
          <div class="infoBox" style="display: none;">
            <p class="Tihabilidades">Skills</p>
            <p class="habilidades">
              ${poke.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
            </p>
            <div class="pokemon-imagen">
              <img src="${poke.sprites.other["official-artwork"].front_shiny}" alt="${poke.name}">
            </div>
            <h2 class="pokemon-nombre">${poke.name}</h2>
            <p class="pokemon-id-back">#${pokeId}</p>
            <p class="TiShiny">Shiny Version</p>
          </div>
        </div>
      </div>
    </div>
  `;
  listaPokemon.append(div);
}


//Boton mostrar mas
const mostrar = document.getElementById('mostrar')
const infoBox =document.getElementById('infoBox')

listaPokemon.addEventListener('click', (event) => {
    if (event.target.classList.contains('mostrar')) {
      const infoBox = event.target.nextElementSibling; // Seleccionar el cuadro de información asociado
      if (infoBox.style.display === 'block') {
        infoBox.style.display = 'none'; // Ocultar cuadro
      } else {
        infoBox.style.display = 'block'; // Mostrar cuadro
      }
      infoBox.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el clic cierre inmediatamente al abrir
        infoBox.style.display = 'none';
      }, { once: true }); // Asegurarse de que el evento solo se registre una vez
    
    }
  });



// Filtrar Pokémon por tipo, mostrar todos, o filtrar por búsqueda
const filtrarPokemon = (filtro) => {
    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
               //comprueba si es un numero
                if (!isNaN(filtro)) {
                   //si es un numero lo compara con el ID del pokemon
                    if (i === parseInt(filtro)) {
                        mostrarPokemon(data);
                    }
                } else {
                    // Si no es un número, trátelo como un nombre o tipo
                    if (filtro === "ver-todos") {
                        mostrarPokemon(data);
                    } else if (filtro === data.name.toLowerCase()) {
                        mostrarPokemon(data);
                    } else {
                        const tipos = data.types.map(type => type.type.name);
                        if (tipos.includes(filtro)) {
                            mostrarPokemon(data);
                        }
                    }
                }
            });
    }
};


// Filtrar por tipo o mostrar todos (manteniendo funcionalidad anterior)
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
  const botonId = event.currentTarget.id;
  filtrarPokemon(botonId);
}));

// Filtrar por búsqueda (nuevo)
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.toLowerCase();
  filtrarPokemon(searchTerm);
});

//funcion para buscar con enter
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = searchInput.value.toLowerCase();
        filtrarPokemon(searchTerm);
    }
});

