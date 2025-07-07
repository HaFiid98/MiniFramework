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
        if (typeof newState === 'function') {
            this.state = newState(this.state)
        } else if (typeof newState === "string") {
            this.state = newState
            console.log("llzakeazkeazk");

        } else if (Array.isArray(this.state)) {
            this.state = [...this.state, newState]
        } else {

            this.state = { ...this.state, ...newState };
        }


        //   if (typeof newState === 'function') {
        //     this.state = newState(this.state); // Functional update
        //   } else {
        //     this.state = { ...this.state, ...newState }; 
        //   }




        this.notify();
    }

    notify() {
        this.listeners.forEach(listener => listener.update());
    }
}

export function useState(initialValue) {


    const comp = currentComponent

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
        this.props = props
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
const root = document.getElementById("root")
// const div = new Component(count, root, count().count, Subscribe, () => createElement("div", {}, count().count))




// setCount({count:12356})
// setCount({count:45654654})


// console.log(countState.getState());
// countState.setState({count: 144})

function NotFoundView() {
    return ` <div>404</div>`
}

let Pathsetter = null
const Todo = new Component({}, root, () => {
    const [currentPath, SetcurrentPath] = useState(location.hash)
    console.log('currrrrrrrentpaaaaaaaaath', currentPath());

    if (!Pathsetter){
        
        Pathsetter = SetcurrentPath
    }
    const [Todo, SetTodo] = useState([])

    // console.log(Todo(), "fsdfsdfdsfdsfsdfsdfsdfs");
    // addevent("click", '[data-click="todo-add"]', (e) => {

    //     SetTodo([...(Todo()), "hsdfhksfkdsjf"])
    // });

    addevent("click", '[data-path="path"]', (e) => {
        SetcurrentPath(e.target.getAttribute('href').slice(1))
        console.log("aaaaaaaaaaaaaaaaa", e.target.getAttribute('href').slice(1));

    });
    addevent("hashchange", 'window', (e) => {

        console.log("windoooooow clickeed");

    });




    addevent("change", '[data-checked="checked"]', (e) => {
        e.target.classList.toggle("completed")
        const Id = e.target.dataset.id
        console.log(e.target.dataset, "daaata seeet");

        console.log(Id);

        SetTodo(prev => {
            console.log(prev, "prrrrrrrrrrrrrev", "idddddddd", Id);

            return prev.map(item => {
                return item.id == Id ? { ...item, ["complete"]: !item.complete } : item
            }
            )
        })
        console.log("toooooooodocheeecked", Todo());

    });

    addevent("keydown", '[data-input="input"]', (e) => {
        console.log("itts here");

        if (e.key === "Enter") {
            if (e.target.value !== "") {
                SetTodo({ id: Date.now(), content: e.target.value, complete: false })
                e.target.value = ""
            }
        }
    });

    const filterTodo = currentPath() === "/completed" ? Todo().filter(item => item.complete == true) :
        currentPath() === "/active" ? Todo().filter(item => item.complete == false) :
            Todo()

    console.log("toooooooooooo", filterTodo, Todo);

    return (

        createElement(
            "div",
            { class: "Container" },

            createElement("p", { class: "TodoText" }, "todoMVC"),
            createElement("input", { class: "TodoText", 'data-input': 'input' }),
            createElement(
                "ul",
                { class: "list" },
                (
                    filterTodo.map(Task => {
                        console.log(Task, "taaaaaaaaask")
                        return createElement("li", { class: "listItem" }, Task.content,
                            !Task.complete ? createElement("input", { type: "checkbox", 'data-checked': "checked", 'data-id': Task.id })
                                : createElement("input", { type: "checkbox", 'data-checked': "checked", 'data-id': Task.id, checked: true })

                        )
                    }


                    ))
            ),
            createElement("div", { class: "filterContainer" },
                createElement("a", { href: "#/", 'data-path': "path" }, "All"),
                createElement("a", { href: "#/completed", 'data-path': "path" }, "Completed"),
                createElement("a", { href: "#/active", 'data-path': "path" }, "active"),
                createElement("button", {}, "clear completed"),
                createElement("p", { class: "items", }, `${Todo().length} items left!`),
            ),
            createElement("button", { class: "button", 'data-click': 'todo-add' }, "Tooodo")
        )
    )
})


const router1 = new Router("/", Todo, NotFoundView, root , Pathsetter)
router1.AddPath("/completed", Todo)
router1.AddPath("/active", Todo)
