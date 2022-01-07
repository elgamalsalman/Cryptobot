import path from "path";
import http from "http";

import express from "express";
import { WebSocketServer } from "ws";

import botsRouter from "./routes/bots.js";
import { findArbitrageableCoins, monitorArbitrageOpportunities } from "./controllers/arbitrageManager.js";
import { launchCoins } from "./controllers/coinsManager.js";
import { streamClients } from "./controllers/clientStreamer.js";
import { port } from "./config.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use("/", express.static(path.join(process.cwd(), "public")));

app.use("/", botsRouter);

app.use("/", (request, response, next) => {
	response.sendFile(path.join(process.cwd(), "views", "404.html"));
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

(async () => {
  // launchCoins();
	// streamClients(wss);
	// findArbitrageableCoins();
	monitorArbitrageOpportunities();
})();

//import tulind from "tulind";
//
//console.log(tulind.indicators.sma);
//console.log(tulind.indicators.rsi);
//console.log(tulind.indicators.bbands);