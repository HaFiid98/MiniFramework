import { createElement, diff, patch, render } from "./dom.js";
import { addevent } from "./events.js";
import { Router } from "./router.js";


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
        if (Array.isArray(this.state)) {
            this.state = [...this.state, newState]
        } else {

            this.state = { ...this.state, ...newState };
        }

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
    if (!comp.states[stateIndex]) {
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


    render() {
        this.stateIndex = 0
        currentComponent = this
        this.dom = this.renderfunc()
        render(this.dom, this.root)
        currentComponent = null

    }

    update() {
        this.stateIndex = 0
        currentComponent = this;
        const newVd = this.renderfunc()
        const patches = diff(this.dom, newVd)
        console.log('paaaatchessss', patches);

        patch(this.root, patches)
        // render(patches , this.root)
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

  function NotFoundView() {
        return ` <div>404</div>`
    }

const counterComponent = new Component({}, root, () => {
    // console.log(filterState() , "fffffffffffffffffff");
    
    const [Todo, SetTodo] = useState([])
    console.log(Todo(), "fsdfsdfdsfdsfsdfsdfsdfs");
    addevent("click", '[data-click="todo-add"]', (e) => {

        SetTodo([...(Todo()), "hsdfhksfkdsjf"])
    });

    addevent("change", '[data-checked="checked"]', (e) => {
        e.target.classList.toggle("completed")
    });

    addevent("keydown", '[data-input="input"]', (e) => {
        console.log("itts here");

        if (e.key === "Enter") {
            if (e.target.value !== ""){

                SetTodo(e.target.value)
                e.target.value = ""
            }
        }
    });

    return (

        createElement(
            "div",
            { class: "Container" },
            // createElement("p", {}, count().count),
            // createElement("button", {
            // 'data-click': 'Increase-click'
            // }, "increase"),
            createElement("p", { class: "TodoText" }, "todoMVC"),
            createElement("input", { class: "TodoText", 'data-input': 'input' }),
            createElement(
                "ul",
                { class: "list" },
                ( (Todo()).map(Task => createElement("li", { class: "listItem" }, Task,
                    createElement("input", { type: "checkbox", 'data-checked': "checked" })
                ))),
        
                
            ),
            createElement("div", { class: "filterContainer" },
                createElement("a", { href: "#/" }, "All"),
                createElement("a", { href: "#/completed" }, "Completed"),
                createElement("a", { href: "#/active" }, "active"),
                createElement("button", {}, "clear completed"),
                createElement("p", { class: "items" }, `${Todo().length} items left!`),
            ),
            createElement("button", { class: "button", 'data-click': 'todo-add' }, "Tooodo")


        )


    )


}



)
const router1 = new Router("/qdqsdqs" , counterComponent , NotFoundView , root )
