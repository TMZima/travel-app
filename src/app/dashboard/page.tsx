"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import toast from "react-hot-toast";

interface Activity {
  time: string;
  description: string;
}

interface DayPlan {
  date: string;
  activities: Activity[];
}

interface Itinerary {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
}

export default function Dashboard() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("/api/itinerary/user")
      .then((res) => setItineraries(res.data.data))
      .catch((err: unknown) => {
        const error = err as AxiosError<{ message?: string; error?: string }>;
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load itineraries";
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (!confirmed) return;
    try {
      await axios.delete(`/api/itinerary/${id}`);
      setItineraries((prev) => prev.filter((itin) => itin._id !== id));
      toast.success("Itinerary deleted successfully");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete itinerary";
      toast.error(message);
      console.error("Error deleting itinerary:", err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <div className="flex justify-between items-center w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your Itineraries
        </h2>
        <Link
          href="/itineraries/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Create Itinerary
        </Link>
      </div>
      <div className="w-full max-w-3xl">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-gray-600 text-lg">Loading...</span>
          </div>
        ) : itineraries.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No itineraries yet. Start by creating one!
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {itineraries.map((itin) => (
              <li
                key={itin._id}
                className="border p-6 rounded-lg shadow bg-white flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {itin.destination}
                  </h3>
                  <p className="text-gray-600">
                    {dayjs.utc(itin.startDate).format("MMMM D, YYYY")} -{" "}
                    {dayjs.utc(itin.endDate).format("MMMM D, YYYY")}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {itin.days.length} day{itin.days.length !== 1 ? "s" : ""} of
                    scheduled activities
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/itineraries/${itin._id}`}
                    className="text-blue-600 underline hover:text-blue-800 transition"
                  >
                    View/Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(itin._id)}
                    className="text-red-600 hover:text-red-800 transition underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
