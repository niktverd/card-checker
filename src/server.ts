import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import { openPuppeteer, readFile, sendMessage, sendMessageAndGotCardStatus } from "./app";
import { Console } from "console";
import { isLocked } from "./helpers/lock";

const app: Application = express();
console.log("app...");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", async (req: Request, res: Response) => {
    return res.status(201).json({ status: "ok", version: '0.0.1' });
});

app.get("/runHeadfull", async (req, res) => {
    console.log("app.get /runHeadfull ");
    await openPuppeteer();
    return res.json({ status: "ok", data: [] });
});

//http://localhost:8080/runToSend?chat=SDBB_Bot&message=/chk%204647331155846215|11|2024|630
app.get("/runToSend", async (req, res) => {
    console.log("app.post /runToSend ");
    const {query: {
        chat, message,
    }} = req;

    if (!chat || !message) {
        return res.json({ status: "empty chat or message", data: {chat, message} });
    }

    await sendMessage(chat as string, message as string);

    return res.json({ status: "ok", data: [] });
});

app.get("/logInTg", async (req, res) => {
    console.log("app.post /logInTg ");
    
    res.json({ status: "ok", data: ['will be closed in 100 seconds'] });

    await openPuppeteer();
});

app.get("/runToCheck", async (req, res) => {
    console.log("app.post /runToCheck ");

    if (isLocked()) {
        return res.json({ status: "false", data: ['process is locked. try in a minute'] });
    }

    res.json({ status: "ok", data: ['started'] });
    const {query: {
        headless,
    }} = req;

    const chat = 'SDBB_Bot';

    const cards = readFile();

    console.log(cards);

    for (let card of cards) {
            const isGood = /^\d{16}\|\d{2}\|\d{4}\|\d{3}$/.test(card);
            if (!isGood) {
                console.log(`Card (${card}) is not match format XXXXXXXXXXXXXXXX|MM|YYYY|CVC`);
                continue;
            }

            const message = `/chk ${card}`;
        
            await sendMessageAndGotCardStatus(chat as string, message as string, card, Boolean(headless));
    }
});

app.listen(process.env.PORT || 8080);
