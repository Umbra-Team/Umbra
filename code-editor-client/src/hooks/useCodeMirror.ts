// use-code-mirror.ts
import { useRef, useState, useEffect } from "react";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror"
import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

export default function useCodeMirror(extensions: Extension[]) {
  const ref = useRef<HTMLElement | null>(null);
  const [view, setView] = useState<EditorView | undefined>(undefined);

  useEffect(() => {
    if (ref.current === null) return;
    const view = new EditorView({
      extensions: [
        basicSetup,
        /**
         * Check each language package to see what they support,
         * for instance javascript can use typescript and jsx.
         */
        javascript({
          jsx: true,
          typescript: true,
        }),
        ...extensions,
      ],
      parent: ref.current,
    });

    setView(view);

    /**
     * Make sure to destroy the codemirror instance
     * when our components are unmounted.
     */
    return () => {
      view.destroy();
      setView(undefined);
    };
  }, [extensions]);

  return { ref, view };
}
