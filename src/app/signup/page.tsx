"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success(
        `Welcome aboard, ${user.username}! Your journey begins now!`
      );
      router.push("/");
    } catch (err: any) {
      console.error("Signup failed:", err.message);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between">
      {/* Hero Section */}
      <header
        className="relative w-full text-white py-12 text-center"
        style={{
          backgroundImage: "url('/backgroundImg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#2563eb", // Fallback color
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">Welcome to TravelApp</h1>
          <p className="mt-4 text-lg">
            Plan your trips, manage itineraries, and explore the world with
            ease.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow px-6 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
          <p className="mt-4 text-gray-600">
            Join our community and start exploring the world with TravelApp.
          </p>
        </div>

        {/* Signup Form */}
        <form
          className="mt-8 flex flex-col gap-4 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={buttonDisabled}
          >
            {loading
              ? "Singing Up..."
              : buttonDisabled
              ? "Please complete all fields"
              : "Sign Up"}
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} TravelApp. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4">
          <Link
            href="/about"
            className="text-gray-400 hover:text-white transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-400 hover:text-white transition"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="text-gray-400 hover:text-white transition"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
