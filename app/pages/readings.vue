<script setup lang="ts">
definePageMeta({
    middleware: "auth",
})

const books = ref([
    {
        id: 1,
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        progress: 68,
        status: "Reading",
        lastRead: "Today",
    },
    {
        id: 2,
        title: "Computer Systems: A Programmer's Perspective",
        author: "Randal E. Bryant, David R. O'Hallaron",
        progress: 42,
        status: "Reading",
        lastRead: "Yesterday",
    },
    {
        id: 3,
        title: "The Art of Computer Programming",
        author: "Donald E. Knuth",
        progress: 12,
        status: "Reading",
        lastRead: "Sep 29",
    },
])

const filter = ref("All")

const filteredBooks = computed(() => {
    if (filter.value === "Reading") {
        return books.value.filter((book) => book.status === "Reading")
    }

    if (filter.value === "Finished") {
        return books.value.filter((book) => book.status === "Finished")
    }

    return books.value
})
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-white">
        <!-- Header -->
        <header
            class="flex h-16 items-center justify-between border-b border-slate-800 px-6"
        >
            <div>
                <h1 class="text-xl font-semibold">
                    Reading
                </h1>

                <p class="text-sm text-slate-500">
                    Books and reading progress
                </p>
            </div>

            <button
                class="rounded-md bg-[#E49C1B] px-4 py-2 text-sm font-medium text-slate-950 transition hover:opacity-90"
            >
                + Add Book
            </button>
        </header>

        <!-- Content -->
        <main class="mx-auto max-w-5xl p-6">
            <!-- Stats -->
            <div class="mb-6 grid grid-cols-3 gap-3">
                <div class="rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <div class="text-xs text-slate-500">
                        Reading
                    </div>

                    <div class="mt-1 text-2xl font-semibold">
                        3
                    </div>
                </div>

                <div class="rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <div class="text-xs text-slate-500">
                        Finished
                    </div>

                    <div class="mt-1 text-2xl font-semibold">
                        12
                    </div>
                </div>

                <div class="rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <div class="text-xs text-slate-500">
                        This month
                    </div>

                    <div class="mt-1 text-2xl font-semibold">
                        4
                    </div>
                </div>
            </div>

            <!-- Filter -->
            <div class="mb-4 flex items-center gap-1">
                <button
                    v-for="item in ['All', 'Reading', 'Finished']"
                    :key="item"
                    class="rounded-md px-3 py-1.5 text-sm transition"
                    :class="
                        filter === item
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-500 hover:text-white'
                    "
                    @click="filter = item"
                >
                    {{ item }}
                </button>
            </div>

            <!-- Books -->
            <div class="space-y-3">
                <div
                    v-for="book in filteredBooks"
                    :key="book.id"
                    class="rounded-lg border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                >
                    <div class="flex items-start justify-between gap-6">
                        <div class="min-w-0">
                            <h2 class="truncate text-base font-medium">
                                {{ book.title }}
                            </h2>

                            <p class="mt-1 text-sm text-slate-500">
                                {{ book.author }}
                            </p>
                        </div>

                        <span
                            class="shrink-0 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400"
                        >
                            {{ book.lastRead }}
                        </span>
                    </div>

                    <!-- Progress -->
                    <div class="mt-5">
                        <div class="mb-2 flex justify-between text-xs">
                            <span class="text-slate-500">
                                Progress
                            </span>

                            <span class="text-slate-400">
                                {{ book.progress }}%
                            </span>
                        </div>

                        <div class="h-1.5 overflow-hidden rounded-full bg-slate-800">
                            <div
                                class="h-full rounded-full bg-[#E49C1B]"
                                :style="{ width: `${book.progress}%` }"
                            />
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-4 flex items-center justify-between">
                        <button
                            class="text-sm text-[#E49C1B] hover:underline"
                        >
                            Continue reading
                        </button>

                        <button
                            class="text-sm text-slate-500 hover:text-white"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
