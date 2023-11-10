import { useEffect, useRef, useState, useMemo } from "react";
import { basicSetup } from "codemirror";

import { EditorState } from "@codemirror/state";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const LibrarySnippetEditor = ({
  editorViewRef,
  code,
  isEditMode,
  languageMode,
}: {
  editorViewRef: React.MutableRefObject<EditorView | undefined>;
  code: string;
  isEditMode: boolean;
  languageMode: any;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [editorContent, setEditorContent] = useState(code);


  const theme = useMemo(
    () =>
      EditorView.theme({
        "&": {
          fontSize:"0.75em",
        },
      }),
    []
  );

  useEffect(() => {
    if (ref.current) {
      // Destroy the previous EditorView instance if it exists
      editorView?.destroy();

      // Create a newEditorView instance
      const newEditorView = new EditorView({
        parent: ref.current,
        state: EditorState.create({
          doc: editorContent,
          extensions: [
            basicSetup,
            theme,
            languageMode,
            vscodeDark,
            EditorView.editable.of(isEditMode),
            EditorView.updateListener.of((update: ViewUpdate) => {
              if (update.docChanged) {
                setEditorContent(update.state.doc.toString());
              }
            }),
          ],
        }),
      });
      // Save the new EditorView instance
      setEditorView(newEditorView);

      // Update the editorViewRef with the new EditorView instance
      editorViewRef.current = newEditorView;
    }

    // Cleanup function that destroys the EditorView instance
    return () => {
      editorView?.destroy();
    };
  }, [isEditMode, languageMode]);

  return <div ref={ref} />;
};

export default LibrarySnippetEditor;
