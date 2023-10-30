import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/CustomRequest";

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied.");

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
