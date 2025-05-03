import mongoose from "mongoose";
import { dbConnect } from "../db";

jest.mock("mongoose");

describe("dbConnect", () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (mongoose.connection as any) = { readyState: 0 };
  });

  it("should not attempt to connect if already connected", async () => {
    (mongoose.connection.readyState as number) = 1; // Simulate already connected state

    await dbConnect();

    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it("should connect to MongoDB if not already connected", async () => {
    (mongoose.connection.readyState as number) = 0; // Simulate disconnected state
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});

    await dbConnect();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if connection fails", async () => {
    (mongoose.connection.readyState as number) = 0; // Simulate disconnected state
    const mockError = new Error("Connection failed");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(dbConnect()).rejects.toThrow("Database connection failed");

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });
});
