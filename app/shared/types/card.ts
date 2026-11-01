type Card = {
  uuid: string;
  title: string;
  content: string;
  image_path: string | null;
};

export interface CardsResponse {
  data: Card[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
