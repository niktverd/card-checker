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
const body_parser_1 = __importDefault(require("body-parser"));
const app_1 = require("./app");
const app = (0, express_1.default)();
console.log("app...");
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).json({ status: "ok", version: '0.0.1' });
}));
app.get("/runHeadfull", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("app.get /runHeadfull ");
    yield (0, app_1.openPuppeteer)();
    return res.json({ status: "ok", data: [] });
}));
app.get("/runToSend", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("app.post /runToSend ");
    const { query: { chat, message, } } = req;
    if (!chat || !message) {
        return res.json({ status: "empty chat or message", data: { chat, message } });
    }
    yield (0, app_1.sendMessage)(chat, message);
    return res.json({ status: "ok", data: [] });
}));
app.listen(process.env.PORT || 8080);
