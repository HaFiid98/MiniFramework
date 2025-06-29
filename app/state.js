import { createElement, diff, patch, render } from "./dom.js";
import { addevent } from "./events.js";


let currentComponent = null

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

export function useState(initialValue) {

    
    const comp = currentComponent
    console.log("currrrrrrrrrrent", comp);
    
    const stateIndex = currentComponent.stateIndex++
    if (!comp.states[stateIndex]){
    const store = new StoreState(initialValue)
    store.subscribe(comp)
    comp.states[stateIndex] = store
    

    }

const store = comp.states[stateIndex]
    return [() => store.getState(),
    store.setState.bind(store),
    store.subscribe.bind(store),
    store.unsubscribe.bind(store)]

}

class Component {
    constructor(props, root, renderfunc) {
        this.states = []
        this.stateIndex = 0

        this.root = root
        this.renderfunc = renderfunc
        // this.sub(this)
        // render(this.dom, this.root)
        this.render()

    }


    render(){
        this.stateIndex = 0
        currentComponent = this
         this.dom = this.renderfunc()
        render(this.dom , this.root)
        currentComponent = null

    }

    update() {
        this.stateIndex = 0
            currentComponent = this;

                currentComponent = this
        const newVd = this.renderfunc()
        const patches = diff(this.dom, newVd)
        console.log('paaaatchessss', patches);
        
        patch(this.root, patches)
        this.dom = newVd;
        currentComponent = null
    }
}



// const [count, setCount, Subscribe, Unsub] = useState({ count: 0 })

// console.log(count, "count");
// const root = document.getElementById("root")
// const div = new Component(count, root, count().count, Subscribe, () => createElement("div", {}, count().count))




// setCount({count:12356})
// setCount({count:45654654})


// console.log(countState.getState());
// countState.setState({count: 144})



const counterComponent = new Component({} , root ,  ()=>{

 const   [count , SetCount ]  = useState({count : 0})
 const [Todo, SetTodo] = useState(["geeeeeeeeeeeel", "hdqslfhjdsfkhsdf" , "hgfjhdsfgsdjfdgjsf" ,"ghdshgfsdhgfjsdf"])
console.log(count() , "fsdfsdfdsfdsfsdfsdfsdfs");
    return (
    


        createElement(
            "div",
            {class:"Container"},
            createElement("p", {}, count().count),
            createElement("button",{onclick:()=>{
                
                                console.log(count() , "couuuuunt");

                SetCount(count().count+1)
                                console.log(count() , "couuuuuuuuuuuuuuuuuunt");


            }}, "increase"),
            createElement("p", {class:"TodoText"},"todoMVC"),
            createElement(   
                "ul",
                {class:"list"},
                (Todo().map(Task => createElement(
                                    "li",
                                    {class:"listItem"},
                                    Task)))),
            createElement("button" , {class:"button" , onclick:addevent( "click" , ".button" , ()=>{SetTodo(...Todo(),)},)}, "Tooodo")

    
        )
     
            
    )


}



)
