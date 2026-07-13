'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Props = {
  mode: "login" | "signup";
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

const AuthForm = ({ mode }: Props) => {
  const router = useRouter()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Choose the correct endpoint based on mode
    const endpoint =
      mode === "signup"
        ? `${BASE_URL}/signup.php`
        : `${BASE_URL}/login.php`;
  
    // Payload changes depending on signup or login
    const payload =
      mode === "signup"
        ? { name, email, password }
        : { email, password };
  
    // send POST request to the backend scripts
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (data.error) {
        setMessage(`${data.error}`);
      } else {
        setMessage(`${data.message || "Login successful"}`);
  
        if (data.user?.id) {
          localStorage.setItem("user_id", data.user.id.toString());
          window.location.href = "/";
        }
        

      }
    } catch (err) {
      setMessage("❌ Server error");
    }
    router.push("/");
  };
  

  return (
    <div className="max-w-lg md:max-w-md mx-auto mt-20 p-10 bg-transparent border rounded-xl border-white shadow-md shadow-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full gap-1"
      >
        <h2 className="text-2xl font-bold mb-6 capitalize text-white ">
          {mode}
        </h2>

        {mode === "signup" && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-3 p-2 border rounded-lg bg-transparent text-white shadow-sm shadow-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded-lg bg-transparent text-white shadow-sm shadow-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded-lg bg-transparent text-white shadow-sm shadow-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-1/2 mt-8 border border-white rounded-lg hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-violet-900 text-white py-2 transition duration-300 ease-in-out shadow-sm shadow-white"
        >
          {mode === "signup" ? "Sign Up" : "Log In"}
        </button>
      </form>

      {message && (
      <p className="mt-4 text-center text-white">{message}</p>
      )}

      <p className="mt-6 text-sm text-white text-center">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white underline hover:text-fuchsia-400 transition"
            >
              Log in here
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-white underline hover:text-fuchsia-400 transition"
            >
              Sign up here
            </Link>
          </>
        )}
      </p>
    </div>

  );
  
};

export default AuthForm;