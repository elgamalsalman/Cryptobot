class Database {
  constructor(symbol) {
    this.symbol = symbol;
    this.candleCount = 0;
    this.time = [];
    this.open = [];
    this.high = [];
    this.low = [];
    this.close = [];
    this.volume = [];
    this.indicators = {};
		this.botData = [];
  }

	get currPrice() {
		return this.close[this.candleCount - 1];
	}
}

export default Database;