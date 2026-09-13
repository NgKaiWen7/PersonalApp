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
    return mockData;
    const backendUrl = `https://your-api.com/workouts?date=${todayStr}`;

    const response = await fetch(backendUrl);

    if (response.ok) {
      const data = await response.json();

      return data;
    }
  } catch (error) {
    console.error("Error loading today's workout:", error);
  }
}

async function saveWorkoutData(workoutData) {
  // 1. Optional: Prevent saving if the list is empty
  if (workoutData.length === 0) {
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
        exercises: workoutData,
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

export { loadTodayWorkout, saveWorkoutData };
