import { getJwtSecret } from "../helperService";
import { ConfigurationError } from "../customErrors";

describe("getJwtSecret", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("returns the JWT secret if set", () => {
    process.env.JWT_SECRET = "supersecret";
    expect(getJwtSecret()).toBe("supersecret");
  });

  it("throws ConfigurationError if JWT secret is not set", () => {
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow(ConfigurationError);
    expect(() => getJwtSecret()).toThrow(
      "JWT secret is not set in environment variables"
    );
  });
});
