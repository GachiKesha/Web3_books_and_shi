import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { FiMenu } from 'react-icons/fi';
import Epub, { Book, Rendition, type Location, type NavItem } from 'epubjs';
import {
  saveReadingProgress,
  getBookPath,
  getBookContentUrl,
  getReadingProgress,
  type Book as myBook,
  getRecommendations,
} from '../components/books';
import Header from '../components/Header';
import BookCard from '~/components/bookcard';

export default function ReadBookPage() {
  const { bookId } = useParams();
  const [token, setToken] = useState('');
  const [bookUrl, setBookUrl] = useState<string | null>(null);
  const [percentRead, setPercentRead] = useState<number>(0);
  const [pageStr, setPageStr] = useState<string>('');
  const [location, setLocation] = useState<string | null>(null);
  const [toc, setToc] = useState<NavItem[]>([]);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const existingReading = useRef<string>('');
  const percent = useRef(0);

  const [recommendedBooks, setRecommendedBooks] = useState<myBook[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const bookRef = useRef<Book>(null);
  const renditionRef = useRef<Rendition>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const latestPageRef = useRef<number>(0);
  const latestPercentRef = useRef<number>(0);

  useEffect(() => {
    const t = sessionStorage.getItem('accessToken');
    if (!t) {
      alert('Not logged in');
      return;
    }
    setToken(t);

    getBookPath(bookId!).then((path) => {
      setBookUrl(getBookContentUrl(path));
      const cfi = localStorage.getItem(`epub-location-${bookId}`);
      getReadingProgress(bookId!, t).then(({ id, perc }) => {
        //console.log('get:', id, perc);
        existingReading.current = id;
        percent.current = perc;
      });
      if (cfi !== null) {
        setLocation(cfi);
      }
    });
  }, [bookId]);

  useEffect(() => {
    if (!bookUrl || !viewerRef.current) return;
    try {
      bookRef.current = Epub(bookUrl);
      bookRef.current.ready
        .then(() => {
          console.log('Book fully loaded');
          return bookRef.current!.locations.generate(1000);
        })
        .then(() => {
          renditionRef.current = bookRef.current!.renderTo(viewerRef.current!, {
            width: '100%',
            height: '100%',
            spread: 'none',
          });

          renditionRef.current.display(
            location ||
              bookRef.current!.locations.cfiFromPercentage(percent.current),
          );
          setToc(bookRef.current!.navigation.toc);

          renditionRef.current?.on('relocated', (loc: Location) => {
            const percent =
              renditionRef.current!.book.locations.percentageFromCfi(
                loc.start.cfi,
              ) * 100;
            const match = loc.start.cfi.match(/\[(.*?)\]/);
            const chapterId = match ? match[1] : '';
            const chapter = renditionRef.current!.book.navigation.toc.find(
              (item) => item.href.includes(chapterId),
            );
            setPercentRead(percent);
            setPageStr(
              `Page ${loc.start.displayed.page} / ${loc.start.displayed.total} in chapter ${chapter?.label || 'n/a'}`,
            );

            localStorage.setItem(`epub-location-${bookId}`, loc.start.cfi);
            //console.log(existingReading.current);

            latestPageRef.current = loc.start.displayed.page;
            latestPercentRef.current = percent;

            if (Math.round(percent) === 100 && !showRecommendations) {
              getRecommendations(token)
                .then((data) => {
                  setRecommendedBooks(data);
                  setShowRecommendations(true);
                })
                .catch((err) =>
                  console.error('Failed to fetch recommendations', err),
                );
            } else setShowRecommendations(false);
          });
        });
    } catch (err) {
      console.error(err);
    }
  }, [bookUrl, location]);

  useEffect(() => {
    console.log('setting interval');
    const interval = setInterval(() => {
      if (bookId && token) {
        saveReadingProgress(
          existingReading.current,
          bookId,
          token,
          latestPageRef.current,
          latestPercentRef.current,
        )
          .then((id) => {
            existingReading.current = id;
          })
          .catch((err) => console.error('Progress save error', err));
      } else {
        console.log('no book or token is null:', bookId, token !== '');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [bookId, token]);

  const nextPage = () => {
    renditionRef.current?.next();
  };

  const prevPage = () => {
    renditionRef.current?.prev();
  };

  return (
    <div className="max-w-5xl mx-auto relative">
      <Header />
      <div className="absolute top-16 left-2 z-50">
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="px-3 py-2 bg-gray-800 text-white rounded"
        >
          <FiMenu size={24} />
        </button>

        {isTocOpen && (
          <div className="mt-2 w-64 bg-black shadow-md p-4 rounded opacity-90">
            <h2 className="font-bold text-lg text-white mb-2">
              Table of Contents
            </h2>
            <ul>
              {toc.map((chapter) => (
                <li key={chapter.href}>
                  <button
                    onClick={() => {
                      renditionRef.current?.display(chapter.href);
                      setIsTocOpen(false);
                    }}
                    className="block w-full text-left p-2 hover:bg-gray-600 rounded"
                  >
                    {chapter.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border rounded shadow bg-white p-2 relative">
        <div ref={viewerRef} className="h-[80vh]"></div>
      </div>
      <div className="flex border rounded bg-white p-2 mt-4 text-center text-gray-700 h-auto">
        <button onClick={prevPage} className="px-4 py-2 bg-gray-400 rounded">
          Previous
        </button>
        <div className="flex-grow flex items-center justify-center">
          {pageStr} | {Math.round(percentRead)}%
        </div>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-orange-400 text-white rounded"
        >
          Next
        </button>
      </div>
      {showRecommendations && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl text-black font-bold mb-4">
            Recommended for you
          </h2>
          <div
            className="grid gap-[35px] bg-orange-100 overflow-auto w-full"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gridAutoRows: 'minmax(300px, auto)',
            }}
          >
            {recommendedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
