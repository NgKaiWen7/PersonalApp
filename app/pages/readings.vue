<script setup lang="ts">
import { computed, ref } from "vue";
import { BookOpen, Search } from "@lucide/vue";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import BookDiaglog from "@/components/reading/BookDiaglog.vue";

definePageMeta({ middleware: "auth" });

type BookStatus = "Reading" | "Finished" | "Want to Read";

type Book = {
    id: number;
    title: string;
    category: string[];
    status: string;
    lastRead: string;
    description: string;
};
const {
    data: books,
    pending,
    error,
    refresh,
} = await useFetch<Book[]>("/api/readings", {
    default: () => [],
});

const filter = ref("All");
const search = ref("");

const filters = ["All", "Reading", "Want to Read", "Finished"];

const filteredBooks = computed(() => {
    return books.value.filter((book) => {
        const matchesStatus =
            filter.value === "All" || book.status === filter.value;

        const query = search.value.trim().toLowerCase();

        const matchesSearch =
            !query ||
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
    });
});

function statusClass(status: BookStatus) {
    switch (status) {
        case "Reading":
            return "border-[#C5A24A]/30 bg-[#C5A24A]/10 text-[#C5A24A]";
        case "Finished":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
        case "Want to Read":
            return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    }
}

function handleAddBook(book: { title: string; author: string }) {
    books.value.push({
        id: Math.max(0, ...books.value.map((book) => book.id)) + 1,
        title: book.title,
        author: book.author,
        status: "Want to Read",
        lastRead: "Not started",
        progress: 0,
    });
}

function handleEditBook(updatedBook: Book) {
    const index = books.value.findIndex((book) => book.id === updatedBook.id);

    if (index !== -1) {
        books.value[index] = {
            ...books.value[index],
            ...updatedBook,
        };
    }
}
</script>

<template>
    <div class="mx-auto w-full max-w-7xl space-y-8 text-white">
        <p v-if="pending">Loading books...</p>

        <p v-else-if="error">Failed to load books: {{ error.message }}</p>

        <p v-else-if="books.length === 0">No books found.</p>
        <!-- Page heading -->
        <div
            class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
            <BookDiaglog @add="handleAddBook" mode="add" />
        </div>
        <!-- Reading table -->
        <section
            class="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]"
        >
            <div
                class="flex flex-col gap-4 border-b border-white/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="relative w-full sm:max-w-xs">
                    <Search
                        class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
                    />
                    <Input
                        v-model="search"
                        placeholder="Search books or authors..."
                        class="border-white/[0.1] bg-black pl-9 text-white placeholder:text-neutral-600 focus-visible:ring-[#C5A24A]"
                    />
                </div>
            </div>

            <!-- Status filters -->
            <div
                class="flex gap-2 overflow-x-auto border-b border-white/[0.08] px-4 py-3"
            >
                <Button
                    v-for="item in filters"
                    :key="item"
                    size="sm"
                    :variant="filter === item ? 'secondary' : 'ghost'"
                    :class="
                        filter === item
                            ? 'shrink-0 bg-white/[0.1] text-[#C5A24A] hover:bg-white/[0.15]'
                            : 'shrink-0 text-neutral-400 hover:bg-white/[0.05] hover:text-white'
                    "
                    @click="filter = item"
                >
                    {{ item }}
                </Button>
            </div>

            <div class="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow
                            class="border-white/[0.08] hover:bg-transparent"
                        >
                            <TableHead
                                class="min-w-[280px] pl-5 text-neutral-500"
                            >
                                Book
                            </TableHead>
                            <TableHead class="min-w-[120px] text-neutral-500">
                                Category
                            </TableHead>
                            <TableHead
                                class="hidden min-w-[130px] text-neutral-500 md:table-cell"
                            >
                                Status
                            </TableHead>

                            <TableHead
                                class="hidden min-w-[120px] text-neutral-500 md:table-cell"
                            >
                                Last read
                            </TableHead>
                            <TableHead class="w-12" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <TableRow
                            v-for="book in filteredBooks"
                            :key="book.id"
                            class="border-white/[0.06] transition-colors hover:bg-white/[0.025]"
                        >
                            <TableCell class="py-4 pl-5">
                                <div class="flex items-start gap-3">
                                    <div
                                        class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#C5A24A]/20 bg-[#C5A24A]/[0.08]"
                                    >
                                        <BookOpen
                                            class="size-5 text-[#C5A24A]"
                                        />
                                    </div>

                                    <div class="min-w-0">
                                        <p
                                            class="font-medium leading-5 text-neutral-100"
                                        >
                                            {{ book.title }}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell class="hidden md:table-cell">
                                <Badge
                                    variant="outline"
                                    :class="statusClass(book.status)"
                                >
                                    {{ book.status }}
                                </Badge>
                            </TableCell>

                            <TableCell
                                class="hidden text-sm text-neutral-400 md:table-cell"
                            >
                                {{ book.category }}
                            </TableCell>

                            <TableCell
                                class="hidden text-sm text-neutral-400 md:table-cell"
                            >
                                {{ book.lastRead }}
                            </TableCell>
                            <TableCell>
                                <div
                                    class="flex items-center justify-end gap-1"
                                >
                                    <BookDiaglog
                                        mode="edit"
                                        :id="book.id"
                                        :title="book.title"
                                        :category="book.category"
                                        :status="book.status"
                                        @book="handleEditBook"
                                    />
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow v-if="filteredBooks.length === 0">
                            <TableCell colspan="5" class="h-32 text-center">
                                <div
                                    class="flex flex-col items-center gap-2 text-neutral-500"
                                >
                                    <BookOpen class="size-6" />
                                    <p class="text-sm">No books found.</p>
                                    <p class="text-xs">
                                        Try another search or status filter.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </section>
    </div>
</template>
