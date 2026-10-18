<script setup lang="ts">
definePageMeta({ middleware: "auth" });
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination";
const search = ref("");
const page = ref(1);
const limit = ref(20);

interface Note {
    id: string;
    uuid: string;
    title: string;
    description: string;
}
interface NotesResponse {
    items: Note[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
const {
    data: notesResponse,
    refresh,
} = await useFetch<NotesResponse>("/api/notes", {
    query: { search, page, limit },
    default: () => ({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    }),
});

const notes = computed(() => notesResponse.value.items);
const total = computed(() => notesResponse.value.total);
const totalPages = computed(() => notesResponse.value.totalPages);

async function handleNewDraft() {
    try {
        const note = await $fetch("/api/notes", {
            method: "POST",
            body: {
                title: "New Draft",
                description: "",
                category: "",
                content: "",
            },
        });

        await navigateTo(`/notes/${note.id}`);
    } catch (error) {
        console.error("Failed to create note:", error);
    }
}
function openNote(uuid: string) {
    navigateTo(`/notes/${uuid}`);
}
function changePage(newPage: number) {
    page.value = newPage;
}
</script>
<template>
    <div class="w-full p-4 sm:p-6">
        <!-- Header -->
        <div class="mb-6">
            <div class="mb-1 text-2xl font-bold text-white">Notes</div>
            <div class="text-sm italic text-slate-500">
                "I never wrote things down to remember; I always wrote things
                down so I could forget."
            </div>
        </div>
        <!-- Actions -->
        <div class="mb-6 flex flex-col gap-3 sm:flex-row">
            <input
                v-model="search"
                type="text"
                placeholder="Search notes..."
                class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[#E49C1B] focus:ring-1 focus:ring-[#E49C1B] sm:flex-1"
            />
            <Button
                class="px-3 bg-[#E49C1B] font-medium text-slate-950 hover:bg-[#f0aa24]"
                @click="handleNewDraft"
            >
                + New Draft
            </Button>
        </div>
        <!-- Notes -->
        <div class="space-y-3">
            <noteCard
                v-for="note in notes"
                :key="note.uuid"
                :title="note.title"
                :description="note.description"
                @click="openNote(note.id)"
            />
        </div>
    </div>
    <!-- Pagination -->
    <div
        v-if="totalPages > 0"
        class="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-4 sm:flex-row"
    >
        <p class="text-sm text-slate-500">
            {{ notesResponse.total }} notes · Page {{ page }} of
            {{ totalPages }}
        </p>

        <Pagination
            :items-per-page="10"
            :total="notesResponse.total"
            :sibling-count="1"
            :default-page="1"
            :page="page"
            @update:page="changePage"
        >
            <PaginationContent v-slot="{ items }" class="gap-1.5">
                <PaginationPrevious
                    class="border border-[#332D20] bg-[#191A33] text-slate-300 transition hover:bg-[#252640] hover:text-[#E49C1B] [&_svg]:size-4"
                />

                <template v-for="(item, index) in items" :key="index">
                    <PaginationItem
                        v-if="item.type === 'page'"
                        :value="item.value"
                        :is-active="item.value === page"
                        class="h-9 min-w-9 rounded-md border border-[#332D20] bg-[#191A33] text-sm text-slate-300 transition hover:border-[#E49C1B]/60 hover:bg-[#252640] hover:text-[#E49C1B] data-[active=true]:border-[#E49C1B] data-[active=true]:bg-[#E49C1B] data-[active=true]:font-semibold data-[active=true]:text-[#191A33] data-[active=true]:shadow-[0_0_10px_rgba(228,156,27,0.12)]"
                    >
                        {{ item.value }}
                    </PaginationItem>

                    <PaginationEllipsis
                        v-else
                        :index="index"
                        class="text-slate-500"
                    />
                </template>

                <PaginationNext
                    class="border border-[#332D20] bg-[#191A33] text-slate-300 transition hover:bg-[#252640] hover:text-[#E49C1B] [&_svg]:size-4"
                />
            </PaginationContent>
        </Pagination>
    </div>
</template>
