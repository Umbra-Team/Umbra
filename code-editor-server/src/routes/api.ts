// routes/api.ts
import express, { Request, Response } from "express";
import { verifyToken } from "../utils/middleware";
import { getOrCreateDoc } from "@y-sweet/sdk";
import { CONNECTION_STRING } from "../utils/constants";
import { StatusCodes } from 'http-status-codes';
import File from "../models/File";
import sequelize from "../utils/sequelize";

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

router.get("/files", verifyToken, async (req: Request, res: Response) => {
  const files = await File.findAll();
  res.json(files);
});

router.post("/files", verifyToken, async (req: Request, res: Response) => {
  const { name, content } = req.body;
  console.log(`/files: name=${name}, content=${content}`);
  const file = await File.create({ name, content });
  res.json(file);
});

router.get("/files/:id", verifyToken, async (req: Request, res: Response) => {
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

// PUT /files/:id
router.put('/files/:id', verifyToken, async (req, res) => {
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
router.delete('/files/:id', verifyToken, async (req, res) => {
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
