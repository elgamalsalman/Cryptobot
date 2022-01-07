import tulind from "tulind";

import Database from "./database.js";
import { padFront } from "../utils/arrayManipulator.js";
import binanceClient from "../controllers/binanceManager.js";
import { defaultExchange } from "../config.js";
import botDict from "./botDict.js";

class CoinInterface {
  constructor(symbol) {
    this.symbol = symbol;

    this.database = new Database(symbol);
    this.bots = [];

		(async () => {
			await this.fetchHistoricalData();
			this.streamLiveData();
		})();
  };

	hookBot(botMetaData) {
		this.bots.push(new (botDict[botMetaData.name])(this.database, botMetaData));
	};

  async fetchHistoricalData () {
    const candles = await binanceClient.fetchOHLCV(this.symbol, defaultExchange.interval);
    this.updateCandles(candles);
  };

  async streamLiveData () {
		binanceClient.onNewOHLCV(
			this.symbol,
			defaultExchange.interval,
			(candle) => {
				this.updateCandles([candle]);
				this.bots.forEach(bot => {
					bot.takeStep();
					bot.updatePerformance();
				});
			},
		);
  };

  _updateCandle(candle) {
    const lastInd = this.database.candleCount - 1;
    if (
      this.database.candleCount > 0 &&
      this.database.time[lastInd] === candle[0]
    ) {
      this.database.open[lastInd] = candle[1];
      this.database.high[lastInd] = candle[2];
      this.database.low[lastInd] = candle[3];
      this.database.close[lastInd] = candle[4];
      this.database.volume[lastInd] = candle[5];
    } else {
      this.database.time.push(candle[0]);
      this.database.open.push(candle[1]);
      this.database.high.push(candle[2]);
      this.database.low.push(candle[3]);
      this.database.close.push(candle[4]);
      this.database.volume.push(candle[5]);
      this.database.candleCount++;
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
        [this.database.close],
        [9],
        (err, [values]) => {
          if (err) rej(err);
          const padSize = this.database.candleCount - values.length;
          this.database.indicators.sma = padFront(values, padSize);
        }
      );
      res();
    });

    const rsiPromise = new Promise((res, rej) => {
      tulind.indicators.rsi.indicator(
        [this.database.close],
        [14],
        (err, [values]) => {
          if (err) rej(err);
          const padSize = this.database.candleCount - values.length;
          this.database.indicators.rsi = padFront(values, padSize);
        }
      );
      res();
    });

    const bbandsPromise = new Promise((res, rej) => {
      tulind.indicators.bbands.indicator(
        [this.database.close],
        [20, 1.5],
        (err, values) => {
          if (err) rej(err);
          const padSize = this.database.candleCount - values[0].length;
          values[0] = padFront(values[0], padSize);
          values[1] = padFront(values[1], padSize);
          values[2] = padFront(values[2], padSize);
          this.database.indicators.bbands = values;
        }
      );
      res();
    });

    const indicatorPromises = [rsiPromise, smaPromise, bbandsPromise];

    return Promise.all(indicatorPromises);
  }
}

export default CoinInterface;