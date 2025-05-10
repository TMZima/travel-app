import { sendSuccess, sendError } from "../apiResponse";
import { handleApiError } from "../apiErrorHandler";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("../errorHandler", () => ({
  handleApiError: jest.fn(),
}));

// Mock NextResponse.json
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, options) => ({ body, options })),
  },
}));

describe("apiResponse", () => {
  describe("sendSuccess", () => {
    it("should return a success response with default values", () => {
      const data = { key: "value" };

      const response = sendSuccess(data);

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          status: 200,
          message: "Operation successful",
          data,
        },
        { status: 200 }
      );
      expect(response).toEqual({
        body: {
          status: 200,
          message: "Operation successful",
          data,
        },
        options: { status: 200 },
      });
    });

    it("should return a success response with custom status and message", () => {
      const data = { key: "value" };
      const status = 201;
      const message = "Created successfully";

      const response = sendSuccess(data, status, message);

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          status,
          message,
          data,
        },
        { status }
      );
      expect(response).toEqual({
        body: {
          status,
          message,
          data,
        },
        options: { status },
      });
    });
  });

  describe("sendError", () => {
    it("should return an error response for a handled error", () => {
      const error = new Error("Handled error");
      (handleApiError as jest.Mock).mockReturnValue({
        status: 400,
        body: { message: "Handled error" },
      });

      const response = sendError(error);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Handled error" },
        { status: 400 }
      );
      expect(response).toEqual({
        body: { message: "Handled error" },
        options: { status: 400 },
      });
    });

    it("should log an error and return a 500 response for an internal server error", () => {
      const error = new Error("Internal server error");
      (handleApiError as jest.Mock).mockReturnValue({
        status: 500,
        body: { message: "Internal server error" },
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const response = sendError(error);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(consoleSpy).toHaveBeenCalledWith("Internal server error:", {
        message: "Internal server error",
      });
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Internal server error" },
        { status: 500 }
      );
      expect(response).toEqual({
        body: { message: "Internal server error" },
        options: { status: 500 },
      });

      consoleSpy.mockRestore();
    });
  });
});
