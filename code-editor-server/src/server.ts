import express, { RequestHandler, Request, Response } from "express";
import cors from "cors";
import path from "path";
import apiRouter from "./routes/api";

const app = express();
const port = 3001;

app.use(cors() as RequestHandler);
app.use(express.json());

app.use(express.static(path.join(__dirname, "../build")));
app.use("/api", apiRouter);

console.log(path.join(__dirname, "../build"));

app.get("/hello", (req, res) => {
  res.send("Hello World From Editor Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
