<script setup lang="ts">
import { computed, ref } from "vue";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const props = defineProps<{
    title: string;
    content: string;
    imagePath: string | null;
}>();

const open = ref(false);
const previewOpen = ref(false);

const renderedContent = computed(() =>
    DOMPurify.sanitize(marked.parse(props.content) as string),
);
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <Card
                class="group w-full max-w-md cursor-pointer overflow-hidden rounded-xl border border-gray-700 bg-[#1c1c1c] text-white transition-colors hover:border-gray-500"
            >
                <div class="p-3">
                    <!-- Image Preview -->
                    <div
                        v-if="imagePath"
                        class="flex h-64 items-center justify-center overflow-hidden rounded-lg bg-[#111111]"
                    >
                        <img
                            :src="imagePath"
                            :alt="title"
                            class="h-full w-full object-contain"
                            loading="lazy"
                        />
                    </div>

                    <!-- Title -->
                    <div class="px-2 pb-2 pt-4">
                        <h3 class="text-lg font-semibold">
                            {{ title }}
                        </h3>

                        <p class="mt-2 line-clamp-2 text-sm text-gray-400">
                            {{ content }}
                        </p>
                    </div>
                </div>
            </Card>
        </DialogTrigger>

        <DialogContent
            class="overflow-y-auto scrollbar-none !left-[50%] !top-[50%] !h-[90vh] !w-[95vw] !max-w-[95vw] !translate-x-[-50%] !translate-y-[-50%] flex flex-col overflow-hidden border border-gray-700 bg-[#1c1c1c] p-6 text-white"
        >
            <DialogHeader class="shrink-0">
                <DialogTitle class="text-xl font-semibold">
                    {{ title }}
                </DialogTitle>
            </DialogHeader>

            <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
                <!-- Image -->
                <div
                    v-if="imagePath"
                    class="flex min-h-[60vh] flex-1 items-center justify-center overflow-hidden rounded-lg bg-[#111111]"
                >
                    <img
                        :src="imagePath"
                        :alt="title"
                        class="h-full w-full cursor-zoom-in object-contain"
                        loading="lazy"
                        @click="previewOpen = true"
                    />
                </div>

                <!-- Markdown Content -->
                <div
                    class="markdown-content shrink-0 text-sm leading-7 text-gray-300"
                    v-html="renderedContent"
                />
            </div>
        </DialogContent>
    </Dialog>

    <!-- Image Preview -->
    <Dialog v-model:open="previewOpen">
        <DialogContent
            class="flex h-[95vh] w-[95vw] max-w-[95vw] items-center justify-center border-gray-700 bg-[#111111] p-2"
        >
            <img
                :src="imagePath ?? ''"
                :alt="title"
                class="h-full w-full object-contain"
            />
        </DialogContent>
    </Dialog>
</template>
<style scoped>
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
    color: #fbbf24;
}

.markdown-content :deep(p) {
    margin-bottom: 1rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
    margin: 1rem 0;
    padding-left: 1.5rem;
}

.markdown-content :deep(ul) {
    list-style-type: disc;
}

.markdown-content :deep(ol) {
    list-style-type: decimal;
}

.markdown-content :deep(code) {
    border-radius: 4px;
    background: #29251b;
    padding: 2px 5px;
    color: #fbbf24;
}

.markdown-content :deep(pre) {
    overflow-x: auto;
    margin: 1rem 0;
    border-radius: 8px;
    background: #0d0d0b;
    padding: 1rem;
}

.markdown-content :deep(pre code) {
    background: transparent;
    padding: 0;
}

.markdown-content :deep(blockquote) {
    border-left: 3px solid #d97706;
    padding-left: 1rem;
    color: #d6c9a5;
}

.markdown-content :deep(a) {
    color: #fbbf24;
    text-decoration: underline;
}
</style>
