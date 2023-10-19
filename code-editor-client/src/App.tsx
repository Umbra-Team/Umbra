// import "./App.css";
import { MainEditor } from "./components/MainEditor";
import OutputDisplay from './components/OutputDisplay';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import { YDocProvider } from '@y-sweet/react'
import { ClientToken } from '@y-sweet/sdk'

function App() {
  const [code, setCode] = useState<string>("console.log(2+2);\nconsole.log('hello world')");
  const [output, setOutput] = useState<string>("");
  const [clientToken, setClientToken] = useState<ClientToken | null>(null);

  useEffect(() => {
    const fetchClientToken = async () => {
      const response = await axios.get('http://localhost:3001/get-token/my-room');
      setClientToken(response.data.clientToken);
    };

    fetchClientToken();
  }, []);

  const extensions = useMemo(() => {
    // Compute extensions array here
    return [];
  }, [/* dependencies */]);
  

  const sendCode = async (code: string) => {
    const codeEndpoint = "http://localhost:8000/run";
    console.log(`Sending code to ${codeEndpoint}, code: ${code}`)
    const response = await axios.post(codeEndpoint, {
      code: code
    });
    console.log(`Response: ${JSON.stringify(response)}`);
    setOutput(JSON.stringify(response.data, null, 2));
  }

  return clientToken ? (
    <YDocProvider clientToken={clientToken} setQueryParam="doc">
      <h1>CodeShare</h1>
      <MainEditor 
        value={code}
        onChange={(newCode: string) => setCode(newCode)}
        extensions={extensions}
      />
      <button onClick={() => sendCode(code)}>
        Run Code
      </button>
      <OutputDisplay output={output} />
    </YDocProvider>
  ) : null;
}

export default App;
