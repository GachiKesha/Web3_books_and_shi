import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex flex-row bg-blue-600 text-white p-4 shadow-md">
      <div className="justify-start">
        <button onClick={() => navigate("/")} className="hover:font-bold">
          Home
        </button>
      </div>
      <div className="container mx-auto flex justify-end space-x-4">
        <button onClick={() => navigate("/login")} className="hover:underline">
          Log In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="hover:underline"
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}
