// routes/api.ts
import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/middleware";
import { getOrCreateDoc } from "@y-sweet/sdk";
import { CONNECTION_STRING } from "../utils/constants";
import { StatusCodes } from 'http-status-codes';
import File from "../models/File";
import User from "../models/User";
import sequelize from "../utils/sequelize";
import { RequestWithUser } from "../types/types";



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
```
- `GET /files`: List files for authenticated user
- `POST /files`: Save new file
- `GET /files/:id`: Retrieve file details
- `PUT /files/:id`: Update file
- `DELETE /files/:id`: Delete file
*/

router.post("/fileCreate", verifyToken, async (req, res) => {
  // from verifyToken, req.user has all the user info
  const username = req.body.username;

  const user = await User.findOne({ where: { username: username}});

  const randName = Math.random().toString(36).substring(7);

  if (user) {
    const file = await File.create({ name: randName, content: "test", userId: user.id });
    res.json(file);
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }

});

router.get("/users/files", verifyToken, async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }
  console.log(`req.user: ${JSON.stringify(req.user)}`);
  const username = req.user.Username;
  const user = await User.findOne({ where: { username: username}});
  console.log(`user: ${JSON.stringify(user)}`);
  const files = await File.findAll({ where: { userId: user?.id }});

  return res.json(files);
  // const userId = req.params.userId;
  // const files = await File.findAll({ where: { userId: userId }});
  // res.json(files);
});

router.get("/files", async (req: Request, res: Response) => {
  const files = await File.findAll();
  res.json(files);
});

router.post("/files", verifyToken, async (req: Request, res: Response) => {
  const { name, content } = req.body;
  console.log(`/files: name=${name}, content=${content}`);
  const file = await File.create({ name, content });
  res.json(file);
});

router.get("/files/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await File.findByPk(id);
    if (file) {
      res.json(file);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "File not found" });
    }
  } catch (err) {
    const error = err as Error;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

// PATCH /files/:id
router.patch('/files/:id', async (req: Request, res: Response) => {
  const [numberOfAffectedRows, affectedRows] = await File.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (numberOfAffectedRows > 0) {
    res.json(affectedRows[0]);
  } else {
    res.status(404).send('File not found');
  }
});

// PUT /files/:id
router.put('/files/:id', async (req: Request, res: Response) => {
  const [numberOfAffectedRows, affectedRows] = await File.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (numberOfAffectedRows > 0) {
    res.json(affectedRows[0]);
  } else {
    res.status(404).send('File not found');
  }
});

// DELETE /files/:id
router.delete('/files/:id', async (req, res) => {
  const numberOfDestroyedRows = await File.destroy({
    where: { id: req.params.id },
  });
  if (numberOfDestroyedRows > 0) {
    res.status(204).end();
  } else {
    res.status(404).send('File not found');
  }
});

export default router;
