import { useNavigate } from "react-router";

export default function BookControlButtons({
  onSearchOpen,
}: {
  onSearchOpen: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-around bg-orange-300 dark:bg-gray-100 p-4 rounded shadow">
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
        onClick={() => onSearchOpen(true)}
      >
        Search
      </button>
      <button
        className="px-6 py-3 bg-blue-400 text-white rounded-xl shadow hover:bg-blue-600"
        onClick={() => navigate("/mybooks")}
      >
        My Books
      </button>
      <button
        className="px-6 py-3 bg-gray-300 text-black rounded-xl shadow hover:bg-gray-400"
        onClick={() => navigate("/")}
      >
        Catalog
      </button>
    </div>
  );
}
