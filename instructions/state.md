# 🗂️ `state.js` – Global Store (State Management)

A **lightweight, reactive state manager** that enables components to respond to global state changes with ease.

---

## 📌 Goal

Provide a simple and effective **global state management system** that:

- Maintains a **single source of truth**
- Allows **subscribers to respond to state changes**
- Ensures **immutability** and **separation of concerns**

---



## 🚫 Avoid

- ❌ Direct Mutation: Do not modify state directly (e.g., state.todos.push(...))

- ❌ DOM Coupling: Keep state logic separate from UI logic (let render logic live elsewhere)


---

## 📦 Key Features

- 🧠 **Global State** – Centralized, shared state object
- 🔍 `getState()` – Retrieve the current global state
- ✍️ `setState()` – Update state immutably (shallow merge)
- 🔔 `subscribe()` – Subscribe to state changes (pub/sub pattern)

---

## ✅ Core Concepts & Patterns

| Concept                  | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| **Immutable Updates**    | Use shallow cloning to update state instead of mutation                    |
| **Pub/Sub Pattern**      | Listeners (subscribers) are notified whenever the state changes             |
| **Separation of Concerns** | No DOM logic is tied into the state management logic                    |

---

## 🧱 Suggested File Structure




## 🧩 state.js – Implementation

```js
// state.js

let state = {};               // Global state object
let listeners = [];           // List of subscribers

// Retrieve current state
export function getState() {
  return state;
}

// Set new state and notify all subscribers (immutable shallow merge)
export function setState(newState) {
  state = { ...state, ...newState };
  listeners.forEach((listener) => listener(state));
}

// Subscribe to state changes
export function subscribe(listener) {
  listeners.push(listener);
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
```





## 🔄 Example Usage

![alt text](<Screenshot from 2025-06-26 02-23-08-1.png>)