const routes = {};
let currentRoute = null;


//Registers a component for a specific path
export function addRoute(path, component) {
  routes[path] = component;
}

//Changes the browser’s URL (no reload)
export function navigate(path) {
  if (routes[path]) {
    window.history.pushState({}, '', path);
    currentRoute = path;
    routes[path]();
  }
}
//Listens for back/forward browser buttons.
export function initRouter() {
  on()
  window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    if (routes[path]) {
      currentRoute = path;
      routes[path]();
    }
  });

  // When the app first loads, it runs the matching route.
  const initialPath = window.location.pathname;
  if (routes[initialPath]) {
    currentRoute = initialPath;
    routes[initialPath]();
  } else {
    navigate('/'); 
  }
}

//Returns the currently active route path.
export function getCurrentRoute() {
  return currentRoute;
}