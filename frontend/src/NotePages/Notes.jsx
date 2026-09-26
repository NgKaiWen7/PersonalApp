import { useNavigate } from "react-router-dom";
import "./Notes.css"

export function Notes() {
  const navigate = useNavigate();

  return (
    <section
      className="notes"
      onClick={() => navigate("/notes")}
    >
      <div className="notes-header">
        <h2 className="notes-title">Notes</h2>
      </div>
    </section>
  );
}
