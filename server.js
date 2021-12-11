import path from "path";
import http from "http";
import fs from "fs";

import express from "express";
import { WebSocketServer } from "ws";

import botsRouter from "./routes/bots.js";
import { streamPriceData } from "./controllers/priceStreamer.js";

const port = 3000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New connection!");
	fs.readFile(path.join(process.cwd(), "data", "SOLETH.json"), "utf8", (err, priceData) => {
		ws.send(priceData);
	});
});

app.use("/", express.static(path.join(process.cwd(), "public")));

app.use("/", botsRouter);

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

streamPriceData();