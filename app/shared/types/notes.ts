// types/notes.ts
export interface Note {
  id: string
  title: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface NotesResponse {
  items: Note[]
  total: number
  page: number
  limit: number
  totalPages: number
}