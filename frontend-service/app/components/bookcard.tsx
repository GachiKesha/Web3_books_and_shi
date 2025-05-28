import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCover, type Book } from './books';

const BookCard = ({ book }: { book: Book }) => {
  const [isOpen, setIsOpen] = useState(false);
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
          onClick={() => {
            navigate(`/read/${book.id}`, {
              state: { file_url: book.file_url },
            });
          }}
          className="px-3 py-1 bg-orange-600 text-white rounded shadow hover:bg-orange-700"
        >
          Start Reading
        </button>
      </div>
    </div>
  );
};

export default BookCard;
