import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../api/auth";
import "./base.css";

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      const [res, ok] = await login(email, password);

      if (ok) {
        sessionStorage.setItem("accessToken", res.accessToken);
        sessionStorage.setItem("refreshToken", res.refreshToken);

        navigate("/menu");
      } else {
        console.error("Login failed.", res);
        alert("Login failed. Please check your login information.");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[color:var(--background-color)]">
      <div className="flex items-center justify-center max-w-[1000px] w-full">
        <div className="flex flex-col max-w-[433px] w-full h-auto">
          <label htmlFor="email" className="text-[#cdcdcd] font-normal text-sm">
            Email
          </label>
          <input
            type="email"
            placeholder="mail@abc.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-[45px] w-full border border-[#DED2D9] rounded-[5px] mb-[5px] text-base px-3.5 py-0 bg-[#24242C] text-white placeholder:text-white placeholder:text-sm focus:outline-none"
          />
          {emailError && <p className="text-sm text-[#ff007f]">{emailError}</p>}

          <label
            htmlFor="password"
            className="text-[#cdcdcd] font-normal text-sm"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="*****************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-[45px] w-full border border-[#DED2D9] rounded-[5px] mb-[5px] text-base px-3.5 py-0 bg-[#24242C] text-white placeholder:text-white placeholder:text-sm focus:outline-none"
          />
          {passwordError && (
            <p className="text-sm text-[#ff007f]">{passwordError}</p>
          )}

          <label className="flex items-center text-[15px] mt-0.5 mb-[7px] mx-0">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="hidden"
            />
            <div className="inline-block w-4 h-4 bg-[#666be4] ml-px mr-3.5 rounded-[3px] border border-[#666be4] text-center leading-4 text-[#24242c] relative">
              {/* Checkmark styled below */}
            </div>
            <p className="text-white text-sm">Remember Me</p>
            <a
              href="##"
              className="text-[#666be4] text-sm ml-auto hover:underline"
            >
              Forgot Password?
            </a>
          </label>

          <div className="flex flex-col text-center items-center gap-2.5 mt-[25px] mb-5">
            <button
              type="button"
              onClick={onSubmit}
              className="w-full cursor-pointer text-white text-[1.15rem] font-semibold rounded-[5px] bg-gradient-to-r from-[#958eff] via-[#7c009a] to-[#7d6bd6] h-[45px] bg-[length:300%_100%] transition-all duration-300 ease-in-out hover:bg-[position:100%_0] focus:outline-none"
            >
              {loading ? "loading..." : "Login"}
            </button>
            <p className="text-[#828282] text-base">
              Not Registered Yet?{" "}
              <Link
                to="/register"
                className="text-[#7076fe] text-lg hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
