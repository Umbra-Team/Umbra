import { Editor } from "./components/Editor";
import OutputDisplay from "./components/OutputDisplay";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import HamburgerMenuButton from "./components/HamburgerMenuButton";
import { EditorView } from "codemirror";
import LibraryDrawer from "./components/LibraryDrawer";
import { useDisclosure } from "@chakra-ui/react";
import fetchCards from "./utils/fetchCards";

interface AppProps {
  clientToken: string;
}

function App({ clientToken }: AppProps) {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cards, setCards] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const fetchAndSetCards = async () => {
      const codeCards = await fetchCards();
      setCards(codeCards);
    };

    fetchAndSetCards();
  }, []);

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
    <Flex direction={"column"} minH='100vh' bg='gray.100'>
      <Flex
        flex={1}
        align='center'
        justify='space-between'
        p={6}
        // bg='gray.200'
        bgGradient='linear(to-r, black, gray.100, blue.800)'
        border='2px'
        borderColor='gray.200'
      >
        <Heading size='lg' fontWeight='bold' color='gray.900'>
          Our Code Thing
        </Heading>
        <Flex align='center' gap={10}>
          <Button
            bg='transparent'
            _hover={{
              color: "white",
              fontWeight: "bold",
              textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
            }}
            onClick={onOpen}
            _active={{ bg: "transparent" }}
          >
            Code Library
          </Button>
          <HamburgerMenuButton
            replaceEditorContent={replaceEditorContent}
            appendEditorContent={appendEditorContent}
          />
        </Flex>
      </Flex>
      <Flex
        direction='column'
        p={6}
        gap={3}
        bgGradient='linear(to-r, black, gray.100, blue.800)'
      >
        <Editor setEditorViewRef={setEditorViewRef} onChange={setCode} />
        <Button
          bg='blue.700'
          borderRadius='20'
          _hover={{ bg: "blue.900" }}
          onClick={() => sendCode(code)}
        >
          Run Code
        </Button>
        <OutputDisplay output={output} />
      </Flex>
      <LibraryDrawer
        placement={"left"}
        onClose={onClose}
        isOpen={isOpen}
        size={"xl"}
        codeCards={cards}
      />
    </Flex>
  ) : null;
}

export default App;
