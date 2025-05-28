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

export type UserBook = {
  id: string;
  current_page: number;
  percentage_read: number;
  title: string;
  author: string;
  genre: string;
};

export const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
export const fileServerUrl =
  process.env.FILE_SERVER_URL || 'http://localhost:3005';

export async function getBooks(
  page: number,
  limit: number,
  filters?: Filters,
): Promise<[Book[] | any, boolean]> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page.toString());
  if (limit) queryParams.append('limit', limit.toString());
  if (filters && filters.author) {
    queryParams.append('author', filters.author);
  }
  if (filters && filters.genre) {
    queryParams.append('genre', filters.genre);
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

export async function getCover(book_id: string): Promise<Blob> {
  const res = await fetch(`${fileServerUrl}/covers/${book_id}.jpg`);
  if (!res.ok) throw new Error('Cover not found');
  return res.blob();
}

export async function getUserBooks(
  token: string,
): Promise<[UserBook[] | any, boolean]> {
  const res = await fetch(`${backendUrl}/api/reading_progress/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const readings = await res.json();
  if (!res.ok) return [readings, false];

  const bookPromises = readings.map(async (reading: any) => {
    const bookRes = await fetch(`${backendUrl}/api/books/${reading.book_id}`);
    if (!bookRes.ok) return [bookRes, false];
    const book = await bookRes.json();

    return {
      id: reading.book_id,
      current_page: reading.current_page,
      percentage_read: reading.percentage_read,
      title: book.title,
      author: book.author,
      genre: book.genre,
    } as UserBook;
  });

  const userBooks = (await Promise.all(bookPromises)).filter(
    Boolean,
  ) as UserBook[];

  return [userBooks, true];
}

export async function getBookContent(
  bookPath: string,
  token: string,
): Promise<[ArrayBuffer | null | any, boolean]> {
  try {
    const res = await fetch(`${fileServerUrl}/${bookPath}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return [await res.json(), false];

    const arrayBuffer = await res.arrayBuffer();
    return [arrayBuffer, true];
  } catch (err) {
    console.log(err);
    return [null, false];
  }
}

export async function getBookPath(id: string): Promise<string> {
  const res = await fetch(`${backendUrl}/api/books/${id}`);
  //console.log('res:', res);
  const json: any = await res.json();
  //console.log('json:', json);
  if (res.ok) {
    return json.file_url;
  } else {
    throw new Error(json);
  }
}

export async function getReadingProgress(
  bookId: string,
  token: string,
): Promise<{ id: string; perc: number }> {
  const res = await fetch(`${backendUrl}/api/reading_progress/get/${bookId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return { id: '', perc: 0 };
  } else {
    const json = await res.json();
    console.log(json);
    return { id: json.id, perc: json.percentage_read / 100 };
  }
}

export async function saveReadingProgress(
  id: string,
  bookId: string,
  token: string,
  currentPage: number,
  percentage: number,
): Promise<string> {
  if (id === '') {
    console.log('create');
    const res = await fetch(`${backendUrl}/api/reading_progress/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        book_id: bookId,
        current_page: currentPage,
        percentage_read: percentage,
      }),
    });
    if (!res.ok) throw new Error(await res.json());
    const json = await res.json();
    return json.id;
  } else {
    console.log('update');
    const res = await fetch(`${backendUrl}/api/reading_progress/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_page: currentPage,
        percentage_read: percentage,
      }),
    });
    if (!res.ok) throw new Error(await res.json());
    const json = await res.json();
    console.log(json);
    return json.id;
  }
}

export function getBookContentUrl(filename: string) {
  return `${
    process.env.FILE_SERVER_URL || 'http://localhost:3005'
  }/${filename}`;
}

export async function getRecommendations(token: string) {
  const res = await fetch(`${backendUrl}/api/reading_progress/recommend/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json);
  return json;
}
