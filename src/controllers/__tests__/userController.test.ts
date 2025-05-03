import {
  registerUser,
  loginUser,
  resetPassword,
  getUser,
  updateUser,
  deleteUser,
  getFriends,
  addFriend,
  removeFriend,
} from "../userController";
import {
  registerUserService,
  getUserService,
  updateUserService,
  deleteUserService,
} from "@/services/users/userService";
import {
  loginUserService,
  resetPasswordService,
} from "@/services/users/authService";
import {
  getFriendsService,
  addFriendService,
  removeFriendService,
} from "@/services/users/friendService";
import { sendSuccess, sendError } from "@/utils/apiResponse";

jest.mock("@/services/users/userService");
jest.mock("@/services/users/authService");
jest.mock("@/services/users/friendService");
jest.mock("@/utils/apiResponse");

describe("userController", () => {
  const mockRequest = (body = {}, query = {}, params = {}) => ({
    json: jest.fn().mockResolvedValue(body),
    query,
    params,
  });

  const mockError = new Error("Something went wrong");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: "registerUser",
      controller: registerUser,
      service: registerUserService,
      input: {
        username: "testuser",
        email: "test@example.com",
        password: "Password1!",
      },
      successResponse: { id: "123", username: "testuser" },
      successStatus: 201,
      errorLine: 33,
    },
    {
      name: "loginUser",
      controller: loginUser,
      service: loginUserService,
      input: { email: "test@example.com", password: "Password1!" },
      successResponse: { token: "jwt-token" },
      errorLine: 42,
    },
    {
      name: "resetPassword",
      controller: resetPassword,
      service: resetPasswordService,
      input: { email: "test@example.com", newPassword: "NewPassword1!" },
      successResponse: { message: "Password reset successful" },
      errorLine: 51,
    },
    {
      name: "getUser",
      controller: getUser,
      service: getUserService,
      input: {},
      query: { id: "123" },
      successResponse: { id: "123", username: "testuser" },
      errorLine: 60,
    },
    {
      name: "updateUser",
      controller: updateUser,
      service: updateUserService,
      input: { username: "updateduser" },
      params: { id: "123" },
      successResponse: { id: "123", username: "updateduser" },
      errorLine: 69,
    },
    {
      name: "deleteUser",
      controller: deleteUser,
      service: deleteUserService,
      input: {},
      params: { id: "123" },
      successResponse: { message: "User deleted successfully" },
      errorLine: 78,
    },
    {
      name: "getFriends",
      controller: getFriends,
      service: getFriendsService,
      input: {},
      params: { id: "123" },
      successResponse: [{ id: "456", username: "friend1" }],
      errorLine: 87,
    },
    {
      name: "addFriend",
      controller: addFriend,
      service: addFriendService,
      input: {},
      params: { id: "123", friendId: "456" },
      successResponse: { message: "Friend added successfully" },
      errorLine: 96,
    },
    {
      name: "removeFriend",
      controller: removeFriend,
      service: removeFriendService,
      input: {},
      params: { id: "123", friendId: "456" },
      successResponse: { message: "Friend removed successfully" },
    },
  ];

  testCases.forEach(
    ({
      name,
      controller,
      service,
      input,
      query,
      params,
      successResponse,
      successStatus = 200,
      errorLine,
    }) => {
      it(`should handle ${name} successfully`, async () => {
        const req = mockRequest(input, query, params);

        (service as jest.Mock).mockResolvedValue(successResponse);
        (sendSuccess as jest.Mock).mockReturnValue({
          status: successStatus,
          data: successResponse,
        });

        const result = await controller(req as any);

        expect(service).toHaveBeenCalledWith(req);
        expect(sendSuccess).toHaveBeenCalledWith(
          successResponse,
          successStatus
        );
        expect(result).toEqual({
          status: successStatus,
          data: successResponse,
        });
      });

      if (errorLine) {
        it(`should handle errors in ${name} (line ${errorLine})`, async () => {
          const req = mockRequest(input, query, params);

          (service as jest.Mock).mockRejectedValue(mockError);
          (sendError as jest.Mock).mockReturnValue({
            status: 500,
            error: mockError.message,
          });

          const result = await controller(req as any);

          expect(service).toHaveBeenCalledWith(req);
          expect(sendError).toHaveBeenCalledWith(mockError);
          expect(result).toEqual({ status: 500, error: mockError.message });
        });
      }
    }
  );
});
