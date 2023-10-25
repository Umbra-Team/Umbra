import express, { Request, Response } from 'express';
const { getOrCreateDoc } = require('@y-sweet/sdk');
import { CONNECTION_STRING } from '../utils/constants';

const router = express.Router();

router.get('/get-token/:docId', async (req, res) => {
  let docId: string | undefined = req.params.docId;
  if (docId === "default") {
    docId = undefined;
  }
  const clientToken = await getOrCreateDoc(docId, CONNECTION_STRING);
  res.json({ clientToken });
});

export default router;