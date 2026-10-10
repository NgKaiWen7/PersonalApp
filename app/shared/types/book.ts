export type BookStatus = "Reading" | "Finished" | "Want to Read";

export type Book = {
  id: number;
  title: string;
  category: string;
  status: BookStatus;
  lastRead: string | null;
  description: string;
};

export type BookListItem = Pick<Book, "id" | "title">;

export type UpdateBook = Partial<Omit<Book, "id">>;
export type CreateBook = Pick<
  Book,
  "title" | "category" | "status" | "description"
>;
