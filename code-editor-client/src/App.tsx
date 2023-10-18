// import "./App.css";
import { MainEditor } from "./components/MainEditor";
import OutputDisplay from './components/OutputDisplay';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState<string>("console.log(2+2);\nconsole.log('hello world')");
  const [output, setOutput] = useState<string>("");

  const sendCode = async (code: string) => {
    const codeEndpoint = "http://localhost:8000/run";
    console.log(`Sending code to ${codeEndpoint}, code: ${code}`)
    const response = await axios.post(codeEndpoint, {
      code: code
    });
    console.log(`Response: ${JSON.stringify(response)}`);
    setOutput(JSON.stringify(response.data, null, 2));
  }

  return (
    <>
      <h1>CodeShare</h1>
      <MainEditor code={code} setCode={setCode} />
      <button onClick={() => sendCode(code)}>
        Run Code
      </button>
      <OutputDisplay output={output} />
    </>
  );
}

export default App;
