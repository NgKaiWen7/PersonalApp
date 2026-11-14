<script setup lang="ts">
import { computed, ref } from "vue";
import { Search, Layers } from "@lucide/vue";
import { Input } from "@/components/ui/input";

definePageMeta({ middleware: "auth" });

type CardDeck = {
    id: string;
    source_id: string;
    title: string | null;
    system_prompt: string;
    created_at: string;
};

const {
    data: cardDecks,
    pending,
    error,
} = await useFetch<CardDeck[]>("/api/readings", {
    default: () => [],
});

const search = ref("");

const filteredDecks = computed(() => {
    const query = search.value.trim().toLowerCase();

    if (!query) return cardDecks.value;

    return cardDecks.value.filter((deck) =>
        [
            deck.title,
            deck.id,
            deck.source_id,
            deck.system_prompt,
        ].some((value) => value?.toLowerCase().includes(query)),
    );
});

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
</script>

<template>
    <div class="mx-auto w-full max-w-7xl space-y-6 text-white">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-semibold">Card Decks</h1>
                <p class="mt-1 text-sm text-neutral-400">
                    {{ cardDecks.length }} learning collections
                </p>
            </div>

            <div class="relative w-full sm:max-w-xs">
                <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                <Input v-model="search" placeholder="Search card decks..."
                    class="border-white/10 bg-white/[0.04] pl-9 text-white placeholder:text-neutral-500" />
            </div>
        </div>

        <p v-if="pending" class="text-sm text-neutral-400">
            Loading card decks...
        </p>

        <p v-else-if="error" class="text-sm text-red-400">
            Failed to load card decks: {{ error.message }}
        </p>

        <div v-else-if="filteredDecks.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink v-for="deck in filteredDecks" :key="deck.id" :to="`/readings/${deck.id}`"
                class="block rounded-xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all hover:border-[#C5A24A]/40 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A24A]">
                <div class="mb-4 flex items-center gap-3">
                    <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#C5A24A]/10">
                        <Layers class="size-5 text-[#C5A24A]" />
                    </div>

                    <div class="min-w-0 flex-1">
                        <h2 class="truncate font-medium text-neutral-100">
                            {{ deck.title || "Untitled deck" }}
                        </h2>
                        <p class="text-xs text-neutral-500">
                            {{ formatDate(deck.created_at) }}
                        </p>
                    </div>
                    <span class="text-xs text-neutral-500">↗</span>
                </div>

                <p class="mb-3 text-xs text-neutral-500">
                    Source ID: {{ deck.source_id }}
                </p>

                <p class="break-words whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                    {{ deck.system_prompt }}
                </p>

                <p class="mt-4 break-all text-[11px] text-neutral-600">
                    {{ deck.id }}
                </p>
            </NuxtLink>
        </div>

        <div v-else
            class="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] py-16 text-neutral-500">
            <Layers class="mb-3 size-8" />
            <p class="text-sm">No card decks found.</p>
        </div>
    </div>
</template>
