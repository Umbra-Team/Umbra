"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getOrCreateDoc } = require('@y-sweet/sdk');
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3001;
// const CONNECTION_STRING = "yss://j50rr8Tdqb5gfNfg_rw.AAAg_-VBX9RjPa4QCnMpHUXlyhPcTMJM1DSWuo86qNyaaxY@prod.y-sweet.net/p/gyaINP7dTZ4IaY3BGiI/"
// const CONNECTION_STRING = "ys://127.0.0.1:8080"
const CONNECTION_STRING = "yss://y-sweet-server-worker-staging.davidrd123.workers.dev";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/codeEval', routes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
app.get('/get-token/:docId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let docId = req.params.docId;
    if (docId === "default") {
        docId = undefined;
    }
    // const clientToken = await getOrCreateDoc(undefined, CONNECTION_STRING);
    // const clientToken = await getOrCreateDoc(`PrBqaP_Hrd2UkLNzECPwI`, CONNECTION_STRING);
    const clientToken = yield getOrCreateDoc(docId, CONNECTION_STRING);
    res.json({ clientToken });
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
