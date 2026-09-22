const backendUrl = "https://backend.nkwzotero.uk/api/workouts";
const backendMetaUrl = "https://backend.nkwzotero.uk/api/workoutsmeta";
async function loadTodayWorkout() {
  try {
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const today = now.toISOString().split("T")[0];
    const url = `${backendUrl}?date=${today}`;

    const token = localStorage.getItem("app_token");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    const token = localStorage.getItem("app_token");
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("app_token");

    const response = await fetch(`${backendUrl}?uuid=${uuid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
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

async function loadTodayLoad() {
  try {
    const url = `${backendMetaUrl}`;

    const token = localStorage.getItem("app_token");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load today's workout");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading today's workout:", error);
    return null;
  }
}

export { loadTodayWorkout, saveWorkoutData, deleteWorkout ,loadTodayLoad};
