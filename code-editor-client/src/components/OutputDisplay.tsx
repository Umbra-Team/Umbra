import React from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { Box, Heading } from "@chakra-ui/react";

interface OutputDisplayProps {
  output: string;
  height: string;
  width: string;
  orientation: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  output, 
  width,
  height,
}) => {
  const parsedOutput = output ? JSON.parse(output) : {};
  let errorText = parsedOutput.error ? parsedOutput.error : null;
  const outputRef = React.useRef<HTMLDivElement>(null);
  const view = React.useRef<EditorView>();

  const theme = React.useMemo(
    () =>
      EditorView.theme({
        "&": {
          width,
          height,
        },
      }),
    [width, height]
  );
  
  React.useEffect(() => {
    if (outputRef.current) {
      const state = EditorState.create({
        doc: errorText ? errorText : parsedOutput.output,
        extensions: [theme, vscodeDark, EditorView.editable.of(false)],
      });

      view.current = new EditorView({ state, parent: outputRef.current });
    }
    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = undefined;
      }
    };
  }, [parsedOutput.output, width, height])


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

  return (
    <Box flex='1' bg='gray.200' p={3} borderRadius='5' overflow='auto'>
      <Heading color='white' size='md' mb='3'>
        Output
      </Heading>
      <div ref={outputRef} />
    </Box>
  );
};

export default OutputDisplay;