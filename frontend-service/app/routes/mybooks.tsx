import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { type UserBook, getCover, getUserBooks } from '../components/books';
import BookControlButtons from '../components/Controlls';
import Header from '../components/Header';

export default function MyBooksPage() {
  const navigate = useNavigate();
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<UserBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserBooks = async (token: string) => {
    setIsLoading(true);
    const [data, ok] = await getUserBooks(token);
    if (ok) {
      setUserBooks(data);

      const uniqueGenres: any = [
        ...new Set(data.map((book: UserBook) => book.genre)),
      ].sort();
      const uniqueAuthors: any = [
        ...new Set(data.map((book: UserBook) => book.author)),
      ].sort();

      setGenres(uniqueGenres);
      setAuthors(uniqueAuthors);
    } else {
      console.error(data);
    }
    setIsLoading(false);
  };

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('accessToken');
    if (!storedToken) {
      navigate('/login');
    } else {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserBooks(token);
    }
  }, [token]);

  useEffect(() => {
    const filtered = userBooks.filter((book) => {
      const matchAuthor = selectedAuthor
        ? book.author === selectedAuthor
        : true;
      const matchGenre = selectedGenre ? book.genre === selectedGenre : true;
      return matchAuthor && matchGenre;
    });
    setFilteredBooks(filtered);
  }, [selectedAuthor, selectedGenre, userBooks]);

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-6">
        <BookControlButtons onSearchOpen={setSearchOpen} />

        {searchOpen && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-md shadow-md z-50 text-black">
            <h2 className="text-lg font-bold mb-4 text-black">Search Books</h2>
            <select
              className="px-4 py-2 border rounded w-full mb-2 text-black"
              onChange={(e) => setSelectedGenre(e.target.value)}
              value={selectedGenre}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 border rounded w-full mb-2 text-black"
              onChange={(e) => setSelectedAuthor(e.target.value)}
              value={selectedAuthor}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSearchOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded mt-2"
            >
              Close
            </button>
          </div>
        )}
        <div
          id="book-container"
          className="grid gap-[35px] p-[40px] bg-orange-200 dark:bg-gray-100 overflow-auto w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: 'minmax(300px, auto)',
            maxWidth: '100%',
          }}
        >
          {filteredBooks.map((book) => (
            <MyBookCard key={book.id} book={book} />
          ))}
        </div>
        <div>{isLoading ? 'Loading...' : null}</div>
      </div>
    </div>
  );
}

const MyBookCard = ({ book }: { book: UserBook }) => {
  const [coverUrl, setCoverUrl] = useState<string>('/book_cover.jpg');
  const navigate = useNavigate();

  const loadCover = async (id: string) => {
    try {
      const blob = await getCover(id);
      setCoverUrl(URL.createObjectURL(blob));
    } catch {
      console.warn('Error with cover fetching');
      setCoverUrl('/book_cover.jpg');
    }
  };

  useEffect(() => {
    loadCover(book.id);
  }, [book]);

  const progress = book.percentage_read ?? 0;
  const isCompleted = progress >= 100;

  return (
    <div className="flex flex-col items-center bg-yellow-100 dark:bg-white shadow-md rounded-md p-4 relative">
      <div className="w-full h-auto relative mb-2">
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full h-full object-cover rounded-md"
        />
        {isCompleted && (
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            className="absolute inset-0 flex items-center justify-center rounded-md"
          >
            <span className="text-white text-xl font-bold">Completed</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-center text-gray-800">
        {book.title}
      </h3>
      <p className="text-sm text-center text-gray-600 mb-2">{book.author}</p>

      <div className="w-full h-4 bg-gray-300 rounded overflow-hidden mb-2 relative">
        <div
          className="h-full bg-orange-500"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="absolute inset-0 flex justify-center items-center text-xs font-semibold text-gray-900">
          {Math.round(progress)}%
        </span>
      </div>

      <button
        onClick={() => navigate(`/read/${book.id}`)}
        className="mt-2 px-4 py-2 bg-orange-600 text-white rounded shadow hover:bg-orange-700"
      >
        {isCompleted ? 'View' : 'Continue Reading'}
      </button>
    </div>
  );
};
