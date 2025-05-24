import { NextRequest } from "next/server";
import {
  getAccommodation,
  updateAccommodation,
  deleteAccommodation,
} from "@/controllers/accommodationController";

/**
 * Handles the GET request to fetch an accommodation by ID.
 * Delegates the request to the 'getAccommodation' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @param {{ params: { id: string } }} context - The request context containing route parameters.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export const GET = (
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> => {
  return getAccommodation(req, context);
};

/**
 * Handles the PUT request to update an accommodation by ID.
 * Delegates the request to the 'updateAccommodation' controller.
 *
 * @param {NextRequest} req - The incoming HTTP request object.
 * @param {{ params: { id: string } }} context - The request context containing route parameters.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export const PUT = (
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> => {
  return updateAccommodation(req, context);
};

/**
 * Handles the DELETE request to remove an accommodation by ID.
 * Delegates the request to the 'deleteAccommodation' controller.
 *
 * @param req - The incoming HTTP request object.
 * @param {{ params: { id: string } }} context - The request context containing route parameters.
 * @returns {Promise<Response>} - The response returned by the controller.
 */
export const DELETE = (
  req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> => {
  return deleteAccommodation(req, context);
};
