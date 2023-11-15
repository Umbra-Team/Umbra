import { useEffect, useRef, useState, useMemo } from "react";
import { basicSetup } from "codemirror";

import { EditorState } from "@codemirror/state";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const LibrarySnippetEditor = ({
  setEditorViewRef,
  code,
  isEditMode,
  languageMode,
}: {
  setEditorViewRef: (
    viewRef: React.MutableRefObject<EditorView | undefined>
  ) => void;
  code: string;
  isEditMode: boolean;
  languageMode: any;
}) => {
  const view = useRef<EditorView>();
  const ref = useRef<HTMLDivElement | null>(null);
  const [editorContent, setEditorContent] = useState(code);

  const theme = useMemo(
    () =>
      EditorView.theme({
        "&": {
          height: "100%",
          fontSize: "0.75em",
        },
      }),
    []
  );

  useEffect(() => {
    setEditorViewRef(view);
  });

  useEffect(() => {
    if (ref.current) {
      // Create a newEditorView instance
      const newEditorView = new EditorView({
        parent: ref.current,
        state: EditorState.create({
          doc: editorContent,
          extensions: [
            basicSetup,
            EditorView.lineWrapping,
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

      // Update the editorViewRef with the new EditorView instance
      view.current = newEditorView;
    }

    // Cleanup function that destroys the EditorView instance
    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = undefined;
      }
    };
  }, [isEditMode, languageMode]);

  return <div ref={ref} />;
};

export default LibrarySnippetEditor;
