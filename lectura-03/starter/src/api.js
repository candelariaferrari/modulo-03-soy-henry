// ============================================================
// api.js — Capa de comunicación con la PokéAPI
// Solo hace fetch. No toca el DOM ni modifica el estado.
// ============================================================

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// fetchJson(url)
// --------------
// Helper reutilizable para cualquier request GET.
// Resuelve el problema de que fetch() no rechaza en 404/500.
export async function fetchJson(url) {
  // 1er await: espera que llegue la respuesta de red
  // En este punto solo tenemos los headers, no los datos todavía
  const response = await fetch(url);

  // fetch() no lanza error con 404 o 500 — lo hacemos nosotros
  // response.ok es true solo si el status está entre 200-299
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }

  // 2do await: espera que el body se lea y se parsee como JSON
  // Necesita su propio await porque leer el body también es asíncrono
  const data = await response.json();
  return data;
}

// getPokemon(name)
// ----------------
// Construye la URL para un pokémon específico y delega el fetch a fetchJson.
// Normaliza el nombre: minúsculas y sin espacios extra.
export async function getPokemon(name) {
  const url = `${BASE_URL}/${name.toLowerCase().trim()}`;
  return await fetchJson(url);
}
