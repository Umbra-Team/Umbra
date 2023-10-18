import express, { Request, Response } from 'express';
import Sandbox from '@nyariv/sandboxjs';
import * as esprima from 'esprima';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const code = req.body.code;

  // Syntax validation
  try {
    console.log('Validating JavaScript syntax: ', code);
    esprima.parseScript(code);
  } catch (e) {
    console.log(`Invalid JavaScript syntax: ${e}`)
    res.status(400).send({ error: 'Invalid JavaScript syntax' });
    return;
  }

  // Code execution in a sandbox
  const sandbox = new Sandbox();
  const exec = sandbox.compile(code);

  try {
    const result = exec({}).run();
    console.log('Code execution result: ', result);
    res.send({ output: result });
  } catch (e) {
    res.status(500).send({ error: 'Error executing code' });
  }
});

export default router;