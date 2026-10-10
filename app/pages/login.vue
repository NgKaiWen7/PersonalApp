
<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";

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

<template>
    <div
        class="flex min-h-screen items-center justify-center bg-[#191A33] px-4 py-8 text-white"
    >
        <div v-if="checkingSession" class="text-sm text-white/60">
            Checking session...
        </div>

        <Card
            v-else
            class="w-full max-w-md border-white/10 bg-white/[0.04] text-white shadow-2xl"
        >
            <CardHeader class="space-y-2">
                <CardTitle class="text-2xl font-semibold tracking-tight">
                    Login Required
                </CardTitle>

                <CardDescription class="text-white/60">
                    Enter your credentials to access your dashboard.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form class="space-y-5" @submit.prevent="handleSubmit">
                    <Alert
                        v-if="error"
                        variant="destructive"
                    >
                        <AlertDescription>
                            {{ error }}
                        </AlertDescription>
                    </Alert>

                    <div class="space-y-2">
                        <label
                            for="username"
                            class="text-sm font-medium"
                        >
                            Username
                        </label>

                        <Input
                            id="username"
                            v-model="username"
                            type="text"
                            placeholder="Enter your username"
                            autocomplete="username"
                            required
                            class="border-white/10 bg-black/20 text-white placeholder:text-white/30"
                        />
                    </div>

                    <div class="space-y-2">
                        <label
                            for="password"
                            class="text-sm font-medium"
                        >
                            Password
                        </label>

                        <Input
                            id="password"
                            v-model="password"
                            type="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            required
                            class="border-white/10 bg-black/20 text-white placeholder:text-white/30"
                        />
                    </div>

                    <Button
                        type="submit"
                        :disabled="loading"
                        class="w-full bg-[#E49C1B] text-[#191A33] hover:bg-[#E49C1B]/90"
                    >
                        {{
                            loading
                                ? "Signing In..."
                                : "Sign In"
                        }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
