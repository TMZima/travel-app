"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Represents an accommodation in an itinerary.
 */
interface Accommodation {
  _id: string;
  name?: string;
}

/**
 * Represents a point of interest in an itinerary.
 */
interface PointOfInterest {
  _id: string;
  name?: string;
}

/**
 * Represents a user's itinerary.
 */
interface Itinerary {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  accommodations: Accommodation[];
  pointsOfInterest: PointOfInterest[];
}

/**
 * Dashboard page component for displaying user itineraries.
 * @returns The dashboard page.
 */
export default function Dashboard() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetches the user's itineraries on mount.
  useEffect(() => {
    axios
      .get("/api/itinerary/user")
      .then((res) => setItineraries(res.data.data))
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load itineraries";
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

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
                    {itin.title}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(itin.startDate).toLocaleDateString()} -{" "}
                    {new Date(itin.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {itin.accommodations.length} accommodations,{" "}
                    {itin.pointsOfInterest.length} points of interest
                  </p>
                </div>
                <Link
                  href={`/itineraries/${itin._id}`}
                  className="text-blue-600 underline hover:text-blue-800 transition"
                >
                  View/Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
