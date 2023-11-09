import request from "supertest";
import app from "../../src/server"; // import your express app
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { verifyToken, fetchUser, fetchSnippet } from "../utils/middleware";
import { RequestWithUser } from "../types/types";
import { Application } from "express";
import supertest from "supertest";
import User from "../models/User";
import Snippet from "../models/Snippet";

jest.setTimeout(30000); // 30 second timeout

jest.mock("aws-sdk", () => {
    return {
      CognitoIdentityServiceProvider: jest.fn().mockImplementation(() => {
        return {
          getUser: jest.fn().mockImplementation((params) => {
            return {
              promise: jest.fn().mockImplementation(() => {
                if (params.AccessToken === "validToken") {
                  return Promise.resolve({ Username: "testUser" });
                } else {
                  return Promise.reject(new Error("Invalid token."));
                }
              }),
            };
          }),
        };
      }),
      config: {
        update: jest.fn(),
      },
    };
  });

describe("middleware", () => {
  describe("verifyToken", () => {
    it("sets req.user if the token is valid", async () => {
      const req = {
        header: () => "Bearer validToken",
      } as unknown as RequestWithUser;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const next = jest.fn();

      await verifyToken(req, res, next);
      console.log(`Test: req.user = ${JSON.stringify(req.user)}`);

      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it("returns an error if the token is invalid", async () => {
      const req = {
        header: () => "Bearer invalidToken",
      } as unknown as RequestWithUser;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const next = jest.fn();

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid token.");
    });
  });

    describe('fetchUser', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('sets req.userRecord if the user is found', async () => {
        // Mock User.findOne to return a user
        jest.spyOn(User, 'findOne').mockImplementation(() => 
          Promise.resolve({ id: 1, username: 'testUser' }) as any);
    
        const req = { user: { Username: 'testUser' } } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();
    
        await fetchUser(req, res, next);
    
        expect(req.userRecord).toBeDefined();
        expect(next).toHaveBeenCalled();
      });
    
      it('returns an error if the user is not found', async () => {
        // Mock User.findOne to return null
        jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(null));
    
        const req = { user: { Username: 'testUser' } } as any;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        const next = jest.fn();
    
        await fetchUser(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      });
  });
});
