<script setup lang="ts">
import { ArrowLeft } from "@lucide/vue";
import { Input } from '@/components/ui/input'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import type { CardsResponse } from '#shared/types/card';
const route = useRoute();

const id = computed(() => String(route.params.id));
const page = ref(1);
const limit = ref(20);
const search = ref("");

const {
  data: cards,
  pending,
  error,
  refresh,
} = await useFetch<CardsResponse>(
  () => `/api/readings/memorycard/${id.value}`,
  {
    query: {
      page,
      limit,
      search,
    },
    default: () => ({
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }),
    watch: [page, limit, search],
  },
  );
</script>

<template>
    <div class="min-h-screen bg-[#0D0D0B] text-amber-50">
        <!-- Back navigation -->
        <div class="px-6 pt-6 md:px-8">
            <NuxtLink
                to="/readings"
                aria-label="Back to readings"
                title="Back to readings"
                class="inline-flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-stone-400 transition-colors hover:border-amber-400/30 hover:bg-amber-400/[0.08] hover:text-amber-300"
            >
                <ArrowLeft class="size-4" />
            </NuxtLink>
        </div>

        <!-- Main content -->
        <div class="flex flex-col gap-6 p-6 md:p-8">
            <Input
                v-model="search"
                type="text"
                placeholder="Search card..."
            />

            <!-- Cards -->
            <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2">
                <ReadingMemoryCard
                    v-for="card in cards?.data ?? []"
                    :key="card.uuid"
                    :title="card.title"
                    :content="card.content"
                    :image-path="`/api/readings/memorycard/${card.uuid}/image`"
                />
            </div>

            <!-- Pagination -->
            <div
                v-if="cards && cards.pagination.totalPages > 1"
                class="flex flex-col items-center gap-3 border-t border-gray-800 pt-6"
            >
                <Pagination
                    v-model:page="page"
                    :total="cards.pagination.total"
                    :items-per-page="limit"
                    :sibling-count="1"
                    show-edges
                >
                    <PaginationContent v-slot="{ items }">
                        <PaginationPrevious />

                        <template v-for="(item, index) in items" :key="index">
                        <PaginationItem
                            v-if="item.type === 'page'"
                            :value="item.value"
                            :is-active="item.value === page"
                            class="border border-gray-700 text-gray-900 hover:bg-gray-800 hover:text-white data-[active=true]:border-amber-500 data-[active=true]:bg-amber-500 data-[active=true]:text-black"
                        >
                            {{ item.value }}
                        </PaginationItem>

                            <PaginationEllipsis
                                v-else
                                :index="index"
                            />
                        </template>

                        <PaginationNext />
                    </PaginationContent>
                </Pagination>

                <p class="text-xs text-gray-500">
                    Showing
                    {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, cards.pagination.total) }}
                    of {{ cards.pagination.total }} cards
                </p>
            </div>
        </div>
    </div>
</template>
