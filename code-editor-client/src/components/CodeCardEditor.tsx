import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";

import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@uiw/react-codemirror";

const CodeCardEditor = ({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      new EditorView({
        parent: ref.current,
        state: EditorState.create({
          doc: code,
          extensions: [
            basicSetup,
            javascript(),
            oneDark,
            EditorView.editable.of(false),
          ],
        }),
      });
    }
  }, [code]);

  return <div ref={ref} />;
};

export default CodeCardEditor;
