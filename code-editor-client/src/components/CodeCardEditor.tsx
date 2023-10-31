import { useEffect, useRef, useState } from "react";
import { basicSetup } from "codemirror";

import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@uiw/react-codemirror";

const CodeCardEditor = ({
  code,
  isEditMode,
}: {
  code: string;
  isEditMode: boolean;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (ref.current) {
      // Destroy the previous EditorView instance if it exists
      editorView?.destroy();

      // Create a newEditorView instance
      const newEditorView = new EditorView({
        parent: ref.current,
        state: EditorState.create({
          doc: code,
          extensions: [
            basicSetup,
            javascript(),
            oneDark,
            EditorView.editable.of(isEditMode),
          ],
        }),
      });
      // Save the new EditorView instance
      setEditorView(newEditorView);
    }

    // Cleanup function that destroys the EditorView instance
    return () => {
      editorView?.destroy();
    };
  }, [code, isEditMode]);

  return <div ref={ref} />;
};

export default CodeCardEditor;
