import "./Workout.css";
import editIcon from '../assets/editbutton.png';
import { useNavigate } from "react-router-dom";

export function WorkoutDay({ title }) {
  const workoutColors = {
    Push: "workout-push",
    Pull: "workout-pull",
    Legs: "workout-legs",
  };

  return (
    <div className={`workout-day ${workoutColors[title] || ""}`}>
      {title}
    </div>
  );
}

export function Workout() {
  const navigate = useNavigate();

  return (
    <section className="workout">
      <div className="workout-header">
      <h2 className="workout-title">Workout</h2>
      <button
          className="edit-btn"
          onClick={() => navigate("/workout/edit")}
      >
          <img src={editIcon} alt="Edit" />
      </button>
      </div>
      <div className="workout-days">
        <WorkoutDay title="Push" />
        <WorkoutDay title="Pull" />
        <WorkoutDay title="Legs" />
      </div>
    </section>
  );
}
