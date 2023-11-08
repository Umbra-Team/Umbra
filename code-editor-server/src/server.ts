import express, { RequestHandler, Request, Response } from "express";
import './utils/awsConfig';
import cors from "cors";
import path from "path";
import apiRouter from "./routes/api";
import { errorHandler } from "./utils/middleware";
import sequelize from "./utils/sequelize";
import './models/associations'
import { syncUsers } from "./scripts/syncUsers";
import { wipeUsers, wipeSnippets } from "./scripts/deleteDB";
import morgan from "morgan"; 

const app = express();
const port = 3001;

const CODE_EXECUTION_ENDPOINT = 'http://35.81.242.17:2000/api/v2/execute';

// Test and sync database connections
sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
    return sequelize.sync({ alter: true });  // Update tables if needed
  })
  .then(() => {
    
    // wipeUsers();  // Wipe users
    // wipeSnippets();  // Wipe snippets
    return syncUsers();  // Sync users from Cognito
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
app.use(errorHandler);

console.log(path.join(__dirname, "../build"));

app.get("/hello", (req, res) => {
  res.send("Hello World From Editor Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
