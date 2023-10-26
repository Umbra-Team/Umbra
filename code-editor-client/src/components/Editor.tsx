import { useRef, useEffect } from 'react';

// CM6 core modules
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';

// CM6 editor options
import { defaultKeymap, indentWithTab, history, redo, undo } from '@codemirror/commands';
// import {
//   syntaxHighlighting,
//   defaultHighlightStyle,
//   bracketMatching
// } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

// yjs and associates
import { yCollab } from 'y-codemirror.next';
import { useAwareness, useText } from '@y-sweet/react';

// Editor component
export type EditorProps = {
  code: string;
  onChange: (e: Object) => void;
}

export const Editor: React.FC<EditorProps> = ({ code, onChange }) => {
  const editorRef = useRef(); // allows us to attach the CodeMirror editor to a parent HTML component
  const view = useRef<EditorView>();

  const yText = useText(code, { observe: 'none' });
  const awareness = useAwareness();

  const onUpdate = EditorView.updateListener.of((v) => {
    if (v.docChanged) {
      onChange({target: {value: v.state.doc.toString()}});
    }
  })

  const theme = EditorView.theme({
    "&": {
      height: "200px",
      width: "800px",
    }
  })

  useEffect(() => {
    // initializes CodeMirror editor
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        history(),
        keymap.of([
          ...defaultKeymap,
          indentWithTab,
          { key: "Mod-z", run: undo, preventDefault: true },
          { key: "Mod-Shift-z", run: redo, preventDefault: true },
        ]),
        oneDark,
        theme,
        onUpdate,
        javascript(),
        yCollab(yText, awareness)
      ]
    })

    // renders the CodeMirror editor in the browser; sets the parent element to the div that holds the ref
    view.current = new EditorView({ state, parent: editorRef.current});

    // cleanup function (?)
    return () => {
      if (view.current) {
        view.current.destroy();
      }
    }
  }, [])

  // should maybe add a timer to this for debouncing
  useEffect(() => {
    if (view.current && view.current.state.doc.toString() !== code) {
      view.current.dispatch({
        changes: { from: 0, to: view.current.state.doc.length, insert: "" }
      });
    }
  }, [code])

  return <div ref={editorRef} />
}