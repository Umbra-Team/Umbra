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
const sandboxjs_1 = __importDefault(require("@nyariv/sandboxjs"));
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    // Syntax validation
    try {
        console.log('Validating JavaScript syntax: ', code);
    }
    catch (e) {
        console.log(`Invalid JavaScript syntax: ${e}`);
        res.status(400).send({ error: 'Invalid JavaScript syntax' });
        return;
    }
    // Code execution in a sandbox
    const sandbox = new sandboxjs_1.default();
    const exec = sandbox.compile(code);
    try {
        const result = exec({}).run();
        console.log('Code execution result: ', result);
        res.send({ output: result });
    }
    catch (e) {
        res.status(500).send({ error: 'Error executing code' });
    }
}));
exports.default = router;
