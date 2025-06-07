"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import toast from "react-hot-toast";

/**
 * Represents a single activity in a day's plan.
 */
interface Activity {
  time: string;
  description: string;
}

/**
 * Represents a single day in the itinerary.
 */
interface DayPlan {
  date: string;
  activities: Activity[];
}

/**
 * Page for creating a new itinerary.
 * Allows user to add days and activities for each day.
 */
export default function CreateItineraryPage() {
  const router = useRouter();
  const [destination, setDestination] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [days, setDays] = useState<DayPlan[]>([]);
  const [newDayDate, setNewDayDate] = useState<string>("");
  const [activityInputs, setActivityInputs] = useState<
    Record<number, Activity>
  >({});

  /**
   * Adds a new day to the itinerary.
   */
  const handleAddDay = (): void => {
    if (!newDayDate) {
      toast.error("Please enter a date for the new day.");
      return;
    }
    if (newDayDate < startDate || newDayDate > endDate) {
      toast.error("Day must be within the itinerary date range.");
      return;
    }
    if (days.some((d) => d.date === newDayDate)) {
      toast.error("This Day already exists.");
      return;
    }
    setDays([
      ...days,
      { date: dayjs(newDayDate).format("YYYY-MM-DD"), activities: [] },
    ]);
    setNewDayDate("");
  };

  /**
   * Adds a new activity to a specific day.
   * @param dayIdx - The index of the day in the days array.
   */
  const handleAddActivity = (dayIdx: number): void => {
    const activity = activityInputs[dayIdx];
    if (!activity?.time || !activity?.description) {
      toast.error("Please fill out both time and description.");
      return;
    }
    const updatedDays = [...days];
    updatedDays[dayIdx].activities.push(activity);
    setDays(updatedDays);
    setActivityInputs((prev) => ({
      ...prev,
      [dayIdx]: { time: "", description: "" },
    }));
  };

  /**
   * Handles the form submission to create a new itinerary.
   * @param e - The form event.
   */
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!destination || !startDate || !endDate || days.length === 0) {
      toast.error("Please fill out all fields and add at least one day.");
      return;
    }
    if (endDate < startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }
    try {
      await axios.post("/api/itinerary", {
        destination,
        startDate,
        endDate,
        days,
      });
      toast.success("Itinerary created!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to create itinerary"
      );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow px-6 py-12 w-full bg-gray-100 text-gray-900">
      <div className="max-w-xl w-full bg-white rounded shadow p-8 text-gray-900">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Create New Itinerary
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
          <div>
            <label htmlFor="destination" className="block mb-1 font-medium">
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDestination(e.target.value)
              }
              className="border rounded px-3 py-2 w-full bg-white text-gray-900 text-base"
              placeholder="Enter destination"
            />
          </div>
          <div>
            <label htmlFor="start-date" className="block mb-1 font-medium">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartDate(e.target.value)
              }
              className="border rounded px-3 py-2 w-full bg-white text-gray-900 text-base"
              max={endDate || undefined}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block mb-1 font-medium">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEndDate(e.target.value)
              }
              className="border rounded px-3 py-2 w-full bg-white text-gray-900 text-base"
              min={startDate || undefined}
            />
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-900">
              Add Activities by selecting a day:
            </h4>
            <div className="flex gap-2 mb-2">
              <label htmlFor="new-day-date" className="sr-only">
                Add Day (date)
              </label>
              <input
                id="new-day-date"
                type="date"
                value={newDayDate}
                min={startDate || undefined}
                max={endDate || undefined}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewDayDate(e.target.value)
                }
                className="border rounded px-3 py-2 bg-white text-gray-900 text-base"
              />
              <button
                type="button"
                className="bg-blue-600 text-white px-3 py-2 rounded"
                onClick={handleAddDay}
              >
                Add Day
              </button>
            </div>
            <ul>
              {days.map((day, idx) => (
                <li key={day.date} className="mb-4 text-gray-900">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-gray-900">
                      {dayjs.utc(day.date).format("MMMM D, YYYY")}
                    </div>
                  </div>
                  <ul className="ml-4 text-gray-900">
                    {day.activities.length === 0 ? (
                      <li className="italic text-gray-500">
                        No activities yet. Add one below!
                      </li>
                    ) : (
                      day.activities.map((act, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="font-mono text-gray-900">
                            {act.time}
                          </span>{" "}
                          - {act.description}
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="flex gap-2 mt-2">
                    <label htmlFor={`activity-time-${idx}`} className="sr-only">
                      Activity Time
                    </label>
                    <input
                      id={`activity-time-${idx}`}
                      type="time"
                      value={activityInputs[idx]?.time || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setActivityInputs((prev) => ({
                          ...prev,
                          [idx]: { ...prev[idx], time: e.target.value },
                        }))
                      }
                      className="border rounded px-2 py-1 bg-white text-gray-900 text-base"
                    />
                    <label htmlFor={`activity-desc-${idx}`} className="sr-only">
                      Activity Description
                    </label>
                    <input
                      id={`activity-desc-${idx}`}
                      type="text"
                      value={activityInputs[idx]?.description || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setActivityInputs((prev) => ({
                          ...prev,
                          [idx]: { ...prev[idx], description: e.target.value },
                        }))
                      }
                      className="border rounded px-2 py-1 bg-white text-gray-900 text-base"
                      placeholder="Description"
                    />
                    <button
                      type="button"
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleAddActivity(idx)}
                    >
                      Add Activity
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Itinerary
          </button>
        </form>
      </div>
    </main>
  );
}
