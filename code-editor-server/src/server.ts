import express, { RequestHandler, Request, Response } from 'express';
import cors from 'cors';
import codeRouter from './routes/routes';

const app = express();
const port = 3001;

app.use(cors() as RequestHandler);
app.use('/api/codeEval', codeRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});