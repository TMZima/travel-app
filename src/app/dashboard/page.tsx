"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

interface Accommodation {
  _id: string;
  name?: string;
  // add other fields as needed
}
interface PointOfInterest {
  _id: string;
  name?: string;
  // add other fields as needed
}
interface Itinerary {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  accommodations: Accommodation[];
  pointsOfInterest: PointOfInterest[];
}

export default function Dashboard() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/itinerary/user")
      .then((res) => setItineraries(res.data.data))
      .catch(() => toast.error("Failed to load itineraries"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Itineraries</h1>
        <Link
          href="/itineraries/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Itinerary
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : itineraries.length === 0 ? (
        <p>No itineraries yet. Start by creating one!</p>
      ) : (
        <ul className="space-y-4">
          {itineraries.map((itin) => (
            <li key={itin._id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{itin.title}</h2>
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
                  className="text-blue-600 underline"
                >
                  View/Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <Link href="/map" className="text-blue-700 underline">
          Go to Map
        </Link>
      </div>
      <div className="mt-8">
        <form action="/api/users/logout" method="POST">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}
