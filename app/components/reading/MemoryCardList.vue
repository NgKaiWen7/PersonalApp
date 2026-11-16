<script setup lang="ts">
import { useRoute } from "vue-router";
import { useMemoryCards } from "~/composables/useMemoryCards";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationNext,
    PaginationPrevious,
    PaginationItem,
} from "@/components/ui/pagination";
import Input from "../ui/input/Input.vue";

const route = useRoute();
const bookId = route.params.id as string;

const page = ref(1);
const limit = 10;
const search = ref("");

const { memoryCards, total, totalPages } = useMemoryCards({
    page,
    limit,
    search,
    bookId,
});

watch(search, () => {
    page.value = 1;
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <Input v-model="search" placeholder="Search memory cards..." class="w-full" />
        <!-- Memory cards -->
        <div class="space-y-4">
            <MemorycardsMemoryCard v-for="memoryCard in memoryCards" :key="memoryCard.uuid" :title="null"
                :content="memoryCard.content" :image-path="`/api/memorycards/${memoryCard.uuid}/raptor_image`" />
        </div>

        <!-- Pagination -->
        <Pagination v-if="totalPages > 1" v-model:page="page" :total="total" :items-per-page="limit" :sibling-count="1"
            show-edges class="mt-6">
            <PaginationContent v-slot="{ items }" class="flex items-center gap-1">

                <PaginationFirst />
                <PaginationPrevious />

                <template v-for="(item, index) in items" :key="index">
                    <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                        {{ item.value }}
                    </PaginationItem>

                    <PaginationEllipsis v-else :index="index" />
                </template>

                <PaginationNext />
                <PaginationLast />

            </PaginationContent>
        </Pagination>

    </div>
</template>