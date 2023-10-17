import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { langs } from '@uiw/codemirror-extensions-langs';

export const MainEditor = () => {
  return (
    <CodeMirror 
      height="200px"
      width="800px"
      theme={vscodeDark}
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


/*
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { javascript } from '@codemirror/lang-javascript'
<CodeMirror
value={code}
height="200px"
width="400px"
theme={vscodeDark}
extension={javascript}
basicSetup={{
  foldGutter: false,
  dropCursor: false,
  allowMultipleSelections: false,
  indentOnInput: false,
}}
/> */
