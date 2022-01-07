import Bot from "./bot.js";

class BBandsBot extends Bot {
	static name = "BBands-Bot";
	constructor(database, botMetaData) {
		super(database, botMetaData);
		this.assetState = "SOLD";
		this.actionTime = 0;
	}
	
	async takeStep() {
		//console.log(`${BBandsBot.name} is taking a step`);
		//if (Math.random() < 0.5) this.setBoughtFraction(1.0);
		//else this.setBoughtFraction(0.0);
		
		const bbandsValues = {
			low: this.database.indicators.bbands[0].slice(-1)[0],
			mid: this.database.indicators.bbands[1].slice(-1)[0],
			high: this.database.indicators.bbands[2].slice(-1)[0],
		};
		const bbandsPercentageDiff = (bbandsValues.high - bbandsValues.low) / bbandsValues.low;

		const currPrice = parseFloat(this.database.close.slice(-1)[0]);
		const currTime = this.database.time.slice(-1)[0];
		const prevPrice = this.database.close[this.database.candleCount - 2];

		if (this.assetState === "BOUGHT" && currPrice >= bbandsValues.high) {
			this.actionTime = currTime;
			this.assetState = "RISING_BUY";
		}

		if (this.assetState === "RISING_BUY" && currTime > this.actionTime && prevPrice <= bbandsValues.high) {
			this.assetState = "SOLD";
			this.setBoughtFraction(0.0);
			console.log(`// ${BBandsBot.name} is selling`);
		}

		if (this.assetState === "SOLD" && currPrice <= bbandsValues.low && bbandsPercentageDiff > 0.003) {
      this.actionTime = currTime;
      this.assetState = "FALLING_SELL";
    }

		if (this.assetState === "FALLING_SELL" && currTime > this.actionTime && prevPrice >= bbandsValues.low) {
			this.assetState = "BOUGHT";
			this.setBoughtFraction(1.0);
			console.log(`// ${BBandsBot.name} is buying`);
		}
	}
}

export default BBandsBot;