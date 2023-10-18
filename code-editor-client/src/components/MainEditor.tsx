import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { langs } from '@uiw/codemirror-extensions-langs';
import React, { useState, useEffect, useRef } from 'react';

export type MainEditorProps = {
  code: string;
  setCode: (code: string) => void;
}

export const MainEditor: React.FC<MainEditorProps> = ({ code, setCode }) => {

  return (
    <CodeMirror 
      value={code}
      height="200px"
      width="800px"
      theme={vscodeDark}
      onChange={(editorValue, _) => {
        setCode(editorValue);
        console.log(editorValue);
      }}
      basicSetup={{
        foldGutter: true,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
      }}
      autoFocus={true}
      extensions={[langs.tsx()]}
    />
  )
}
