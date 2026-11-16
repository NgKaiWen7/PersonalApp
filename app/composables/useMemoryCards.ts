import type { Card, CardsResponse } from "~/shared/types/summarycard"

export interface MemoryCardQuery {
  page: Ref<number>;
  limit: number;
  search: Ref<string>;
  bookId: string;
}

export function useMemoryCards(query: MemoryCardQuery) {
  const { bookId, page, limit, search } = toValue(query)
  const { data, refresh } = useFetch<CardsResponse>(
    `/api/readings/${bookId}/memorycard`,
    { query: { page, limit, search } }
  )
  const memoryCards = computed<Card[]>(() => data.value?.data ?? []);
  const total = computed<number>(() => data.value?.pagination.total ?? 0);
  const totalPages = computed<number>(() => data.value?.pagination.totalPages ?? 0);

  return {
    memoryCards,
    total,
    totalPages,
    refresh,
  }
}