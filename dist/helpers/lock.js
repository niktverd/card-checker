"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLock = exports.isLocked = void 0;
const fs_1 = require("fs");
function isLocked() {
    try {
        const lock = JSON.parse((0, fs_1.readFileSync)('./lock.json', { encoding: 'utf-8' }));
        const currentDate = new Date();
        const lockedDate = new Date(lock.locked);
        const diff = currentDate.getTime() - lockedDate.getTime();
        if (diff > 60000) {
            return false;
        }
        return true;
    }
    catch (error) {
        return true;
    }
}
exports.isLocked = isLocked;
function setLock() {
    try {
        (0, fs_1.writeFileSync)('./lock.json', JSON.stringify({ locked: new Date().toISOString() }));
    }
    catch (error) {
        console.log(error);
    }
}
exports.setLock = setLock;
