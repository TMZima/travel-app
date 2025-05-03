import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "@/models/userModel"; // Adjust path as needed
import bcrypt from "bcryptjs";

let mongoServer: MongoMemoryServer;
let Itinerary: mongoose.Model<any>;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    dbName: "jestDB",
  });

  // Define a simple Itinerary model for testing
  const itinerarySchema = new mongoose.Schema({
    name: String,
    description: String,
  });
  Itinerary = mongoose.model("Itinerary", itinerarySchema);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await Itinerary.deleteMany({});
});

describe("User Model", () => {
  it("should create and save a user successfully", async () => {
    const validUser = new User({
      username: "testuser",
      email: "test@example.com",
      password: "Password1!",
    });

    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe("testuser");
    expect(savedUser.email).toBe("test@example.com");
    expect(savedUser.password).not.toBe("Password1!"); // Should be hashed
  });

  it("should fail validation for invalid email", async () => {
    const invalidUser = new User({
      username: "bademailuser",
      email: "not-an-email",
      password: "Password1!",
    });

    await expect(invalidUser.save()).rejects.toThrow();
  });

  it("should fail validation for weak password", async () => {
    const invalidUser = new User({
      username: "weakpassuser",
      email: "user@example.com",
      password: "weakpass",
    });

    await expect(invalidUser.save()).rejects.toThrow();
  });

  it("should paginate friends correctly", async () => {
    const user1 = await new User({
      username: "user1",
      email: "user1@example.com",
      password: "Password1!",
    }).save();

    // Create 15 actual User documents
    const friendUsers = await Promise.all(
      Array.from({ length: 15 }, (_, i) =>
        new User({
          username: `friend${i}`,
          email: `friend${i}@example.com`,
          password: "Password1!",
        }).save()
      )
    );

    const friendIds = friendUsers.map((friend) => friend._id);

    user1.friends = friendIds;
    await user1.save();

    const result = await User.getPaginatedFriends(user1._id.toString(), 2, 5);

    expect(result.data.length).toBe(5);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.total).toBe(15);
  });

  it("should paginate itineraries correctly", async () => {
    const user1 = await new User({
      username: "user2",
      email: "user2@example.com",
      password: "Password1!",
    }).save();

    const itinerary1 = await Itinerary.create({
      name: "Itinerary 1",
      description: "Description 1",
    });
    const itinerary2 = await Itinerary.create({
      name: "Itinerary 2",
      description: "Description 2",
    });

    user1.itineraries = [itinerary1._id, itinerary2._id];
    await user1.save();

    const result = await User.getPaginatedItineraries(
      user1._id.toString(),
      1,
      1
    );
    expect(result.data.length).toBe(1); // Limit is 1
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
    expect(result.total).toBe(2);
  });

  it("should not hash password if not modified", async () => {
    const user = new User({
      username: "nohashuser",
      email: "nohash@example.com",
      password: "Password1!",
    });
    await user.save();

    const originalPassword = user.password;
    user.username = "updateduser";
    await user.save();

    expect(user.password).toBe(originalPassword);
  });

  it("should handle error during password hashing", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const genSaltSpy = jest
      .spyOn(bcrypt, "genSalt")
      .mockRejectedValue(new Error("Salt error") as never);

    const user = new User({
      username: "erroruser",
      email: "error@example.com",
      password: "Password1!",
    });

    await expect(user.save()).rejects.toThrow(
      "An error occurred while securing your password"
    );

    genSaltSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it("should return empty friends list if user not found", async () => {
    const result = await User.getPaginatedFriends(
      new mongoose.Types.ObjectId().toString(),
      1,
      5
    );
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("should return empty itineraries list if user not found", async () => {
    const result = await User.getPaginatedItineraries(
      new mongoose.Types.ObjectId().toString(),
      1,
      5
    );
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });
});
