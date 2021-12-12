import { clientStreamerConfig } from "../config.js";
import coinDatabase from "../data/coins.js";

const symbolClients = new Map();

const streamClients = async (wss) => {
  wss.on("connection", (ws, req) => {
		const symbol = req.url.slice(1);
		if (!symbolClients.get(symbol)) symbolClients.set(symbol, []);
		symbolClients.get(symbol).push(ws);
		
		ws.send(JSON.stringify({
			type: "init",
			data: coinDatabase
		}));
		setInterval(() => {
			ws.send(JSON.stringify({
				type: "init",
				data: coinDatabase
			}));
		}, clientStreamerConfig.interval);
  });
};

export { streamClients };