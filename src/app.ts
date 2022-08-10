import {prepare} from './helpers/prepare';

export async function openPuppeteer() {
    const {page} = await prepare({headless: false});

    await page.goto('https://web.telegram.org/k/');
}

export async function sendMessage(chat: string, message: string) {
    console.log(message);
    const {page, browser} = await prepare({headless: false});
    await page.goto(`https://web.telegram.org/k/#@${chat}`);
    await page.waitForTimeout(4000);
    const messageField = await page.$('div.input-message-container');
    await messageField?.click({clickCount: 3});
    await messageField?.type(message, {delay: 60});
    const sendBtn = await page.$('div.btn-send-container');
    await sendBtn?.click({clickCount: 1});
    await page.waitForTimeout(2000);
    await browser.close();
}