import "./Workout.css";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {  loadTodayLoad } from "./WorkoutData.jsx";
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
  const [totalLoad, setTotalLoad] = useState(0);
  useEffect(() => {
    async function fetchLoad() {
      const load = await loadTodayLoad();
      setTotalLoad(load);
    }

    fetchLoad();
  }, []);
  return (
    <section className="workout">
      <div className="workout-header">
        <h2 className="workout-title">Workout</h2>
        <div className="workout-load">
          <span className="workout-load-label">Today's Load</span>
          <span className="workout-load-value">
            {totalLoad.toLocaleString()} <small>kg</small>
          </span>
        </div>
      </div>
      <div className="workout-days">
        <WorkoutDay title="Push" />
        <WorkoutDay title="Pull" />
        <WorkoutDay title="Legs" />
      </div>
    </section>
  );
}
