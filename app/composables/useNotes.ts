import type { MaybeRef } from "vue"
import type { NotesResponse } from "~/shared/types/notes"
export interface NotesQuery {
  page: number
  limit: number
  search?: string | null
  bookId?: string
}

export function useNotes(query: MaybeRef<NotesQuery>) {
  const { data, refresh } = useFetch<NotesResponse>("/api/notes", { query })

  const notes = computed(() => data.value?.items ?? [])

  async function deleteNote(id: string) {
    await $fetch(`/api/notes/${id}`, {
      method: "DELETE",
    })

    await refresh()
  }
  async function createNote(bookId?: string) {
    const note = await $fetch<{ id: string }>("/api/notes", {
      method: "POST",
      body: {
        title: "New Draft",
        description: "",
        category: "",
        content: "",
        ...(bookId ? { book_id: bookId } : {}),
      },
    })
    return note
  }
  const total = computed(() => data.value?.total ?? 0)

  const totalPages = computed(() => data.value?.totalPages ?? 0)
  return {
    notes,
    total,
    totalPages,
    createNote,
    deleteNote,
    refresh,
  }
}