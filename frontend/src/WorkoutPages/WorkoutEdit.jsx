import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  for (let weight = 0; weight <= 200; weight += 0.25) {
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
  function updateExercise(index, field, value) {
    const updated = [...exercises];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setExercises(updated);
  }

  return (
    <div className="workout-history">
      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Weight (kg)</th>
            <th>Reps</th>
          </tr>
        </thead>

        <tbody>
          {exercises.map((exercise, index) => (
            <tr key={index}>
              <td>
                <ExerciseSelector
                  value={exercise.exerciseType}
                  onChange={(value) =>
                    updateExercise(index, "exerciseType", value)
                  }
                />
              </td>

              <td>
                <WeightSelector
                  value={exercise.weight}
                  onChange={(value) =>
                    updateExercise(index, "weight", value)
                  }
                />
              </td>

              <td>
                <RepsSelector
                  value={exercise.reps}
                  onChange={(value) =>
                    updateExercise(index, "reps", value)
                  }
                />
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
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(1);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const navigate = useNavigate();
  function handleSave() {
    console.log(workout);
    navigate("/workout/edit");
  }

  function handleCancel() {
    navigate("/");
  }
  function handleAddExercise() {
    if (!exerciseType) {
      return;
    }

    setWorkoutHistory([
      ...workoutHistory,
      {
        exerciseType,
        weight,
        reps,
      },
    ]);
  }
  return (
    <div className="workout-edit">
      <h1>Workout Session</h1>
      <div className="workout-history">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
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
