<script setup lang="ts">
import { Layers, Search } from "@lucide/vue";
import { Input } from "@/components/ui/input";
import type { Book } from "#shared/types/book";

definePageMeta({ middleware: "auth" });

const { data: books, pending, error } = await useFetch<Book[]>("/api/readings", {
    default: () => [],
});
const search = ref("");

const filteredBooks = computed(() => {
    const query = search.value.trim().toLowerCase();
    if (!query) return books.value;

    return books.value.filter((book) =>
        [
            book.title,
            book.id,
            book.category.join(" "),
            book.status,
            book.description,
        ].some((value) => value.toLowerCase().includes(query)),
    );
});

function formatDate(value: string | null) {
    if (!value) return null;

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
                <h1 class="text-2xl font-semibold">Books</h1>
                <p class="mt-1 text-sm text-neutral-400">{{ books.length }} books</p>
            </div>

            <div class="relative w-full sm:max-w-xs">
                <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                <Input
                    v-model="search"
                    placeholder="Search books..."
                    class="border-white/10 bg-white/[0.04] pl-9 text-white placeholder:text-neutral-500"
                />
            </div>
        </div>

        <p v-if="pending" class="text-sm text-neutral-400">Loading books...</p>
        <p v-else-if="error" class="text-sm text-red-400">
            Failed to load books: {{ error.message }}
        </p>

        <div v-else-if="filteredBooks.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink
                v-for="book in filteredBooks"
                :key="book.id"
                :to="`/readings/${book.id}`"
                class="block rounded-xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all hover:border-[#C5A24A]/40 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A24A]"
            >
                <div class="mb-4 flex items-center gap-3">
                    <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#C5A24A]/10">
                        <Layers class="size-5 text-[#C5A24A]" />
                    </div>

                    <div class="min-w-0 flex-1">
                        <h2 class="truncate font-medium text-neutral-100">{{ book.title }}</h2>
                        <p v-if="formatDate(book.created_at)" class="text-xs text-neutral-500">
                            {{ formatDate(book.created_at) }}
                        </p>
                    </div>
                    <span class="text-xs text-neutral-500">↗</span>
                </div>

                <div class="mb-3 flex flex-wrap gap-2 text-xs text-neutral-400">
                    <span v-for="category in book.category" :key="category" class="rounded-full bg-white/[0.06] px-2 py-1">
                        {{ category }}
                    </span>
                    <span class="rounded-full bg-[#C5A24A]/10 px-2 py-1 text-[#D8B65A]">
                        {{ book.status }}
                    </span>
                </div>

                <p v-if="book.description" class="break-words whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                    {{ book.description }}
                </p>
                <p v-if="book.last_read" class="mt-3 text-xs text-neutral-500">
                    Last read {{ formatDate(book.last_read) }}
                </p>
                <p v-if="book.source" class="mt-3 text-xs text-neutral-500">Source attached</p>
                <p class="mt-4 break-all text-[11px] text-neutral-600">{{ book.id }}</p>
            </NuxtLink>
        </div>

        <div v-else class="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] py-16 text-neutral-500">
            <Layers class="mb-3 size-8" />
            <p class="text-sm">No books found.</p>
        </div>
    </div>
</template>
