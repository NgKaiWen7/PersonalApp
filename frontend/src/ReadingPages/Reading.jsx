import { useNavigate } from "react-router-dom";

export function Readings() {
  const navigate = useNavigate();

  return (
    <section className="reading">
      <div className="reading-header">
        <h2 className="reading-title">Readings</h2>

        <button
          className="reading-add"
          onClick={() => navigate("/readings")}
        >
          List
        </button>
      </div>
    </section>
  );
}
