import Bot from "./bot.js";

class RSIBot extends Bot {
	static name = "RSI-Bot";
	constructor(database, botMetaData) {
		super(database, botMetaData);
		this.lowerRSILimit = botMetaData.lowerRSILimit;
		this.upperRSILimit = botMetaData.upperRSILimit;
		this.assetState = "SOLD";
	}
	
	async takeStep() {
		//console.log(`${RSIBot.name} is taking a step`);
		//if (Math.random() < 0.5) this.setBoughtFraction(1.0);
		//else this.setBoughtFraction(0.0);

		const currRSIValue = this.database.indicators.rsi.slice(-1);
		if (currRSIValue >= this.upperRSILimit && this.assetState === "BOUGHT") {
			console.log(`// ${RSIBot.name} is selling`);
			this.setBoughtFraction(0.0);
			this.assetState = "SOLD";
		} else if (currRSIValue <= this.lowerRSILimit && this.assetState === "SOLD") {
			console.log(`// ${RSIBot.name} is buying`);
			this.setBoughtFraction(1.0);
			this.assetState = "BOUGHT";
		}
	}
}

export default RSIBot;