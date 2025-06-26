# 🌐 `router.js` – Hash-Based Routing

A **simple client-side router** that switches views based on the URL hash (e.g., `#/`, `#/active`, `#/settings`).

---

## 📌 Goal

Implement a lightweight router to:

- Switch views based on `location.hash`
- Handle routes like `#/home`, `#/about`, etc.
- Provide a default or 404 fallback view

---

## 📦 Key Features

- 🧭 `addRoute(path, handler)` – Register a route and its handler function
- 🔁 Detect `hashchange` and invoke matching route
- 🆘 `setNotFound(handler)` – Fallback when no route matches
- 🚀 `navigate(path)` – Change route programmatically (updates URL hash)

---

## ✅ Core Concepts & Patterns

| Concept             | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Observer Pattern** | Listens for `hashchange` and triggers corresponding route handler           |
| **Route Map**        | Internal `Map` holds path-handler pairs for fast lookup                     |
| **Loose Coupling**   | The router does not render views directly – it only triggers handler logic  |

---

## 🧱 Suggested File Structure

```bash
📁 src
 └── 📄 router.js   # Hash-based routing module
 ```


### 🚫 Avoid
❌ Parsing complex URL parameters
Keep routing simple: use basic paths like #/home or #/todo

❌ Rendering directly in router
Router should only invoke handlers – let them handle DOM updates or rendering


## 🧩 router.js – Implementation
<pre>
```
// router.js

const routes = new Map();
let notFoundHandler = null;

// Register a route and its handler
export function addRoute(path, handler) {
  routes.set(path, handler);
}

// Set fallback handler for unmatched routes
export function setNotFound(handler) {
  notFoundHandler = handler;
}

// Navigate to a route (changes the hash)
export function navigate(path) {
  window.location.hash = path;
}

// Internal: handle current hash and trigger route
function handleRoute() {
  const path = window.location.hash.slice(1); // Remove '#'
  const route = routes.get(path);
  if (route) route();
  else if (notFoundHandler) notFoundHandler();
}

// Listen for changes in the hash and on initial load
window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

``` </pre>



## 🔄 Example Usage


<pre>
```

import { addRoute, setNotFound, navigate } from './router.js';

// Define routes
addRoute('', () => console.log('Home view'));
addRoute('about', () => console.log('About view'));

// Handle unknown paths
setNotFound(() => console.log('404 - Page not found'));

// Navigate programmatically
navigate('about'); // Will trigger the 'about' route handler

```
</pre>





