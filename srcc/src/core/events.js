const eventHandlers = {};


export function addevent(eventName, selector, handler) {
  if (!eventHandlers[eventName]) {
    eventHandlers[eventName] = [];
    document.addEventListener(eventName, (e) => {
      for (const { selector, handler } of eventHandlers[eventName]) {
        if (e.target.matches(selector)) {
          handler(e);
        }
      }
    });
  }
  
  eventHandlers[eventName].push({ selector, handler });
}



// export function on(eventType, selector, handler) {
//   // Initialize registry for the event type
//   if (!eventHandlers[eventType]) {
//     eventHandlers[eventType] = [];
    
//     // Handle scroll events differently (they don't bubble)
//     if (eventType === "scroll") {
//       // Use `window.onscroll` for global scroll events
//       window.onscroll = (e) => {
//         for (const entry of eventHandlers[eventType]) {
//           // For scroll, we check if the scrollable element matches the selector
//           const scrollableElement = getScrollParent(e.target);
//           if (scrollableElement && scrollableElement.matches(entry.selector)) {
//             entry.handler(e);
//           }
//         }
//       };
//     } else {
//       // Non-scroll events (click, keydown, etc.)
//       document[`on${eventType}`] = (e) => {
//         const target = e.target || e.srcElement;
//         for (const entry of eventHandlers[eventType]) {
//           if (target.matches(entry.selector)) {
//             entry.handler(e);
//           }
//         }
//       };
//     }
//   }

//   // Register the new handler
//   eventRegistry[eventType].push({ selector, handler });
// }

/**
 * Helper: Find the nearest scrollable parent of an element
 * (For scroll events, we check the scrollable container)
 */
function getScrollParent(element) {
  while (element && element !== document.body) {
    const style = window.getComputedStyle(element);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return element;
    }
    element = element.parentElement;
  }
  return window; // Fallback to window
}


//Removes a specific event handler.
export function delevent(eventName, selector, handler) {
  if (eventHandlers[eventName]) {
    eventHandlers[eventName] = eventHandlers[eventName].filter(
      (item) => item.selector !== selector || item.handler !== handler
    );
  }
}