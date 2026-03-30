# MiniFramework

A lightweight JavaScript framework built entirely from scratch — no external libraries or dependencies. It provides DOM abstraction, reactive state management, event delegation, and hash-based routing. The framework is demonstrated through a fully functional **TodoMVC** application.

---

## Features

- ✅ **DOM Abstraction** — Create and manage virtual DOM elements declaratively
- ✅ **Virtual DOM Diffing & Patching** — Efficient reconciliation with keyed and non-keyed support
- ✅ **Reactive State Management** — Component-scoped reactive stores with `useState`
- ✅ **Event Delegation** — Centralized event handling without scattering `addEventListener` calls
- ✅ **Hash-Based Router** — Sync URL hash with application state for SPA navigation

---

## Project Structure

```
MiniFramework/
├── app/
│   ├── dom.js        # createElement, render, diff, patch
│   ├── state.js      # Component, useState, StoreState
│   ├── events.js     # eventManager (event delegation system)
│   └── router.js     # Router (hash-based routing)
└── src/
    ├── main.js       # TodoMVC app entry point
    ├── index.html    # HTML shell
    └── index.css     # Styles
```

---

## Getting Started

No build step is required. Simply open `src/index.html` in a browser (via a local server to support ES modules):

```bash
# Using Python
python3 -m http.server 8080 --directory src

# Using Node.js (npx)
npx serve src
```

Then visit `http://localhost:8080` in your browser.

---

## Core Modules

### `app/dom.js` — DOM Abstraction

#### `createElement(tag, attrs, ...children)`

Creates a virtual DOM node (plain object).

```js
import { createElement } from '../app/dom.js';

const vnode = createElement('div', { class: 'container' },
  createElement('h1', {}, 'Hello, World!')
);
```

#### `render(vdom, container)`

Renders a virtual DOM node into a real DOM container.

```js
import { render } from '../app/dom.js';

render(vnode, document.getElementById('root'));
```

#### `diff(oldVdom, newVdom)` / `patch(parent, patches, index)`

Computes the difference between two virtual DOM trees and applies minimal updates to the real DOM.

---

### `app/state.js` — State Management

#### `useState(initialValue)`

Returns a reactive state tuple scoped to the current component. Must be called inside a `Component` render function.

```js
const [getValue, setValue] = useState(0);

getValue(); // → 0
setValue(1);
setValue(prev => prev + 1);
```

#### `new Component(props, root, renderFn)`

Creates a self-updating component that re-renders when state changes.

```js
import { Component, useState } from '../app/state.js';

new Component({}, document.getElementById('root'), () => {
  const [count, setCount] = useState(0);

  return createElement('button', { onClick: () => setCount(c => c + 1) },
    `Clicked ${count()} times`
  );
});
```

---

### `app/events.js` — Event Delegation

All events are managed centrally through a single `eventManager` instance. This avoids memory leaks from scattered listeners and supports dynamic elements.

```js
import { eventManager } from '../app/events.js';

// Add a delegated click handler for elements matching '.btn'
eventManager.addevent('click', '.btn', (e) => {
  console.log('Button clicked:', e.target);
});

// Add a global keydown handler
eventManager.addevent('keydown', (e) => {
  if (e.key === 'Enter') console.log('Enter pressed');
});
```

**Supported events:** `click`, `dblclick`, `keydown`, `change`, `blur`, `scroll`, `hashchange`

---

### `app/router.js` — Hash-Based Router

```js
import { Router } from '../app/router.js';

const router = new Router('/', MyComponent, '', document.getElementById('root'), setPath);

router.AddPath('/active', MyComponent);
router.AddPath('/completed', MyComponent);
```

The router listens to `hashchange` events and re-renders the associated component when the URL hash changes.

---

## TodoMVC Demo

The `src/main.js` file demonstrates the full framework by implementing a [TodoMVC](https://todomvc.com/) application with:

- Adding and removing todos
- Editing todos on double-click
- Marking todos complete/incomplete
- Toggle all todos
- Filter by All / Active / Completed
- Clear completed todos
- Item count display

---

## Collaborators

| Username |
|----------|
| abelbach |
| asebbar  |
| ahssaini |
| kelali   |

---

## License

This project was created for educational purposes as part of the [Zone01 Oujda](http://zone01oujda.ma) curriculum.
