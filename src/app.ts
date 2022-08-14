import { readFileSync } from 'fs';
import { setLock } from './helpers/lock';
import {prepare} from './helpers/prepare';

export async function openPuppeteer() {
    const {page, browser} = await prepare({headless: false});

    await page.goto('https://web.telegram.org/k/');

    await page.waitForTimeout(100000);
    await browser.close();
}

export async function sendMessage(chat: string, message: string) {
    const messages = message.split(',');
    const {page, browser} = await prepare({headless: false});
    await page.goto(`https://web.telegram.org/k/#@${chat}`, {waitUntil: 'networkidle2'});
    await page.waitForTimeout(5000);
    const messageField = await page.$('div.input-message-container');
    if (!messageField) {
        return false;
    }
    await messageField.click({clickCount: 3});
    for(const m of messages) {
        await messageField.type(m.trim(), {delay: 60});
        const sendBtn = await page.$('div.btn-send-container');
        if (!sendBtn) {
            return false;
        }
        await sendBtn.click({clickCount: 1});
        await page.waitForTimeout(3000);
    }
    await browser.close();

    return true;
}

export async function sendMessageAndGotCardStatus(chat: string, message: string, card: string, headless: boolean) {
    const messages = message.split(',');
    setLock();
    const {page, browser} = await prepare({headless: headless});
    await page.goto(`https://web.telegram.org/k/#@${chat}`, {waitUntil: 'networkidle2'});
    await page.waitForTimeout(5000);
    const messageField = await page.$('div.input-message-container');
    if (!messageField) {
        return false;
    }
    await messageField.click({clickCount: 3});
    for(const m of messages) {
        await messageField.type(m.trim(), {delay: 60});
        const sendBtn = await page.$('div.btn-send-container');
        if (!sendBtn) {
            return false;
        }
        await sendBtn.click({clickCount: 1});
        await page.waitForTimeout(3000);
    }
    await page.waitForTimeout(1000);

    let shouldBreak = false;
    for(let i=0; i<3; i++) {
        await page.waitForTimeout(10000);
        const listItems = await page.$$('div.message');
        const messages = await Promise.all(listItems.map(async it => await it.evaluate((el: any) => el.innerText)));
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
                } else {
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

    await page.waitForTimeout(10000);
    await browser.close();
    setLock();
    return true;
}

export function readFile() {
    return readFileSync('./cards.txt', {encoding: "utf-8"}).split('\n');
}