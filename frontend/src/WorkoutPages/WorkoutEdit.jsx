import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkoutEdit.css"

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
  function updateExercise(index, field, value) {
    const updated = [...exercises];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setExercises(updated);
  }
  function deleteExercise(indexToRemove) {
    // .filter() creates a new array containing only the items that DO NOT match the index you clicked
    const updatedExercises = exercises.filter((exercise, index) => {
      return index !== indexToRemove;
    });
    // Update the state with the new array
    setExercises(updatedExercises);
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
              <td>
                <button
                  className="delete-row-btn"
                  onClick={() => deleteExercise(index)}
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
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(1);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const navigate = useNavigate();

  // --- NEW: Load today's data when the page opens ---
  useEffect(() => {
    async function loadTodayWorkout() {
      try {
        // 1. Get today's date in YYYY-MM-DD format
        const todayStr = new Date().toISOString().split("T")[0];
        const mockData = [
          {
            exerciseType: "Bench Press",
            weight: 60,
            reps: 10,
          },
          {
            exerciseType: "Squat",
            weight: 100,
            reps: 8,
          },
        ];
        setWorkoutHistory(mockData);
        return;
        // 2. Fetch data from your backend for this specific date
        // Adjust this URL to match how your backend expects to receive the date
        const backendUrl = `https://your-api.com/workouts?date=${todayStr}`;

        const response = await fetch(backendUrl);

        if (response.ok) {
          const data = await response.json();

          // 3. Update the table with the fetched data
          // (Adjust this depending on if your backend returns an array directly,
          // or an object like { date: "...", exercises: [...] })
          if (data && data.exercises) {
            setWorkoutHistory(data.exercises);
          } else if (Array.isArray(data)) {
            setWorkoutHistory(data);
          }
        }
      } catch (error) {
        console.error("Error loading today's workout:", error);
      }
    }

    loadTodayWorkout();
  }, []); // The empty array [] means this only runs ONCE when the page first loads

  async function handleSave() {
    // 1. Optional: Prevent saving if the list is empty
    if (workoutHistory.length === 0) {
      alert("Please add at least one exercise before saving.");
      return;
    }

    try {
      // 2. Change this URL to your actual backend endpoint
      const backendUrl = "https://your-api.com/workouts";

      // 3. Send the data to the backend
      const response = await fetch(backendUrl, {
        method: "POST", // Use "PUT" if you are updating an existing workout
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // You can send just the array, or wrap it in an object with a date
          date: new Date().toISOString().split("T")[0],
          exercises: workoutHistory,
        }),
      });

      // 4. Check if the backend accepted it
      if (!response.ok) {
        throw new Error("Failed to save workout");
      }

      // 5. If successful, navigate back to the home page or dashboard
      console.log("Workout saved successfully!");
      navigate("/");

    } catch (error) {
      // 6. Handle any errors (like network dropping)
      console.error("Error saving workout:", error);
      alert("There was a problem saving your workout. Please try again.");
    }
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
