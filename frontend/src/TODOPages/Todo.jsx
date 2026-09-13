import "./Todo.css";
import { useNavigate } from "react-router-dom";
import editIcon from '../assets/editbutton.png';
import TodoDays from "./TodoEdit.jsx";

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // e.g. "2026-09-13"
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
        <TodoDays centerDate={getTodayDate()} />
      </div>
    </section>
  );
}
