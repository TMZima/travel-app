"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Represents the signup form state.
 */
interface SignupFormState {
  username: string;
  email: string;
  password: string;
}

/**
 * Signup page component for user registration.
 * @returns The signup page.
 */
export default function Signup() {
  const router = useRouter();
  const [user, setUser] = useState<SignupFormState>({
    username: "",
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles input changes for the signup form.
   * @param {React.ChangeEvent<HTMLInputElement>} evt - The input change event.
   */
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, [evt.target.name]: evt.target.value });
  };

  /**
   * Handles form submission for signup.
   * @param {React.FormEvent} evt - The form submission event.
   */
  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/user/signup", user);
      console.log("Signup success", response.data);
      toast.success(
        `Welcome aboard, ${user.username}! Your journey begins now!`
      );
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
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
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
        <p className="mt-4 text-gray-600">
          Create your account to start planning your next adventure.
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
            ? "Signing Up..."
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
  );
}
