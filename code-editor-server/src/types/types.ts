import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';

export interface RequestWithUser extends Request {
    user?: CognitoIdentityServiceProvider.GetUserResponse;
  }
  
export type MiddlewareFunction = (req: RequestWithUser, res: Response, next: NextFunction) => void;