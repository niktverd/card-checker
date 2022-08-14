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
const lock_1 = require("./helpers/lock");
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
//http://localhost:8080/runToSend?chat=SDBB_Bot&message=/chk%204647331155846215|11|2024|630
app.get("/runToSend", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("app.post /runToSend ");
    const { query: { chat, message, } } = req;
    if (!chat || !message) {
        return res.json({ status: "empty chat or message", data: { chat, message } });
    }
    yield (0, app_1.sendMessage)(chat, message);
    return res.json({ status: "ok", data: [] });
}));
app.get("/logInTg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("app.post /logInTg ");
    res.json({ status: "ok", data: ['will be closed in 100 seconds'] });
    yield (0, app_1.openPuppeteer)();
}));
app.get("/runToCheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("app.post /runToCheck ");
    if ((0, lock_1.isLocked)()) {
        return res.json({ status: "false", data: ['process is locked. try in a minute'] });
    }
    res.json({ status: "ok", data: ['started'] });
    const { query: { headless, } } = req;
    const chat = 'SDBB_Bot';
    const cards = (0, app_1.readFile)();
    console.log(cards);
    for (let card of cards) {
        const isGood = /^\d{16}\|\d{2}\|\d{4}\|\d{3}$/.test(card);
        if (!isGood) {
            console.log(`Card (${card}) is not match format XXXXXXXXXXXXXXXX|MM|YYYY|CVC`);
            continue;
        }
        const message = `/chk ${card}`;
        yield (0, app_1.sendMessageAndGotCardStatus)(chat, message, card, Boolean(headless));
    }
}));
app.listen(process.env.PORT || 8080);
