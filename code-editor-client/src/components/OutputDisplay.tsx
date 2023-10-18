// OutputDisplay.tsx
import React from "react";
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'

import { createTheme } from '@uiw/codemirror-themes';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';

const myTheme = createTheme({
  dark: 'light',
  settings: {
    background: '#000000',
    backgroundImage: '',
    foreground: '#f50f54',
    caret: '#AEAFAD',
    selection: '#D6D6D6',
    selectionMatch: '#D6D6D6',
    gutterBackground: '#FFFFFF',
    gutterForeground: '#f4230b',
    gutterBorder: '#dddddd',
    gutterActiveForeground: '#d02525',
    lineHighlight: '#EFEFEF',
  },
  styles: [
    { tag: t.comment, color: '#787b80' },
    { tag: t.definition(t.typeName), color: '#194a7b' },
    { tag: t.typeName, color: '#194a7b' },
    { tag: t.tagName, color: '#008a02' },
    { tag: t.variableName, color: '#1a00db' },
  ],
});

interface OutputDisplayProps {
  output: string;
  error: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  const parsedOutput = output ? JSON.parse(output) : {};

  let errorText = parsedOutput.error ? parsedOutput.error : null;

  // Remove ANSI escape codes
  if (errorText) {
    const ansiEscapeCodes = new RegExp(
      [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*' +
          '(?:;[a-zA-Z\\d]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))',
      ].join('|'),
      'g'
    );
    errorText = errorText.replace(ansiEscapeCodes, '');
  }

  if (!errorText) {
    return (
      <div>
        <h2>Output</h2>
        <CodeMirror
          value={parsedOutput.output}
          height="400px"
          width="800px"
          theme={vscodeDark}
          readOnly={true}
          />
        <div style={{whiteSpace: 'pre-line', fontFamily: 'monospace', maxHeight: '200px', overflowY: 'auto'}}>
          {parsedOutput.output}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Errors</h2>
      
      <CodeMirror
        value={errorText}
        height="400px"
        width="800px"
        theme={myTheme}
        readOnly={true}
        />
      </div>
    );
  }
};

export default OutputDisplay;
