import mongoose from "mongoose";
import { Itinerary } from "../itineraryModel";

describe("Itinerary Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb");
  });

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Itinerary.deleteMany({});
  });

  it("should create a valid itinerary document", async () => {
    const itinerary = new Itinerary({
      createdBy: new mongoose.Types.ObjectId(), // Mock User ID
      title: "Summer Vacation",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-15"),
      accommodations: [new mongoose.Types.ObjectId()], // Mock Accommodation IDs
      pointsOfInterest: [new mongoose.Types.ObjectId()], // Mock Point of Interest IDs
      sharedWith: [new mongoose.Types.ObjectId()], // Mock User IDs
      uploadedEmails: "example@example.com",
    });

    const savedItinerary = await itinerary.save();

    expect(savedItinerary._id).toBeDefined();
    expect(savedItinerary.createdBy).toBeDefined();
    expect(savedItinerary.title).toBe("Summer Vacation");
    expect(savedItinerary.startDate).toEqual(new Date("2025-06-01"));
    expect(savedItinerary.endDate).toEqual(new Date("2025-06-15"));
    expect(savedItinerary.accommodations.length).toBe(1);
    expect(savedItinerary.pointsOfInterest.length).toBe(1);
    expect(savedItinerary.sharedWith.length).toBe(1);
    expect(savedItinerary.uploadedEmails).toBe("example@example.com");
    expect(savedItinerary.createdAt).toBeDefined();
    expect(savedItinerary.updatedAt).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const itinerary = new Itinerary({
      title: "Summer Vacation",
    });

    let error: mongoose.Error.ValidationError | undefined;
    try {
      await itinerary.save();
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error!.errors.createdBy).toBeDefined();
    expect(error!.errors.startDate).toBeDefined();
    expect(error!.errors.endDate).toBeDefined();
  });

  it("should allow saving without optional fields", async () => {
    const itinerary = new Itinerary({
      createdBy: new mongoose.Types.ObjectId(), // Mock User ID
      title: "Summer Vacation",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-15"),
    });

    const savedItinerary = await itinerary.save();

    expect(savedItinerary._id).toBeDefined();
    expect(savedItinerary.uploadedEmails).toBeUndefined();
    expect(savedItinerary.accommodations.length).toBe(0);
    expect(savedItinerary.pointsOfInterest.length).toBe(0);
    expect(savedItinerary.sharedWith.length).toBe(0);
  });

  it("should automatically set timestamps", async () => {
    const itinerary = new Itinerary({
      createdBy: new mongoose.Types.ObjectId(), // Mock User ID
      title: "Summer Vacation",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-15"),
    });

    const savedItinerary = await itinerary.save();

    expect(savedItinerary.createdAt).toBeDefined();
    expect(savedItinerary.updatedAt).toBeDefined();
    expect(savedItinerary.createdAt).toBeInstanceOf(Date);
    expect(savedItinerary.updatedAt).toBeInstanceOf(Date);
  });

  it("should allow adding multiple accommodations, points of interest, and shared users", async () => {
    const itinerary = new Itinerary({
      createdBy: new mongoose.Types.ObjectId(), // Mock User ID
      title: "Summer Vacation",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-15"),
      accommodations: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ], // Mock Accommodation IDs
      pointsOfInterest: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ], // Mock Point of Interest IDs
      sharedWith: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ], // Mock User IDs
    });

    const savedItinerary = await itinerary.save();

    expect(savedItinerary.accommodations.length).toBe(2);
    expect(savedItinerary.pointsOfInterest.length).toBe(2);
    expect(savedItinerary.sharedWith.length).toBe(2);
  });
});
