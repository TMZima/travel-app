import mongoose from "mongoose";
import { Accommodation } from "../accommodationModel";

describe("Accommodation Model", () => {
  beforeAll(async () => {
    // Connect to an in-memory MongoDB instance for testing
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb");
  });

  afterAll(async () => {
    // Disconnect and clean up the database
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clear the Accommodation collection after each test
    await Accommodation.deleteMany({});
  });

  it("should create a valid accommodation document", async () => {
    const accommodation = new Accommodation({
      type: "Hotel",
      name: "Grand Hotel",
      address: "123 Main St",
      confirmationNumber: "ABC123",
      checkInDate: new Date("2025-05-01"),
      checkOutDate: new Date("2025-05-05"),
      location: "New York",
      belongsTo: new mongoose.Types.ObjectId(), // Mock Itinerary ID
    });

    const savedAccommodation = await accommodation.save();

    expect(savedAccommodation._id).toBeDefined();
    expect(savedAccommodation.type).toBe("Hotel");
    expect(savedAccommodation.name).toBe("Grand Hotel");
    expect(savedAccommodation.address).toBe("123 Main St");
    expect(savedAccommodation.confirmationNumber).toBe("ABC123");
    expect(savedAccommodation.checkInDate).toEqual(new Date("2025-05-01"));
    expect(savedAccommodation.checkOutDate).toEqual(new Date("2025-05-05"));
    expect(savedAccommodation.location).toBe("New York");
    expect(savedAccommodation.belongsTo).toBeDefined();
    expect(savedAccommodation.createdAt).toBeDefined();
    expect(savedAccommodation.editedAt).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const accommodation = new Accommodation({
      name: "Grand Hotel",
      address: "123 Main St",
    });

    let error: any;
    try {
      await accommodation.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.type).toBeDefined();
    expect(error.errors.checkInDate).toBeDefined();
    expect(error.errors.checkOutDate).toBeDefined();
    expect(error.errors.location).toBeDefined();
    expect(error.errors.belongsTo).toBeDefined();
  });

  it("should allow saving without optional fields", async () => {
    const accommodation = new Accommodation({
      type: "Hotel",
      name: "Grand Hotel",
      address: "123 Main St",
      checkInDate: new Date("2025-05-01"),
      checkOutDate: new Date("2025-05-05"),
      location: "New York",
      belongsTo: new mongoose.Types.ObjectId(), // Mock Itinerary ID
    });

    const savedAccommodation = await accommodation.save();

    expect(savedAccommodation._id).toBeDefined();
    expect(savedAccommodation.confirmationNumber).toBeUndefined();
  });

  it("should automatically set timestamps", async () => {
    const accommodation = new Accommodation({
      type: "Hotel",
      name: "Grand Hotel",
      address: "123 Main St",
      confirmationNumber: "ABC123",
      checkInDate: new Date("2025-05-01"),
      checkOutDate: new Date("2025-05-05"),
      location: "New York",
      belongsTo: new mongoose.Types.ObjectId(), // Mock Itinerary ID
    });

    const savedAccommodation = await accommodation.save();

    expect(savedAccommodation.createdAt).toBeDefined();
    expect(savedAccommodation.editedAt).toBeDefined();
    expect(savedAccommodation.createdAt).toBeInstanceOf(Date);
    expect(savedAccommodation.editedAt).toBeInstanceOf(Date);
  });
});
