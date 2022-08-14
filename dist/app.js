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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.sendMessageAndGotCardStatus = exports.sendMessage = exports.openPuppeteer = void 0;
const fs_1 = require("fs");
const lock_1 = require("./helpers/lock");
const prepare_1 = require("./helpers/prepare");
function openPuppeteer() {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, browser } = yield (0, prepare_1.prepare)({ headless: false });
        yield page.goto('https://web.telegram.org/k/');
        yield page.waitForTimeout(100000);
        yield browser.close();
    });
}
exports.openPuppeteer = openPuppeteer;
function sendMessage(chat, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = message.split(',');
        const { page, browser } = yield (0, prepare_1.prepare)({ headless: false });
        yield page.goto(`https://web.telegram.org/k/#@${chat}`, { waitUntil: 'networkidle2' });
        yield page.waitForTimeout(5000);
        const messageField = yield page.$('div.input-message-container');
        if (!messageField) {
            return false;
        }
        yield messageField.click({ clickCount: 3 });
        for (const m of messages) {
            yield messageField.type(m.trim(), { delay: 60 });
            const sendBtn = yield page.$('div.btn-send-container');
            if (!sendBtn) {
                return false;
            }
            yield sendBtn.click({ clickCount: 1 });
            yield page.waitForTimeout(3000);
        }
        yield browser.close();
        return true;
    });
}
exports.sendMessage = sendMessage;
function sendMessageAndGotCardStatus(chat, message, card, headless) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = message.split(',');
        (0, lock_1.setLock)();
        const { page, browser } = yield (0, prepare_1.prepare)({ headless: headless });
        yield page.goto(`https://web.telegram.org/k/#@${chat}`, { waitUntil: 'networkidle2' });
        yield page.waitForTimeout(5000);
        const messageField = yield page.$('div.input-message-container');
        if (!messageField) {
            return false;
        }
        yield messageField.click({ clickCount: 3 });
        for (const m of messages) {
            yield messageField.type(m.trim(), { delay: 60 });
            const sendBtn = yield page.$('div.btn-send-container');
            if (!sendBtn) {
                return false;
            }
            yield sendBtn.click({ clickCount: 1 });
            yield page.waitForTimeout(3000);
        }
        yield page.waitForTimeout(1000);
        let shouldBreak = false;
        for (let i = 0; i < 3; i++) {
            yield page.waitForTimeout(10000);
            const listItems = yield page.$$('div.message');
            const messages = yield Promise.all(listItems.map((it) => __awaiter(this, void 0, void 0, function* () { return yield it.evaluate((el) => el.innerText); })));
            for (const m of messages) {
                if (m.includes(card)) {
                    if (m.includes('/chk')) {
                        continue;
                    }
                    if (m.includes('Checking your card')) {
                        continue;
                    }
                    if (m.includes('Waiting for result')) {
                        continue;
                    }
                    if (m.toLowerCase().includes('𝗗𝗲𝗰𝗹𝗶𝗻𝗲𝗱')) {
                        console.log(`${card} -> Declined`);
                    }
                    else {
                        console.log(`${card} -> Good`);
                    }
                    shouldBreak = true;
                    break;
                }
            }
            if (shouldBreak) {
                break;
            }
        }
        if (!shouldBreak) {
            console.log(`${card} -> Problem. Try mannualy`);
        }
        yield page.waitForTimeout(10000);
        yield browser.close();
        (0, lock_1.setLock)();
        return true;
    });
}
exports.sendMessageAndGotCardStatus = sendMessageAndGotCardStatus;
function readFile() {
    return (0, fs_1.readFileSync)('./cards.txt', { encoding: "utf-8" }).split('\n');
}
exports.readFile = readFile;
