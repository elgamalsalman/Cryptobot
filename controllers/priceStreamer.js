import path from "path";
import fs from "fs";

import ccxt from "ccxt";

import sleep from "../utils/sleep.js";
import { symbol, interval } from "../config.js";
import coinDatabase from "../data/coins.js";

const binanceClient = new ccxt.binance();

const streamPriceData = async () => {
	console.log("fetching historical price data");

	const candles = await binanceClient.fetchOHLCV(symbol, interval);
	coinDatabase.updateCandles(candles);

	// streaming live data
	console.log("fetching live price data");
	while (1) {
		const currCandles = await binanceClient.fetchOHLCV(symbol, interval, coinDatabase.getLastTimestamp());
		await coinDatabase.updateCandles(currCandles);

		fs.writeFileSync(path.join(process.cwd(), "data", "raw.json"),JSON.stringify(coinDatabase));

		await sleep(Math.max(1000, binanceClient.rateLimit));
	}
};

export {
	streamPriceData
};