import "./Workout.css";
import { useNavigate } from "react-router-dom";

export function WorkoutDay({ title }) {
  const navigate = useNavigate();

  const workoutColors = {
    Push: "workout-push",
    Pull: "workout-pull",
    Legs: "workout-legs",
  };

  return (
    <button
      className={`workout-day ${workoutColors[title] || ""}`}
      onClick={() => navigate("/workout/edit", { state: { day: title } })}
    >
      {title}
    </button>
  );
}

export function Workout() {
  return (
    <section className="workout">
      <div className="workout-header">
        <h2 className="workout-title">Workout</h2>
      </div>
      <div className="workout-days">
        <WorkoutDay title="Push" />
        <WorkoutDay title="Pull" />
        <WorkoutDay title="Legs" />
      </div>
    </section>
  );
}
