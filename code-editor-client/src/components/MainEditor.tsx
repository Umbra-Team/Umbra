import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { langs } from '@uiw/codemirror-extensions-langs';
import React, { useState, useEffect, useRef } from 'react';


export const MainEditor: React.FC<{}> = () => {
  const [code, setCode] = useState<string>("");

  return (
    <CodeMirror 
      value={"test"}
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
