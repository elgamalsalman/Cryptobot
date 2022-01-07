import Bot from "./bot.js";

class RandomBot extends Bot {
	static name = "Random-Bot";
	constructor(database, botMetaData) {
		super(database, botMetaData);
		this.count = 0;
	}
	
	async takeStep() {
		//console.log(`${RandomBot.name} is taking a step`);
		if (this.count > 10) return;
		if (Math.random() < 0.5) this.setBoughtFraction(1.0);
		else this.setBoughtFraction(0.0);
		this.count++;
	}
}

export default RandomBot;
