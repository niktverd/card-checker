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
exports.prepare = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
function prepare({ headless = true, debug = false }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("prepare.....");
        const args = ["--no-sandbox", "--disable-setuid-sandbox"];
        if (debug) {
            args.push("--remote-debugging-port=9222");
        }
        const browser = yield puppeteer_1.default.launch({
            headless,
            devtools: false,
            args,
            userDataDir: './userDataDir',
        });
        console.log("browser launched.....");
        const page = yield browser.newPage();
        yield page.setViewport({
            width: 1400,
            height: 720,
        });
        yield page.emulateTimezone("Asia/Almaty");
        return { page, browser };
    });
}
exports.prepare = prepare;
