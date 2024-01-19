"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getOrCreateDoc } = require("@y-sweet/sdk");
const cors_1 = __importDefault(require("cors"));
// import codeRouter from './routes/routes';
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3001;
const CONNECTION_STRING =
  "yss://y-sweet-server-worker-staging.davidrd123.workers.dev";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../build")));
// app.use('/api/codeEval', codeRouter);
console.log(path_1.default.join(__dirname, "../build"));
app.get("/hello", (req, res) => {
  res.send("Hello World From Editor Server!");
});
app.get("/get-token/:docId", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let docId = req.params.docId;
    if (docId === "default") {
      docId = undefined;
    }
    const clientToken = yield getOrCreateDoc(docId, CONNECTION_STRING);
    res.json({ clientToken });
  })
);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
