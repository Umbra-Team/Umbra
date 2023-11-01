// routes/api.ts
import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/middleware";
import { getOrCreateDoc } from "@y-sweet/sdk";
import { CONNECTION_STRING } from "../utils/constants";
import { StatusCodes } from "http-status-codes";
import File from "../models/File";
import User from "../models/User";
import sequelize from "../utils/sequelize";
import { RequestWithUser } from "../types/types";

import { generateRandomName } from "../utilities/generateRandomName";

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
  // Send JWT in response
});

router.post("/auth/logout", async (req, res) => {
  // Invalidate JWT
});

/*
- `GET /files`: List files for authenticated user
- `POST /files`: Save new file
- `GET /files/:fileId`: Retrieve file details
- `PATCH /files/:fileId`: Update file
- `DELETE /files/:fileId`: Delete file

  DEVELOPMENT ONLY:
- `GET /filesNoAuth`: List all files (no auth required)
- `POST /fileCreateRandom`: 
      Create a file (for current user in request body pulled out by middleware)
      with random name and content "test"
*/

/**
 * Get all files for a user
 * @route GET /users/files
 * @requires Authentication header
 * @returns {File[]} - array of files
 */

router.get(
  "/files",
  verifyToken,
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    console.log(`req.user: ${JSON.stringify(req.user)}`);
    const username = req.user.Username;
    const user = await User.findOne({ where: { username: username } });
    console.log(`user: ${JSON.stringify(user)}`);
    const files = await File.findAll({ where: { userId: user?.id } });

    return res.json(files);
  }
);

router.post("/files", verifyToken, async (req: Request, res: Response) => {
  const { name, content } = req.body;
  console.log(`/files: name=${name}, content=${content}`);
  const file = await File.create({ name, content });
  res.json(file);
});

router.get(
  "/files/:fileId",
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
      const { fileId } = req.params;
      const file = await File.findByPk(fileId);
      if (!file) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "File not found" });
      }
      if (file.userId !== user?.id) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "File does not belong to user" });
      }

      res.json(file);
    } catch (err) {
      const error = err as Error;
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
);

// PATCH /files/:id
router.patch(
  "/files/:fileId",
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
      const { fileId } = req.params;
      const file = await File.findByPk(fileId);

      if (!file) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "File not found" });
      }

      if (file.userId !== user?.id) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "File does not belong to user" });
      }

      const [numberOfAffectedRows, affectedRows] = await File.update(req.body, {
        where: { id: file.id },
        returning: true,
      });

      if (numberOfAffectedRows > 0) {
        res.json(affectedRows[0]);
      } else {
        res.status(404).send("File not found");
      }
    } catch (err) {
      const error = err as Error;
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
);

// DELETE /files/:id
router.delete(
  "/files/:fileId",
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
      const { fileId } = req.params;
      const file = await File.findByPk(fileId);

      if (!file) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "File not found" });
      }

      if (file.userId !== user?.id) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "File does not belong to user" });
      }

      const numberOfDestroyedRows = await File.destroy({
        where: { id: file.id },
      });
      if (numberOfDestroyedRows > 0) {
        res.status(204).end();
      } else {
        res.status(404).send("File not found");
      }
    } catch (err) {
      const error = err as Error;
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }

    // These are for testing and development:
    router.get("/filesNoAuth", async (req: Request, res: Response) => {
      const files = await File.findAll();
      res.json(files);
    });
  }
);

router.post("/fileCreateRandom", verifyToken, async (req, res) => {
  // from verifyToken, req.user has all the user info
  const username = req.body.username;

  const user = await User.findOne({ where: { username: username } });

  const randName = Math.random().toString(36).substring(7);

  const content = `console.log("Hello, ${generateRandomName()}");`;

  if (user) {
    const file = await File.create({
      name: randName,
      content: content,
      userId: user.id,
    });
    res.json(file);
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }
});

export default router;
