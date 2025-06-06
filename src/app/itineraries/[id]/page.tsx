"use client";
import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import toast from "react-hot-toast";

/** Represents a single activity in a day's plan. */
interface Activity {
  time: string;
  description: string;
}

/** Represents a single day in the itinerary. */
interface DayPlan {
  date: string;
  activities: Activity[];
}

/** Represents the itinerary object. */
interface Itinerary {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
}

export default function ItineraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

  // For editing/adding activities
  const [editDayIdx, setEditDayIdx] = useState<number | null>(null);
  const [newActivity, setNewActivity] = useState<Activity>({
    time: "",
    description: "",
  });

  // For editing an existing activity
  const [editActivity, setEditActivity] = useState<{
    dayIdx: number;
    actIdx: number;
  } | null>(null);
  const [editActivityData, setEditActivityData] = useState<Activity>({
    time: "",
    description: "",
  });

  // For editing itinerary details
  const [editDetails, setEditDetails] = useState(false);
  const [editDestination, setEditDestination] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  // For adding a new day
  const [newDayDate, setNewDayDate] = useState("");

  // Fetch itinerary
  const fetchItinerary = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/itinerary/${id}`);
      setItinerary(res.data.data);
      setEditDestination(res.data.data.destination);
      setEditStartDate(res.data.data.startDate.slice(0, 10));
      setEditEndDate(res.data.data.endDate.slice(0, 10));
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

  // Add activity to a day
  const handleAddActivity = async (dayIdx: number) => {
    if (!newActivity.time || !newActivity.description) {
      toast.error("Please fill out both time and description.");
      return;
    }
    if (!itinerary) return;
    // Sort days before updating to keep order consistent
    const sortedDays = [...itinerary.days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    sortedDays[dayIdx].activities.push({ ...newActivity });
    // Sort activities by time before saving
    sortedDays[dayIdx].activities = [...sortedDays[dayIdx].activities].sort(
      (a, b) => a.time.localeCompare(b.time)
    );
    try {
      await axios.put(`/api/itinerary/${id}`, { days: sortedDays });
      setNewActivity({ time: "", description: "" });
      setEditDayIdx(null);
      fetchItinerary();
      toast.success("Activity added!");
    } catch {
      toast.error("Failed to add activity");
    }
  };

  // Edit an existing activity
  const handleUpdateActivity = async (dayIdx: number, actIdx: number) => {
    if (!editActivityData.time || !editActivityData.description || !itinerary)
      return;
    const sortedDays = [...itinerary.days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    sortedDays[dayIdx].activities[actIdx] = { ...editActivityData };
    // Sort activities by time
    sortedDays[dayIdx].activities = [...sortedDays[dayIdx].activities].sort(
      (a, b) => a.time.localeCompare(b.time)
    );
    try {
      await axios.put(`/api/itinerary/${id}`, { days: sortedDays });
      setEditActivity(null);
      fetchItinerary();
      toast.success("Activity updated!");
    } catch {
      toast.error("Failed to update activity");
    }
  };

  // Delete an activity
  const handleDeleteActivity = async (dayIdx: number, actIdx: number) => {
    if (!itinerary) return;
    const sortedDays = [...itinerary.days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    sortedDays[dayIdx].activities.splice(actIdx, 1);
    try {
      await axios.put(`/api/itinerary/${id}`, { days: sortedDays });
      fetchItinerary();
      toast.success("Activity deleted!");
    } catch {
      toast.error("Failed to delete activity");
    }
  };

  // Delete a day
  const handleDeleteDay = async (dayIdx: number) => {
    if (!itinerary) return;
    const updatedDays = itinerary.days.filter((_, idx) => idx !== dayIdx);
    try {
      await axios.put(`/api/itinerary/${itinerary._id}`, { days: updatedDays });
      toast.success("Day deleted!");
      setEditDayIdx(null);
      fetchItinerary();
    } catch {
      toast.error("Failed to delete day");
    }
  };

  // Add a new day
  const handleAddDay = async (e: FormEvent) => {
    e.preventDefault();
    if (!itinerary) return;
    if (!newDayDate) {
      toast.error("Please enter a date for the new day.");
      return;
    }
    if (
      newDayDate < itinerary.startDate.slice(0, 10) ||
      newDayDate > itinerary.endDate.slice(0, 10)
    ) {
      toast.error("Day must be within the itinerary's start and end dates.");
      return;
    }
    if (itinerary.days.some((d) => d.date === newDayDate)) {
      toast.error("That day already exists.");
      return;
    }
    const updatedDays = [
      ...itinerary.days,
      { date: newDayDate, activities: [] },
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    try {
      await axios.put(`/api/itinerary/${id}`, { days: updatedDays });
      setNewDayDate("");
      fetchItinerary();
      toast.success("Day added!");
    } catch {
      toast.error("Failed to add day");
    }
  };

  // Update itinerary details
  const handleUpdateDetails = async (e: FormEvent) => {
    e.preventDefault();
    if (!itinerary) return;
    if (!editStartDate || !editEndDate || editEndDate < editStartDate) {
      toast.error("End date must be after start date.");
      return;
    }
    try {
      await axios.put(`/api/itinerary/${id}`, {
        destination: editDestination,
        startDate: editStartDate,
        endDate: editEndDate,
        days: itinerary.days,
      });
      setEditDetails(false);
      fetchItinerary();
      toast.success("Itinerary updated!");
    } catch {
      toast.error("Failed to update itinerary");
    }
  };

  if (loading)
    return (
      <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100">
        <div className="p-8 text-gray-900">Loading...</div>
      </main>
    );
  if (!itinerary)
    return <div className="p-8 text-gray-900">Itinerary not found</div>;

  // Always sort days by date before rendering
  const sortedDays = [...itinerary.days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100 text-gray-900">
      <div className="max-w-xl w-full bg-white rounded shadow p-8 text-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {editDetails ? "Edit Itinerary" : itinerary.destination}
          </h2>
          <Link
            href="/dashboard"
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        {editDetails ? (
          <form
            onSubmit={handleUpdateDetails}
            className="mb-6 flex flex-col gap-2"
          >
            <input
              type="text"
              value={editDestination}
              onChange={(e) => setEditDestination(e.target.value)}
              className="border rounded px-3 py-2 bg-white text-gray-900 text-base"
              required
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={editStartDate}
                onChange={(e) => {
                  setEditStartDate(e.target.value);
                  if (
                    editEndDate &&
                    e.target.value &&
                    editEndDate < e.target.value
                  ) {
                    setEditEndDate("");
                  }
                }}
                className="border rounded px-3 py-2 bg-white text-gray-900 text-base"
                required
              />
              <input
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                min={editStartDate || undefined}
                className="border rounded px-3 py-2 bg-white text-gray-900 text-base"
                required
                disabled={!editStartDate}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
              <button
                type="button"
                className="text-gray-500 underline"
                onClick={() => setEditDetails(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="mb-4 text-gray-900">
              <span className="font-medium text-gray-900">Dates:</span>{" "}
              {dayjs.utc(itinerary.startDate).format("MMMM D, YYYY")} to{" "}
              {dayjs.utc(itinerary.endDate).format("MMMM D, YYYY")}
            </p>
            <button
              className="mb-6 text-blue-600 underline hover:text-blue-800 transition cursor-pointer"
              onClick={() => setEditDetails(true)}
            >
              Edit Itinerary Details
            </button>
          </>
        )}

        {/* Add Day */}
        <form onSubmit={handleAddDay} className="flex gap-2 items-center mb-6">
          <input
            type="date"
            value={newDayDate}
            onChange={(e) => setNewDayDate(e.target.value)}
            className="border rounded px-3 py-2 bg-white text-gray-900 text-base"
            min={itinerary?.startDate.slice(0, 10)}
            max={itinerary?.endDate.slice(0, 10)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Add Day
          </button>
        </form>

        <div className="space-y-6">
          {sortedDays.map((day, idx) => (
            <div
              key={day.date}
              className="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg text-gray-900">
                  {`Day ${idx + 1}: ${dayjs(day.date).format("MMMM D, YYYY")}`}
                </h4>
                <div className="flex gap-2">
                  {editDayIdx === idx ? (
                    <button
                      className="text-gray-500 underline"
                      onClick={() => setEditDayIdx(null)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <>
                      <button
                        className="text-blue-600 underline hover:text-blue-800 transition cursor-pointer"
                        onClick={() => {
                          setEditDayIdx(idx);
                          setNewActivity({ time: "", description: "" });
                        }}
                      >
                        + Add Activity
                      </button>
                      <button
                        className="text-red-600 underline hover:text-red-800 transition cursor-pointer"
                        onClick={() => handleDeleteDay(idx)}
                      >
                        Delete Day
                      </button>
                    </>
                  )}
                </div>
              </div>
              <ul className="mb-2 text-gray-900">
                {day.activities.length === 0 ? (
                  <li className="ml-4 italic text-gray-500">
                    No activities yet.
                  </li>
                ) : (
                  [...day.activities]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((act, actIdx) =>
                      editActivity &&
                      editActivity.dayIdx === idx &&
                      editActivity.actIdx === actIdx ? (
                        <li
                          key={actIdx}
                          className="ml-4 flex items-center gap-2"
                        >
                          <input
                            type="time"
                            value={editActivityData.time}
                            onChange={(e) =>
                              setEditActivityData((data) => ({
                                ...data,
                                time: e.target.value,
                              }))
                            }
                            className="border rounded px-2 py-1 bg-white text-gray-900 text-base"
                          />
                          <input
                            type="text"
                            value={editActivityData.description}
                            onChange={(e) =>
                              setEditActivityData((data) => ({
                                ...data,
                                description: e.target.value,
                              }))
                            }
                            className="border rounded px-2 py-1 bg-white text-gray-900 text-base"
                            placeholder="Description"
                          />
                          <button
                            className="bg-green-600 text-white px-2 py-1 rounded"
                            onClick={() => handleUpdateActivity(idx, actIdx)}
                            type="button"
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-500 underline"
                            onClick={() => setEditActivity(null)}
                            type="button"
                          >
                            Cancel
                          </button>
                        </li>
                      ) : (
                        <li
                          key={actIdx}
                          className="ml-4 flex items-center gap-2 text-gray-900"
                        >
                          <span className="font-mono text-gray-900">
                            {act.time}
                          </span>{" "}
                          - {act.description}
                          <button
                            className="text-blue-600 underline text-sm hover:text-blue-800 transition cursor-pointer"
                            onClick={() => {
                              setEditActivity({ dayIdx: idx, actIdx });
                              setEditActivityData(act);
                            }}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 underline text-sm hover:text-red-800 transition cursor-pointer"
                            onClick={() => handleDeleteActivity(idx, actIdx)}
                            type="button"
                          >
                            Delete
                          </button>
                        </li>
                      )
                    )
                )}
              </ul>
              {editDayIdx === idx && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="time"
                    value={newActivity.time}
                    onChange={(e) =>
                      setNewActivity((a) => ({ ...a, time: e.target.value }))
                    }
                    className="border rounded px-2 py-1 bg-white text-gray-900 text-base"
                  />
                  <input
                    type="text"
                    value={newActivity.description}
                    onChange={(e) =>
                      setNewActivity((a) => ({
                        ...a,
                        description: e.target.value,
                      }))
                    }
                    className="border rounded px-2 py-1 bg-white text-gray-900 text-base"
                    placeholder="Description"
                  />
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleAddActivity(idx)}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
