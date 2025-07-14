import { createElement, diff, patch, render } from "./dom.js";
import { eventManager } from "./events.js";
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
        // console.log('paaaatchessss', patches);

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

    if (!Pathsetter) {

        Pathsetter = SetcurrentPath
    }
    const [Todo, SetTodo] = useState([])

    // console.log(Todo(), "fsdfsdfdsfdsfsdfsdfsdfs");
    // eventManager.addevent("click", '[data-click="todo-add"]', (e) => {

    //     SetTodo([...(Todo()), "hsdfhksfkdsjf"])
    // });


    const events = ["click",]

    eventManager.addevent("click", "", (e) => {
        if (Todo().some(todo => todo.db)) {

            const input = document.querySelector(".input-container")
            if (e.target.contains(input)) {
                // console.log("cliiiiiick outsside");

                SetTodo(prev => {
                    return prev.map(todo => { return { ...todo, db: false } })
                })
            }
        }

    })
    // console.log(document.visibilityState)

    eventManager.addevent("blur",(e) => {
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
            SetTodo(prev => {
                return prev.map(todo => { return { ...todo, db: false } })
            })
    })
    console.log(eventManager.handlers,"fjdskljdflkjsdklfjlksjlkfjlsdkf")
    // eventManager.addevent("visibilitychange",(e) => {
    //     console.log(document.visibilityState, "itsmeeeeeeeeee")
    //     if (document.visibilityState == 'hidden') {
    //         SetTodo(prev => {
    //             return prev.map(todo => { return { ...todo, db: false } })
    //         })
    //     }
    // })

    console.log(eventManager.handlers)
    eventManager.addevent("dblclick", 'label', (e) => {
        // console.log("eveeeeeeeeeeeent");
        if (e.target.hasAttribute('data-label')) {
        
            const id = parseInt(e.target.getAttribute('data-label'));
            SetTodo(prev => {
                return prev.map(task => task.id === id ? { ...task, db: true } : { ...task, db: false })
            })

            document.querySelector("#edit").focus()
            
        }

    }
    );
    eventManager.addevent("click", '[data-path="path"]', (e) => {
        SetcurrentPath(e.target.getAttribute('href').slice(1))
        e.target.classList.add("selected")

    });

    
    eventManager.addevent("click", '.clear-completed', (e) => {
        e.preventDefault()

        SetTodo(prev => prev.filter(task => !task.complete))
    })

    eventManager.addevent("change", '.toggle', (e) => {
        // e.target.classList.toggle("completed")

        if (e.target.tagName !== "INPUT") return;
        const Id = e.target.dataset.id


        SetTodo(prev => {

            return prev.map(item => {
                return item.id == Id ? { ...item, ["complete"]: !item.complete } : item
            }
            )
        })

    });

    eventManager.addevent("keydown", '[data-input="input"]', (e) => {
        console.log("keeeeeeeeeey" , e.key);
        
        if (e.key === "Enter" || (e.key === "Tab") ) {
            if (e.target.value !== "") {
                // console.log( "iddd :  " , e.target.getAttribute("id")  ,"keeeey : ", e.target.getAttribute("key")  , "taaarget : " ,  e.target);

                if (e.target.classList.contains("edit-todo")) {
                    const key = e.target.getAttribute("key")
                    SetTodo(prev => { return prev.map(todo => todo.id == key ? { ...todo, db: false, content: e.target.value } : todo) })
                } else if (e.key === "Enter") {
                    SetTodo({ id: Date.now(), content: e.target.value, complete: false, db: false })
                    e.target.value = ""
                }

            }
        }
    });

    const filterTodo = currentPath() === "/completed" ? Todo().filter(item => item.complete == true) :
        currentPath() === "/active" ? Todo().filter(item => item.complete == false) :
            Todo()


    return (

        createElement(
            "header",
            { class: "header" },

            createElement("h1", {}, "todoMVC"),
            createElement("div", { class: "input-container" },
                createElement("input", { class: "new-todo", 'data-input': 'input', placeholder: "What needs to be done?" }),
                createElement("label", { class: "visually-hidden", for: "todo-input" }, "todo Input")

            ),
            createElement("div", { class: "toggle-all-container" }, createElement("input", { type: "checkbox", class: "toggle-all", id: "toggle-all", "data-testid": "toggle-all" }), createElement("label", { class: "toggle-all-label", for: "toggle-all" })),
            createElement(
                "ul",
                { class: "todo-list" },
                (
                    filterTodo.map(Task => {


                        return (Task.db == false ? (createElement("li", { key: Task.id, class: Task.complete ? "completed" : "" },
                            createElement("div", { class: "view" },
                                (!Task.complete ? createElement("input", { class: "toggle", id: `todo-${Task.id}`, type: "checkbox", 'data-checked': "checked", 'data-id': Task.id })
                                    : createElement("input", { class: "toggle", id: `todo-${Task.id}`, type: "checkbox", 'data-checked': "checked", 'data-id': Task.id, checked: true }))
                                , createElement("label", { 'data-label': `${Task.id}` }, Task.content))
                        )) : (createElement("li", { class: "", key: Task.id },
                            createElement("div", { class: "view" },
                                createElement("div", { class: "input-container", onClick: (e) => e.stopPropagation() },
                                    createElement("input", {
                                    id: "edit", key: Task.id, 'data-input': "input", class: "edit-todo new-todo", type: "text", value: Task.content, autofocus: true

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
