let state = {};//data app globa
const subscribers = [];//functionlist


//Merges new values and notifies listeners
export function setState(newState) {
  state = { ...state, ...newState };
  notifySubscribers();
}

//Returns the current global state
export function getState() {
  return state;
}

//Adds a listener function and returns an unsubscribe function
export function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
}

// Calls every subscriber function with the new state
function notifySubscribers() {
  for (const subscriber of subscribers) {
    console.log("hi")
    subscriber(state);
  }
}