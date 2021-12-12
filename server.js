import path from "path";
import http from "http";
import fs from "fs";

import express from "express";
import { WebSocketServer } from "ws";

import botsRouter from "./routes/bots.js";
import { fetchHistoricalData, streamLiveData } from "./controllers/priceStreamer.js";
import { streamClients } from "./controllers/clientStreamer.js";

const port = 3000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use("/", express.static(path.join(process.cwd(), "public")));

app.use("/", botsRouter);

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

(async () => {
  await fetchHistoricalData();
	streamLiveData();
	streamClients(wss);
})();

//import tulind from "tulind";
//
//console.log(tulind.indicators.sma);
//console.log(tulind.indicators.rsi);
//console.log(tulind.indicators.bbands);