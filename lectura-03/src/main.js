import { fetchJson } from "./api.js";
import { getState, setState } from "./state.js";
import { render } from "./ui.js";

const API_BASE = "https://pokeapi.co/api/v2/pokemon";

async function handleSearch(name) {
  setState({
    status: "loading",
    data: null,
    error: null,
    lastSearch: name,
  });

  render(getState());

  try {
    const data = await fetchJson(`${API_BASE}/${name.toLowerCase()}`);

    setState({
      status: "success",
      data,
      error: null,
    });

    render(getState());
  } catch (error) {
    setState({
      status: "error",
      data: null,
      error:
        error.message === "HTTP 404" ? "Pokémon no encontrado" : error.message,
    });

    render(getState());
  }
}
document
  .querySelector("#search-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const input = document.querySelector("#search-input");

    const pokemon = input.value.trim();

    if (pokemon) {
      handleSearch(pokemon);
    }
  });
  document
  .querySelector("#retry-btn")
  .addEventListener("click", () => {
    const { lastSearch } = getState();

    if (lastSearch) {
      handleSearch(lastSearch);
    }
  });