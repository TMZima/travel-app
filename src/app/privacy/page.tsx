/**
 * Privacy Policy page component for TravelApp.
 * Displays information about user privacy and data usage.
 * @returns The privacy policy page JSX.
 */
export default function Privacy() {
  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-700">Privacy Policy</h1>
      <p className="mt-4 text-lg text-gray-700 text-center max-w-2xl">
        Your privacy is important to us. TravelApp collects and uses your data
        only to improve your experience. We do not share your data with third
        parties without your consent.
      </p>
    </main>
  );
}
