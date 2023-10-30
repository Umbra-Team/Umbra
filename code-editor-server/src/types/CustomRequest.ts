import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Request } from 'express';

export interface CustomRequest extends Request {
    user?: CognitoIdentityServiceProvider.GetUserResponse;
  }