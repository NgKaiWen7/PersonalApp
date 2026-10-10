<script setup lang="ts">
import { ref } from "vue";
import { Plus, MoreHorizontal } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BookCategories } from "@/composables/BookCategories";

const emit = defineEmits<{
    book: [book: { title: string; category: string; description: string }];
    delete: [id: string];
}>();
const props = defineProps<{
    mode: "add" | "edit";
    id?: string;
    title?: string;
    category?: string[];
    description?: string;
    status?: string;
}>();
const categories = BookCategories();
const statuses = ["To Read", "Reading", "Completed", "On Hold"];
const open = ref(false);
const title = ref(props.title);
const category = ref(props.category);
const description = ref(props.description);
const status = ref(props.status ?? "To Read");
const file = ref<File | null>(null);

function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    file.value = input.files?.[0] ?? null;
}
async function handleSubmit() {
    if (props.mode == "add") {
        await handlePost();
    } else if (props.mode == "edit") {
        await handlePatch();
    } else {
        throw new Error("Method not supported");
    }
}
async function handlePost() {
    const fileName = file.value?.name.replace(/\.[^/.]+$/, "").trim() ?? "";
    const bookTitle = title.value || fileName;

    if (typeof bookTitle !== "string" || !bookTitle) {
        console.error("Please enter a book title or select a book file.");
        return;
    }
    const formData = new FormData();
    formData.append("title", bookTitle);
    formData.append("category", JSON.stringify(category.value));
    formData.append("description", description.value);
    if (file.value) {
        formData.append("file", file.value);
    }
    try {
        const result = await $fetch<{ id: string; source: string }>(
            "/api/readings",
            {
                method: "POST",
                body: formData,
            },
        );
        emit("book", {
            id: result.id,
            title: bookTitle,
            category: category.value,
            description: description.value,
            status: status.value,
        });
        open.value = false;
    } catch (error) {
        console.error("Failed to create book:", error);
    }
}
async function handleDelete() {
    if (props.id == null) {
        open.value = false;
        return;
    }
    try {
        await $fetch(`/api/readings/${props.id}`, { method: "DELETE" });
        open.value = false;
        emit("delete", {
            id: props.id,
        });
    } catch (error) {
        console.error("Failed to delete book:", error);
    }
}
async function handlePatch() {
    if (props.id == null) {
        open.value = false;
        return;
    }
    try {
        await $fetch(`/api/readings/${props.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                title: title.value,
                category: category.value,
                description: description.value,
                status: status.value,
            }),
        });
        emit("book");
        open.value = false;
    } catch (error) {
        console.error("Failed to patch book:", error);
    }
}
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <Button
                v-if="props.mode === 'add'"
                class="bg-[#C5A24A] text-black hover:bg-[#d4b45e]"
            >
                <Plus class="mr-2 size-4" />
                Add book
            </Button>

            <Button
                v-else
                variant="ghost"
                size="icon"
                class="size-8 text-neutral-400 hover:bg-white/[0.08] hover:text-white"
                title="Edit book"
            >
                <MoreHorizontal class="size-4 text-[#C5A24A]" />
            </Button>
        </DialogTrigger>

        <DialogContent
            class="border-white/[0.1] bg-[#111111] text-white sm:max-w-md"
        >
            <DialogHeader>
                <DialogTitle>
                    {{ props.mode === "add" ? "Add a book" : "Edit book" }}
                </DialogTitle>
                <DialogDescription class="text-neutral-400">
                    {{
                        props.mode === "add"
                            ? "Add a book to your reading list."
                            : "Update your book details."
                    }}
                </DialogDescription>
            </DialogHeader>

            <form
                class="flex w-full flex-col space-y-4"
                @submit.prevent="submit"
            >
                <div class="space-y-2">
                    <label for="book-file" class="text-sm font-medium">
                        Book File
                    </label>

                    <Input
                        id="book-file"
                        type="file"
                        accept=".pdf,.epub"
                        class="border-white/[0.1] bg-black text-white"
                        @change="handleFileChange"
                    />

                    <p class="text-xs text-muted-foreground">
                        Upload a PDF or EPUB file.
                    </p>

                    <p v-if="file" class="text-sm text-muted-foreground">
                        Selected: {{ file.name }}
                    </p>
                </div>

                <div class="space-y-2">
                    <label for="book-title" class="text-sm font-medium">
                        Book title
                    </label>
                    <Input
                        id="book-title"
                        v-model="title"
                        placeholder="Enter book title"
                        class="border-white/[0.1] bg-black text-white"
                        required
                        autofocus
                    />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium"> Category </label>
                    <Select v-model="category">
                        <SelectTrigger
                            class="border-white/[0.1] bg-black text-white focus:ring-[#C5A24A]"
                        >
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem
                                v-for="item in categories"
                                :key="item"
                                :value="item"
                            >
                                {{ item }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium"> Status </label>
                    <Select v-model="status">
                        <SelectTrigger
                            class="border-white/[0.1] bg-black text-white focus:ring-[#C5A24A]"
                        >
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem
                                v-for="item in statuses"
                                :key="item"
                                :value="item"
                            >
                                {{ item }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium"> Description </label>
                    <Input
                        v-model="description"
                        placeholder="Enter book description"
                        class="border-white/[0.1] bg-black text-white"
                        rows="4"
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        class="bg-[#d4b45e] text-black hover:bg-[#d4b45e]"
                        @click="open = false"
                    >
                        Cancel
                    </Button>
                    <Button
                        @click="handleSubmit"
                        class="bg-[#d4b45e] text-black hover:bg-[#d4b45e]"
                    >
                        Save
                    </Button>
                    <Button
                        @click="handleDelete"
                        class="bg-[#d4b45e] text-black hover:bg-[#d4b45e]"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
