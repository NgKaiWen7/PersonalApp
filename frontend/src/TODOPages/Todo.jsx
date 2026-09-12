import "./Todo.css";
import { useNavigate } from "react-router-dom";
import editIcon from '../assets/editbutton.png';

const todos = [
  {
    id: 1,
    title: "Study React",
    description: "Learn components, props, and state",
    status: true,
    priority: "low",
  },
  {
    id: 2,
    title: "Work on personal manager",
    description: "Build the daily todo page",
    status: true,
    priority: "high",
  },
  {
    id: 3,
    title: "Read a book",
    description: "Read 20 pages before sleeping",
    status: true,
    priority: "medium",
  },
  {
    id: 4,
    title: "Exercise",
    description: "Go for a 30-minute walk",
    status: false,
    priority: "critical",
  },
];

async function handleStatusChange(uuid, status) {
  await fetch(`/api/todos/${uuid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });
}

export function TodoItem({
  title,
  description,
  status,
  priority,
  onStatusChange,
}) {
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
        <input
          type="checkbox"
          checked={status}
          // TODO the uuid needs to change some day
          onChange={(event) => onStatusChange("uuid", event.target.checked)}
        />
      </div>

      <div className="todo-description">{description}</div>
    </div>
  );
}

export function Todo() {
  const navigate = useNavigate();

  return (
    <section className="todo">
      <div className="todo-header">
        <h2 className="todo-title">TODO</h2>
        <button
          className="edit-btn"
          onClick={() => navigate("/todo/edit")}
        >
          <img src={editIcon} alt="Edit" />
        </button>
      </div>

      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            title={todo.title}
            description={todo.description}
            status={todo.status}
            priority={todo.priority}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </section>
  );
}
