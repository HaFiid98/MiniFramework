# 🧱 `dom.js` – Virtual DOM & Diffing

A lightweight **Virtual DOM implementation** to create, diff, and render UI efficiently using plain JavaScript.

---

## 📌 Goal

Build a basic virtual DOM system that:

- Represents UI as JavaScript objects
- Updates the real DOM efficiently through rendering and diffing
- Serves as a foundation for reactive UIs

---

## 📦 Key Features

- 🧬 `h(type, props, ...children)` – Create virtual DOM nodes
- 🎨 `render(vnode, container)` – Render virtual DOM to real DOM
- 🔁 `diff(oldVNode, newVNode)` – Efficient DOM patching (optional or future)

---

## ✅ Core Concepts & Patterns

| Concept              | Description                                                             |
|----------------------|-------------------------------------------------------------------------|
| **Virtual DOM**       | A tree of JavaScript objects representing DOM elements                  |
| **Recursive Rendering** | Tree-walk to build real DOM nodes from virtual ones                  |
| **Diffing** (*extendable*) | Compare old and new trees to apply minimal DOM changes             |
| **Keys in Lists**    | (*optional*) Useful for optimizing performance in list rendering         |

---

## 🧱 Suggested File Structure

```bash
📁 src
 └── 📄 dom.js   # Virtual DOM logic
```

## 🚫 Avoid

- ❌ Direct DOM manipulation inside business logic
Let virtual DOM abstract this.
- ❌ Deeply nested HTML strings or template literals
Prefer declarative node creation via h().

## 🧩 dom.js – Implementation

<pre>
```
// dom.js

// Create a virtual DOM node
export function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children,
  };
}

// Render virtual DOM to actual DOM
export function render(vnode, container) {
  container.innerHTML = "";
  container.appendChild(createElement(vnode));
}

// Internal: create real DOM from virtual DOM node
function createElement(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.type);

  for (const [key, value] of Object.entries(vnode.props)) {
    el.setAttribute(key, value);
  }

  vnode.children
    .map(createElement)
    .forEach((child) => el.appendChild(child));

  return el;
}

// Optional: diff() function to be implemented for patching
```
</pre>




## 🔄 Example Usage 

<pre>
```
import { h, render } from './dom.js';
const vnode = h("div", { class: "app" },
  h("h1", null, "Hello, Virtual DOM!"),
  h("p", null, "This is a simple VDOM example.")
);

```
</pre>