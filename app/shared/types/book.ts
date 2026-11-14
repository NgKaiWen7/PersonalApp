export type BookStatus = "Reading" | "Finished" | "Want to Read";

export type Book = {
  id: string;
  title: string;
  category: string[];
  status: BookStatus;
  last_read: string | null;
  description: string;
  source: string | null;
  created_at: string;
};

export type BookListItem = Pick<
  Book,
  | "id"
  | "title"
  | "category"
  | "status"
  | "last_read"
  | "description"
  | "source"
  | "created_at"
>;

export type UpdateBook = Partial<Omit<Book, "id">>;
export type CreateBook = Pick<
  Book,
  "title" | "category" | "status" | "description" | "last_read"
>;
