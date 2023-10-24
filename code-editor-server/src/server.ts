import express, { RequestHandler, Request, Response } from 'express';
const { getOrCreateDoc } = require('@y-sweet/sdk');
import cors from 'cors';
import codeRouter from './routes/routes';

const app = express();
const port = 3001;
// const CONNECTION_STRING = "yss://j50rr8Tdqb5gfNfg_rw.AAAg_-VBX9RjPa4QCnMpHUXlyhPcTMJM1DSWuo86qNyaaxY@prod.y-sweet.net/p/gyaINP7dTZ4IaY3BGiI/"
// const CONNECTION_STRING = "ys://127.0.0.1:8080"
const CONNECTION_STRING="yss://y-sweet-server-worker-staging.davidrd123.workers.dev"

app.use(cors() as RequestHandler);
app.use(express.json());
app.use('/api/codeEval', codeRouter);

app.get('/get-token/:docId', async (req, res) => {
  let docId: string | undefined = req.params.docId;
  if (docId === "default") {
    docId = undefined;
  }
  // const clientToken = await getOrCreateDoc(undefined, CONNECTION_STRING);
  // const clientToken = await getOrCreateDoc(`PrBqaP_Hrd2UkLNzECPwI`, CONNECTION_STRING);
  const clientToken = await getOrCreateDoc(docId, CONNECTION_STRING);
  res.json({ clientToken });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});