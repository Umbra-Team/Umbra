
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EditorState } from '@codemirror/state';
import { useAwareness, useText } from '@y-sweet/react'

import { CodemirrorBinding } from 'y-codemirror'
import { EditorFromTextArea } from 'codemirror'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import './caret.css'

export type MainEditorProps = {
  code: string;
  setCode: (code: string) => void;
}

export const MainEditor: React.FC<MainEditorProps> = ({ code, setCode }) => {
  const yText = useText('text', { observe: 'none' })
  const awareness = useAwareness()
  const editorRef = useRef<EditorFromTextArea | null>(null)
  const bindingRef = useRef<CodemirrorBinding | null>(null)

  const codeMirrorRef = useCallback(
    (ref: HTMLTextAreaElement | null) => {
      if (ref == null) {
        if (editorRef.current != null) {
          editorRef.current.toTextArea();
          editorRef.current = null;
        }

        if (bindingRef.current != null) {
          bindingRef.current.destroy();
          bindingRef.current = null;
        }

        return;
      }

      if (bindingRef.current !== null) {
        bindingRef.current.awareness = awareness;
        return;
      }

      editorRef.current = CodeMirror.fromTextArea(ref, {
        lineNumbers: true,
        mode: 'javascript',
      });

      bindingRef.current = new CodemirrorBinding(yText!, editorRef.current, awareness);

      // Add a change event listener to update the code prop
      editorRef.current.on('change', () => {
        setCode(editorRef.current!.getValue());
      });
    },
    [awareness, yText, setCode],
  );

  return (
    <div className="p-4 lg:p-8 space-y-4">
      <h3>Code Editor</h3>
      <div>
        <textarea ref={codeMirrorRef} />
      </div>
    </div>
  );
}