import "./Workout.css";

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
  return (
    <section className="workout">
      <h2 className="workout-title">Workout</h2>

      <div className="workout-days">
        <WorkoutDay title="Push" />
        <WorkoutDay title="Pull" />
        <WorkoutDay title="Legs" />
      </div>
    </section>
  );
}
