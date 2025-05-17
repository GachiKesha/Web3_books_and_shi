import { useNavigate } from "react-router";
import { register } from "../api/auth";
import { useState } from "react";
import "./base.css";

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export default function Register() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;

    if (!username) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!repeatPassword) {
      setRepeatPasswordError("Please repeat your password.");
      isValid = false;
    } else if (repeatPassword !== password) {
      setRepeatPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setRepeatPasswordError("");
    }

    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    if (e.target.value.trim() !== "") {
      setNameError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.trim() !== "") {
      setPasswordError("");
    }
  };

  const handleRepeatPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRepeatPassword(e.target.value);
    if (e.target.value.trim() !== "") {
      setRepeatPasswordError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    if (inputValue !== "") {
      setEmailError("");
    }

    if (!emailPattern.test(inputValue)) {
      setEmailError("Please enter a valid email address.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    if (validate()) {
      e.preventDefault();
      try {
        setLoading(true);
        const [res, ok] = await register(email, password, username, "user"); //For now admins are created only artificially
        if (ok) {
          sessionStorage.setItem("accessToken", res.accessToken);
          sessionStorage.setItem("refreshToken", res.refreshToken);

          navigate("/menu");
        } else {
          console.error(
            "Registration failed. Please check the form for errors.",
            res
          );
        }
      } catch (error) {
        console.error(
          "An error occurred while processing the registration.",
          error
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[color:var(--background-color)]">
      <div className="flex items-center justify-center max-w-[1000px] w-full">
        <div className="flex flex-col max-w-[433px] w-full h-auto">
          <label htmlFor="Name" className="text-[#cdcdcd] font-normal text-sm">
            Name
          </label>
          <input
            type="text"
            placeholder="Name"
            value={username}
            onChange={handleNameChange}
            className="h-[45px] w-full border border-white rounded-[5px] mb-[5px] text-base px-3.5 py-0 bg-[#24242c] text-white placeholder:text-[#828282] focus:outline-none"
          />
          <p className="text-sm text-[#ff007f]">{nameError}</p>

          <label
            htmlFor="password"
            className="text-[#cdcdcd] font-normal text-sm"
          >
            Password
          </label>
          <input
            type="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}"
            placeholder="*****************"
            value={password}
            onChange={handlePasswordChange}
            className="h-[45px] w-full border border-white rounded-[5px] mb-[5px] text-base px-3.5 py-0 bg-[#24242c] text-white placeholder:text-[#828282] focus:outline-none"
          />
          <p className="text-sm text-[#ff007f]">{passwordError}</p>

          <label
            htmlFor="repeat-password"
            className="text-[#cdcdcd] font-normal text-sm"
          >
            Repeat password
          </label>
          <input
            type="password"
            placeholder="*****************"
            value={repeatPassword}
            onChange={handleRepeatPasswordChange}
            className="h-[45px] w-full border border-white rounded-[5px] mb-[5px] text-base px-3.5 py-0 bg-[#24242c] text-white placeholder:text-[#828282] focus:outline-none"
          />
          <p className="text-sm text-[#ff007f]">{repeatPasswordError}</p>

          <label htmlFor="email" className="text-[#cdcdcd] font-normal text-sm">
            Email
          </label>
          <input
            type="email"
            placeholder="mail@abc.com"
            value={email}
            onChange={handleEmailChange}
            className="h-[45px] w-full border border-white rounded-[5px] mb-[5px] text-base px-3.5 py-0 bg-[#24242c] text-white placeholder:text-[#828282] focus:outline-none"
          />
          <p className="text-sm text-[#ff007f]">{emailError}</p>

          <div className="flex flex-col text-center gap-[15px] mt-[7px]">
            <button
              type="submit"
              onClick={onSubmit}
              className="w-full cursor-pointer text-white text-[1.15rem] font-semibold rounded-[5px] h-[45px]
             bg-gradient-to-r from-[#958eff] via-[#7c009a] to-[#7d6bd6] bg-[length:300%_100%]
             transition-all duration-300 ease-in-out hover:bg-[position:100%_0] focus:outline-none"
            >
              {loading ? "loading..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
