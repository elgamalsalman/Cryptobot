import ccxt from "ccxt";

import sleep from "../utils/sleep.js";
import { symbol, interval, priceStreamerConfig } from "../config.js";
import coinDatabase from "../data/coins.js";

const binanceClient = new ccxt.binance();

const fetchHistoricalData = async () => {
	console.log("fetching historical price data");
	const candles = await binanceClient.fetchOHLCV(symbol, interval);
	coinDatabase.updateCandles(candles);
};

const streamLiveData = async () => {
	console.log("streaming live price data");
	await sleep(Math.max(priceStreamerConfig.minInterval, binanceClient.rateLimit));
	while (1) {
		const currCandles = await binanceClient.fetchOHLCV(symbol, interval, coinDatabase.getLastTimestamp());

		await Promise.all([
			coinDatabase.updateCandles(currCandles),
			sleep(Math.max(priceStreamerConfig.minInterval, binanceClient.rateLimit))
		]);
	}
};

export {
	fetchHistoricalData,
	streamLiveData
};