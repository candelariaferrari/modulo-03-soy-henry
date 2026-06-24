// ============================================================
// router.js — Núcleo del sistema de routing SPA
// ============================================================

import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

// TODO 1: Crear la tabla de rutas
// Asocia cada pathname con su función de render
const routes = {
  "/": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

// TODO 2: Implementar router()
// Debe:
//   - Leer window.location.pathname
//   - Normalizar trailing slash (ej: "/chat/" → "/chat")
//   - Buscar el renderer en routes, o usar renderNotFound
//   - Llamar al renderer
//   - Llamar a updateActiveLink()
//   - Llamar a updateRouteBadge(path)
export function router() {
  const raw = window.location.pathname; //es la url cruda
  const path = normalizePath(raw);
  const render = routes[path] || renderNotFound;

  render();
  updateActiveLink();
  updateRouteBadge(path);
}

// TODO 3: Implementar navigateTo(path)
// Debe:
//   - Si ya estamos en ese path, no hacer nada
//   - history.pushState(null, "", path)
//   - Llamar router() manualmente (pushState NO dispara popstate)
export function navigateTo(path) {
  if (window.location.pathname === path) return;

  history.pushState(null, "", path);
  router();
}

// TODO 4: Implementar updateActiveLink()
// Debe recorrer todos los "nav a" y agregar/quitar clase "active"
// según si link.pathname === window.location.pathname
function updateActiveLink() {
  const currentPath = normalizePath(window.location.pathname);

  document.querySelectorAll("nav a").forEach((link) => {
    const linkPath = normalizePath(link.pathname);

    if (link.origin === window.location.origin && linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// TODO 5: Implementar updateRouteBadge(path)
// Crea o actualiza un div.route-badge en el body mostrando la ruta activa
// Ayuda visual para debuggear durante la clase
function updateRouteBadge(path) {
  let badge = document.querySelector(".route-badge");

  if (!badge) {
    badge = document.createElement("div");
    badge.className = "route-badge";
    document.body.appendChild(badge);
  }

  badge.innerHTML = `ruta activa: <span>${path}</span>`;
}

// Mantener la normalizacion en un helper evita que el router y el nav
// interpreten distinto rutas equivalentes como /chat y /chat/.
function normalizePath(path) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}
