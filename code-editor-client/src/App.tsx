import { Editor } from "./components/Editor";
import OutputDisplay from "./components/OutputDisplay";
import React, { useState } from "react";
import axios from "axios";

import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import HamburgerMenuButton from "./components/HamburgerMenuButton";
import { EditorView } from "codemirror";

interface AppProps {
  clientToken: string;
}

function App({ clientToken }: AppProps) {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  // state to hold a reference to the code editor window
  const [editorViewRef, setEditorViewRef] =
    useState<React.MutableRefObject<EditorView | undefined>>();

  // const awareness = useAwareness();

  const CODE_EXECUTION_ENDPOINT =
    "https://ls-capstone-team1-code-execution-server.8amvljcm2giii.us-west-2.cs.amazonlightsail.com/run";

  // function to replace entire editor view state
  const replaceEditorContent = (newContent: string) => {
    if (editorViewRef?.current) {
      const transaction = editorViewRef.current.state.update({
        changes: {
          from: 0,
          to: editorViewRef.current.state.doc.length,
          insert: newContent,
        },
      });
      editorViewRef.current.dispatch(transaction);
    }
  };

  const appendEditorContent = (newContent: string) => {
    if (editorViewRef?.current) {
      const docLength = editorViewRef.current.state.doc.length;
      const transaction = editorViewRef.current.state.update({
        changes: [{ from: docLength, insert: "\n" + newContent + "\n" }],
      });
      editorViewRef.current.dispatch(transaction);
    }
  };

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
        borderColor=''
      >
        <Heading size='lg' fontWeight='bold' color='gray.900'>
          WeNeedAName
        </Heading>
        <HamburgerMenuButton
          replaceEditorContent={replaceEditorContent}
          appendEditorContent={appendEditorContent}
        />
      </Flex>
      <Flex direction='column' h='full' p={6} gap={3}>
        <Editor setEditorViewRef={setEditorViewRef} onChange={setCode} />
        <Button onClick={() => sendCode(code)} colorScheme='messenger'>
          Run Code
        </Button>
        <OutputDisplay output={output} />
      </Flex>
    </Box>
  ) : null;
}

export default App;
