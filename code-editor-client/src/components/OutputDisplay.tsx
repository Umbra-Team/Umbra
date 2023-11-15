import React from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { Box, Heading } from "@chakra-ui/react";

// yjs and associates
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { useText } from "@y-sweet/react";

interface OutputDisplayProps {
  output: string;
  height: string;
  width: string;
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
  const yText = useText("outputWindow", { observe: "none" });

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
    // Check if yText is defined and output has changed
    if (yText && output) {
      // Clear the existing content
      yText.delete(0, yText.length);

      // Insert the new content
      yText.insert(0, parsedOutput.output);
    }
  }, [parsedOutput.output, yText]);

  React.useEffect(() => {
    if (outputRef.current) {
      const state = EditorState.create({
        doc: errorText ? errorText : parsedOutput.output,
        extensions: [
          theme,
          vscodeDark,
          EditorView.editable.of(false),
          yCollab(yText),
        ],
      });

      view.current = new EditorView({ state, parent: outputRef.current });
    }
    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = undefined;
      }
    };
  }, [parsedOutput.output, width, height]);

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
    <Box flex='1' bg='gray.900' p={3} borderRadius='5' overflow='auto'>
      <Heading textAlign='center' color='blue.400' size='md' mb='3'>
        Output
      </Heading>
      <div ref={outputRef} />
    </Box>
  );
};

export default OutputDisplay;
