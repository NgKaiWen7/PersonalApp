import "./Aim.css";
import { useNavigate } from "react-router-dom";

export function Todo() {
  const navigate = useNavigate();

  return (
    <section className="aim">
      <div className="aim-header">
        <h2 className="aim-header">TODO</h2>
        <button
          className="edit-btn"
          onClick={() => navigate("/aim/edit")}
        >
          <img src={editIcon} alt="Edit" />
        </button>
      </div>

      <div className="aim-list">
        <TodoDays centerDate={getTodayDate()} />
      </div>
    </section>
  );
}
