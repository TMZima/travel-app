/**
 * About page component for TravelApp.
 * Displays information about the app and its mission.
 * @returns The about page JSX.
 */
export default function About() {
  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">About TravelApp</h1>
      <p className="mt-2 text-lg text-gray-700 text-center max-w-2xl">
        TravelApp is your ultimate travel companion. Plan your trips, manage
        itineraries, and explore the world with ease. Our mission is to make
        travel planning simple and enjoyable for everyone.
      </p>
    </main>
  );
}
