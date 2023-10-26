// import "./App.css";
import { MainEditor } from "./components/MainEditor";
import OutputDisplay from "./components/OutputDisplay";
import { useState, useEffect } from "react";
import axios from "axios";

// import { YDocProvider } from "@y-sweet/react";
// import { ClientToken } from "@y-sweet/sdk";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import HamburgerMenuButton from "./components/HamburgerMenuButton";
import { useAwareness, useText } from "@y-sweet/react";

function App({ clientToken }) {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [editorViewReference, setEditorViewReference] = useState(null);
  // const [clientToken, setClientToken] = useState<ClientToken | null>(null);

  const yText = useText("input", { observe: "none" }); // Is this integrating correctly?

  const awareness = useAwareness();
  // console.log(`yText.toString(): ${yText.toString()}`);

  // If process.env.REACT_APP_EXPRESS_SERVER_ENDPOINT is not set, use the default endpoint
  // const EXPRESS_SERVER_ENDPOINT = "/api";
  // console.log(`EXPRESS_SERVER_ENDPOINT: ${EXPRESS_SERVER_ENDPOINT}`);

  // useEffect(() => {
  //   const fetchClientToken = async (doc: string) => {
  //     const response = await axios.get(
  //       `${EXPRESS_SERVER_ENDPOINT}/get-token/${doc}`
  //     );
  //     setClientToken(response.data.clientToken);
  //   };

  //   const params = new URLSearchParams(window.location.search);
  //   const doc = params.get("doc") || "default";

  //   fetchClientToken(doc || "default");
  // }, []);

  const CODE_EXECUTION_ENDPOINT =
    "https://ls-capstone-team1-code-execution-server.8amvljcm2giii.us-west-2.cs.amazonlightsail.com/run";

  const sendCode = async (code: string) => {
    const codeEndpoint = CODE_EXECUTION_ENDPOINT;
    console.log(`Sending code to ${codeEndpoint}, code: ${code}`);
    const response = await axios.post(codeEndpoint, {
      code: code,
    });
    console.log(`Response: ${JSON.stringify(response)}`);
    setOutput(JSON.stringify(response.data, null, 2));
  };

  return clientToken ? (
    <Box minH='100vh' bg='gray.100'>
      <Flex
        align='center'
        justify='space-between'
        p={6}
        bg='gray.200'
        border='2px'
        borderColor='gray.200'
      >
        <Heading size='lg' fontWeight='bold' color='gray.900'>
          CodeShare
        </Heading>
        <HamburgerMenuButton setCode={setCode} yText={yText} />
      </Flex>
      <Flex direction='column' h='full' p={6} space={6}>
        <MainEditor
          code={code}
          setCode={setCode}
          yText={yText}
          awareness={awareness}
        />
        <Button onClick={() => sendCode(code)} colorScheme='blue'>
          Run Code
        </Button>
        <OutputDisplay output={output} />
      </Flex>
    </Box>
  ) : null;
}

export default App;
