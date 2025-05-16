export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-600">Contact Us</h1>
      <p className="mt-4 text-lg text-gray-700 text-center max-w-2xl">
        Have questions or feedback? We'd love to hear from you! Reach out to us
        at:
      </p>
      <p className="mt-4 text-gray-800">
        Email:{" "}
        <a
          href="mailto:support@travelapp.com"
          className="text-blue-600 hover:underline"
        >
          support@travelapp.com
        </a>
      </p>
    </div>
  );
}
