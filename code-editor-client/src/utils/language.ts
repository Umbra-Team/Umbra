// Image icons
import python_icon from "../assets/python_icon.png";
import js_icon from "../assets/js_icon.png";
import ts_icon from "../assets/ts_icon.png";
import rb_icon from "../assets/rb_icon.png";
import go_icon from "../assets/go_icon.png";

// Syntax highlighting
import { javascript, typescriptLanguage } from "@codemirror/lang-javascript";
import { StreamLanguage } from "@codemirror/language";
import { python } from "@codemirror/legacy-modes/mode/python";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { go } from "@codemirror/legacy-modes/mode/go";

export const languageIconMap = {
  js: js_icon,
  ts: ts_icon,
  rb: rb_icon,
  go: go_icon,
  py: python_icon,
};

export const getLanguageMode = (language: string) => {
  switch (language) {
    case 'js':
      return javascript();
    case 'ts':
      return typescriptLanguage;
    case 'py':
      return StreamLanguage.define(python);
    case 'go':
      return StreamLanguage.define(go);
    case 'rb':
      return StreamLanguage.define(ruby);
    default:
      return javascript();
  }
};