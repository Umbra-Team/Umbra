import CodeMirror, { placeholder } from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { langs } from "@uiw/codemirror-extensions-langs";
import React, { useRef } from "react";
import { EditorState } from "@codemirror/state";
import { useAwareness, useText } from "@y-sweet/react";
import { yCollab } from "y-codemirror.next";

export type MainEditorProps = {
  code: string;
  setCode: (code: string) => void;
};

export const MainEditor: React.FC<MainEditorProps> = ({ code, setCode }) => {
  const editorRef = useRef<EditorState | null>(null);

  const yText = useText(code, { observe: "none" }); // Is this integrating correctly?
  const awareness = useAwareness();
  console.log(`yText.toString(): ${yText.toString()}`);
  return (
    <>
      <CodeMirror
        value={yText.toString()}
        height='200px'
        width='800px'
        theme={vscodeDark}
        onChange={(editorValue, viewUpdate) => {
          if (!editorRef.current) {
            editorRef.current = viewUpdate.state;
            console.log(
              `editorRef.current: ${JSON.stringify(editorRef.current)}`
            );
          }
          setCode(editorValue);
        }}
        basicSetup={{
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
        }}
        autoFocus={true}
        extensions={[
          langs.tsx(),
          yCollab(yText, awareness),
          placeholder("console.log('hello!')"),
        ]}
      />
    </>
  );
};
