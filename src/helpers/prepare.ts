
import puppeteer from 'puppeteer';

export async function prepare({headless = true, debug = false}) {
    console.log("prepare.....");

    const args = ["--no-sandbox", "--disable-setuid-sandbox"];

    if (debug) {
        args.push("--remote-debugging-port=9222");
    }

    const browser = await puppeteer.launch({
        headless,
        devtools: false,
        args,
        userDataDir: './userDataDir',
    });

    console.log("browser launched.....");

    const page = await browser.newPage();

    await page.setViewport({
        width: 1400,
        height: 720,
    });

    await page.emulateTimezone("Asia/Almaty");

    return {page, browser};
}
