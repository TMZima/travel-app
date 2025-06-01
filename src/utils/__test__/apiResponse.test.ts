import { sendSuccess, sendError } from "../apiResponse";
import { NextResponse } from "next/server";
import * as apiErrorHandler from "../apiErrorHandler";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, options) => ({
      body,
      options,
    })),
  },
}));

describe("apiResponse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendSuccess", () => {
    it("returns a success response with default values", () => {
      const data = { foo: "bar" };
      const result = sendSuccess(data);

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          status: 200,
          message: "Operation successful",
          data,
        },
        { status: 200 }
      );
      expect(result).toEqual({
        body: {
          status: 200,
          message: "Operation successful",
          data,
        },
        options: { status: 200 },
      });
    });

    it("returns a success response with custom status and message", () => {
      const data = { foo: "bar" };
      const result = sendSuccess(data, 201, "Created!");
      const resultAny = result as any;

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          status: 201,
          message: "Created!",
          data,
        },
        { status: 201 }
      );
      expect(resultAny.body.status).toBe(201);
      expect(resultAny.body.message).toBe("Created!");
    });
  });

  describe("sendError", () => {
    it("returns an error response from handleApiError", () => {
      jest.spyOn(apiErrorHandler, "handleApiError").mockReturnValue({
        status: 400,
        body: {
          message: "Bad request",
          status: 400,
          code: "BadRequestError",
        },
      });

      const result = sendError(new Error("fail"));
      const resultAny = result as any;

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Bad request", status: 400, code: "BadRequestError" },
        { status: 400 }
      );
      expect(resultAny.body.status).toBe(400);
      expect(resultAny.body.message).toBe("Bad request");
      expect(resultAny.body.code).toBe("BadRequestError");
    });

    it("logs internal server error for status 500", () => {
      const spy = jest.spyOn(console, "error").mockImplementation();
      jest.spyOn(apiErrorHandler, "handleApiError").mockReturnValue({
        status: 500,
        body: {
          message: "Internal error",
          status: 500,
          stackTrace: "Error stack trace",
        },
      });

      sendError(new Error("fail"));

      expect(spy).toHaveBeenCalledWith("Internal server error:", {
        message: "Internal error",
        status: 500,
        stackTrace: "Error stack trace",
      });
      spy.mockRestore();
    });
  });
});
