import express, { RequestHandler, Request, Response } from "express";
import cors from "cors";
import path from "path";
import apiRouter from "./routes/api";
import sequelize from "./utils/sequelize";
import File from "./models/File";
import { info, error } from "./utils/logger";
import morgan from "morgan"; 

const app = express();
const port = 3001;


// Test and sync database connections
sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
    return sequelize.sync({ alter: true });  // Update tables if needed
  })
  .then(() => {
    console.log('All PostgreSQL tables have been successfully created.');
  })
  .catch((error) => {
    console.error('Unable to connect to PostgreSQL:', error);
  });


app.use(cors() as RequestHandler);
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, "../build")));
app.use("/api", apiRouter);

console.log(path.join(__dirname, "../build"));

app.get("/hello", (req, res) => {
  res.send("Hello World From Editor Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
