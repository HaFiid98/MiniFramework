# 🌍 `events.js` – Global Event Delegation

A performant event handling module that uses **event delegation** to attach event listeners globally and dispatch them based on selectors.

---

## ✅ Goal

Improve performance by **delegating all event listeners** to the document level, reducing the number of individual listeners attached.

---

## 📚 Key Features

- 🔗 `on(eventType, selector, handler)` – Register event listeners globally on the document and delegate to matching selectors

---

## 🚫 Avoid
❌ Attaching multiple listeners for the same event type unnecessarily

❌ Directly attaching listeners to every individual element (use delegation)


---

## 🧠 Core Concepts

| Concept             | Description                                                        |
|---------------------|--------------------------------------------------------------------|
| **Event Delegation** | Attach a single event listener at a high level (e.g., document)    |
| **Selector-Based Dispatch** | Invoke handlers only when events originate from matching selectors |
| **Global Event Map** | Map of event types to their delegated listeners and selectors      |

---

## 🧱 Suggested File Structure

```bash
📁 src
 └── 📄 events.js   # Global event delegation module
```

## 🧩 events.js – Implementation

<pre>
```
// events.js

const eventMap = new Map();

export function on(eventType, selector, handler) {
  // If no listeners for this eventType, add a global listener
  if (!eventMap.has(eventType)) {
    document.addEventListener(eventType, (event) => {
      (eventMap.get(eventType) || []).forEach(({ selector, handler }) => {
        if (event.target.matches(selector)) {
          handler(event);
        }
      });
    });
    eventMap.set(eventType, []);
  }
  // Register the selector and handler for this eventType
  eventMap.get(eventType).push({ selector, handler });
}

```
</pre>

## 🔄 Example Usage

  <pre>
  ```
  import { on } from './events.js';

// Delegate click events on buttons with class "btn"
on('click', '.btn', (event) => {
  console.log('Button clicked:', event.target);
});
```
</pre>

