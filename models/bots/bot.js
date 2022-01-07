import binanceClient from "../../controllers/binanceManager.js";
import moment from "moment";
import sleep from "../../utils/sleep.js";

class Bot {
	constructor(database, botMetaData) {
		this.database = database;
		this.botIndex = this.database.botData.length;
		// implement this
		this.isSandbox = botMetaData.isSandbox;
		this.trades = [];
		this.dailyPerformance = [];
		this.database.botData.push({
			botName: botMetaData.name,
			isSandbox: this.isSandbox,
			baseAmount: botMetaData.baseAmount,
			quoteAmount: botMetaData.quoteAmount,
			trades: this.trades,
			dailyPerformance: this.dailyPerformance,
		});

		this._controlledBaseAmount = botMetaData.baseAmount;
		this._controlledQuoteAmount = botMetaData.quoteAmount;

		this.logNewDay();
	}

	logNewDay = async () => {
		await sleep(1000); // make sure the day has passed
		const timeTillEndOfDay = (moment().endOf("day").unix() - moment().unix()) * 1000;

		this.dailyPerformance.push({
			time: moment().unix(),
			startPrice: this.database.currPrice,
			startEvaluation: this.getTotalEvaluationInQuote(),
		});

		setTimeout(this.logNewDay, timeTillEndOfDay);
	}

	updatePerformance () {
		const lastLog = this.dailyPerformance[this.dailyPerformance.length - 1];
		lastLog.endPrice = this.database.currPrice;
		lastLog.endEvaluation = this.getTotalEvaluationInQuote();
		lastLog.coinPercentChange = 100 * (lastLog.endPrice - lastLog.startPrice) / lastLog.startPrice;
		lastLog.botPercentChange = 100 * (lastLog.endEvaluation - lastLog.startEvaluation) / lastLog.startEvaluation;
	}

	getTotalEvaluationInBase() {
		return this._controlledBaseAmount + (this._controlledQuoteAmount / this.database.currPrice);
	}

	getTotalEvaluationInQuote() {
		return this._controlledQuoteAmount + (this._controlledBaseAmount * this.database.currPrice);
	}

	getBoughtFraction() {
		return (this._controlledBaseAmount / this.getTotalEvaluationInBase());
	}

	setBoughtFraction(targetFraction) {
		if (targetFraction < 0.0 || targetFraction > 1.0) {
			throw "setBoughtFraction out of range [0.0 to 1.0]";
		}

		const boughtFraction = this.getBoughtFraction();
		const fractionDiff = Math.abs(boughtFraction - targetFraction);
		if (fractionDiff < 0.001) return;
		if (boughtFraction > targetFraction) {
			const amountToSell = fractionDiff * this.getTotalEvaluationInBase();
			this._sell(amountToSell);
		} else if (boughtFraction < targetFraction) {
			const amountToBuy = fractionDiff * this.getTotalEvaluationInBase()
			this._buy(amountToBuy);
		}
	}

	async _buy(amount) {
		console.log(`// buy ${amount} from ${this.database.symbol}`);
		if (!this.isSandbox) await binanceClient.createMarketBuyOrder(this.database.symbol, 0);
		this._controlledBaseAmount += amount * 0.999;
		this._controlledQuoteAmount -= amount * this.database.currPrice;

		this.database.botData[this.botIndex].baseAmount = this._controlledBaseAmount;
		this.database.botData[this.botIndex].quoteAmount = this._controlledQuoteAmount;
		this.trades.push({
			type: "buy",
			amount: amount,
			price: parseFloat(this.database.currPrice),
		});
		if (this.trades.length > 5) this.trades.shift(1);
	}

	async _sell(amount) {
		console.log(`// sell ${amount} from ${this.database.symbol}`);
		if (!this.isSanbox) await binanceClient.createMarketSellOrder(this.database.symbol, 0);
		this._controlledBaseAmount -= amount;
		this._controlledQuoteAmount += amount * this.database.currPrice * 0.999;

		this.database.botData[this.botIndex].baseAmount = this._controlledBaseAmount;
		this.database.botData[this.botIndex].quoteAmount = this._controlledQuoteAmount;
		this.trades.push({
			type: "sell",
			amount: amount,
			price: parseFloat(this.database.currPrice),
		});
		if (this.trades.length > 5) this.trades.shift(1);
	}
}

export default Bot;