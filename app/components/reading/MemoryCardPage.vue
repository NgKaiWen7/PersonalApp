<script setup lang="ts">
const props = defineProps<{ bookId: string }>();
import MemoryCard from "./MemoryCard.vue";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = 10;
const totalCards = ref(0);

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
const {
    data: memory_card_response,
    status: status1,
    error: error1,
} = await useFetch<MemoryCardResponse>(
    () => `/api/readings/memorycard/${props.bookId}`,
);

const memorycards = ref<MemoryCard[]>([]);
async function loadMemoryCards() {
    const { items, total, page, limit, totalPages } =
        await $fetch<MemoryCardResponse>(
            `/api/readings/memorycard/${props.bookId}`,
            {
                query: {
                    chapter_id: selectedChapter.value || undefined,
                    page: currentPage.value,
                    search: searchQuery.value.trim() || undefined,
                },
            },
        );
    memorycards.value = items;
    totalCards.value = total;
}

let searchTimeout: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, () => {
    clearTimeout(searchTimeout);

    currentPage.value = 1;

    searchTimeout = setTimeout(() => {
        loadMemoryCards();
    }, 300);
});
watch(currentPage, async () => {
    await loadMemoryCards();
});

async function selectChapter(chapterId: string) {
    selectedChapter.value = chapterId;
    await loadMemoryCards();
}
</script>
<template>
    <div class="min-h-screen space-y-8 bg-[#0D0D0B] p-6 md:p-8">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 border-b border-amber-500/20 pb-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="w-full max-w-xl">
                <div
                    class="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-gradient-to-br from-[#242016] to-[#171610] px-4 py-3 shadow-sm transition-colors focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/20"
                >
                    <Search class="size-5 shrink-0 text-amber-500/70" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search memory cards..."
                        class="w-full bg-transparent text-sm text-amber-50 outline-none placeholder:text-stone-500"
                    />
                </div>
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

                    <DropdownMenuSeparator class="bg-amber-500/20" />

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
        <div class="flex flex-wrap items-stretch justify-center gap-6">
            <MemoryCard
                v-for="card in memorycards"
                :key="card.id"
                :card="card"
            />
        </div>
        <!-- Pagination -->
        <div
            class="mt-8 flex w-full min-w-0 max-w-full justify-center overflow-x-auto"
        >
            <Pagination
                v-model:page="currentPage"
                :items-per-page="pageSize"
                :total="totalCards"
                :sibling-count="1"
                show-edges
                class="max-w-full"
            >
                <PaginationContent v-slot="{ items }" class="flex-nowrap">
                    <PaginationPrevious
                        class="shrink-0 border-amber-500/30 text-amber-200 hover:bg-amber-400/10 hover:text-amber-100"
                    />

                    <template v-for="(item, index) in items" :key="index">
                        <PaginationItem
                            v-if="item.type === 'page'"
                            :value="item.value"
                            class="shrink-0 border-amber-500/30 text-amber-200 data-[active=true]:border-amber-400/60 data-[active=true]:bg-[#3A3020] data-[active=true]:text-amber-100"
                        >
                            {{ item.value }}
                        </PaginationItem>

                        <PaginationEllipsis v-else />
                    </template>

                    <PaginationNext
                        class="shrink-0 border-amber-500/30 text-amber-200 hover:bg-amber-400/10 hover:text-amber-100"
                    />
                </PaginationContent>
            </Pagination>
        </div>
    </div>
</template>
