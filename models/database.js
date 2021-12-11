import talib from "talib";

class Database {
	constructor(symbol, interval) {
		this.done = 0;
		this.symbol = symbol;
		this.interval = interval;

		this.candleCount = 0;
		this.time = [];
		this.open = [];
		this.high = [];
		this.low = [];
		this.close = [];
		this.volume = [];
		this.indicators = {
			rsi: [],
		};
	};

	getLastTimestamp() {
		if (this.candleCount === 0) return 0;
		return this.time[this.candleCount - 1];
	};

	_updateCandle(candle) {
		const lastInd = this.candleCount - 1;
		if(this.candleCount > 0 && this.time[lastInd] === candle[0]) {
			this.open[lastInd] = candle[1];
			this.high[lastInd] = candle[2];
			this.low[lastInd] = candle[3];
			this.close[lastInd] = candle[4];
			this.volume[lastInd] = candle[5];
		} else {
			this.time.push(candle[0]);
			this.open.push(candle[1]);
			this.high.push(candle[2]);
			this.low.push(candle[3]);
			this.close.push(candle[4]);
			this.volume.push(candle[5]);
			this.candleCount++;
		}
	};

	updateCandles(candles) {
		for (let candle of candles) {
			this._updateCandle(candle);
		}

		return this.calcIndicators();
	};

	calcIndicators() {
		console.log("calculating indicators");

		this.done = 0;

		const rsiPromise = new Promise((res, rej) => {
			this.indicators.rsi = talib.execute({
				name: "RSI",
				startIdx: 0,
				endIdx: this.candleCount - 1,
				inReal: this.close,
				optInTimePeriod: 14
			});
			res();
		});

		const smaPromise = new Promise((res, rej) => {
			this.indicators.rsi = talib.execute({
				name: "RSI",
				startIdx: 0,
				endIdx: this.candleCount - 1,
				inReal: this.close,
				optInTimePeriod: 14
			});
			res();
		});

		const indicatorPromises = [rsiPromise];

		return Promise.all(indicatorPromises);
	};
}

export default Database;