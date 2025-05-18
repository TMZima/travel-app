import Link from "next/link";

/**
 * Footer component with secondary navigation links.
 * Displays copyright and legal/about links.
 * @returns The footer section for the app.
 */
export default function Footer() {
  return (
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
  );
}
