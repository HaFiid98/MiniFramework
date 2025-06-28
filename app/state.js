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
  constructor(state ,root , vdom , sub ,renderfuncs){
    this.sub = sub
    this.root = root
    // this.state.subscribe(this)
    this.renderfunc = renderfuncs
    this.dom =  this.renderfunc()
    // console.log(this.dom,"fjdjjaffsd")
    // this.sub = sub
    this.sub(this)

    render(this.dom , this.root)
    console.log(this.root.childNodes[0], this.root.childNodes.length , "fskdjflkdsjklfjdskljfkldjsklfjdsjfldskjfkldsjfkldsjfkldsjkfklsdj")


    // this.render()
  }

  // render(){
  // //  this.dom =  createElement("span" , {id : this.state().count} , this.state().count)
  // render(this.dom , this.root)
  // //  this.update()
  // }


 

  update(){
    // console.log()
    const newVd = this.renderfunc()

    const patches = diff(this.dom ,newVd)
    console.log(patches,"kakakakka",this.root)
    // console.log(patches,this.root,"fkdsljfksjdfklsd")
    patch(this.root , patches)

    // render(patches , this.root)
    // render(this,this.root)
    this.dom = newVd;
  }
}




// // ---- Implementation ---- //
// const counterState = new StoreState({ count: 0 });
// const countersub = new Subscriber({ count: counterState.getState().count });
// console.log(countersub, counterState);

// counterState.subscribe(countersub);
// counterState.setState({ count: 5 });

// console.log(countersub, counterState);

//  function Todo(state) {
//   console.log(state,"lollo")
//     return {
      
//     }
    
//   }
const [count , setCount , Subscribe , Unsub] = useState({count : 0})

console.log(count , "count");

// const countState = new StoreState({count : 0})
const root = document.getElementById("root")


// console.log(root , "hkfdskjfhskdjfkhsdfk");
const div = new Component(count , root , count().count , Subscribe,()=>createElement("div",{}, count().count))
// console.log(div.root,"hhhhi")



//  export function UpdateElement(fn){
//   const create 
//     return function(...args) {
//             return fn(...args)
            
//   // }
//   // }


//   // const MemozCreate = UpdateElement(createElement)

// MemozCreate()(("div", {id : count().count}, 555))

// countState.setState({count: 7})
// render(div.dom,div.root)
// console.log(div.dom,div.root)
// setCount({count:456546})
setCount({count:7000})



// setCount({count:12356})
// setCount({count:45654654})

console.log(count());

// console.log(countState.getState());
// countState.setState({count: 144})

