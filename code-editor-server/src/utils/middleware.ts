import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Request, Response, NextFunction } from "express";
import { RequestWithUser, MiddlewareFunction } from "../types/types";
import User from "../models/User";
import Snippet from "../models/Snippet";
import { StatusCodes } from "http-status-codes";
import { UniqueTitleError } from "./errors";
import { UniqueConstraintError } from "sequelize";


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
  console.log(`Token: ${token}`);

  try {
    const cognito = new CognitoIdentityServiceProvider();
    const params = { AccessToken: token };
    const result = await cognito.getUser(params).promise();

    req.user = result;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

/**
 *
 * @param req RequestWithUser - extends Request, should have user property
 * @param res
 * @param next
 * If the user property is not set, return a 401 error
 * If the user property is set, find the user in the database and set the userRecord property
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