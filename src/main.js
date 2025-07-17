

import { createElement } from "../app/dom.js"
import { Router } from '../app/router.js'
import { Component, useState } from "../app/state.js"
import { eventManager } from "../app/events.js"
function App() {
  const paths = ["#/", "#/active", "#/completed"]
  const root = document.getElementById("root")
  let Pathsetter = null
  const Todo = new Component({}, root, () => {
    const [currentPath, SetcurrentPath, _, unsub] = useState(location.hash)

    console.log(currentPath());

    if (!Pathsetter) {
      Pathsetter = SetcurrentPath
    }


    if (!paths.includes(currentPath()) && !currentPath().startsWith(paths[0]) && currentPath() !== "") {
      console.log("lkhwaaaaaaaaaaaa");

      return createElement("p", {}, "")
    }
    const [Todo, SetTodo] = useState([])

    // console.log(Todo(), "fsdfsdfdsfdsfsdfsdfsdfs");
    // eventManager.addevent("click", '[data-click="todo-add"]', (e) => {

    //     SetTodo([...(Todo()), "hsdfhksfkdsjf"])
    // });


    const HandleDestroy = (id) => { SetTodo(prev => prev.filter(todo => todo.id !== id)) }
    eventManager.addevent("click", ".destroy", (e) => {
      const li = e.target.closest("li");
      if (!li) return;

      const id = parseInt(li.getAttribute("data-id"));
      if (!isNaN(id)) {
        HandleDestroy(id);
      }
    });
    eventManager.addevent("click", "", (e) => {

      const isEditInput = e.target.classList.contains("new-todo")
      const isMainInput = e.target.classList.contains("edit-todo")

      if ((!isMainInput || isEditInput)  && Todo().some(todo => todo.db)) {
        SetTodo(prev =>
          prev.map(todo => ({ ...todo, db: false }))
        );
      }
   
    });

    eventManager.addevent("blur", () => {
      SetTodo(prev => {
        return prev.map(todo => { return { ...todo, db: false } })
      })
    })


    eventManager.addevent("dblclick", 'label', (e) => {
      console.log("eveeeeeeeeeeeent");
      if (e.target.hasAttribute('data-label')) {

        const id = parseInt(e.target.getAttribute('data-label'));
        SetTodo(prev => {
          return prev.map(task => task.id === id ? { ...task, db: true } : { ...task, db: false })
        })

        document.querySelector("#edit").focus()

      }

    }
    );


    eventManager.addevent("click", '.clear-completed', (e) => {
      e.preventDefault()

      SetTodo(prev => prev.filter(task => !task.complete))
    })

    eventManager.addevent("click", '.toggle', (e) => {

      if (e.target.tagName !== "INPUT") return;
      const Id = e.target.dataset.id


      SetTodo(prev => {

        return prev.map(item => {
          return item.id == Id ? { ...item, ["complete"]: !item.complete } : item
        }
        )
      })

    });
    const filterTodo = currentPath() === "#/completed" ? Todo().filter(item => item.complete == true) :
      currentPath() === "#/active" ? Todo().filter(item => item.complete == false) :
        Todo()


    eventManager.addevent("click", '.toggle-all', (e) => {
      // e.stopPropagation()
      // e.preventDefault()
      console.log("eveeeeeeeeent trigerred");
      e.preventDefault()
      const keys = filterTodo.map(todo => todo.id)
      const fullyCheckedUncheked = filterTodo.every(todo => todo.complete) || filterTodo.every(todo => !todo.complete)
      if (fullyCheckedUncheked == true) {
        SetTodo(prev => {
          return prev.map(todo => { return keys.includes(todo.id) ? { ...todo, ["complete"]: !todo.complete } : todo })
        }
        )
      } else {
        SetTodo(prev => {
          return prev.map(todo => { return keys.includes(todo.id) ? { ...todo, ["complete"]: true } : todo })
        }
        )
      }

    })
    eventManager.addevent("keydown", '[data-input="input"]', (e) => {
      console.log("keeeeeeeeeey", e.key);

      if (e.key === "Enter" || (e.key === "Tab")) {
        if (e.target.value !== "" && e.target.value.length >= 2) {
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


    return (
      createElement(
        "container",
        { class: "container" },

        createElement("header", { class: "header" },
          createElement("h1", {}, "todoMVC"),
          createElement("div", { class: "input-container" },
            createElement("input", { class: "new-todo", 'data-input': 'input', placeholder: "What needs to be done?" }),
            createElement("label", { class: "visually-hidden", for: "todo-input" }, "todo Input")

          ),
        ),

        createElement("main", { class: "main" },
          createElement("div", { class: "toggle-all-container" }, createElement("input", { type: "checkbox", class: "toggle-all", id: "toggle-all", "data-testid": "toggle-all" }), createElement("label", { class: "toggle-all-label", for: "toggle-all" })),
          createElement(
            "ul",
            { class: "todo-list" },
            (
              filterTodo.map(Task => {



                return (Task.db == false ?
                  (createElement("li", { 'data-id': Task.id, key: Task.id, class: Task.complete ? "completed" : "" },
                    createElement("div", { class: "view" },
                      createElement("input", { checked: Task.complete, class: "toggle", id: `todo-${Task.id}`, type: "checkbox", 'data-checked': "checked", 'data-id': Task.id })

                      , createElement("label", { 'data-label': `${Task.id}` }, Task.content)),
                    createElement("button", { class: "destroy" })

                  )) : (createElement("li", { class: "", key: Task.id },
                    createElement("div", { class: "view" },
                      createElement("div", { class: "input-container", onClick: (e) => e.stopPropagation() },
                        createElement("input", {
                          id: "edit", key: Task.id, 'data-input': "input", class: "edit edit-todo new-todo", type: "text", value: Task.content, autofocus: true

                        }, "inputing"))))))
              }

              ))
          )),
        Todo().length > 0 && createElement("footer", { class: "footer" },
          createElement("ul", { class: "filters" },
            createElement("span", { class: "todo-count", }, `${Todo().filter(Task => !Task.complete).length} items left!`),

            paths.map(path => {
              const attrs = currentPath() === path.slice(1) ? { href: path, 'data-path': "path", class: "selected" } :
                { href: path, 'data-path': "path" }
              return createElement("li", {}, createElement("a", attrs, path === "#/" ? "All" : path.slice(2).slice(0, 1).toUpperCase().concat(path.slice(3))))

            })


            , createElement("button", { class: "clear-completed" }, "clear completed")
          )

        ),





      )
    )
  })
  const FrameworkAside = new Component({}, document.body, () => {


    return createElement(
      "aside",
      { class: "learn" },

      createElement(
        "header",
        {},
        createElement("h3", {}, "mini-framework"),
        createElement(
          "span",
          { class: "source-links" },
          createElement("h5", {}, "Source Code"),
          createElement(
            "a",
            { href: "https://learn.zone01oujda.ma/git/ahssaini/mini-framework" },
            "Git Repository"
          )
        )
      ),

      createElement("hr", {}),

      createElement(
        "blockquote",
        { class: "quote speech-bubble" },
        createElement(
          "p",
          {},
          "A lightweight JavaScript framework that handles DOM abstraction, routing, state management, and event delegation — fully implemented from scratch without relying on any external libraries."
        ),
        createElement(
          "footer",
          {},
          createElement("strong", {}, "Created by Zone01 students")
        )
      ),

      createElement("hr", {}),

      createElement("h4", {}, "Collaborators"),
      createElement(
        "ul",
        {},
        ["abelbach", "asebbar", "ahssaini", "kelali"].map(name =>
          createElement("li", {}, name)
        )
      ),
      createElement("h4", {}, "Project Goals"),
      createElement(
        "ul",
        {},
        createElement("li", {}, "Build a custom JavaScript framework from scratch."),
        createElement("li", {}, "No usage of libraries like React, Vue, Angular."),
        createElement("li", {}, "Make a working TodoMVC using our own framework.")
      ),

      createElement("h4", {}, "Framework Features"),
      createElement(
        "ul",
        {},
        createElement("li", {}, "✅ DOM Abstraction using virtual elements"),
        createElement("li", {}, "✅ State management via reactive stores"),
        createElement("li", {}, "✅ Event delegation system without addEventListener"),
        createElement("li", {}, "✅ Basic Router to sync URL with app state")
      ),

      createElement("h4", {}, "Documentation Includes"),
      createElement(
        "ul",
        {},
        createElement("li", {}, "Creating elements"),
        createElement("li", {}, "Binding events dynamically"),
        createElement("li", {}, "Nesting virtual DOM nodes"),
        createElement("li", {}, "Attribute and class handling"),
        createElement("li", {}, "Updating UI via state changes"),
        createElement("li", {}, "Custom routing strategy")
      ),

      createElement("h4", {}, "Learning Outcomes"),
      createElement(
        "ul",
        {},
        createElement("li", {}, "Web Framework Architecture"),
        createElement("li", {}, "Virtual DOM & Reconciliation"),
        createElement("li", {}, "State & Event Systems"),
        createElement("li", {}, "Routing & SPA Concepts")
      ),

      createElement(
        "footer",
        {},
        createElement("hr", {}),
        createElement(
          "em",
          {},
          "This project demonstrates how to build modern app architecture using only native JS. ",
          "It's designed for learning, exploration, and performance."
        )
      )
    );
  });

  const router1 = new Router("/", Todo, "", root, Pathsetter)
  router1.AddPath("/completed", Todo)
  router1.AddPath("/active", Todo)


}
App()




