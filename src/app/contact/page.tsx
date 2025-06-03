/**
 * Contact page component for TravelApp.
 * Displays contact information and a way to reach support.
 * @returns The contact page JSX.
 */
export default function Contact() {
  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Contact Us</h1>
      <p className="mt-4 text-lg text-gray-700 text-center max-w-2xl">
        Have questions or feedback? We&apos;d love to hear from you! Reach out
        to us at:
      </p>
      <p className="mt-4 text-gray-800 text-center">
        Email:{" "}
        <a
          href="mailto:support@travelapp.com"
          className="text-blue-600 hover:underline"
        >
          support@travelapp.com
        </a>
      </p>
    </main>
  );
}
