// ============================================================
// main.js — Orquestador: conecta api, state y ui
// Es el único archivo que importa y coordina los otros tres.
// ============================================================

import { getPokemon } from "./api.js";
import { getState, setState } from "./state.js";
import { render } from "./ui.js";

// Render inicial: al cargar la app, el estado es "idle"
// El usuario ve el panel de bienvenida antes de buscar cualquier cosa
render(getState());

// ─── Búsqueda ────────────────────────────────────────────────────────────────

// handleSearch(query)
// -------------------
// Orquesta el ciclo completo de una búsqueda:
//   idle → loading → success
//                  → error
async function handleSearch(query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return; // no disparar fetch con input vacío

  // 1. Loading: limpia cualquier resultado o error anterior
  //    lastQuery se guarda para poder reintentar desde el botón retry
  setState({ 
    status: "loading", 
    data: null, 
    error: null, 
    lastQuery: trimmed 
  });
  render(getState());

  try {
    // 2. Fetch delegado a api.js — puede fallar por:
    //    - error de red (sin conexión, CORS)
    //    - error HTTP (404 si el pokémon no existe)
    //    fetchJson() ya se encarga de lanzar el error en ambos casos
    const pokemon = await getPokemon(trimmed); // ← api.js hace el fetch

    // 3. Éxito: guardamos los datos crudos de la API en el estado
    //    ui.js se encarga de decidir qué campos mostrar y cómo
    setState({ 
      status: "success",
      data: pokemon });
    render(getState());
  } catch (error) {
    // 4. Error: traducimos el mensaje técnico a texto legible para el usuario
    //    Distinguimos 404 (pokémon no existe) de error de red (sin conexión)
    const msg = error.message.includes("404")
      ? `No encontramos un Pokémon llamado "${trimmed}". ¿Está bien escrito?`
      : `Error de conexión: ${error.message}`;

    setState({ 
      status: "error", 
      error: msg });
    render(getState());
  }
}

// ─── Eventos ─────────────────────────────────────────────────────────────────
// Submit del formulario
// e.preventDefault() evita que el navegador recargue la página
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.querySelector("#search-input").value;
  handleSearch(query);
});

// Botón reintentar
// Lee lastQuery del estado (guardado en el paso 1 de handleSearch)
// y repite exactamente la misma búsqueda que falló
document.querySelector("#retry-btn").addEventListener("click", () => {
  const { lastQuery } = getState();
  if (lastQuery) handleSearch(lastQuery);
});