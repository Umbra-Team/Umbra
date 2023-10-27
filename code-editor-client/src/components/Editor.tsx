import { useRef, useEffect, useCallback, useMemo } from "react";
import * as random from "lib0/random";

// CM6 core modules
import { basicSetup } from "codemirror";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap } from "@codemirror/view";

// CM6 editor options
import {
  defaultKeymap,
  indentWithTab,
  history,
  redo,
  undo,
} from "@codemirror/commands";
// import {
//   syntaxHighlighting,
//   defaultHighlightStyle,
//   bracketMatching
// } from '@codemirror/language';
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

// yjs and associates
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { yUndoManagerKeymap } from "y-codemirror.next";
import { useAwareness, useText } from "@y-sweet/react";

// Awareness consts
const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

const adjectives = [
  "Suburban",
  "Urban",
  "Rural",
  "Mountain",
  "River",
  "Ocean",
  "Forest",
  "Desert",
  "Arctic",
  "Tropical",
  "Gnarly",
  "Blue",
  "Honest",
];
const nouns = [
  "Eagle",
  "Lion",
  "Bear",
  "Shark",
  "Tiger",
  "Elephant",
  "Wolf",
  "Fox",
  "Deer",
  "Owl",
  "Pilgrim",
  "Sentinel",
  "Scion",
];

function generateRandomName(): string {
  // Check if a name already exists in local storage
  const storedName = localStorage.getItem("codeeditor-username");
  if (storedName) {
    // If a name exists, return it
    return storedName;
  }
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const newName = `${randomAdjective} ${randomNoun}`;

  localStorage.setItem("codeeditor-username", newName);

  return newName;
}

// Editor component
export type EditorProps = {
  code: string;
  onChange: (e: Object) => void;
};

export const Editor: React.FC<EditorProps> = ({ code, onChange }) => {
  // console.log("Editor RERENDERING");
  // We want editorRef to be a mutable instance of EditorView, so we use useRef
  const editorRef = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>();

  const yText = useText("input", { observe: "none" });

  // Create an UndoManager for the shared text type
  const undoManager = new Y.UndoManager(yText);

  const awareness = useAwareness();
  const userColor = usercolors[random.uint32() % usercolors.length];

  useEffect(() => {
    if (awareness) {
      awareness.setLocalStateField("user", {
        name: generateRandomName() + " " + Math.floor(Math.random() * 100),
        color: userColor.color,
        colorLight: userColor.light,
      });
    }
    console.log(`awareness: ${awareness}`);
  }, [awareness]);

  const onUpdate = useCallback(
    (v: ViewUpdate) => {
      if (v.docChanged) {
        onChange({ target: { value: v.state.doc.toString() } });
      }
    },
    [onChange]
  );

  const updateListener = EditorView.updateListener.of(onUpdate);

  const theme = useMemo(
    () =>
      EditorView.theme({
        "&": {
          height: "300px",
          width: "800px",
        },
      }),
    []
  );

  yText.observe((event) => {
    // console.log(`yText.observe: ${JSON.stringify(event)}`)
  });

  useEffect(() => {
    if (!editorRef.current) return;

    // initializes CodeMirror editor
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        history(),
        keymap.of([...defaultKeymap, indentWithTab]),
        oneDark,
        theme,
        updateListener,
        javascript(),
        yCollab(yText, awareness, { undoManager }),
      ],
    });

    // renders the CodeMirror editor in the browser; sets the parent element to the div that holds the ref
    view.current = new EditorView({ state, parent: editorRef.current });

    // cleanup function (?)
    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = undefined;
      }
    };
  }, []);

  // should maybe add a timer to this for debouncing
  // useEffect(() => {
  //   if (view.current && view.current.state.doc.toString() !== code) {
  //     view.current.dispatch({
  //       changes: { from: 0, to: view.current.state.doc.length, insert: "" }
  //     });
  //   }
  // }, [code])

  return <div ref={editorRef} />;
};
