const eventHandlers = {cli};


export function addevent(event, selector, handler) {
  if (!eventHandlers[event]) {
    eventHandlers[event] = [];
    document.addEventListener(event, (e) => {
      for (const { selector, handler } of eventHandlers[event]) {
        if (e.target.matches(selector)) {
          handler(e);
        }
      }
    });
  }

  eventHandlers[event].push({ selector, handler });
}

export function delevent(event, selector, handler) {
  if (eventHandlers[event]) {
    eventHandlers[event] = eventHandlers[event].filter(
      (item) => item.selector !== selector || item.handler !== handler
    );
  }
}