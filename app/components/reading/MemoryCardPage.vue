<script setup lang="ts">
const props = defineProps<{ bookId: string }>();
import MemoryCard from "./MemoryCard.vue";
const page = ref(1);
const pageSize = 10;
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemoryCard {
    question: string;
    answer: string;
    keypoint: string;
    isimportant: boolean;
}

interface MemoryCardResponse {
    items: MemoryCard[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface Chapter {
    id: string;
    chapter_number: number;
    title: string;
}

const {
    data: chapters,
    status,
    error,
} = await useFetch<Chapter[]>(() => `/api/readings/chapter/${props.bookId}`);
const selectedChapter = ref<string | null>(null);
const memorycards = ref<MemoryCard[]>([]);

async function selectChapter(chapterId: string) {
    selectedChapter.value = chapterId;
    const { data, error } = await useFetch<MemoryCardResponse>(
        `/api/readings/memorycard/${chapterId}`,
    );

    if (error.value || !data.value) return;
    memorycards.value = data.value?.items ?? [];
}
</script>
<template>
    <div class="min-h-screen space-y-8 bg-[#0D0D0B] p-6 md:p-8">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 border-b border-amber-500/20 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="space-y-1">
                <h2
                    class="text-2xl font-semibold tracking-wide text-amber-50"
                >
                    Study Cards
                </h2>

                <p class="text-sm text-stone-400">
                    Review your knowledge, one concept at a time.
                </p>
            </div>

            <!-- Chapter selector -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <button
                        class="inline-flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-gradient-to-br from-[#242016] to-[#171610] px-4 py-3 text-sm font-medium text-amber-100 shadow-sm transition-all hover:border-amber-400/60 hover:bg-amber-400/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    >
                        <span class="flex items-center gap-2">
                            <span class="text-amber-400">✧</span>
                            Chapters
                        </span>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    class="w-72 border border-amber-500/25 bg-[#171610] p-2 text-amber-50 shadow-xl shadow-black/40"
                >
                    <div
                        class="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/80"
                    >
                        Select a chapter
                    </div>

                    <DropdownMenuSeparator
                        class="bg-amber-500/20"
                    />

                    <DropdownMenuItem
                        v-for="item in chapters"
                        :key="item.id"
                        class="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-stone-300 outline-none transition-colors focus:bg-amber-400/10 focus:text-amber-200"
                        @select="selectChapter(item.id)"
                    >
                        {{ item.title }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <!-- Memory cards -->
        <div
            class="flex flex-wrap items-stretch justify-center gap-6"
        >
            <MemoryCard
                v-for="card in memorycards"
                :key="card.id"
                :card="card"
            />
        </div>
    </div>
</template>
