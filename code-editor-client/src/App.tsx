import { Editor } from "./components/Editor";
import OutputDisplay from "./components/OutputDisplay";
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
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
  const codeRef = useRef(code);
  const [output, setOutput] = useState<string>("");
  const [isAwaitingPiston, setIsAwaitingPiston] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("js");
  const langRef = useRef(language);

  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  const [editorHeight, setEditorHeight] = useState("45vh");
  const [outputHeight, setOutputHeight] = useState("20vh");
  const [editorWidth, setEditorWidth] = useState("60vw");
  const [outputWidth, setOutputWidth] = useState("60vw");
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);
  const toast = useToast();

  // Function to calculate the interpolated width
  const lerpWidth = (currentWidth) => {
    // Define the start and end points
    const startWidth = 1280; // px
    const endWidth = 520; // px
    const startVw = 55; // vw
    const endVw = 85; // vw

    // Clamp currentWidth to the range [endWidth, startWidth]
    currentWidth = Math.max(endWidth, Math.min(startWidth, currentWidth));

    // Calculate the interpolation factor (0 at startWidth, 1 at endWidth)
    const t = (currentWidth - startWidth) / (endWidth - startWidth);

    // Lerp the vw value
    return (1 - t) * startVw + t * endVw; // vw
  };

  // Function to calculate widths based on window size and orientation
  const calculateWidths = (currentWidth, orientation) => {
    let editorWidthValue = "55vw"; // Default value for horizontal orientation
    let outputWidthValue = "55vw"; // Default value for horizontal orientation

    if (orientation === "vertical") {
      editorWidthValue = "40vw";
      outputWidthValue = "40vw";
    } else if (currentWidth < 1280) {
      // Adjust these values as needed for smaller window sizes
      const lerpedWidth = lerpWidth(currentWidth);
      console.log(`lerpedWidth: ${lerpedWidth}`);
      editorWidthValue = `${lerpedWidth}vw`;
      outputWidthValue = `${lerpedWidth}vw`;
    }

    return { editorWidthValue, outputWidthValue };
  };

  const calculateHeights = (currentHeight, orientation) => {
    let editorHeightValue = "45vh"; // Default value for horizontal orientation
    let outputHeightValue = "20vh"; // Default value for horizontal orientation

    if (orientation === "vertical") {
      editorHeightValue = "70vh";
      outputHeightValue = "70.5vh";
    }

    return { editorHeightValue, outputHeightValue };
  }


  // useEffect for handling window resize
  useEffect(() => {
    const handleResize = () => {
      const { editorWidthValue, outputWidthValue } = calculateWidths(window.innerWidth, orientation);
      const { editorHeightValue, outputHeightValue } = calculateHeights(window.innerHeight, orientation);
      setEditorWidth(editorWidthValue);
      setOutputWidth(outputWidthValue);
      setEditorHeight(editorHeightValue);
      setOutputHeight(outputHeightValue);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [orientation]); // Make sure to include orientation in the dependency array

    // useLayoutEffect for setting initial widths based on orientation
    useLayoutEffect(() => {
      const { editorWidthValue, outputWidthValue } = calculateWidths(window.innerWidth, orientation);
      const { editorHeightValue, outputHeightValue } = calculateHeights(window.innerHeight, orientation);
      setEditorHeight(editorHeightValue);
      setOutputHeight(outputHeightValue);
      setEditorWidth(editorWidthValue);
      setOutputWidth(outputWidthValue);
    }, [orientation]);

  // useLayoutEffect(() => {
  //   if (orientation === "horizontal") {
  //     setEditorHeight("45vh");
  //     setOutputHeight("20vh");
  //     setEditorWidth("55vw");
  //     setOutputWidth("55vw");
  //   } else {
  //     setEditorHeight("70vh");
  //     setOutputHeight("70.5vh");
  //     setEditorWidth("40vw");
  //     setOutputWidth("40vw");
  //   }
  // }, [orientation]);

  // Update the code ref whenever the code state changes
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Update the language ref whenever the language state changes
  useEffect(() => {
    langRef.current = language;
  }, [language]);

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

  // state to track tooltip open/close status
  const {
    isOpen: isTooltipOpen,
    onOpen: onTooltipOpen,
    onClose: onTooltipClose,
  } = useDisclosure();

  // state to hold a reference to the code editor window
  const [editorViewRef, setEditorViewRef] = useState<
    React.MutableRefObject<EditorView | undefined>
  >({ current: undefined });

  const CODE_EXECUTION_ROUTE = "/api/runCode";

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
    console.log("Setting isLoading to true");
    setIsAwaitingPiston(true);
    const response = await axios.post(
      CODE_EXECUTION_ROUTE,
      codeExecutionMap(langRef.current, codeRef.current)
    );
    setOutput(JSON.stringify(response.data.run));
    console.log("Setting isLoading to False");
    setIsAwaitingPiston(false);
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
            isTooltipOpen={isTooltipOpen}
            onTooltipClose={onTooltipClose}
            onTooltipOpen={onTooltipOpen}
            isLoginOpen={isLoginOpen}
            onSignupOpen={onSignupOpen}
            onSignupClose={onSignupClose}
            isSignupOpen={isSignupOpen}
            toastProps={toastProps}
            setToastProps={setToastProps}
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
              output={isAwaitingPiston ? "Awaiting Results..." : output}
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
          onTooltipClose={onTooltipClose}
          isOpen={isLibraryOpen}
          size={"xl"}
          appendEditorContent={appendEditorContent}
          editorViewRef={editorViewRef}
        />
      </Flex>
    </>
  );
}

export default App;
