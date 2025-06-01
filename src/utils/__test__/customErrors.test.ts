import {
  AppError,
  MongooseValidationError,
  ConfigurationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} from "../customErrors";

describe("AppError", () => {
  it("sets message, statusCode, and userMessage", () => {
    const err = new AppError("msg", 418, "user msg");
    expect(err.message).toBe("msg");
    expect(err.statusCode).toBe(418);
    expect(err.userMessage).toBe("user msg");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });
});

describe("MongooseValidationError", () => {
  it("formats mongoose validation error messages", () => {
    const fakeMongooseError = {
      errors: {
        field1: { message: "Field1 is required" },
        field2: { message: "Field2 must be a number" },
      },
    } as any;
    const err = new MongooseValidationError(fakeMongooseError);
    expect(err.message).toBe("Validation failed");
    expect(err.statusCode).toBe(400);
    expect(err.userMessage).toContain("Field1 is required");
    expect(err.userMessage).toContain("Field2 must be a number");
  });
});

describe("ConfigurationError", () => {
  it("sets default messages and status", () => {
    const err = new ConfigurationError();
    expect(err.message).toBe("Configuration error");
    expect(err.statusCode).toBe(500);
    expect(err.userMessage).toMatch(/internal server error/i);
  });
  it("allows custom messages", () => {
    const err = new ConfigurationError("Custom", "User");
    expect(err.message).toBe("Custom");
    expect(err.userMessage).toBe("User");
  });
});

describe("NotFoundError", () => {
  it("sets default messages and status", () => {
    const err = new NotFoundError();
    expect(err.message).toBe("Resource not found");
    expect(err.statusCode).toBe(404);
    expect(err.userMessage).toMatch(/could not be found/i);
  });
  it("allows custom messages", () => {
    const err = new NotFoundError("Custom", "User");
    expect(err.message).toBe("Custom");
    expect(err.userMessage).toBe("User");
  });
});

describe("ConflictError", () => {
  it("sets default messages and status", () => {
    const err = new ConflictError();
    expect(err.message).toBe("Conflict occurred");
    expect(err.statusCode).toBe(409);
    expect(err.userMessage).toMatch(/already registered/i);
  });
  it("allows custom messages", () => {
    const err = new ConflictError("Custom", "User");
    expect(err.message).toBe("Custom");
    expect(err.userMessage).toBe("User");
  });
});

describe("UnauthorizedError", () => {
  it("sets default messages and status", () => {
    const err = new UnauthorizedError();
    expect(err.message).toBe("Unauthorized access");
    expect(err.statusCode).toBe(401);
    expect(err.userMessage).toMatch(/invalid email or password/i);
  });
  it("allows custom messages", () => {
    const err = new UnauthorizedError("Custom", "User");
    expect(err.message).toBe("Custom");
    expect(err.userMessage).toBe("User");
  });
});

describe("BadRequestError", () => {
  it("sets default messages and status", () => {
    const err = new BadRequestError();
    expect(err.message).toBe("Bad request");
    expect(err.statusCode).toBe(400);
    expect(err.userMessage).toMatch(/invalid request data/i);
  });
  it("allows custom messages", () => {
    const err = new BadRequestError("Custom", "User");
    expect(err.message).toBe("Custom");
    expect(err.userMessage).toBe("User");
  });
});
