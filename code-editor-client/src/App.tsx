import { Editor } from "./components/Editor";
import OutputDisplay from "./components/OutputDisplay";
import React, { useState, useLayoutEffect, useRef } from "react";
import axios from "axios";

import { Flex, Box } from "@chakra-ui/react";
import { EditorView } from "codemirror";
import LibraryDrawer from "./components/LibraryDrawer";

import { useDisclosure, useToast, useColorModeValue } from "@chakra-ui/react";
import MainHeader from "./components/MainHeader";

// Code execution mapping object
import codeExecutionMap from "./utils/codeExecutionMap";

import { AppProps, ToastProps } from "./types/types";
import UmbraToast from "./components/UmbraToast";

function App({ user, setUser }: AppProps) {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const [language, setLanguage] = useState<string>("js");

  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  const [editorHeight, setEditorHeight] = useState("45vh");
  const [outputHeight, setOutputHeight] = useState("20vh");
  const [editorWidth, setEditorWidth] = useState("60vw");
  const [outputWidth, setOutputWidth] = useState("60vw");
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);
  const toast = useToast();

  // sets focus component after library drawer modal is closed
  const finalFocusRef = useRef(null);

  useLayoutEffect(() => {
    if (orientation === "horizontal") {
      setEditorHeight("45vh");
      setOutputHeight("20vh");
      setEditorWidth("55vw");
      setOutputWidth("55vw");
    } else {
      setEditorHeight("70vh");
      setOutputHeight("70.5vh");
      setEditorWidth("40vw");
      setOutputWidth("40vw");
    }
  }, [orientation]);

  // Modal actions for Snippet Library
  const {
    isOpen: isLibraryOpen,
    onClose: onLibraryClose,
    onOpen: onLibraryOpen,
  } = useDisclosure();

  // Modal actions for Login Form
  const {
    onOpen: onLoginOpen,
    onClose: onLoginClose,
    isOpen: isLoginOpen,
  } = useDisclosure();

  // Modal actions for SignUp Form
  const {
    onOpen: onSignupOpen,
    onClose: onSignupClose,
    isOpen: isSignupOpen,
  } = useDisclosure();

  // state to hold a reference to the code editor window
  const [editorViewRef, setEditorViewRef] = useState<
    React.MutableRefObject<EditorView | undefined>
  >({ current: undefined });

  const CODE_EXECUTION_ROUTE = "/api/runCode";

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
    const response = await axios.post(
      CODE_EXECUTION_ROUTE,
      codeExecutionMap(language, code)
    );
    console.log(`Response: ${JSON.stringify(response)}`);
    console.log(`output is ${response.data.run.stdout}`);
    setOutput(JSON.stringify(response.data.run));
  };

  return (
    <>
      {toastProps && (
        <UmbraToast {...toastProps} setToastProps={setToastProps} />
      )}
      <Flex
        direction={"column"}
        minH='100vh'
        bg={useColorModeValue(
          "linear-gradient(180deg, hsla(0, 0%, 100%, 1) 0%, hsla(205, 100%, 95%, 1) 50%, hsla(0, 0%, 100%, 1) 100%)",
          // 'radial-gradient(circle, hsla(205, 100%, 95%, 1) 0%, hsla(0, 0%, 100%, 1) 95%)',
          "radial-gradient(circle, hsla(0, 0%, 19%, 1) 0%, hsla(0, 0%, 2%, 1) 100%)"
        )}
        justify='space-between'
      >
        <Flex direction='column'>
          <MainHeader
            user={user}
            setUser={setUser}
            replaceEditorContent={replaceEditorContent}
            appendEditorContent={appendEditorContent}
            onLibraryOpen={onLibraryOpen}
            onLoginOpen={onLoginOpen}
            onLoginClose={onLoginClose}
            isLoginOpen={isLoginOpen}
            onSignupOpen={onSignupOpen}
            onSignupClose={onSignupClose}
            isSignupOpen={isSignupOpen}
            toastProps={toastProps}
            setToastProps={setToastProps}
            ref={finalFocusRef}
          />
        </Flex>
        <Flex
          direction={orientation === "horizontal" ? "column" : "row"}
          gap={1}
          bg={useColorModeValue("white", "gray.900")}
          align='center'
          maxWidth='75%'
          justifyContent='center'
          margin='auto'
        >
          <Box
            boxShadow={useColorModeValue("dark-lg", "base")}
            borderRadius='5px'
          >
            <Editor
              setEditorViewRef={setEditorViewRef}
              setOutput={setOutput}
              onChange={setCode}
              onClick={() => sendCode(code)}
              orientation={orientation}
              setOrientation={setOrientation}
              language={language}
              setLanguage={setLanguage}
              width={editorWidth}
              height={editorHeight}
              replaceEditorContent={replaceEditorContent}
              user={user}
            />
          </Box>
          <Box
            boxShadow={useColorModeValue("dark-lg", "base")}
            borderRadius='5px'
          >
            <OutputDisplay
              output={output}
              setOutput={setOutput}
              width={outputWidth}
              height={outputHeight}
            />
          </Box>
        </Flex>
        <LibraryDrawer
          user={user}
          placement={"right"}
          onClose={onLibraryClose}
          isOpen={isLibraryOpen}
          finalFocusRef={finalFocusRef}
          size={"xl"}
          appendEditorContent={appendEditorContent}
          editorViewRef={editorViewRef}
        />
      </Flex>
    </>
  );
}

export default App;
