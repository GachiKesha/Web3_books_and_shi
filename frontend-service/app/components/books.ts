type Filters = {
  author?: string;
  genre?: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  publication_year: number;
  file_url: string;
};

export const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

export async function getBooks(
  page: number,
  limit: number,
  filters?: Filters
): Promise<[Book[] | any, boolean]> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (filters && filters.author) {
    queryParams.append("author", filters.author);
  }
  if (filters && filters.genre) {
    queryParams.append("genre", filters.genre);
  }
  const res = await fetch(`${backendUrl}/api/books?${queryParams.toString()}`);
  const json = await res.json();
  return [json, res.ok];
}

export async function getColumn(column: string): Promise<[string[], boolean]> {
  const res = await fetch(`${backendUrl}/api/books/column/${column}`);
  const json = await res.json();
  return [json, res.ok];
}
