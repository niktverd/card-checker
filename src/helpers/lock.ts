import { readFileSync, writeFileSync } from "fs";

export function isLocked() {
    try {
        const lock = JSON.parse(readFileSync('./lock.json', {encoding: 'utf-8'}));
        const currentDate = new Date();
        const lockedDate = new Date(lock.locked);
        const diff = currentDate.getTime() - lockedDate.getTime();
        if (diff > 60000) {
            return false;
        }
        return true;
    }
    catch(error) {
        return true;
    }
}


export function setLock() {
    try {
        writeFileSync('./lock.json', JSON.stringify({locked: new Date().toISOString()}));
    }
    catch(error) {
        console.log(error);
    }
}