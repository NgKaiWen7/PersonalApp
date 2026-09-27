import { useState, useEffect } from "react";
import {
  saveWorkoutData,
  deleteWorkout,
  loadTodayLoad,
} from "./WorkoutData.jsx";
import "./WorkoutEdit.css";

const exercisesByDay = {
  Push: [
    "Bench Press",
    "Fly",
    "Incline Dumbbell Press",
    "Tricep Pushdown",
    "Tricep Overhead Extension",
    "Lateral Raise",
    "Front Raise?",
  ],
  Pull: [
    "Lat Pulldown (Wide)",
    "Lat Pulldown (Narrow)",
    "Face Pull",
    "Row",
    "Bicep Curl",
  ],
  Legs: [
    "Squat",
    "Hip Extension",
    "Hip Induction",
    "Leg Extension",
    "Leg Curl",
    "Calf Raise",
  ],
};

function ExerciseSelector({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        Select exercise
      </option>
      {options.map((exercise) => (
        <option key={exercise} value={exercise}>
          {exercise}
        </option>
      ))}
    </select>
  );
}

function WeightSelector({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={2.5}
      inputMode="decimal"
    />
  );
}
function RepsSelector({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={1}
      inputMode="numeric"
    />
  );
}

export function WorkoutDay({ title, day, setDay }) {
  const workoutColors = {
    Push: "workout-push",
    Pull: "workout-pull",
    Legs: "workout-legs",
  };

  return (
    <button
      className={`workout-day ${workoutColors[title] || ""} ${
        day === title ? "selected" : ""
      }`}
      onClick={() => setDay(title)}
    >
      {title}
    </button>
  );
}

export default function WorkoutEdit() {
  const [exerciseType, setExerciseType] = useState("");
  const [weight, setWeight] = useState(2.5);
  const [reps, setReps] = useState(1);
  const [day, setDay] = useState("Push");
  const exerciseOptions = exercisesByDay[day] || [];
  const [totalLoad, setTotalLoad] = useState(0);

  async function handleAddExercise() {
    if (!exerciseType) {
      return;
    }

    const newExercise = {
      exerciseType,
      weight,
      reps,
    };
    const id = await saveWorkoutData(newExercise);
    const load = await loadTodayLoad();
    setTotalLoad(load);
  }
  useEffect(() => {
    async function fetchLoad() {
      const load = await loadTodayLoad();
      setTotalLoad(load);
    }

    fetchLoad();
  }, []);
  return (
    <div className="workout-edit">
      <div className="workout-load">
        <p>Volume: {totalLoad} kgs</p>
      </div>
      <div className="workout-days">
        <WorkoutDay title="Push" day={day} setDay={setDay} />
        <WorkoutDay title="Pull" day={day} setDay={setDay} />
        <WorkoutDay title="Legs" day={day} setDay={setDay} />
      </div>
      <ExerciseSelector
        value={exerciseType}
        onChange={setExerciseType}
        options={exerciseOptions}
      />
      <WeightSelector value={weight} onChange={setWeight} />
      <RepsSelector value={reps} onChange={setReps} />
      <div className="workout-history">
        <button onClick={handleAddExercise}>Add Exercise</button>
      </div>
    </div>
  );
}
