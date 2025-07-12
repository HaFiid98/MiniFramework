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

        } else if (Array.isArray(this.state)) {
            this.state = [...this.state, newState]
        } else {

            this.state = { ...this.state, ...newState };
        }

        //   if (typeof newState === 'function') {
        //     this.state = newState(this.state)
        //   } else {
        //     this.state = newState
        //   }
        this.notify();



        //   if (typeof newState === 'function') {
        //     this.state = newState(this.state); // Functional update
        //   } else {
        //     this.state = { ...this.state, ...newState }; 
        //   }




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


const root = document.getElementById("root")

function NotFoundView() {
    return ` <div>404</div>`
}

let Pathsetter = null
const Todo = new Component({}, root, () => {
    const [currentPath, SetcurrentPath] = useState(location.hash)
    console.log('currrrrrrrentpaaaaaaaaath', currentPath());

    if (!Pathsetter) {

        Pathsetter = SetcurrentPath
    }
    const [Todo, SetTodo] = useState([])

    // console.log(Todo(), "fsdfsdfdsfdsfsdfsdfsdfs");
    // addevent("click", '[data-click="todo-add"]', (e) => {

    //     SetTodo([...(Todo()), "hsdfhksfkdsjf"])
    // });

    addevent("dblclick", 'label', (e) => {
        if (e.target.hasAttribute('data-label')) {
            const id = parseInt(e.target.getAttribute('data-label'));
            // console.log("id", id);
            SetTodo(prev => {
                return prev.map(task => task.id === id ? { ...task, db: true } : task)
            })

        }
        console.log("tooooodo dbbbbbbbbbb", Todo(),);

    }
    );
    addevent("click", '[data-path="path"]', (e) => {
        SetcurrentPath(e.target.getAttribute('href').slice(1))
        e.target.classList.add("selected")
        console.log("aaaaaaaaaaaaaaaaa", e.target.getAttribute('href').slice(1));

    });


    addevent("click", '.clear-completed', (e) => {
        e.preventDefault()
        console.log('clear compleeteeed');

        SetTodo(prev => prev.filter(task => !task.complete))
    })

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
                SetTodo({ id: Date.now(), content: e.target.value, complete: false, db: false })
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

            createElement("h1", {}, "todoMVC"),
            createElement("div", { class: "input-container" },
                createElement("input", { class: "new-todo", 'data-input': 'input', placeholder: "What needs to be done?" }),
                createElement("label", { class: "visually-hidden", for: "todo-input" })

            ),
            createElement("div", { class: "toggle-all-container" }, createElement("input", { type: "checkbox", class: "toggle-all" }), createElement("label", { class: "toggle-all-label", for: "toggle-all" })),
            createElement(
                "ul",
                { class: "todo-list" },
                (
                    filterTodo.map(Task => {


                        return (Task.db == false ? (createElement("li", { key: Task.id, class: Task.complete ? "listItem completed" : "listItem" },
                            createElement("div", { class: "view" },
                                (!Task.complete ? createElement("input", { class: "toggle", id: `todo-${Task.id}`, type: "checkbox", 'data-checked': "checked", 'data-id': Task.id })
                                    : createElement("input", { class: "toggle", id: `todo-${Task.id}`, type: "checkbox", 'data-checked': "checked", 'data-id': Task.id, checked: true }))
                                , createElement("label", { 'data-label': `${Task.id}`, for: `todo-${Task.id}` }, Task.content))
                        )) : (createElement("li", { class: "", key: Task.id },
                            createElement("div", { class: "view" },
                                createElement("div", { class: "input-container", onClick: (e) => e.stopPropagation() },
                                    createElement("input", {
                                        id: "edit", key: Task.id, 'data-input': "input", class: "new-todo", type: "text", value: Task.content,
                               
                                    }, "inputing"))))))
                    }


                    ))
            ),
            Todo().length > 0 && createElement("footer", { class: "filterContainer" },
                createElement("ul", { class: "filters" },
                    createElement("p", { class: "todo-count", }, `${Todo().filter(Task => !Task.complete).length} items left!`),

                    createElement("li", {}, createElement("a", { href: "#/", 'data-path': "path" }, "All"),
                    ),
                    createElement("li", {}, createElement("a", { href: "#/completed", 'data-path': "path" }, "Completed")),
                    createElement("li", {}, createElement("a", { href: "#/active", 'data-path': "path" }, "active")),
                    createElement("button", { class: "clear-completed" }, "clear completed")
                ),
            ),
        )
    )
})


const router1 = new Router("/", Todo, NotFoundView, root, Pathsetter)
router1.AddPath("/completed", Todo)
router1.AddPath("/active", Todo)
