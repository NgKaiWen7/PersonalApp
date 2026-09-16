const backendUrl = "https://backend.nkwzotero.uk/api/workouts";

async function loadTodayWorkout() {
  try {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const url = `${backendUrl}?date=${today}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to load today's workout");
    }

    const data = await response.json();

    return data.reduce((acc, item) => {
      acc[item.id] = {
        exerciseType: item.exercise_type,
        weight: item.weight,
        reps: item.reps,
      };
      return acc;
    }, {});
  } catch (error) {
    console.error("Error loading today's workout:", error);
    return {};
  }
}

async function saveWorkoutData(exercise) {
  if (!exercise || !exercise.exerciseType) {
    alert("Please add an exercise before saving.");
    return null;
  }

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exercise_type: exercise.exerciseType,
        weight: exercise.weight,
        reps: exercise.reps,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save workout");
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error saving workout:", error);
    alert("There was a problem saving your workout. Please try again.");
    return null;
  }
}

async function deleteWorkout(uuid) {
  try {
    const response = await fetch(`${backendUrl}?uuid=${uuid}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete workout");
    }

    return true;
  } catch (error) {
    console.error("Error deleting workout:", error);
    alert("There was a problem deleting the workout. Please try again.");
    return false;
  }
}

async function updateWorkout(id, exercise) {
  try {
    const response = await fetch(`${backendUrl}?uuid=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        exercise_type: exercise.exerciseType,
        weight: exercise.weight,
        reps: exercise.reps,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update workout");
    }

    return true;
  } catch (error) {
    console.error("Error updating workout:", error);
    return false;
  }
}
export { loadTodayWorkout, saveWorkoutData, deleteWorkout, updateWorkout };
