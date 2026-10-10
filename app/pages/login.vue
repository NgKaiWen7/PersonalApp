<script setup lang="ts">
definePageMeta({ layout: "login" });

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const checkingSession = ref(true);

const router = useRouter();

onMounted(async () => {
    try {
        await $fetch("/api/auth");
        await router.replace("/");
    } catch {
        // No valid session. Show the login form.
    } finally {
        checkingSession.value = false;
    }
});

async function handleSubmit() {
    error.value = "";
    loading.value = true;

    try {
        await $fetch("/api/auth/", {
            method: "POST",
            body: {
                username: username.value,
                password: password.value,
            },
        });

        await router.push("/");
    } catch (err: any) {
        error.value =
            err?.data?.message || "Invalid username or password!";
    } finally {
        loading.value = false;
    }
}
</script>
