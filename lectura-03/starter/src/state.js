// ============================================================
// state.js — Única fuente de verdad del estado de la app
// ============================================================
// No toca el DOM ni hace fetch.
// Solo guarda el estado y lo expone de forma controlada.
// ============================================================

// El objeto state vive acá adentro y nunca se exporta directamente.
// Solo se puede leer con getState() y modificar con setState().
const state = {
  status: "idle",   // "idle" | "loading" | "success" | "error"
  data: null,       // datos del pokémon cuando status === "success"
  error: null,      // mensaje de error cuando status === "error"
  lastQuery: null,  // última búsqueda — permite que retry repita la misma
};

// getState()
// ----------
// Devuelve una COPIA del estado, no el objeto original.
// Así nadie puede modificar el estado accidentalmente desde afuera
// haciendo algo como: getState().status = "error"
export function getState() {
  return { ...state };
}

// setState(updates)
// -----------------
// Recibe solo los campos que cambian y los fusiona con el estado actual.
// El resto de los campos se mantienen como estaban.
//
// Ejemplo: setState({ status: "loading", data: null })
// Solo modifica status y data — error y lastQuery no se tocan.
export function setState(updates) {
  Object.assign(state, updates);
}