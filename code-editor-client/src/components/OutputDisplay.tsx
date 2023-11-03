// OutputDisplay.tsx
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

// import { createTheme } from "@uiw/codemirror-themes";
// import { tags as t } from "@lezer/highlight";
import { Box, Heading } from "@chakra-ui/react";

// const myTheme = createTheme({
//   theme: "light",
//   settings: {
//     background: "#000000",
//     backgroundImage: "",
//     foreground: "#f50f54",
//     caret: "#AEAFAD",
//     selection: "#D6D6D6",
//     selectionMatch: "#D6D6D6",
//     gutterBackground: "#FFFFFF",
//     gutterForeground: "#f4230b",
//     gutterBorder: "#dddddd",
//     gutterActiveForeground: "#d02525",
//     lineHighlight: "#EFEFEF",
//   },
//   styles: [
//     { tag: t.comment, color: "#787b80" },
//     { tag: t.definition(t.typeName), color: "#194a7b" },
//     { tag: t.typeName, color: "#194a7b" },
//     { tag: t.tagName, color: "#008a02" },
//     { tag: t.variableName, color: "#1a00db" },
//   ],
// });

interface OutputDisplayProps {
  output: string;
  width: string;
  height: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, width, height }) => {
  const parsedOutput = output ? JSON.parse(output) : {};

  let errorText = parsedOutput.error ? parsedOutput.error : null;

  // Remove ANSI escape codes
  if (errorText) {
    const ansiEscapeCodes = new RegExp(
      [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*" +
          "(?:;[a-zA-Z\\d]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))",
      ].join("|"),
      "g"
    );
    errorText = errorText.replace(ansiEscapeCodes, "");
  }

  if (!errorText) {
    return (
      <Box flex='1' bg='gray.200' p={3} borderRadius='5' overflow='auto'>
        <Heading color='white' size='md' mb='3'>
          Output
        </Heading>
        <CodeMirror
          value={parsedOutput.output}
          height={height}
          width={width}
          theme={vscodeDark}
          readOnly={true}
        />
      </Box>
    );
  } else {
    return (
      <Box flex='1' bg='gray.200' p={4} borderRadius='15' overflow='auto'>
        <Heading color='red' size='md' mb='3'>
          Errors
        </Heading>
        <CodeMirror
          value={errorText}
          height='25vh'
          width='100%'
          theme={vscodeDark}
          readOnly={true}
        />
      </Box>
    );
  }
};

export default OutputDisplay;
