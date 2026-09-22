import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  loadTodayWorkout,
  saveWorkoutData,
  deleteWorkout,
  loadTodayLoad
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
    "Front Raise?"
  ],
  Pull: ["Lat Pulldown (Wide)", "Lat Pulldown (Narrow)", "Face Pull", "Row", "Bicep Curl"],
  Legs: ["Squat", "Hip Extension", "Hip Induction", "Leg Extension", "Leg Curl", "Calf Raise"],
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

function WorkoutHistory({ exercises, setExercises }) {
  async function deleteExercise(id) {
    const success = await deleteWorkout(id);

    if (success) {
      const updated = { ...exercises };
      delete updated[id];
      setExercises(updated);
    }
  }


  return (
    <div className="workout-history">
      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Weight (kg)</th>
            <th>Reps</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(exercises).map(([id, exercise]) => (
            <tr key={id}>
              <td>{exercise.exerciseType}</td>
              <td>{exercise.weight}</td>
              <td>{exercise.reps}</td>
              <td>
                <button
                  className="delete-row-btn"
                  onClick={() => deleteExercise(id)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WorkoutEdit() {
  const [exerciseType, setExerciseType] = useState("");
  const [weight, setWeight] = useState(2.5);
  const [reps, setReps] = useState(1);
  const [workoutHistory, setWorkoutHistory] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const day = location.state?.day;
  // --- NEW: Load today's data when the page opens ---
  useEffect(() => {
    const loadWorkoutData = async () => {
      const exercise_data = await loadTodayWorkout();
      setWorkoutHistory(exercise_data);
    };
    loadWorkoutData();
  }, []);

  function handleBack() {
    navigate("/");
  }
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

    if (id) {
      setWorkoutHistory({
        ...workoutHistory,
        [id]: newExercise,
      });
    }
  }
  const exerciseOptions = exercisesByDay[day] || [];
  const [totalLoad, setTotalLoad] = useState(0);
  useEffect(() => {
    async function fetchLoad() {
      const load = await loadTodayLoad();
      setTotalLoad(load);
    }

    fetchLoad();
  }, []);
  return (
    <div className="workout-edit">
      <h1>{day ? `${day} Session` : "Workout Session"}</h1>
      <div className="workout-history">
        <button onClick={handleBack}>Back</button>
        <p>{totalLoad} kgs</p>
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
      <div className="workout-history">
        <WorkoutHistory
          exercises={workoutHistory}
          setExercises={setWorkoutHistory}
        />
      </div>
    </div>
  );
}
