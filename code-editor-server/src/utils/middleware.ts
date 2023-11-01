import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Request, Response, NextFunction } from "express";
import { RequestWithUser, MiddlewareFunction } from "../types/types";

export const verifyToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).send("Access denied.");

  // Split the Authorization header value by space
  const parts = authHeader.split(' ');

  // Check if the Authorization header has the correct format
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
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
