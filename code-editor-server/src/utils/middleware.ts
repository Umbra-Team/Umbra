import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Request, Response, NextFunction } from "express";
import { RequestWithUser, MiddlewareFunction } from "../types/types";
import User from "../models/User";
import Snippet from "../models/Snippet";
import { StatusCodes } from "http-status-codes";
import { UniqueTitleError } from "./errors";
import { UniqueConstraintError } from "sequelize";


/**
 * Middleware function to verify the JWT token in the Authorization header.
 * If the token is valid, the decoded user is attached to the request object.
 * If the token is not valid or not present, a 401 Unauthorized error is returned.
 * @param {RequestWithUser} req - The request object, should have a header Authorization with format 'Bearer {token}'
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export const verifyToken = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).send("Access denied.");

  // Split the Authorization header value by space
  const parts = authHeader.split(" ");

  // Check if the Authorization header has the correct format
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).send("Invalid Authorization header format.");
  }

  // Get the token part
  const token = parts[1];
  // console.log(`Token: ${token}`);

  try {
    const cognito = new CognitoIdentityServiceProvider();
    const params = { AccessToken: token };
    const result = await cognito.getUser(params).promise();
    console.log(`*** verifyToken: ${JSON.stringify(result)}`)

    req.user = result;
    next();
  } catch (error) {
    console.error(`verifyToken error: ${error}`);
    res.status(400).send("Invalid token.");
  }
};

/**
 * Middleware function to fetch the authenticated user from the database.
 * If the user is found, it is attached to the request object.
 * If the user is not found, a 404 Not Found error is returned.
 * @param {RequestWithUser} req - The request object, should have a user property (set by verifyToken middleware)
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export const fetchUser = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "User not authenticated" });
  }

  try {
    const username = req.user.Username;
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    req.userRecord = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware function to fetch a snippet by its ID from the database.
 * If the snippet is found and belongs to the authenticated user, it is attached to the request object.
 * If the snippet is not found, a 404 Not Found error is returned.
 * If the snippet does not belong to the authenticated user, a 403 Forbidden error is returned.
 * @param {RequestWithUser} req - The request object, should have a userRecord property (set by fetchUser middleware)
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export const fetchSnippet = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "User not authenticated" });
  }
  try {
    const { snippetId } = req.params;
    const snippet = await Snippet.findByPk(snippetId);
    if (!snippet) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Snippet not found" });
    }
    if (snippet.userId !== req.userRecord?.id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Snippet does not belong to user" });
    }
    req.snippet = snippet;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware function to handle async route handlers.
 * Catches any errors thrown in the route handler and passes them to the next middleware function.
 * If the error is a UniqueConstraintError, it is converted into a UniqueTitleError.
 * @param {Function} fn - The async route handler function
 * @returns {Function} - A new function that wraps the route handler function with error handling
 */
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next))
  .catch((err: any) => {
    if (err instanceof UniqueConstraintError) {
      throw new UniqueTitleError();
    } else {
      throw err;
    }
  })
  .catch(next);
};

/**
 * Middleware function to handle errors.
 * Logs the error stack trace and sends a response with an appropriate status code and error message.
 * If the error is a UniqueTitleError, a 400 Bad Request status code is returned.
 * For all other errors, a 500 Internal Server Error status code is returned.
 * @param {any} err - The error object
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  if (err instanceof UniqueTitleError) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};