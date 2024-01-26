import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import * as random from "lib0/random";

// UI related
import {
  Box,
  Button,
  Select,
  Image,
  Tooltip,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

// CM6 core modules
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView, ViewUpdate, keymap, KeyBinding } from "@codemirror/view";

// CM6 editor options
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { defaultKeymap, history, indentMore } from "@codemirror/commands";

import { acceptCompletion, completionStatus } from "@codemirror/autocomplete";

// Language Mode and Syntax Highlighting
import { getLanguageMode } from "../utils/language";
import { languageIconMap } from "../utils/language";

// yjs and Hocus Pocus provider
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { HocuspocusContext } from "../main.tsx";

// styling for awareness carets
import "../styles/awareness.css";

// Button component to copy contents of editor
import CopyEditorContentsButton from "./CopyEditorContentsButton.tsx";

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
  setOutput: (output: string) => void;
  onClick: () => void;
  orientation: "horizontal" | "vertical";
  setOrientation: Dispatch<SetStateAction<"horizontal" | "vertical">>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>; // eventually narrow this type to specific language identifiers
  width: string;
  height: string;
  replaceEditorContent: (content: string) => void;
  user: any;
};

export const Editor: React.FC<EditorProps> = ({
  onChange,
  setEditorViewRef,
  setOutput,
  onClick,
  orientation,
  setOrientation,
  language,
  setLanguage,
  width,
  height,
  replaceEditorContent,
  user,
}) => {
  // We want editorRef to be a mutable instance of EditorView, so we use useRef
  const editorRef = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>();

  // hocuspocus provider
  const provider = useContext(HocuspocusContext);

  if (!provider) {
    throw new Error("HocuspocusProvider is null");
  }
  // awareness object from hocuspocus
  const awareness = provider ? provider.awareness : null;

  // editor yText
  const yText = provider.document.getText("input");

  // language selection yText
  const yTextLanguage = provider.document.getText("language");

  // Create an UndoManager for the shared text type
  let undoManager: Y.UndoManager;
  if (yText) {
    undoManager = new Y.UndoManager(yText);
  }

  const userColor = useMemo(
    () => usercolors[random.uint32() % usercolors.length],
    []
  );

  const toggleOrientation = () => {
    setOrientation((prev) =>
      prev === "horizontal" ? "vertical" : "horizontal"
    );
  };

  const handleClearEditor = () => {
    replaceEditorContent("");
    setOutput('{"error": "", "output": ""}');
  };

  // yCollab extension to set awareness clients 'typing/not typing' status
  const typingExtension = EditorView.domEventHandlers({
    keydown: () => {
      awareness?.setLocalStateField("typing", true);
      // Clear the typing status after a delay
      setTimeout(() => {
        awareness?.setLocalStateField("typing", false);
      }, 1000);
      return false;
    },
  });

  useEffect(() => {
    setEditorViewRef(view);
  });

  useEffect(() => {
    if (awareness) {
      if (user) {
        awareness.setLocalStateField("user", {
          color: userColor.color,
          colorLight: userColor.light,
          name: user.attributes.email,
        });
      } else {
        awareness.setLocalStateField("user", {
          color: userColor.color,
          colorLight: userColor.light,
          name: generateRandomName() + " " + Math.floor(Math.random() * 100),
        });
      }
    }
  }, [awareness, user]);

  // toggles visibility of remote user carets when typing/not typing
  useEffect(() => {
    if (!awareness) return;

    const handleAwarenessChange = ({ added, updated, removed }) => {
      for (const clientId of added.concat(updated)) {
        const state = awareness?.getStates().get(clientId);
        if (state && state.user) {
          const name = state.user.name;
          const elements = [...document.querySelectorAll(".cm-ySelectionInfo")];
          const element = elements.find((el) => el.innerHTML === name);
          if (element) {
            if (state.typing) {
              element.classList.add("active");
            } else {
              element.classList.remove("active");
            }
          }
        }
      }
      for (const clientId of removed) {
        const state = awareness.getStates().get(clientId);
        if (state && state.user) {
          const name = state.user.name;
          const elements = [...document.querySelectorAll(".cm-ySelectionInfo")];
          const element = elements.find((el) => el.textContent === name);
          if (element) {
            element.classList.remove("active");
          }
        }
      }
    };

    awareness.on("change", handleAwarenessChange);

    return () => {
      awareness.off("change", handleAwarenessChange);
    };
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
          fontSize: "0.8em",
        },
      }),
    [width, height]
  );

  const runKeyBinding: KeyBinding = {
    run: (view) => {
      onClick();
      return true;
    },
    key: "Shift-Mod-Enter",
  };

  const autoCompleteOrIndent: KeyBinding = {
    key: "Tab",
    run: (view) => {
      if (completionStatus(view.state)) {
        return acceptCompletion(view);
      }
      return indentMore(view);
    },
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    yTextLanguage.delete(0, yTextLanguage.length);
    yTextLanguage.insert(0, newLanguage);
    setLanguage(newLanguage);
  };

  useEffect(() => {
    if (!editorRef.current) return;

    // initializes CodeMirror editor
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        history(),
        keymap.of([...defaultKeymap, runKeyBinding, autoCompleteOrIndent]),
        vscodeDark,
        theme,
        updateListener,
        getLanguageMode(yTextLanguage.toString()),
        yCollab(yText, awareness, { undoManager }),
        typingExtension,
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
  }, [width, height, yTextLanguage, language]);

  // keeps the react 'language' state in sync with the yTextLanguage shared state
  useEffect(() => {
    const observer = () => {
      setLanguage(yTextLanguage.toString());
    };
    yTextLanguage.observe(observer);

    // cleanup function
    return () => {
      yTextLanguage.unobserve(observer);
    };
  }, [yTextLanguage, setLanguage]);

  return (
    <Box flex='1' bg='gray.900' p={3} borderRadius='5' overflow='auto'>
      <div ref={editorRef} />
      <Box display='flex' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <Tooltip
            label='Shift+Ctrl+Enter'
            bg={useColorModeValue("yellow.200", "yellow.900")}
            color={useColorModeValue("gray.600", "white")}
          >
            <Button
              color='white'
              size='sm'
              bg='blue.500'
              _hover={{ bg: "umbra.deepSkyBlue" }}
              onClick={onClick}
              marginTop='2'
              marginRight='2'
            >
              Run
            </Button>
          </Tooltip>
          <Select
            bg='inherit'
            marginTop='2'
            width='3mu'
            size='sm'
            value={language}
            onChange={handleLanguageChange}
            textColor={"gray.300"}
            iconColor={"gray.300"}
            borderColor={"gray.600"}
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
          <CopyEditorContentsButton editorContents={yText.toString()} />
          <Tooltip
            label='Clear contents'
            bg={useColorModeValue("yellow.200", "yellow.900")}
            color={useColorModeValue("gray.600", "white")}
          >
            <IconButton
              aria-label='Clear editor'
              icon={<DeleteIcon />}
              mt='2'
              mr='2'
              size='sm'
              color='white'
              bg='blue.500'
              onClick={handleClearEditor}
              variant='solid'
              _hover={{ bg: "umbra.deepSkyBlue" }}
            />
          </Tooltip>
          <Tooltip
            label='Change editor orientation'
            bg={useColorModeValue("yellow.200", "yellow.900")}
            color={useColorModeValue("gray.600", "white")}
          >
            <Button
              size='sm'
              marginTop='2'
              onClick={toggleOrientation}
              bg='blue.500'
              border='1px black'
              marginRight='1'
              _hover={{ bg: "umbra.deepSkyBlue" }}
            >
              {orientation === "horizontal" ? (
                <svg
                  width='1em'
                  height='1em'
                  viewBox='0 0 16 16'
                  fill='white'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z'
                  />
                  <path fillRule='evenodd' d='M7.5 14V2h1v12h-1z' />
                </svg>
              ) : (
                <svg
                  width='1.25em'
                  height='1.25em'
                  viewBox='0 0 16 16'
                  fill='white'
                >
                  <path d='M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zm0 12H3V8h11v5zm0-6H3V2h11v5z' />
                </svg>
              )}
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
