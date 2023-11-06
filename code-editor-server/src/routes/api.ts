// routes/api.ts
import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/middleware";
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
      res.status(500).json({ error: err });
    } else {
      console.log(data);
      res.json({ token: data.AuthenticationResult?.AccessToken });
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
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    console.log(`req.user: ${JSON.stringify(req.user)}`);
    const username = req.user.Username;
    console.log(`username: ${username}`);
    const user = await User.findOne({ where: { username: username } });
    console.log(`user: ${JSON.stringify(user)}`);
    const snippets = await Snippet.findAll({ where: { userId: user?.id } });

    return res.json(snippets);
  }
);

// add a new snippet to user's library
router.post(
  "/snippets",
  verifyToken,
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const { title, code } = req.body;
    console.log(`/snippets: title=${title}, code=${code}`);

    const username = req.user.Username;
    const user = await User.findOne({ where: { username: req.user.Username } });
    const userId = user?.id;
    const snippet = await Snippet.create({ title, code, userId });
    res.json(snippet);
  }
);

// get a single snippet
router.get(
  "/snippets/:snippetId",
  verifyToken,
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    const username = req.user.Username;
    const user = await User.findOne({ where: { username: username } });
    console.log(`user: ${JSON.stringify(user)}`);

    try {
      const { snippetId } = req.params;
      const snippet = await Snippet.findByPk(snippetId);
      if (!snippet) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Snippet not found" });
      }
      if (snippet.userId !== user?.id) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "Snippet does not belong to user" });
      }

      res.json(snippet);
    } catch (err) {
      const error = err as Error;
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
);

// PATCH /snippets/:id
router.patch(
  "/snippets/:snippetId",
  verifyToken,
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    try {
      const username = req.user.Username;
      const user = await User.findOne({ where: { username: username } });
      const { snippetId } = req.params;
      const snippet = await Snippet.findByPk(snippetId);
      console.log(`PATCH: snippetId = ${snippetId}`);

      if (!snippet) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Snippet not found" });
      }

      if (snippet.userId !== user?.id) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "Snippet does not belong to user" });
      }

      const [numberOfAffectedRows, affectedRows] = await Snippet.update(
        req.body,
        {
          where: { id: snippet.id },
          returning: true,
        }
      );

      if (numberOfAffectedRows > 0) {
        res.json(affectedRows[0]);
      } else {
        res.status(404).send("Snippet not found");
      }
    } catch (err) {
      const error = err as Error;
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
);

// DELETE /snippets/:id
router.delete(
  "/snippets/:snippetId",
  verifyToken,
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    try {
      const username = req.user.Username;
      const user = await User.findOne({ where: { username: username } });
      const { snippetId } = req.params;
      const snippet = await Snippet.findByPk(snippetId);

      if (!snippet) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Snippet not found" });
      }

      if (snippet.userId !== user?.id) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "Snippet does not belong to user" });
      }

      const numberOfDestroyedRows = await Snippet.destroy({
        where: { id: snippet.id },
      });
      if (numberOfDestroyedRows > 0) {
        res.status(204).end();
      } else {
        res.status(404).send("Snippet not found");
      }
    } catch (err) {
      const error = err as Error;
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }

    // These are for testing and development:
    router.get("/snippetsNoAuth", async (req: Request, res: Response) => {
      const snippets = await Snippet.findAll();
      res.json(snippets);
    });
  }
);

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
router.post("/snippetCreateRandom", verifyToken, async (req, res) => {
  // from verifyToken, req.user has all the user info
  const email = req.body.email;

  const user = await User.findOne({ where: { email: email } });

  const randTitle = Math.random().toString(36).substring(7);

  const code = `console.log("Hello, ${generateRandomName()}");`;

  if (user) {
    const snippet = await Snippet.create({
      title: randTitle,
      code: code,
      userId: user.id,
    });
    res.json(snippet);
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }
});

export default router;
