import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { getBooks, getColumn, getCover, type Book } from "../components/books";
import Header from "../components/Header";

export default function HomePage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("_");
  const [selectedAuthor, setSelectedAuthor] = useState("_");
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollRef = useRef(null);
  const limit = 4;

  useEffect(() => {
    console.log("Change of filters");
    setBooks([]);
    if (page === 1) {
      fetchBooks();
    } else setPage(1);
  }, [selectedAuthor, selectedGenre]);

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          console.log("scroll me pls");
          setPage((prev) => prev + 1);
        } else {
          console.warn("Intersection detected but not loading more.");
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    if (selectedAuthor == "_" || selectedGenre == "_") return;
    setIsLoading(true);
    setIsError(false);

    const [data, ok] = await getBooks(page, limit, {
      author: selectedAuthor,
      genre: selectedGenre,
    });

    if (ok) {
      setBooks((prev) => [...prev, ...data]);
      data.length > 0 ? setHasMore(true) : setHasMore(false);
    } else {
      console.error("Error fetching books");
      setIsError(true);
    }
    setIsLoading(false);
  };

  const fetchAuthors = async () => {
    setSelectedAuthor("");
    const [data, ok] = await getColumn("author");
    if (ok) {
      setAuthors(data.sort());
    }
  };

  const fetchGenres = async () => {
    setSelectedGenre("");
    const [data, ok] = await getColumn("genre");
    if (ok) {
      setGenres(data.sort());
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-6">
        <div className="flex justify-around bg-orange-300 dark:bg-gray-100 p-4 rounded shadow">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
            onClick={() => setSearchOpen(true)}
          >
            Search
          </button>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600">
            My Books
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-300 text-black rounded-xl shadow hover:bg-gray-400"
          >
            Back to Main Page
          </button>
        </div>

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
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "minmax(300px, auto)",
            maxWidth: "100%",
          }}
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <div>{isLoading ? "Loading..." : null}</div>

        <div id="scroll-me-pls" ref={scrollRef} className="h-[20px]"></div>
      </div>
    </div>
  );
}

const BookCard = ({ book }: { book: Book }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>("/book_cover.jpg");
  const navigate = useNavigate();

  const loadCover = async (id: string) => {
    try {
      const blob = await getCover(id);
      setCoverUrl(URL.createObjectURL(blob));
    } catch {
      console.warn("Error with cover fetching");
      setCoverUrl("/book_cover.jpg");
    }
  };

  useEffect(() => {
    if (!book.file_url) return;

    loadCover(book.id);
  }, [book]);

  return (
    <div className="relative flex flex-col justify-between items-center dark:bg-white bg-yellow-100 shadow-md rounded-md">
      <div className="relative w-full flex flex-col items-center">
        {isOpen && (
          <div className="absolute inset-0 p-4 bg-white flex flex-col justify-center text-gray-700 shadow-md rounded-md">
            <p className="text-lg text-justify">
              <strong>Author:</strong> {book.author}
            </p>
            <p className="text-lg text-justify">
              <strong>Genre:</strong> {book.genre}
            </p>
            <p className="text-lg text-justify">
              <strong>Publication Year:</strong> {book.publication_year}
            </p>
            <p className="text-lg text-justify">
              <strong>Description:</strong> {book.description}
            </p>
          </div>
        )}
        <div className="w-full p-4 flex-shrink-0">
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
        <p className="ml-4 mr-4 font-semibold text-gray-700 text-center">
          {book.title}
        </p>
      </div>
      <div className="flex gap-2 m-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 bg-gray-300 text-black rounded shadow hover:bg-gray-400"
        >
          ...
        </button>
        <button
          onClick={() => navigate(`/read/${book.id}`)}
          className="px-3 py-1 bg-orange-600 text-white rounded shadow hover:bg-orange-700"
        >
          Start Reading
        </button>
      </div>
    </div>
  );
};
