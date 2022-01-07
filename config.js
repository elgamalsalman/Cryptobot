const port = 5000;
const defaultExchange = {
	base: "BTC",
	quote: "USDT",
	interval: "15m",
};
const clientUpdateInterval = 1000;
const clientPingInterval = 5000;
const priceUpdateInterval = 1000;
const botConfig = [
  {
    symbol: "BTCUSDT",
    name: "RSI-Bot",
		baseAmount: 0.0,
		quoteAmount: 10.0,
		lowerRSILimit: 35.0,
		upperRSILimit: 65.0,
		isSandbox: true,
  },
  {
    symbol: "BTCUSDT",
    name: "BBands-Bot",
		baseAmount: 0.0,
		quoteAmount: 10.0,
		isSandbox: true,
  },
  {
    symbol: "TRIBEUSDT",
    name: "RSI-Bot",
		baseAmount: 0.0,
		quoteAmount: 10.0,
		lowerRSILimit: 35.0,
		upperRSILimit: 65.0,
		isSandbox: true,
  },
  {
    symbol: "TRIBEUSDT",
    name: "BBands-Bot",
		baseAmount: 0.0,
		quoteAmount: 10.0,
		isSandbox: true,
  },
];

export { 
	port,
	defaultExchange,
	clientUpdateInterval,
	clientPingInterval,
	priceUpdateInterval,
	botConfig,
};