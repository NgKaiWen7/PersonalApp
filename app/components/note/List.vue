<script setup lang="ts">
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination";
import { Button } from "~/components/ui/button";

const props = defineProps<{
    bookId?: string;
}>();

const page = ref(1)
const limit = ref(20)
const search = ref(null)

const query = computed(() => ({
    page: page.value,
    limit: limit.value,
    search: search.value,
    bookId: props.bookId,
}))

const { notes, total, totalPages, deleteNote, createNote, refresh } = useNotes(query)

const selectedNoteId = ref<string | null>(null)
function openNote(id: string) {
    if (!props.bookId) {
        navigateTo(`/notes/${id}`);
        return
    }
    selectedNoteId.value = id
}

async function handleNewDraft() {
    const note = await createNote(props.bookId)
    await refresh()
    if (!props.bookId) {
        await navigateTo(`/notes/${note.id}`)
    }
}

function changePage(newPage: number) {
    page.value = newPage;
}

async function handleDelete(id: string) {
    deleteNote(id)
    if (props.bookId) {
    } else {
        navigateTo("/notes");
    }
    await refresh()
}
</script>

<template>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row">
        <input v-model="search" type="text" placeholder="Search notes..."
            class="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[#E49C1B] focus:ring-1 focus:ring-[#E49C1B] sm:flex-1" />
        <Button class="bg-[#E49C1B] px-3 font-medium text-slate-950 hover:bg-[#f0aa24]" @click="handleNewDraft">
            + New Draft
        </Button>
    </div>

    <div class="space-y-3 overflow-y-auto">
        <div v-for="note in notes" :key="note.id">
            <NoteCard v-if="note.id !== selectedNoteId" :title="note.title" :description="note.description"
                @click="openNote(note.id)" />
            <NoteEditor v-else :note-id="note.id" @deleteNote="handleDelete(note.id)" />
        </div>
    </div>
    <div v-if="totalPages > 0"
        class="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-4 sm:flex-row">
        <p class="text-sm text-slate-500">
            {{ total }} notes · Page {{ page }} / {{ totalPages }}
        </p>

        <Pagination :items-per-page="limit" :total="total" :sibling-count="1" :default-page="1" :page="page"
            @update:page="changePage">
            <PaginationContent v-slot="{ items }" class="gap-1.5">
                <PaginationPrevious
                    class="border border-[#332D20] bg-[#191A33] text-slate-300 transition hover:bg-[#252640] hover:text-[#E49C1B] [&_svg]:size-4" />

                <template v-for="(item, index) in items" :key="index">
                    <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page"
                        class="h-9 min-w-9 rounded-md border border-[#332D20] bg-[#191A33] text-sm text-slate-300 transition hover:border-[#E49C1B]/60 hover:bg-[#252640] hover:text-[#E49C1B] data-[active=true]:border-[#E49C1B] data-[active=true]:bg-[#E49C1B] data-[active=true]:font-semibold data-[active=true]:text-[#191A33] data-[active=true]:shadow-[0_0_10px_rgba(228,156,27,0.12)]">
                        {{ item.value }}
                    </PaginationItem>

                    <PaginationEllipsis v-else :index="index" class="text-slate-500" />
                </template>

                <PaginationNext
                    class="border border-[#332D20] bg-[#191A33] text-slate-300 transition hover:bg-[#252640] hover:text-[#E49C1B] [&_svg]:size-4" />
            </PaginationContent>
        </Pagination>
    </div>
</template>
