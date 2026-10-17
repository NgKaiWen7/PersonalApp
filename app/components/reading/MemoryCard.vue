<script setup lang="ts">
import { ref } from "vue";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { MemoryCard } from "./types";

defineProps<{
    card: MemoryCard;
}>();

const flipped = ref(false);
</script>

<template>
    <Card
        class="group relative w-full max-w-md cursor-pointer overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#242016] via-[#171610] to-[#0d0d0b] text-amber-50 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-[0_12px_40px_rgba(212,175,55,0.12)]"
        @click="flipped = !flipped"
    >
        <!-- Subtle gold accent -->
        <div
            class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"
        />

        <CardHeader class="relative space-y-5 pb-4">
            <div class="flex items-center justify-between">
                <CardDescription
                    class="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-500/80"
                >
                    {{ flipped ? "Knowledge Revealed" : "Memory Collection" }}
                </CardDescription>

                <span
                    v-if="card.is_important"
                    class="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-300"
                >
                    Important
                </span>
            </div>

            <div class="h-px bg-gradient-to-r from-amber-500/40 via-amber-200/10 to-transparent" />

            <CardTitle
                v-if="!flipped"
                class="text-xl font-medium leading-relaxed tracking-wide text-amber-50"
            >
                {{ card.question }}
            </CardTitle>

            <CardTitle
                v-else
                class="text-xl font-medium tracking-wide text-amber-300"
            >
                Key Insights
            </CardTitle>
        </CardHeader>

        <CardContent class="relative min-h-48 space-y-6 pt-2">
            <template v-if="flipped">
                <div class="space-y-2">
                    <h4
                        class="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-500"
                    >
                        Key Points
                    </h4>

                    <p class="text-sm leading-7 text-stone-300">
                        {{ card.keypoint }}
                    </p>
                </div>

                <div
                    class="rounded-xl border border-amber-500/20 bg-amber-400/[0.04] p-4"
                >
                    <h4
                        class="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400"
                    >
                        Answer
                    </h4>

                    <p class="text-sm leading-7 text-amber-50/90">
                        {{ card.answer }}
                    </p>
                </div>
            </template>

            <div
                v-else
                class="flex min-h-32 items-center justify-center rounded-xl border border-amber-500/10 bg-black/10 px-5"
            >
                <p
                    class="text-center text-xs leading-6 text-stone-500"
                >
                    Reflect on the question before revealing the answer.
                </p>
            </div>
        </CardContent>

        <div class="px-6 pb-5">
            <div
                class="h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent"
            />

            <div
                class="flex items-center justify-center gap-2 pt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-amber-500/70 transition-colors group-hover:text-amber-300"
            >
                <span>{{ flipped ? "Reveal Question" : "Reveal Knowledge" }}</span>
                <span aria-hidden="true" class="text-xs">
                    {{ flipped ? "↺" : "✧" }}
                </span>
            </div>
        </div>
    </Card>
</template>
