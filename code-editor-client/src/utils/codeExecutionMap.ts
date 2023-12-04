interface languageExecutionObject {
  language: string;
  version: string;
  files: object[];
}

const codeExecutionMap = (language: string, code: string) => {
  const deno = {
    language: "deno",
    version: "1.32.3",
    files: [
      {
        content: code,
      },
    ],
  };

  const python = {
    language: "py",
    version: "3.12.0",
    files: [
      {
        content: code,
      },
    ],
  };

  const go = {
    language: "go",
    version: "1.16.2",
    files: [
      {
        content: code,
      },
    ],
  };

  const ruby = {
    language: "rb",
    version: "3.0.1",
    files: [
      {
        content: code,
      },
    ],
  };

  const typescript = {
    language: "typescript",
    version: "5.0.3",
    files: [
      {
        content: code,
      },
    ],
  };

  switch (language) {
    case "js":
      return deno;
    case "ts":
      return typescript;
    case "py":
      return python;
    case "go":
      return go;
    case "rb":
      return ruby;
    default:
      return deno;
  }
};

// js, ts, rb, go, py

export default codeExecutionMap;
