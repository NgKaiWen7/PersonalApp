export function useWorkout() {
    const total = useState("workout-total", () => 0);

    async function loadTotal() {
        const response = await fetch("/api/workout/total");
        total.value = Number(await response.json());
    }

    return {
        total,
        loadTotal,
    };
}
