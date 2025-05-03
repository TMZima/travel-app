import mongoose from "mongoose";
import { PointOfInterest } from "../pointsOfInterestModel";

describe("PointOfInterest Model", () => {
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
    await PointOfInterest.deleteMany({});
  });

  it("should create a valid point of interest document", async () => {
    const pointOfInterest = new PointOfInterest({
      name: "Central Park",
      location: "New York",
      description: "A large public park in New York City.",
      belongsTo: new mongoose.Types.ObjectId(), // Mock Itinerary ID
    });

    const savedPointOfInterest = await pointOfInterest.save();

    expect(savedPointOfInterest._id).toBeDefined();
    expect(savedPointOfInterest.name).toBe("Central Park");
    expect(savedPointOfInterest.location).toBe("New York");
    expect(savedPointOfInterest.description).toBe(
      "A large public park in New York City."
    );
    expect(savedPointOfInterest.belongsTo).toBeDefined();
    expect(savedPointOfInterest.createdAt).toBeDefined();
    expect(savedPointOfInterest.editedAt).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const pointOfInterest = new PointOfInterest({
      description: "A large public park in New York City.",
    });

    let error: mongoose.Error.ValidationError | undefined;
    try {
      await pointOfInterest.save();
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        error = err;
      }
    }

    expect(error).toBeDefined();
    expect(error!.errors.name).toBeDefined();
    expect(error!.errors.location).toBeDefined();
    expect(error!.errors.belongsTo).toBeDefined();
  });

  it("should allow saving without optional fields", async () => {
    const pointOfInterest = new PointOfInterest({
      name: "Central Park",
      location: "New York",
      belongsTo: new mongoose.Types.ObjectId(), // Mock Itinerary ID
    });

    const savedPointOfInterest = await pointOfInterest.save();

    expect(savedPointOfInterest._id).toBeDefined();
    expect(savedPointOfInterest.description).toBeUndefined();
  });

  it("should automatically set timestamps", async () => {
    const pointOfInterest = new PointOfInterest({
      name: "Central Park",
      location: "New York",
      description: "A large public park in New York City.",
      belongsTo: new mongoose.Types.ObjectId(), // Mock Itinerary ID
    });

    const savedPointOfInterest = await pointOfInterest.save();

    expect(savedPointOfInterest.createdAt).toBeDefined();
    expect(savedPointOfInterest.editedAt).toBeDefined();
    expect(savedPointOfInterest.createdAt).toBeInstanceOf(Date);
    expect(savedPointOfInterest.editedAt).toBeInstanceOf(Date);
  });
});
