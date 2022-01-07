import fetch from "node-fetch";
import WebSocket from "ws";

import { APIKEY, SECRET } from "../confidential.js";

class BinanceClient {
	constructor() {
		this.timeout = new Promise((res, rej) => res());
	};

	resetTimeout() {
		this.timeout = new Promise((res, rej) => {
			setInterval(() => res(), 1000);
		});
	};

	async getAllSymbols() {
		await this.timeout;
		const data = await fetch(`https://api.binance.com/api/v3/exchangeInfo`);
		const json = await data.json();
		this.resetTimeout();
		return json;
	};

	async fetchOHLCV(symbol, interval) {
		await this.timeout;
		let data = null;
		while (data === null) {
			try {
				data = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`);
			} catch(err) {
				console.log(err);
			}
		}
		const json = data.json();
		this.resetTimeout();
		return json.then(res => {
			res.forEach(ele => {
				for (let i in ele) {
					ele[i] = parseFloat(ele[i]);
				}
				return ele;
			});
			return res;
		});
	};

	onNewOHLCV(symbol, interval, callback) {
		const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);
		ws.onmessage = (event) => {
			const { k: data } = JSON.parse(event.data);
			let candle = [data.t, data.o, data.h, data.l, data.c, data.v];
			for (let i in candle) candle[i] = parseFloat(candle[i]);
			callback(candle);
		};
	};
	
	async createMarketBuyOrder(symbol, amount) {
		await this.timeout;
		console.log(`creating a marketBuyOrder of ${amount} ${symbol}`);
		this.resetTimeout();
	};
	
	async createMarketSellOrder(symbol, amount) {
		await this.timeout;
		console.log(`creating a marketSellOrder of ${amount} ${symbol}`);
		this.resetTimeout();
	};

	async isSymbolValid(symbol) {
		await this.timeout;
		const data = await fetch(`https://api.binance.com/api/v3/exchangeInfo?symbol=${symbol}`);
		this.resetTimeout();
		if (data.status !== 200) return false;
		return true;
	};
};

const binanceClient = new BinanceClient();

export default binanceClient;