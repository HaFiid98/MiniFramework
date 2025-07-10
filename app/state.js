import { createElement, diff, patch, render } from "./dom.js";
import { Router } from "./router.js";
import { eventManager } from "./events.js";


let currentComponent = null;

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
        this.dom = this.renderfunc();
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

  function NotFoundView() {
        return ` <div>404</div>`
    }

const counterComponent = new Component({}, root, () => {
    let all,com,act = "";
    
    const [Todo, SetTodo] = useState([])
    // (Todo(), "fsdfsdfdsfdsfsdfsdfsdfs");
    // addevent("click", '[data-click="todo-add"]', (e) => {

    //     SetTodo([...(Todo()), "hsdfhksfkdsjf"])
    // });
    // eventManager.addevent("dbclick","")

// Only triggers when clicking buttons with class "btn-primary"
//     eventManager.on('click', '.btn-primary', (e) => {
//     console.log('Primary button clicked!', e.target);
// });
    // addevent("change", '[data-checked="checked"]', (e) => {
    //     e.target.classList.toggle("completed")
    // });


    
    const clickedoutside = (e) => {
    const inputElement = document.querySelector('[data-input="input"]');

        if (inputElement && !inputElement.contains(e.target)) {
    // Clicked outside the input
        console.log('Clicked outside!');
    // Handle the outside click
  }
};
eventManager.addevent("click", clickedoutside)
    eventManager.addevent("keydown",'[data-input="input"]', (e) => {
        if (e.key === "Enter") {
            if (e.target.getAttribute('id') === "edit") {
                const id = parseInt(e.target.getAttribute('key'));
                SetTodo(Todo().map(todo => {
                    if (todo.id === id) {
                        return {...todo, text: e.target.value, db: false};
                    }
                    return todo;
                }));
                e.target.value = "";
                return;
            }
            if (e.target.value !== "" && e.target.value.length != 1){
                SetTodo([...Todo(),{id:Todo().length,text:e.target.value,completed:false,db:false}]);
                // console.log("Todoerrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
                e.target.value = ""
            }
        }});

    const [flter, setFilter] = useState("all");
    eventManager.addevent('click','[data-all="all"]',() => {
        setFilter("all");
        all = "selected";
        com,act = "";
    });
        eventManager.addevent('click','[data-act="act"]',() => {
        setFilter("active");
        act = "selected";
        com,all = "";
    });
        eventManager.addevent('click','[data-com="com"]',() => {
        setFilter("completed");
        com = "selected";
        all,act = "";
    });
        const deltodo = (id) => {
            SetTodo(Todo().filter(todo => {
                if(todo.id != id) return true;
                return false;
            }))
        }
    eventManager.addevent("click",".clear-completed",() => {
        SetTodo(Todo().filter(todo => {
            if(todo.completed) return false;
            return true;

        }))
    })
    eventManager.addevent("click",".toggle-all",() => {
        if (flter() === "completed") {
            SetTodo(Todo().map(todo => ({...todo, completed: completed === true ? false : true})));
            return;
        }
        if (flter() === "active") {
            SetTodo(Todo().map(todo => ({...todo, completed: completed === false ? true : false})));
            return;
        }
        if (getactive() > 0) {
            SetTodo(Todo().map(todo => ({...todo, completed: true})));
            return;
        }
        SetTodo(Todo().map(todo => ({...todo, completed: false})));
    }
);

    const getactive = () => {
        return Todo().filter(todo => {
             return todo.completed === false ? true : false;  
        }).length
    }
        const toggleTodo = (id) => {
            SetTodo(Todo().map(todo =>
              todo.id === id ? {...todo, completed: !todo.completed} : todo
                  ));
                };

        const filteredTodos = Todo().filter(todo => {
         if (flter() === "completed") return todo.completed;
          if (flter() === "active") return !todo.completed;
         return true;
         });


        const footer = ()=>{
                    if (filteredTodos.length > 0){
                        return createElement("footer",{class:"footer"},
                            createElement("span",{class:"todo-count"},`${getactive()} left!`),
                            createElement("ul",{class:"filters"},
                            createElement("li",{},createElement("a", {class:all, href: "#/",'data-all':"all" }, "All")),
                            createElement("li",{},createElement("a", {class:act, href: "#/active",'data-act':"act" }, "Active")),
                            createElement("li",{},createElement("a", {class:com, href: "#/completed",'data-com':"com"}, "Completed")),
                            createElement("button",{class:"clear-completed"},"clear completed")));
                    }
                    return false
                };
        let foot = footer();

        // console.log("fileteredTodos",filteredTodos);
        // eventManager.addevent("change", ".toggle", (e) => {
        //     const id = parseInt(e.target.getAttribute('data-change'));
        //     toggleTodo(id);
        // });
                        eventManager.addevent("dblclick",'label', (e) => {
                            if (e.target.hasAttribute('data-label')) {
                                const id = parseInt(e.target.getAttribute('data-label'));
                                console.log("id", id);
                                            SetTodo(Todo().map(todo => {
                                                if (todo.id === id) {
                                                    return {...todo, db: true};
                                                }
                                                return todo;
                                            }));
                                    }
                                    }
                                    );
    return (
        createElement("div",{ class: "Container"},
            createElement("aside",{class:"learn"}),
            createElement("section",{class:"todoapp",id:"root"},
                createElement("header",{class:"header"},
                    createElement("h1",{},"todos"),
                createElement("div",{class:"input-container"},
                    createElement("input", { class: "new-todo",id:"todo-input", 'data-input': 'input',placeholder:"What needs to be done?" },"inputing"))),
                createElement("main",{class:"main"}, filteredTodos.length > 0 ? createElement("div",{class:"toggle-all-container"},
                            createElement("input",{class:"toggle-all",type:"checkbox",id:"toggle-all"}),
                                createElement("label",{class:"toggle-all-label",for:"toggle-all"},"toggle all input")) : false,
                    filteredTodos.length > 0 ? createElement("ul",{ class: "todo-list"},
                                filteredTodos.map(todo => {
                                    eventManager.addevent("click",`[data-change="${todo.id}"]`,() => toggleTodo(todo.id));
                                    eventManager.addevent("click",".destroy",() => deltodo(todo.id));
                                    let cmp = todo.completed ? "completed":"";
                                    return todo.db ? createElement("li", {class:"",key:todo.id},
                                                       createElement("div",{class:"view"},
                                                         createElement("div",{class:"input-container" , onClick: (e) => e.stopPropagation()},
                                                            createElement("input", {id:"edit",key:todo.id,'data-input':"input", class: "new-todo", type: "text", value: todo.text}, "inputing")))) :
                                            createElement("li", {class:cmp,key:todo.id},
                                                    createElement("div",{class:"view"},(!todo.completed ?
                                                    createElement("input", { class: "toggle", type: "checkbox", 'data-change': `${todo.id}`}) :
                                                    createElement("input", { class:"toggle", type: "checkbox", 'data-change':`${todo.id}`, checked: "" })),
                                                    createElement("label",{'data-label':`${todo.id}`},todo.text),
                                                    createElement("button",{class:"destroy"})))})) : false ), filteredTodos.length > 0 ? foot : false),
            createElement("footer",{class:"info"},createElement("p",{},"Double-click to edit a todo"),createElement("p",{},"Double-Created by hafid && anas"))))


}
)
// const router1 = new Router("/" , counterComponent , NotFoundView , root )
// const routeract = new Router("/active" , counterComponent , setFilter("active") , root )
// const routercom = new Router("/completed" , counterComponent , setFilter("completed") , root )
// const router1 = new Router("/" , counterComponent , NotFoundView , root )







