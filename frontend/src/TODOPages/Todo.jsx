import "./Todo.css";
import { useNavigate } from "react-router-dom";
import editIcon from '../assets/editbutton.png';
import { TodoDays } from "./TodoEdit.jsx";

const days = [
  {
    date: "2026-09-13",
    todos: [
      { id: 1, title: "Workout", priority: "normal", status: null },
      { id: 2, title: "Study React", priority: "high", status: null },
    ],
  },
  {
    date: "2026-09-12",
    todos: [
      { id: 3, title: "Read", priority: "normal", status: null },
    ],
  },
  {
    date: "2026-09-11",
    todos: [
      { id: 4, title: "Buy groceries", priority: "low", status: null },
    ],
  },
];

const priorityColors = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  critical: "priority-critical",
};

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
        <h2 className="todo-header">TODO</h2>
        <button
          className="edit-btn"
          onClick={() => navigate("/todo/edit")}
        >
          <img src={editIcon} alt="Edit" />
        </button>
      </div>

      <div className="todo-list">
        <TodoDays daysToShow={1} />
      </div>
    </section>
  );
}
