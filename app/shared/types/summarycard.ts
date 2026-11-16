interface Card {
  uuid: string;
  content: string;
  image_path: string | null;
}

interface CardsResponse {
  data: Card[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type { Card, CardsResponse };