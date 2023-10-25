import express, { RequestHandler, Request, Response } from "express";
const { getOrCreateDoc } = require("@y-sweet/sdk");
import cors from "cors";
// import codeRouter from './routes/routes';
import path from "path";

const app = express();
const port = 3001;
const CONNECTION_STRING =
  "yss://y-sweet-server-worker-staging.davidrd123.workers.dev";

app.use(cors() as RequestHandler);
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
}
// app.use('/api/codeEval', codeRouter);
console.log(path.join(__dirname, "../build"));

app.get("/hello", (req, res) => {
  res.send("Hello World From Editor Server!");
});

// temporarily adding '/api/' in front of '/get-token' to make local development work properly
// removing before merging changes into main until can talk to David and understand the recent change

app.get("/api/get-token/:docId", async (req, res) => {
  let docId: string | undefined = req.params.docId;
  if (docId === "default") {
    docId = undefined;
  }
  const clientToken = await getOrCreateDoc(docId, CONNECTION_STRING);
  res.json({ clientToken });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
