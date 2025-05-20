"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * New Itinerary page for creating an itinerary.
 * @returns The new itinerary form page.
 */
export default function NewItineraryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (form.title && form.startDate && form.endDate) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/itinerary", form);
      toast.success("Itinerary created!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create itinerary"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create New Itinerary
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="title" className="text-gray-700 font-medium">
            Trip Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="e.g., Summer Vacation!"
            value={form.title}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-lg font-medium text-gray-900 bg-white"
            required
          />

          <label htmlFor="startDate" className="text-gray-700 font-medium">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-lg font-medium text-gray-900 bg-white"
            required
          />

          <label htmlFor="endDate" className="text-gray-700 font-medium">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-lg font-medium text-gray-900 bg-white"
            required
          />

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || buttonDisabled}
          >
            {loading
              ? "Creating..."
              : buttonDisabled
              ? "Please complete all fields"
              : "Create Itinerary"}
          </button>
        </form>
      </div>
    </main>
  );
}
