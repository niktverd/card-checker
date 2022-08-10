import {prepare} from './helpers/prepare';

export async function openPuppeteer() {
    const {page} = await prepare({headless: false});

    await page.goto('https://web.telegram.org/k/');
}

export async function sendMessage(chat: string, message: string) {
    console.log(message);
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