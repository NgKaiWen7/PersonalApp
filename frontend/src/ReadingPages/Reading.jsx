import { useNavigate } from "react-router-dom";
import "./Reading.css"

export function Readings() {
  const navigate = useNavigate();

  return (
    <section
      className="reading"
      onClick={() => navigate("/readings")}
    >
      <div className="reading-header">
        <h2 className="reading-title">Readings</h2>
      </div>
    </section>
  );
}
