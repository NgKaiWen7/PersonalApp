<script setup lang="ts">
definePageMeta({
  layout: "login",
})
const username = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

const router = useRouter()

async function handleSubmit() {
    error.value = ""
    loading.value = true

    try {
        await $fetch("/api/auth/", {
            method: "POST",
            body: {
                username: username.value,
                password: password.value,
            },
        })

        await router.push("/")
    } catch (err: any) {
        error.value =
            err?.data?.message ||
            "Invalid username or password!"
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login-container">
        <form class="login-form" @submit.prevent="handleSubmit">
            <h2>Login Required</h2>

            <p>
                Please enter your credentials to access your dashboard.
            </p>

            <div v-if="error" class="login-error">
                {{ error }}
            </div>

            <input
                v-model="username"
                type="text"
                placeholder="Username"
                autocomplete="username"
                required
            />

            <input
                v-model="password"
                type="password"
                placeholder="Password"
                autocomplete="current-password"
                required
            />

            <button type="submit" :disabled="loading">
                {{ loading ? "Signing In..." : "Sign In" }}
            </button>
        </form>
    </div>
</template>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.login-form {
    width: 100%;
    max-width: 400px;
}

.login-form h2 {
    margin-bottom: 0.5rem;
}

.login-form p {
    margin-bottom: 1.5rem;
}

.login-form input {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.75rem;
}

.login-form button {
    width: 100%;
    padding: 0.75rem;
}

.login-error {
    margin-bottom: 1rem;
}
</style>
