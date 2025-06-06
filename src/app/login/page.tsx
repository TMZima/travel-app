"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

/**
 * Represents the login form state.
 */
interface LoginFormState {
  email: string;
  password: string;
}

/**
 * Login page component for user authentication.
 * @returns The login page.
 */
export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState<LoginFormState>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles input changes for the login form.
   * @param {React.ChangeEvent<HTMLInputElement>} evt - The input change event.
   */
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, [evt.target.name]: evt.target.value });
  };

  /**
   * Handles form submission for login.
   * @param {React.FormEvent} evt - The form submission event.
   */
  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    if (!user.email || !user.password) {
      toast.error("Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/user/login", user);
      toast.success(`Welcome back, ${response.data.data.username}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Log In</h2>
        <p className="mt-4 text-gray-600">
          Enter your credentials to access your account.
        </p>
      </div>
      <form
        className="mt-8 flex flex-col gap-4 w-full max-w-md"
        onSubmit={handleSubmit}
      >
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
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
}
