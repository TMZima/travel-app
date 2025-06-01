import mongoose from "mongoose";
import { validateObjectId } from "../helperRepository";
import { BadRequestError } from "../customErrors";

jest.mock("mongoose", () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn(),
    },
  },
}));

describe("validateObjectId", () => {
  const errorMessage = "Invalid ID";

  it("does not throw if ObjectId is valid", () => {
    (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
    expect(() =>
      validateObjectId("507f1f77bcf86cd799439011", errorMessage)
    ).not.toThrow();
  });

  it("throws BadRequestError if ObjectId is invalid", () => {
    (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(false);
    expect(() => validateObjectId("notanid", errorMessage)).toThrow(
      BadRequestError
    );
    expect(() => validateObjectId("notanid", errorMessage)).toThrow(
      errorMessage
    );
  });
});
