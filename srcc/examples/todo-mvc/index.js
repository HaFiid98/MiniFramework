import Framework from '../../src';

const { 
  createElement, 
  render,
  setState,
  getState,
  subscribe,
  diff,
  patch
} = Framework;



// Initial state
setState({
  todos: [],
  filter: 'all',
  nextId: 1
});

// Helper functions
function addTodo(text) {
  console.log(text);
  setState({
    todos: [
      ...getState().todos,
      { id: getState().nextId, text, completed: false }
    ],
    nextId: getState().nextId + 1
  });
  console.log(getState())
}

function toggleTodo(id) {
  setState({
    todos: getState().todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  });
}

function deleteTodo(id) {
  setState({
    todos: getState().todos.filter(todo => todo.id !== id)
  });
}

function setFilter(filter) {
  setState({ filter });
}

function clearCompleted() {
  setState({
    todos: getState().todos.filter(todo => !todo.completed)
  });
}

function TodoApp() {
  const state = getState();
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });
  console.log(filteredTodos,"hi1")
  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input 
          className="new-todo" 
          placeholder="What needs to be done?" 
          autofocus 
          onKeyDown={e => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              addTodo(e.target.value.trim());
              e.target.value = '';
            }
            // console.log(filteredTodos,"hi")
          }}
        />
      </header>
      <section className="main">
        <input 
          id="toggle-all" 
          className="toggle-all" 
          type="checkbox" 
          checked={state.todos.every(todo => todo.completed)}
          onChange={() => {
            const allCompleted = state.todos.every(todo => todo.completed);
            // console.log(filteredTodos,"hi")
            setState({
              todos: state.todos.map(todo => ({
                ...todo,
                completed: !allCompleted
              }))
            });
          }}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li className={todo.completed ? 'completed' : ''} key={todo.id}>
              <div className="view">
                <input 
                  className="toggle" 
                  type="checkbox" 
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <label>{todo.text}</label>
                <button 
                  className="destroy" 
                  onClick={() => deleteTodo(todo.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
      <footer className="footer">
        <span className="todo-count">
          <strong>
            {state.todos.filter(todo => !todo.completed).length}
          </strong> item left
        </span>
        <ul className="filters">
          <li>
            <a 
              className={state.filter === 'all' ? 'selected' : ''}
              href="#/"
              onClick={e => {
                e.preventDefault();
                setFilter('all');
              }}
            >
              All
            </a>
          </li>
          <li>
            <a 
              className={state.filter === 'active' ? 'selected' : ''}
              href="#/active"
              onClick={e => {
                e.preventDefault();
                setFilter('active');
              }}
            >
              Active
            </a>
          </li>
          <li>
            <a 
              className={state.filter === 'completed' ? 'selected' : ''}
              href="#/completed"
              onClick={e => {
                e.preventDefault();
                setFilter('completed');
              }}
            >
              Completed
            </a>
          </li>
        </ul>
        {state.todos.some(todo => todo.completed) && (
          <button 
            className="clear-completed" 
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        )}
      </footer>
    </div>
  );
}

// Render function
function update() {
  const app = document.getElementById('app');
  const newVNode = TodoApp();
  const patches = diff(app.firstChild, newVNode);
  patch(app, patches);
}

// Subscribe to state changes
subscribe(update);

// Initial render
// render(<TodoApp />, document.getElementById('app'));
// render(<TodoApp />, document.getElementById('app'));


render(TodoApp(), document.getElementById('app'));

// Or better yet, use createElement:
// render(createElement(TodoApp), document.getElementById('app'));
