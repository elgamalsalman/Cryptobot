import { clientUpdateInterval, clientPingInterval } from "../config.js";
import { addCoinUser, removeCoinUser, coinInterfaces } from "./coinsManager.js";

const clients = new Set();
const clientSymbol = new Map();
const clientIntervals = new Map();

const streamClients = async (wss) => {
  wss.on("connection", (ws, req) => {
		clients.add(ws);

		ws.isAlive = true;
		ws.on("pong", function() {
			this.isAlive = true;
		}); 

		const url = new URL(`ws:${req.url}`);
		const base = url.searchParams.get("base");
		const quote = url.searchParams.get("quote");
		const symbol = base + quote;
		clientSymbol.set(ws, symbol);
		addCoinUser(symbol);
		
		ws.send(JSON.stringify({
			type: "init",
			data: coinInterfaces.get(symbol).database,
		}));
		const currInterval = setInterval(() => {
			ws.send(JSON.stringify({
				type: "init",
				data: coinInterfaces.get(symbol).database,
			}));
		}, clientUpdateInterval);
		clientIntervals.set(ws, currInterval);
  });

	setInterval(() => {
		const clientsToDelete = [];
		clients.forEach((ws) => {
			if (ws.isAlive === false) {
				clearInterval(clientIntervals.get(ws));
				removeCoinUser(clientSymbol.get(ws));
				clientsToDelete.push(ws);
			} else {
				ws.isAlive = false;
				ws.ping();
			}
		});
		for (const ws of clientsToDelete) {
			clientSymbol.delete(ws);
			clients.delete(ws);
		}
	}, clientPingInterval);
};

export {
	streamClients,
};