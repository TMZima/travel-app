"use client";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

/**
 * Header component with navigation and logout functionality.
 * Displays the main navigation bar and hero section.
 * @returns The header section for the app.
 */
export default function Header() {
  const router = useRouter();

  /**
   * Handles user logout from the navigation bar.
   * Sends a POST request to the logout endpoint and redirects to login.
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post("/api/user/logout");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header
      className="relative w-full text-white py-12 text-center"
      style={{
        backgroundImage: "url('/backgroundImg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#2563eb",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <nav className="relative z-20 container mx-auto flex items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white z-20"
        >
          TravelApp
        </Link>
        <div className="flex gap-6 z-20 items-center">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/map" className="hover:underline">
            Map
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="border border-white/30 bg-transparent text-white px-4 py-2 rounded-md hover:bg-white/10 transition-colors duration-200 ml-4"
          >
            Log Out
          </button>
        </div>
      </nav>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold">Welcome to TravelApp</h1>
        <p className="mt-4 text-lg">
          Plan your trips, manage itineraries, and explore the world with ease.
        </p>
      </div>
    </header>
  );
}
