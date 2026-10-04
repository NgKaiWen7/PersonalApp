export default defineNuxtRouteMiddleware(async () => {
  const user = useState("user");
  if (user.value) {
    return;
  }

  try {
    user.value = await $fetch("/api/auth");
  } catch {
    return navigateTo("/login");
  }
});
