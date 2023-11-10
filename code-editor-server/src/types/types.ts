import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Snippet from '../models/Snippet';

export interface RequestWithUser extends Request {
    user?: CognitoIdentityServiceProvider.GetUserResponse;
    userRecord?: User;
    snippet?: Snippet;
  }
  
export type MiddlewareFunction = (req: RequestWithUser, res: Response, next: NextFunction) => void;