// use-code-editor.ts
import { onUpdate } from "../extensions/onUpdate";
import { useEffect } from "react";
import useCodeMirror from "./useCodeMirror";
import { Extension } from "@codemirror/state";

export interface UseCodeEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  extensions: Extension[];
}

export function useCodeEditor({ value, onChange, extensions }: UseCodeEditorProps) {
  const { ref, view } = useCodeMirror([onUpdate(onChange), ...extensions]);

  useEffect(() => {
    if (view) {
      const editorValue = view.state.doc.toString();

      if (value !== editorValue) {
        view.dispatch({
          changes: {
            from: 0,
            to: editorValue.length,
            insert: value || "",
          },
        });
      }
    }
  }, [value, view]);

  return ref;
}
