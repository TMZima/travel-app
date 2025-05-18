import Link from "next/link";

/**
 * Home page component for TravelApp.
 * Displays a call-to-action and intro content.
 * @returns The home page JSX.
 */
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your Next Adventure Awaits
        </h2>
        <p className="mt-4 text-gray-600">
          Start planning your dream trip today with TravelApp.
        </p>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/signup"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105 flex items-center justify-center"
          aria-label="Sign up for TravelApp"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition transform hover:scale-105 flex items-center justify-center"
          aria-label="Log in to TravelApp"
        >
          Log In
        </Link>
      </div>
    </main>
  );
}
