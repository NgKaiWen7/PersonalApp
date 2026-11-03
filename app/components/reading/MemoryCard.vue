<script setup lang="ts">
import { computed, ref } from "vue";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { Heart, BookText } from '@lucide/vue';

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
                class="group w-full cursor-pointer overflow-hidden rounded-xl border border-gray-700 bg-[#1c1c1c] text-white transition-colors hover:border-gray-500"
            >
                <CardContent class="p-3">
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
                </CardContent>

                <CardHeader class="px-5 pb-4 pt-0">
                    <h3 class="text-lg font-semibold">
                        {{ title }}
                    </h3>
                    <p class="line-clamp-2 text-sm text-gray-400">
                        {{ content }}
                    </p>
                </CardHeader>
            </Card>
        </DialogTrigger>

        <DialogContent
            class="overflow-y-auto scrollbar-none !left-[50%] !top-[50%] !h-[90vh] !w-[95vw] !max-w-[95vw] !translate-x-[-50%] !translate-y-[-50%] flex flex-col overflow-hidden border border-gray-700 bg-[#1c1c1c] p-6 text-white"
        >
            <DialogHeader class="flex shrink-0 flex-row items-center justify-between pr-10">
                <DialogTitle class="text-xl font-semibold">
                    {{ title }}
                </DialogTitle>

                <div class="flex items-center gap-3">
                    <BookText class="size-5 cursor-pointer" />
                    <Heart class="size-5 cursor-pointer" />
                </div>
            </DialogHeader>
            <div class="min-h-0 flex-1 overflow-y-auto">
                <div class="flow-root">
                    <!-- Floating Image -->
                    <div
                        v-if="imagePath"
                        class="float-left mb-4 mr-6 min-w-[220px] rounded-lg bg-[#111111] p-2"
                    >
                        <img
                            :src="imagePath"
                            :alt="title"
                            class="max-h-[60vh] w-full cursor-zoom-in object-contain"
                            loading="lazy"
                            @click="previewOpen = true"
                        />
                    </div>

                    <!-- Markdown Content -->
                    <div
                        class="markdown-content text-sm leading-7 text-gray-300"
                        v-html="renderedContent"
                    />
                </div>
            </div>
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
