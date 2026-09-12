import "./Todo.css";

const todos = [
  {
    id: 1,
    title: "Study React",
    description: "Learn components, props, and state",
    status: true,
    priority: 'low'
  },
  {
    id: 2,
    title: "Work on personal manager",
    description: "Build the daily todo page",
    status: true,
    priority: 'high'
  },
  {
    id: 3,
    title: "Read a book",
    description: "Read 20 pages before sleeping",
    status: true,
    priority: 'medium'
  },
  {
    id: 4,
    title: "Exercise",
    description: "Go for a 30-minute walk",
    status: true,
    priority: 'critical'
  },
];

export function TodoItem({ title, description, status, priority }) {
  const priorityColors = {
    low: "priority-low",
    medium: "priority-medium",
    high: "priority-high",
    critical: "priority-critical",
  };

  return (
    <div className={`todo-item ${priorityColors[priority] || ""}`}>
      <div className="todo-main">
        <span>{title}</span>
        <input type="checkbox" />
      </div>

      <div className="todo-description">
        {description}
      </div>
    </div>
  );
}
export function Todo() {
  return (
    <section className="todo">
      <h2 className="todo-title">TODO</h2>

      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            title={todo.title}
            description={todo.description}
            status={todo.status}
            priority={todo.priority}
          />
        ))}
      </div>
    </section>
  );
}
