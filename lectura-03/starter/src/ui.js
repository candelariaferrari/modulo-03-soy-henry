// ============================================================
// ui.js — Todo lo que toca el DOM
// No hace fetch ni modifica el estado.
// Recibe el estado y decide qué mostrar en pantalla.
// ============================================================

// Referencias DOM tomadas una sola vez al cargar el módulo.
// Evita buscar los elementos en el DOM cada vez que se llama render().
const $idle    = document.querySelector("#state-idle");
const $loading = document.querySelector("#state-loading");
const $success = document.querySelector("#state-success");
const $error   = document.querySelector("#state-error");
const $card    = document.querySelector("#pokemon-card");
const $errMsg  = document.querySelector("#error-message");
const $badge   = document.querySelector("#state-badge");
const $btn     = document.querySelector("#search-btn");

// render(state)
// -------------
// Única función que decide qué panel mostrar.
// Patrón: ocultar todo primero → mostrar solo el que corresponde.
// Garantiza que nunca haya dos paneles visibles al mismo tiempo.
export function render(state) {
  // 1. Ocultar todos los paneles antes de mostrar el correcto.
  //    Sin este paso, podrían quedar paneles anteriores visibles.
  [$idle, $loading, $success, $error].forEach((el) => {
    el.classList.add("hidden");
  });

  // 2. Badge de debug — muestra el estado actual en pantalla.
  //    Útil para verificar que el ciclo idle→loading→success/error funciona.
  $badge.textContent = `estado: ${state.status}`;

  // 3. Mostrar el panel que corresponde al estado actual.
  if (state.status === "idle") {
    $idle.classList.remove("hidden");
    $btn.disabled = false;

  } else if (state.status === "loading") {
    $loading.classList.remove("hidden");
    $btn.disabled = true; // bloquea el botón para evitar búsquedas dobles

  } else if (state.status === "success") {
    $success.classList.remove("hidden");
    $card.innerHTML = buildPokemonCard(state.data); // construye la tarjeta con los datos
    $btn.disabled = false;

  } else if (state.status === "error") {
    $error.classList.remove("hidden");
    $errMsg.textContent = state.error; // muestra el mensaje traducido de main.js
    $btn.disabled = false;
  }
}

// buildPokemonCard(pokemon)
// -------------------------
// Recibe los datos crudos del pokémon y devuelve el HTML de la tarjeta.
// No modifica el DOM directamente — solo retorna un string HTML.
// render() es quien lo inserta con $card.innerHTML.
function buildPokemonCard(pokemon) {
  // Imagen: intenta el artwork oficial, si no existe usa el sprite básico
  const img = pokemon.sprites.other["official-artwork"].front_default
    || pokemon.sprites.front_default
    || "";

  // ID formateado con ceros a la izquierda: 1 → #001, 25 → #025
  const id = `#${String(pokemon.id).padStart(3, "0")}`;

  // La API devuelve altura en decímetros y peso en hectogramos → convertimos a m y kg
  const height = (pokemon.height / 10).toFixed(1) + " m";
  const weight = (pokemon.weight / 10).toFixed(1) + " kg";

  const experience = pokemon.base_experience || "N/D";

  // types es un array de objetos: [{ slot: 1, type: { name: "fire", url: "..." } }]
  // Mapeamos solo el nombre de cada tipo y lo envolvemos en un span
  const types = pokemon.types
    .map((item) => `<span class="pokemon-card__type">${item.type.name}</span>`)
    .join("");

  return `
    <div class="pokemon-card__media">
      <img src="${img}" alt="Imagen de ${pokemon.name}" />
    </div>
    <div class="pokemon-card__header">
      <h2 class="pokemon-card__name">${pokemon.name}</h2>
      <p class="pokemon-card__id">${id}</p>
    </div>
    <div class="pokemon-card__types">${types}</div>
    <div class="pokemon-card__stats">
      <div class="pokemon-card__stat">
        <span>Altura</span>
        <strong>${height}</strong>
      </div>
      <div class="pokemon-card__stat">
        <span>Peso</span>
        <strong>${weight}</strong>
      </div>
      <div class="pokemon-card__stat">
        <span>EXP</span>
        <strong>${experience}</strong>
      </div>
    </div>
  `;
}