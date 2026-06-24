export function render(state) {
  const loading = document.querySelector("#loading");
  const content = document.querySelector("#content");
  const error = document.querySelector("#error");
  const errorMessage = document.querySelector("#error-message");

  loading.classList.add("hidden");
  content.classList.add("hidden");
  error.classList.add("hidden");

  if (state.status === "loading") {
    loading.classList.remove("hidden");
  }

  if (state.status === "success") {
    content.classList.remove("hidden");
    content.innerHTML = renderPokemon(state.data);
  }

  if (state.status === "error") {
    error.classList.remove("hidden");
    errorMessage.textContent = state.error;
  }
}

function renderPokemon(pokemon) {
  const types = pokemon.types
    .map(type => type.type.name)
    .join(", ");

  return `
    <div class="pokemon-card">
      <img 
        src="${pokemon.sprites.front_default}" 
        alt="${pokemon.name}"
      >

      <h2>${pokemon.name.toUpperCase()}</h2>

      <p><strong>ID:</strong> ${pokemon.id}</p>
      <p><strong>Tipo:</strong> ${types}</p>
      <p><strong>Altura:</strong> ${pokemon.height}</p>
      <p><strong>Peso:</strong> ${pokemon.weight}</p>
    </div>
  `;
}
