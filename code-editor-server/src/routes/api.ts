// routes/api.ts
import express, { Request, Response, NextFunction } from "express";
import { verifyToken, fetchUser, fetchSnippet, asyncHandler } from "../utils/middleware";
import { getOrCreateDoc } from "@y-sweet/sdk";
import { CONNECTION_STRING } from "../utils/constants";
import { StatusCodes } from "http-status-codes";
import Snippet from "../models/Snippet";
import User from "../models/User";
import sequelize from "../utils/sequelize";
import { RequestWithUser } from "../types/types";
import { syncUsers } from "../scripts/syncUsers";
import { generateRandomName } from "../utilities/generateRandomName";
import axios from "axios";
import AWS from 'aws-sdk';
import { UniqueConstraintError } from "sequelize";
import { UniqueTitleError } from "../utils/errors";

AWS.config.update({region: 'us-west-2'});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

// const CODE_EXECUTION_ENDPOINT = 'http://35.81.242.17:2000/api/v2/execute';

const router = express.Router();

router.get("/get-token/:docId", async (req, res) => {
  let docId: string | undefined = req.params.docId;
  if (docId === "default") {
    docId = undefined;
  }
  const clientToken = await getOrCreateDoc(docId, CONNECTION_STRING);
  res.json({ clientToken });
});

// AUTHENTICATION

router.post("/auth/login", async (req, res) => {
  // Authenticate user and generate JWT
  const { username, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: '3rlpf4ht955dmfkb83oh24nf46',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    },
  };

  cognitoidentityserviceprovider.initiateAuth(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return res.status(500).json({ error: err });
    } else {
      console.log(data);
      // return status code 200 and the token
      return res.status(200).json({ token: data.AuthenticationResult?.AccessToken });
      // res.json({ token: data.AuthenticationResult?.AccessToken });
    }
  });
  // Send JWT in response
});

router.post("/auth/logout", async (req, res) => {
  // Invalidate JWT
});

/*
- `GET /snippets`: List snippets for authenticated user
- `POST /snippets`: Save new snippet
- `GET /snippets/:snippetId`: Retrieve snippet details
- `PATCH /snippets/:snippetId`: Update snippet
- `DELETE /snippets/:snippetId`: Delete snippet

  DEVELOPMENT ONLY:
- `GET /snippetsNoAuth`: List all snippets (no auth required)
- `POST /snippetCreateRandom`: 
      Create a snippet (for current user in request body pulled out by middleware)
      with random title and code "console.log('Hello <random name>');"
*/

/**
 * Get all snippets for a user
 * @route GET /users/snippets
 * @requires Authentication header
 * @returns {Snippet[]} - array of snippets
 */
router.get(
  "/snippets",
  verifyToken,
  fetchUser,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const snippets = await Snippet.findAll({ where: { userId: req.userRecord?.id } });
      return res.status(200).json(snippets);
    } catch (err) {
      next(err);
    }
  }
);



router.post(
  "/snippets",
  verifyToken,
  fetchUser,
  asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { title, code, language } = req.body;
    console.log(`/snippets: title=${title}, code=${code}`);

    const snippet = await Snippet.create({ 
      title, 
      code, 
      language, 
      userId: req.userRecord?.id
    });
    res.json(snippet);
  })
);

// get a single snippet
router.get(
  "/snippets/:snippetId",
  verifyToken,
  fetchUser,
  fetchSnippet,
  (req: RequestWithUser, res: Response) => {
    res.status(200).json(req.snippet);
  }
);

// PATCH /snippets/:id
router.patch(
  "/snippets/:snippetId",
  verifyToken,
  fetchUser,
  fetchSnippet,
  asyncHandler(async (req: RequestWithUser, res: Response) => {
    const [numberOfAffectedRows, affectedRows] = await Snippet.update(
      req.body,
      {
        where: { id: req.snippet!.id },
        returning: true,
      }
    );

    if (numberOfAffectedRows > 0) {
      res.json(affectedRows[0]);
    } else {
      res.status(404).json({ error: "Snippet not found" });
    }
  })
);

// DELETE /snippets/:id
router.delete(
  "/snippets/:snippetId",
  verifyToken,
  fetchUser,
  fetchSnippet,
  asyncHandler(async (req: RequestWithUser, res: Response) => {
    const numberOfDestroyedRows = await Snippet.destroy({
      where: { id: req.snippet!.id },
    });
    if (numberOfDestroyedRows > 0) {
      res.status(204).end();
    } else {
      res.status(404).send("Snippet not found");
    }
  })
);

// This is for testing and development:
router.get("/snippetsNoAuth", async (req: Request, res: Response) => {
  const snippets = await Snippet.findAll();
  res.json(snippets);
});

// Sync Cognito users to local DB
router.get("/syncUsers", async (req: Request, res: Response) => {
  try {
    await syncUsers();
    res.send();
  } catch (error) {
    res.status(500).send("Error syncing local users with cognito users");
  }
});

// Code Execution
router.post("/runCode", async (req: Request, res: Response) => {
  if (!process.env.CODE_EXECUTION_ENDPOINT) {
    throw new Error("CODE_EXECUTION_ENDPOINT is missing");
  }

  console.log(JSON.stringify(req.body));
  const response = await axios.post(
    process.env.CODE_EXECUTION_ENDPOINT,
    req.body
  );
  res.json(response.data);
});

// create a random snippet and enter into database
router.post("/snippetCreateRandom", 
  verifyToken, 
  fetchUser,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
  // from fetchUser middleware, req.userRecord has all the user info
  const randTitle = Math.random().toString(36).substring(7);
  const code = `console.log("Hello, ${generateRandomName()}");`;

  try {
    if (req.userRecord) {
      const snippet = await Snippet.create({
        title: randTitle,
        code: code,
        language: "javascript",
        userId: req.userRecord.id,
      });
      res.json(snippet);
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    next(err);
  }
});

export default router;
