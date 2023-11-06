import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import * as random from "lib0/random";

// UI related
import { Box, Button, Select, Image } from "@chakra-ui/react";

// Image icons
import python_icon from "../assets/python_icon.png";
import js_icon from "../assets/js_icon.png";
import ts_icon from "../assets/ts_icon.png";
import rb_icon from "../assets/rb_icon.png";
import go_icon from "../assets/go_icon.png";

// CM6 core modules
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap } from "@codemirror/view";

// CM6 editor options
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { defaultKeymap, indentWithTab, history } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { StreamLanguage } from "@codemirror/language";
import { python } from "@codemirror/legacy-modes/mode/python";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { go } from "@codemirror/legacy-modes/mode/go";

// yjs and associates
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
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

// state setter for editor view
type SetEditorViewRef = (
  viewRef: React.MutableRefObject<EditorView | undefined>
) => void;

// Editor component
export type EditorProps = {
  onChange: (value: string) => void;
  setEditorViewRef: SetEditorViewRef;
  onClick: () => void;
  setOrientation: Dispatch<SetStateAction<"horizontal" | "vertical">>;
  orientationIcon: React.ReactElement;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>; // eventually narrow this type to specific language identifiers
  width: string;
  height: string;
};

const languageIconMap = {
  js: js_icon,
  ts: ts_icon,
  rb: rb_icon,
  go: go_icon,
  py: python_icon,
};

export const Editor: React.FC<EditorProps> = ({
  onChange,
  setEditorViewRef,
  onClick,
  setOrientation,
  orientationIcon,
  language,
  setLanguage,
  width,
  height,
}) => {
  // console.log("Editor RERENDERING");
  // We want editorRef to be a mutable instance of EditorView, so we use useRef
  const editorRef = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>();

  const yText = useText("input", { observe: "none" });

  // Create an UndoManager for the shared text type
  const undoManager = new Y.UndoManager(yText);

  const awareness = useAwareness();
  const userColor = usercolors[random.uint32() % usercolors.length];

  const toggleOrientation = () => {
    setOrientation((prev) =>
      prev === "horizontal" ? "vertical" : "horizontal"
    );
  };

  useEffect(() => {
    setEditorViewRef(view);
  });

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
        onChange(v.state.doc.toString());
      }
    },
    [onChange]
  );

  const updateListener = EditorView.updateListener.of(onUpdate);

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
    if (!editorRef.current) return;

    // initializes CodeMirror editor
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        history(),
        keymap.of([...defaultKeymap, indentWithTab]),
        vscodeDark,
        theme,
        updateListener,
        javascript(),
        // StreamLanguage.define(python),
        yCollab(yText, awareness, { undoManager }),
      ],
    });

    // renders the CodeMirror editor in the browser; sets the parent element to the div that holds the ref
    view.current = new EditorView({ state, parent: editorRef.current });

    // cleanup function
    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = undefined;
      }
    };
  }, [width, height]);

  return (
    <Box flex='1' bg='gray.200' p={3} borderRadius='5' overflow='auto'>
      {/* <Heading size='md' mb='3' color='white'>
        Code Editor
      </Heading> */}
      <div ref={editorRef} />
      {/* <Box display='flex' justifyContent='flex-start'>
        <Button marginTop='2'>
         Test 
        </Button>
      </Box> */}

      <Box display='flex' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <Select
            marginTop='2'
            width='3mu'
            size='sm'
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value='js'>JavaScript</option>
            <option value='ts'>TypeScript</option>
            <option value='py'>Python</option>
            <option value='go'>Golang</option>
            <option value='rb'>Ruby</option>
          </Select>
          <Image
            src={languageIconMap[language]}
            boxSize='32px'
            alt='Code Language Icon'
            ml={2}
            mt={2}
          />
        </Box>
        <Box>
          <Button size='sm' marginTop='2' onClick={toggleOrientation}>
            {orientationIcon}
          </Button>
          <Button
            color='white'
            size='sm'
            bg='#0096FF'
            // borderRadius='20'
            _hover={{ bg: "#04BCF9" }}
            onClick={onClick}
            marginTop='2'
          >
            Run Code
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
