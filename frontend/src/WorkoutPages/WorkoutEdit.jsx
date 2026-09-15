import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadTodayWorkout, saveWorkoutData, deleteWorkout, updateWorkout } from "./WorkoutData.jsx";
import "./WorkoutEdit.css";

const exerciseTypes = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
];

function ExerciseSelector({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select exercise</option>
      {exerciseTypes.map((exercise) => (
        <option key={exercise} value={exercise}>
          {exercise}
        </option>
      ))}
    </select>
  );
}

function WeightSelector({ value, onChange }) {
  const weights = [];

  for (let weight = 2.5; weight <= 100; weight += 2.5) {
    weights.push(weight);
  }

  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {weights.map((weight) => (
        <option key={weight} value={weight}>
          {weight} kg
        </option>
      ))}
    </select>
  );
}
function RepsSelector({ value, onChange }) {
  const reps = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {reps.map((rep) => (
        <option key={rep} value={rep}>
          {rep} reps
        </option>
      ))}
    </select>
  );
}

function WorkoutHistory({ exercises, setExercises }) {
  async function updateExercise(id, field, value) {
    const updated = {
      ...exercises,
      [id]: {
        ...exercises[id],
        [field]: value,
      },
    };
    setExercises(updated);
    const success = await updateWorkout(id, updated[id]); // two args, not one object
    if (!success) {
      // revert on failure
      setExercises(exercises);
    }
  }

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
          {Object.entries(exercises).map(([id, exercise]) =>(
            <tr key={id}>
              <td>
                <ExerciseSelector
                  value={exercise.exerciseType}
                  onChange={(value) =>
                    updateExercise(id, "exerciseType", value)
                  }
                />
              </td>

              <td>
                <WeightSelector
                  value={exercise.weight}
                  onChange={(value) => updateExercise(id, "weight", value)}
                />
              </td>

              <td>
                <RepsSelector
                  value={exercise.reps}
                  onChange={(value) => updateExercise(id, "reps", value)}
                />
              </td>
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
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const navigate = useNavigate();

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
  return (
    <div className="workout-edit">
      <h1>Workout Session</h1>
      <div className="workout-history">
        <button onClick={handleBack}>Back</button>
      </div>

      <ExerciseSelector value={exerciseType} onChange={setExerciseType} />

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
