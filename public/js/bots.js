const botPanel = document.querySelector("#bot-panel");
const botTradeTemplate = document.querySelector("#bot-trade-template");
const botCardTemplate = document.querySelector("#bot-card-template");

let botCardCounter = 0;
const botPerformanceSeriesList = [];
const coinPerformanceSeriesList = [];

function updateCoinDistribution(botCardIndex, baseAmount, quoteAmount) {
	const botCard = document.querySelector(`.bot-card-${botCardIndex}`)
	botCard.querySelector(".coin-distribution-base-amount").innerHTML = baseAmount.toPrecision(3);
	botCard.querySelector(".coin-distribution-quote-amount").innerHTML = quoteAmount.toPrecision(3);
	const baseInQuote = baseAmount * window.global.database.close[window.global.database.candleCount - 1];
	botCard.querySelector(".coin-distribution-indicator-bar").style.width = `${100 * baseInQuote / (baseInQuote + quoteAmount)}%`;
}


function updatePerformance(botPerformanceSeries, coinPerformanceSeries, performance) {
	const botPerformanceValues = [];
	for (let currPerformance of performance) {
		botPerformanceValues.push({
			time: currPerformance.time,
			value: currPerformance.botPercentChange,
		})
	}
	botPerformanceSeries.setData(botPerformanceValues);

	const coinPerformanceValues = []
	for (let currPerformance of performance) {
		coinPerformanceValues.push({
			time: currPerformance.time,
			value: currPerformance.coinPercentChange,
		})
	}
	coinPerformanceSeries.setData(coinPerformanceValues);
}

function updateTrades(botCardIndex, trades) {
	const botCard = document.querySelector(`.bot-card-${botCardIndex}`)
	const botTradesDiv = botCard.querySelector(".bot-trades");
	botTradesDiv.innerHTML = ``;
	for (let i = trades.length - 1; i >= 0; i--) {
		const tradeInfo = trades[i];
		const trade = botTradeTemplate.content.cloneNode(true);
		trade.querySelector(".bot-trade-type").innerHTML = tradeInfo.type.toUpperCase();
		if (tradeInfo.type.toUpperCase() === "BUY") {
			trade.querySelector(".bot-trade").classList.add("buy");
		} else {
			trade.querySelector(".bot-trade").classList.add("sell");
		}
		trade.querySelector(".bot-trade-amount").innerHTML = tradeInfo.amount.toPrecision(3);
		trade.querySelector(".bot-trade-price").innerHTML = tradeInfo.price.toPrecision(10);
		botTradesDiv.appendChild(trade);
	}
}

function hookUpBotCharts(botCardIndex) {
	const botCard = document.querySelector(`.bot-card-${botCardIndex}`);
	const performanceChartDiv = botCard.querySelector(".bot-performance-chart");
	const performanceChart = LightweightCharts.createChart(performanceChartDiv, {
		width: performanceChartDiv.clientWidth,
		height: performanceChartDiv.clientHeight,
		layout: window.global.config.layout,
		grid: window.global.config.grid,
		rightPriceScale: window.global.config.rightPriceScale,
	});
	botPerformanceSeriesList.push(performanceChart.addLineSeries({
		color: "#5050ff",
		lineWidth: 1,
		priceLineVisible: false,
		// lastValueVisible: false,
	}));
	coinPerformanceSeriesList.push(performanceChart.addAreaSeries({
		lineColor: "#26a69a",
		topColor: "#26a69a88",
		bottomColor: "#26a69a11",
		lineWidth: 1,
		priceLineVisible: false,
		// lastValueVisible: false,
	}));
}

function createBotCard(bot, botCardIndex) {
	const botCard = botCardTemplate.content.cloneNode(true);
	
	botCard.querySelector(".bot-card").classList.add(`bot-card-${botCardIndex}`);
	botCard.querySelector(".bot-name").innerHTML = bot.botName;
	botCard.querySelector(".coin-distribution-base-title").innerHTML = window.global.base;
	botCard.querySelector(".coin-distribution-quote-title").innerHTML = window.global.quote;

	return botCard;
}

function createBotCards() {
	const bots = window.global.database.botData;
	botPanel.innerHTML = ``;
	for (let bot of bots) {
		const botCard = createBotCard(bot, botCardCounter);
		botPanel.appendChild(botCard);
		hookUpBotCharts(botCardCounter);
		botCardCounter++;
	}

	if (bots.length === 0) {
		botPanel.innerHTML = `No bots found`;
		botPanel.classList.add("empty");
	} else {
		botPanel.classList.remove("empty");
	}
};

function updateBotCards() {
	for (let i = 0; i < window.global.database.botData.length; i++) {
		const botData = window.global.database.botData[i];
		const trades = botData.trades;
		const performance = botData.dailyPerformance;
		updateTrades(i, trades);
		updatePerformance(botPerformanceSeriesList[i], coinPerformanceSeriesList[i], performance);
		updateCoinDistribution(i, botData.baseAmount, botData.quoteAmount);
	}
}

export {
	createBotCards,
	updateBotCards,
};