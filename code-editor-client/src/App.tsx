import { Editor } from "./components/Editor";
import OutputDisplay from "./components/OutputDisplay";
import React, { useState } from "react";
import axios from "axios";

import { Button, Flex, Box } from "@chakra-ui/react";
import { EditorView } from "codemirror";
import LibraryDrawer from "./components/LibraryDrawer";

import { useDisclosure } from "@chakra-ui/react";
import MainHeader from "./components/MainHeader";

interface AppProps {
  clientToken: string;
}

function App({ clientToken }: AppProps) {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Modal actions for Snippet Library
  const {
    isOpen: isLibraryOpen,
    onClose: onLibraryClose,
    onOpen: onLibraryOpen,
  } = useDisclosure();

  // Modal actions for Login Form
  // const { onOpen: onLoginOpen } = useDisclosure();

  // state to hold a reference to the code editor window
  const [editorViewRef, setEditorViewRef] = useState<
    React.MutableRefObject<EditorView | undefined>
  >({ current: undefined });

  const CODE_EXECUTION_ENDPOINT =
    "https://ls-capstone-team1-code-execution-server.8amvljcm2giii.us-west-2.cs.amazonlightsail.com/run";

  // function to replace entire editor view state
  const replaceEditorContent = (newContent: string) => {
    console.log(editorViewRef);
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
    <Flex direction={"column"} minH='100vh' bg='#FFFFFF'>
      <MainHeader
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        replaceEditorContent={replaceEditorContent}
        appendEditorContent={appendEditorContent}
        onLibraryOpen={onLibraryOpen}
      />
      <Flex
        direction='column'
        p={6}
        gap={3}
        // bgGradient='linear(to-r, black, gray.100, blue.800)'
        bg='white'
        align='center'
        maxWidth='75%'
        width='100%'
        justifyContent='center'
        margin='auto'
      >
        <Box width='70%' margin='30px 0'>
          <Editor setEditorViewRef={setEditorViewRef} onChange={setCode} onClick={() => sendCode(code)}/>
          {/* <Button
            bg='blue.700'
            borderRadius='20'
            _hover={{ bg: "blue.900" }}
            onClick={() => sendCode(code)}
          >
            Run Code
          </Button> */}
          <OutputDisplay output={output} />
        </Box>
      </Flex>
      <LibraryDrawer
        placement={"right"}
        onClose={onLibraryClose}
        isOpen={isLibraryOpen}
        size={"lg"}
        appendEditorContent={appendEditorContent}
        editorViewRef={editorViewRef}
      />
    </Flex>
  ) : null;
}

export default App;
