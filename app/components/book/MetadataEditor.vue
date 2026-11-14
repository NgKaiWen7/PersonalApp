<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Book } from "#shared/types/book";

type BookMetadata = Pick<
    Book,
    "id" | "title" | "category" | "status" | "last_read" | "description" | "source"
>;

const props = defineProps<{
    book: BookMetadata;
    notesCount?: number;
    memoryCardCount?: number;
}>();

const emit = defineEmits<{
    save: [book: BookMetadata];
}>();

const form = reactive<BookMetadata>({ ...props.book });
const categoryInput = ref(props.book.category.join(", "));

watch(
    () => props.book,
    (book) => {
        Object.assign(form, book);
        categoryInput.value = book.category.join(", ");
    },
    { deep: true },
);

function submit() {
    emit("save", {
        ...form,
        category: categoryInput.value
            .split(",")
            .map((category) => category.trim())
            .filter(Boolean),
    });
}
</script>

<template>
    <Card class="border-white/[0.08] bg-white/[0.025] text-white shadow-none">
        <CardHeader class="flex flex-row items-start justify-between gap-4">
            <div>
                <CardTitle>Book details</CardTitle>
                <CardDescription class="mt-1 text-neutral-400">
                    Edit the metadata shown for this book.
                </CardDescription>
            </div>

            <div class="flex flex-wrap justify-end gap-2">
                <Badge v-if="notesCount !== undefined" variant="outline" class="border-white/10 bg-white/[0.06] text-neutral-300">
                    {{ notesCount }} notes
                </Badge>
                <Badge v-if="memoryCardCount !== undefined" variant="outline" class="border-white/10 bg-white/[0.06] text-neutral-300">
                    {{ memoryCardCount }} cards
                </Badge>
            </div>
        </CardHeader>

        <form class="space-y-4" @submit.prevent="submit">
            <CardContent class="space-y-4">
                <label class="grid gap-1.5 text-sm font-medium text-neutral-200">
                    Title
                    <Input v-model="form.title" required class="border-white/10 bg-white/[0.04] text-white" />
                </label>

                <div class="grid gap-4 sm:grid-cols-2">
                    <label class="grid gap-1.5 text-sm font-medium text-neutral-200">
                        Category
                        <Input v-model="categoryInput" placeholder="e.g. History, Philosophy" class="border-white/10 bg-white/[0.04] text-white" />
                    </label>
                    <div class="grid gap-1.5 text-sm font-medium text-neutral-200">
                        <span>Status</span>
                        <Select v-model="form.status">
                            <SelectTrigger class="w-full border-white/10 bg-white/[0.04] text-white">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent class="border-white/10 bg-[#18181b] text-white">
                                <SelectItem value="Want to Read">Want to Read</SelectItem>
                                <SelectItem value="Reading">Reading</SelectItem>
                                <SelectItem value="Finished">Finished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <label class="grid gap-1.5 text-sm font-medium text-neutral-200">
                    Last read
                    <Input v-model="form.last_read" type="date" class="border-white/10 bg-white/[0.04] text-white" />
                </label>

                <label class="grid gap-1.5 text-sm font-medium text-neutral-200">
                    Description
                    <Textarea v-model="form.description" rows="4" placeholder="What is this book about?" class="resize-y border-white/10 bg-white/[0.04] text-white placeholder:text-neutral-500" />
                </label>

            </CardContent>

            <CardFooter class="justify-end border-t border-white/[0.08] pt-6">
                <Button type="submit" class="bg-[#C5A24A] text-[#17140b] hover:bg-[#D8B65A]">Save details</Button>
            </CardFooter>
        </form>
    </Card>
</template>
