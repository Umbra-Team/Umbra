import React, { useContext, useEffect, useMemo, useRef } from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { Box, Heading } from "@chakra-ui/react";
import { HocuspocusContext } from "../main";

// yjs and associates
import { yCollab } from "y-codemirror.next";

interface OutputDisplayProps {
  output: string;
  setOutput: (output: string) => void;
  height: string;
  width: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  output,
  setOutput,
  width,
  height,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>();

  // hocuspocus provider
  const provider = useContext(HocuspocusContext);

  const yText = provider ? provider.document.getText("outputWindow") : "";

  const theme = useMemo(
    () =>
      EditorView.theme({
        "&": {
          width,
          height,
        },
      }),
    [width, height]
  );

  useEffect(() => {
    if (yText && output) {
      let parsedOutput;
      try {
        parsedOutput = JSON.parse(output);
      } catch (error) {
        console.error(`Error parsing output: ${error}`);
        return;
      }

      // Clear the existing content
      yText.delete(0, yText.length);

      // Insert the new content
      const newText = parsedOutput.error || parsedOutput.output;
      yText.insert(0, newText);
    }
  }, [output, yText]);

  useEffect(() => {
    if (outputRef.current) {
      const state = EditorState.create({
        doc: yText.toString(),
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
  }, [yText, width, height]);

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
