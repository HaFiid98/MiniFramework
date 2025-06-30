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
            this.state = [...newState];
        } else if (typeof this.state === "string") {
            // console.log(newState)
            this.state = newState;
            // console.log(this.state)
        }else{

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
    // ("currrrrrrrrrrent", comp);

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
        // ('paaaatchessss', patches);

        patch(this.root, patches)
        // render(patches , this.root)
        this.dom = newVd;
        currentComponent = null
    }
}



// const [count, setCount, Subscribe, Unsub] = useState({ count: 0 })

// (count, "count");
// const root = document.getElementById("root")
// const div = new Component(count, root, count().count, Subscribe, () => createElement("div", {}, count().count))




// setCount({count:12356})
// setCount({count:45654654})


// (countState.getState());
// countState.setState({count: 144})

  function NotFoundView() {
        return ` <div>404</div>`
    }

const counterComponent = new Component({}, root, () => {
    
    const [Todo, SetTodo] = useState([])
    // (Todo(), "fsdfsdfdsfdsfsdfsdfsdfs");
    // addevent("click", '[data-click="todo-add"]', (e) => {

    //     SetTodo([...(Todo()), "hsdfhksfkdsjf"])
    // });
    addevent("change", '[data-checked="checked"]', (e) => {
        e.target.classList.toggle("completed")
    });
    addevent("keydown", '[data-input="input"]', (e) => {
        if (e.key === "Enter") {
            if (e.target.value !== ""){
                SetTodo([...Todo(),{id:Todo().length,text:e.target.value,completed:false}])
                e.target.value = ""
            }
        }
    });
        addevent("click", '[data-all="all"]', (e) => {
            setFilter("all")
        });
                addevent("click", '[data-com="com"]', (e) => {
            setFilter("completed")
        });
                addevent("click", '[data-act="act"]', (e) => {
            setFilter("active")
        });
    // setTodo([])

    const [flter, setFilter] = useState("all");

        const toggleTodo = (id) => {
            // console.log("hello",Todo().map(todo =>
            //   todo.id === id ? {id:todo.id,text:todo.text, completed: !todo.completed } : todo
            //       ),id)
            SetTodo(Todo().map(todo =>
              todo.id === id ? {id:todo.id,text:todo.text, completed: !todo.completed } : todo
                  ));
                    // console.log(Todo(),"heee")
                };

        const filteredTodos = Todo().filter(todo => {
            // console.log(todo.completed,filter())
         if (flter() === "completed") return todo.completed;
          if (flter() === "active") return !todo.completed;
         return true;
         });
        //  console.log(filteredTodos,flter())
        //  console.log( filteredTodos.map(todo => { console.log("helloewww");
        //             return (createElement("li", {key:todo.id}, todo.text, createElement("input", { type: "checkbox",   'data-checked': "checked" , onChange:() =>toggleTodo(todo.id)})))}),"hello")
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
                // ( (Todo()).map(Task => createElement("li", { class: "listItem" }, Task,
                //     createElement("input", { type: "checkbox", 'data-checked': "checked" })
                // ))),
                filteredTodos.map(todo => {
                    addevent("change",`#${todo.id}`,() => toggleTodo(todo.id));
                    return (createElement("li", {key:todo.id}, todo.text, createElement("input", { type: "checkbox",   id:todo.id})))}
                
            )
            // createElement("div", { class: "filterContainer" },
            //     createElement("a", { href: "#/" }, "All"),
            //     createElement("a", { href: "#/completed" }, "Completed"),
            //     createElement("a", { href: "#/active" }, "active"),
            //     createElement("button", {}, "clear completed"),
            //     createElement("p", { class: "items" }, `${Todo().length} items left!`),
            // ),
            // createElement("button", { class: "button", 'data-click': 'todo-add' }, "Tooodo")


        ),createElement("button",{'data-all':'all'},"all"),createElement("button",{'data-act':'act'},"active"),
        createElement("button",{'data-com':'com'},"completed")


    ))


}



)
const router1 = new Router("/qdqsdqs" , counterComponent , NotFoundView , root )






