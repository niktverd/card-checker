import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import { openPuppeteer, sendMessage } from "./app";

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

app.listen(process.env.PORT || 8080);
