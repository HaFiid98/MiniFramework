import { createElement , diff, patch, render } from "./dom.js";

export class StoreState {
  constructor(initialValue = {}) {
    this.state = initialValue;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    
    this.notify();
  }

  notify() {

    this.listeners.forEach(listener => listener.update());
  }
}

// class Subscriber {
//   constructor(element) {
//     this.element = element;
//   }

//   update(state) {
//     this.element.count = state.count;
//   }
// }

export function useState(initialValue){
  const newState = new StoreState(initialValue)
  return [  ()=>newState.getState() , 
    newState.setState.bind(newState), 
    newState.subscribe.bind(newState)  , 
    newState.unsubscribe.bind(newState)]

}

class Component {
  constructor(state , root , vdom , sub ){
    this.sub = sub
    this.root = root
    this.state = state
    // this.state.subscribe(this)
    this.dom = vdom
    // this.sub = sub
    this.sub(this)
//  render(this.dom , this.root)


    this.render()
  }

  render(){
  //  this.dom =  createElement("span" , {id : this.state().count} , this.state().count)
  render(this.dom , this.root)
  //  this.update()
  }

  update(){

    const lol = diff(this.root.firstChild , createElement("span" , {id : this.state().count} , this.state().count))
    // this.dom =  createElement("span" , {id : this.state().count} , this.state().count)
    console.log("diiiiiiiif", lol)

  //  const df = diff(this.root.fi , this.dom)
    patch(this.root , lol)

  }
}

// // ---- Implementation ---- //
// const counterState = new StoreState({ count: 0 });
// const countersub = new Subscriber({ count: counterState.getState().count });
// console.log(countersub, counterState);

// counterState.subscribe(countersub);
// counterState.setState({ count: 5 });

// console.log(countersub, counterState);


const [count , setCount , Subscribe , Unsub] = useState({count : 0})
console.log(count , "count");

// const countState = new StoreState({count : 0})
const root = document.getElementById("root")
console.log(root , "hkfdskjfhskdjfkhsdfk");
const div = new Component(count , root , createElement("span" , {id : count().count} , count().count) , Subscribe)
// countState.setState({count: 7})

setCount({count:456546})
// setCount({count:10})



// setCount({count:12356})
// setCount({count:45654654})

console.log(count());

// console.log(countState.getState());
// countState.setState({count: 144})

