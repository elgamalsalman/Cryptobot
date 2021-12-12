import tulind from "tulind";

import { padFront } from "../utils/arrayManipulator.js";

class Database {
  constructor(symbol, interval) {
    this.symbol = symbol;
    this.interval = interval;

    this.candleCount = 0;
    this.time = [];
    this.open = [];
    this.high = [];
    this.low = [];
    this.close = [];
    this.volume = [];
    this.indicators = {};
  }

  getLastTimestamp() {
    if (this.candleCount === 0) return 0;
    return this.time[this.candleCount - 1];
  }

  _updateCandle(candle) {
    const lastInd = this.candleCount - 1;
    if (this.candleCount > 0 && this.time[lastInd] === candle[0]) {
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
  }

  updateCandles(candles) {
    for (let candle of candles) {
      this._updateCandle(candle);
    }

    return this.calcIndicators();
  }

  calcIndicators() {
    const smaPromise = new Promise((res, rej) => {
      tulind.indicators.sma.indicator(
				[this.close],
				[9],
				(err, [values]) => {
					if (err) rej(err);
					const padSize = this.candleCount - values.length;
					this.indicators.sma = padFront(values, padSize);
				}
			);
      res();
    });

    const rsiPromise = new Promise((res, rej) => {
      tulind.indicators.rsi.indicator(
				[this.close],
				[14],
				(err, [values]) => {
					if (err) rej(err);
					const padSize = this.candleCount - values.length;
					this.indicators.rsi = padFront(values, padSize);
				}
			);
      res();
    });

    const bbandsPromise = new Promise((res, rej) => {
      tulind.indicators.bbands.indicator(
				[this.close],
				[20, 2],
				(err, values) => {
					if (err) rej(err);
					const padSize = this.candleCount - values[0].length;
					values[0] = padFront(values[0], padSize);
					values[1] = padFront(values[1], padSize);
					values[2] = padFront(values[2], padSize);
					this.indicators.bbands = values;
				}
			);
      res();
    });

    const indicatorPromises = [rsiPromise, smaPromise, bbandsPromise];

    return Promise.all(indicatorPromises);
  }
}

export default Database;