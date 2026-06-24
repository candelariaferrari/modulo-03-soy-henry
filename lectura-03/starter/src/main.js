// ============================================================
// STARTER — Anti-patrón: fetch directo sin estados ni manejo
// ============================================================
// TODO 1: Importar getPokemon desde ./api.js
// TODO 2: Importar getState, setState desde ./state.js
// TODO 3: Importar render desde ./ui.js
// TODO 4: Llamar render(getState()) al inicio (estado idle)
// TODO 5: Reescribir handleSearch() con el patrón correcto:
//           setState loading -> render -> await getPokemon ->
//           setState success/error -> render
// TODO 6: Reescribir el event listener del form usando handleSearch()
// TODO 7: Agregar event listener al #retry-btn usando lastQuery
// ============================================================
import { getPokemon } from "./api.js";
import { getState, setState } from "./state.js";
import { render } from "./ui.js";


// Render inicial — muestra estado idle al cargar la app
render(getState());

// ─── Búsqueda ────────────────────────────────────────────────────────────────

async function handleSearch(query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return;

  // 1. Pasar a loading: limpia estado anterior, muestra spinner
  setState({ status: "loading", data: null, error: null, lastQuery: trimmed });
  render(getState());

  try {
    // 2. Fetch — puede lanzar error de red O error HTTP (gracias a fetchJson)
    const pokemon = await getPokemon(trimmed);

    // 3. Éxito: guardar datos y mostrar tarjeta
    setState({ status: "success", data: pokemon });
    render(getState());
  } catch (error) {
    // 4. Error: mostrar mensaje legible al usuario
    const msg = error.message.includes("404")
      ? `No encontramos un Pokémon llamado "${trimmed}". ¿Está bien escrito?`
      : `Error de conexión: ${error.message}`;

    setState({ status: "error", error: msg });
    render(getState());
  }
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

// Form submit
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.querySelector("#search-input").value;
  handleSearch(query);
});

// Botón Reintentar — reutiliza lastQuery guardado en estado
document.querySelector("#retry-btn").addEventListener("click", () => {
  const { lastQuery } = getState();
  if (lastQuery) {
    handleSearch(lastQuery);
  }
});