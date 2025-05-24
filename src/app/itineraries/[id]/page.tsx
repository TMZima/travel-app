"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

interface Accommodation {
  _id: string;
  name: string;
  address: string;
  type: string;
  confirmationNumber: string;
  checkInDate: string;
  checkOutDate: string;
  location: string;
}

interface PointOfInterest {
  _id: string;
  name: string;
}

export default function ItineraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", startDate: "", endDate: "" });
  const [addingAcc, setAddingAcc] = useState(false);

  const [newAcc, setNewAcc] = useState({
    name: "",
    address: "",
    type: "Hotel",
    confirmationNumber: "",
    checkInDate: "",
    checkOutDate: "",
    location: "",
  });

  // Fetch itinerary and populate accommodations/POIs
  const fetchItinerary = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/itinerary/${id}`);
      setItinerary(res.data.data);
      setForm({
        title: res.data.data.title,
        startDate: res.data.data.startDate.slice(0, 10),
        endDate: res.data.data.endDate.slice(0, 10),
      });
    } catch {
      toast.error("Failed to load itinerary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchItinerary();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/itinerary/${id}`, form);
      toast.success("Itinerary updated!");
      fetchItinerary();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update itinerary"
      );
    }
  };

  const handleAddAccommodation = async () => {
    // Validate required fields
    if (
      !newAcc.name ||
      !newAcc.address ||
      !newAcc.type ||
      !newAcc.checkInDate ||
      !newAcc.checkOutDate ||
      !newAcc.location
    ) {
      toast.error("Please fill out all required accommodation fields.");
      return;
    }
    setAddingAcc(true);
    try {
      // 1. Create accommodation (backend will set createdBy from token)
      const accRes = await axios.post("/api/accommodation", {
        ...newAcc,
        confirmationNumber: newAcc.confirmationNumber || "",
        belongsTo: id,
      });
      const acc = accRes.data.data;
      // 2. Update itinerary to include new accommodation
      await axios.put(`/api/itinerary/${id}`, {
        accommodations: [
          ...(itinerary.accommodations || []).map((a: Accommodation) => a._id),
          acc._id,
        ],
      });
      toast.success("Accommodation added!");
      setNewAcc({
        name: "",
        address: "",
        type: "Hotel",
        confirmationNumber: "",
        checkInDate: "",
        checkOutDate: "",
        location: "",
      });
      fetchItinerary();
    } catch (err: any) {
      toast.error("Failed to add accommodation");
    } finally {
      setAddingAcc(false);
    }
  };

  const handleRemoveAccommodation = async (accId: string) => {
    try {
      await axios.put(`/api/itinerary/${id}`, {
        accommodations: (itinerary.accommodations || [])
          .filter((a: Accommodation) => a._id !== accId)
          .map((a: Accommodation) => a._id),
      });
      toast.success("Accommodation removed!");
      fetchItinerary();
    } catch {
      toast.error("Failed to remove accommodation");
    }
  };

  if (loading)
    return (
      <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
        <div className="p-8">Loading...</div>
      </main>
    );
  if (!itinerary) return <div className="p-8">Itinerary not found</div>;

  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
      <div className="max-w-xl w-full bg-white rounded shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Itinerary
          </h2>
          <Link
            href="/dashboard"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Back to Dashboard
          </Link>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="text-gray-700">Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2 bg-white text-gray-900"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Start Date</span>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2 bg-white text-gray-900"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700">End Date</span>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2 bg-white text-gray-900"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
        {/* Accommodations Section */}
        <div className="mt-6 text-gray-700 text-base">
          <h4 className="font-semibold mb-2">Accommodations</h4>
          <ul className="list-disc list-inside mb-4">
            {(itinerary.accommodations || []).map((a: Accommodation) => (
              <li
                key={a._id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2"
              >
                <span className="font-medium">{a.name}</span>
                <span className="text-gray-500">{a.type}</span>
                <span className="text-gray-500">{a.address}</span>
                <span className="text-gray-500">
                  {a.checkInDate?.slice(0, 10)} - {a.checkOutDate?.slice(0, 10)}
                </span>
                <span className="text-gray-500">{a.location}</span>
                {a.confirmationNumber && (
                  <span className="text-gray-500">
                    Conf#: {a.confirmationNumber}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveAccommodation(a._id)}
                  className="text-red-500 hover:underline ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {/* Add Accommodation Form */}
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              value={newAcc.name}
              onChange={(e) =>
                setNewAcc((n) => ({ ...n, name: e.target.value }))
              }
              className="border rounded px-3 py-2 bg-white text-gray-900"
              placeholder="Accommodation name"
              required
            />
            <input
              type="text"
              value={newAcc.address}
              onChange={(e) =>
                setNewAcc((n) => ({ ...n, address: e.target.value }))
              }
              className="border rounded px-3 py-2 bg-white text-gray-900"
              placeholder="Address"
              required
            />
            <select
              value={newAcc.type}
              onChange={(e) =>
                setNewAcc((n) => ({ ...n, type: e.target.value }))
              }
              className="border rounded px-3 py-2 bg-white text-gray-900"
              required
            >
              <option value="Hotel">Hotel</option>
              <option value="Airbnb">Airbnb</option>
              <option value="Hostel">Hostel</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              value={newAcc.confirmationNumber}
              onChange={(e) =>
                setNewAcc((n) => ({ ...n, confirmationNumber: e.target.value }))
              }
              className="border rounded px-3 py-2 bg-white text-gray-900"
              placeholder="Confirmation Number"
            />
            <input
              type="date"
              value={newAcc.checkInDate}
              onChange={(e) =>
                setNewAcc((n) => ({ ...n, checkInDate: e.target.value }))
              }
              className="border rounded px-3 py-2 bg-white text-gray-900"
              placeholder="Check-in Date"
              required
            />
            <input
              type="date"
              value={newAcc.checkOutDate}
              onChange={(e) =>
                setNewAcc((n) => ({ ...n, checkOutDate: e.target.value }))
              }
              className="border rounded px-3 py-2 bg-white text-gray-900"
              placeholder="Check-out Date"
              required
            />
            <input
              type="text"
              value={newAcc.location}
              onChange={(e) =>
                setNewAcc((n) => ({ ...n, location: e.target.value }))
              }
              className="border rounded px-3 py-2 bg-white text-gray-900"
              placeholder="Location"
              required
            />
            <button
              type="button"
              onClick={handleAddAccommodation}
              className="bg-green-600 text-white px-3 py-2 rounded"
              disabled={addingAcc}
            >
              Add
            </button>
          </div>
        </div>
        {/* Points of Interest Section */}
        <div className="mt-6 text-gray-700 text-base">
          <h4 className="font-semibold mb-2">Points of Interest</h4>
          <ul className="list-disc list-inside">
            {(itinerary.pointsOfInterest || []).map((poi: PointOfInterest) => (
              <li key={poi._id}>{poi.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
