
import React from 'react';
import { Extension } from "@codemirror/state";

import { useCodeEditor } from '../hooks/useCodeEditor'

export type MainEditorProps = {
  value: string;
  onChange: (newCode: string) => void;
  extensions: Extension[];
}

export const MainEditor: React.FC<MainEditorProps> = ({ value, onChange, extensions}) => {
  const editorRef = useCodeEditor({ value, onChange, extensions });

  // const yText = useText(code, { observe: 'none' })
  // const awareness = useAwareness()
  // console.log(awareness);
  
  return <div ref={editorRef} />
}