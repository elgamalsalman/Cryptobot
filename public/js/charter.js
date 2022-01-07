const priceChartDiv = document.querySelector("#price-chart");
const rsiChartDiv = document.querySelector("#rsi-chart");

const priceChart = LightweightCharts.createChart(priceChartDiv, {
  width: priceChartDiv.clientWidth,
  height: priceChartDiv.clientHeight,
  layout: window.global.config.layout,
  grid: window.global.config.grid,
  rightPriceScale: window.global.config.rightPriceScale,
});

const rsiChart = LightweightCharts.createChart(rsiChartDiv, {
  width: rsiChartDiv.clientWidth,
  height: rsiChartDiv.clientHeight,
  layout: window.global.config.layout,
  grid: window.global.config.grid,
  rightPriceScale: window.global.config.rightPriceScale,
}); 

const candlestickSeries = priceChart.addCandlestickSeries();
candlestickSeries.applyOptions({
  priceFormat: {
    type: "price",
    precision: 4,
    minMove: 0.0001,
  },
});

const rsiSeries = rsiChart.addAreaSeries({
	lineColor: "#ba27ac",
	topColor: "#ba27ac88",
	bottomColor: "#ba27ac11",
	lineWidth: 2,
});
rsiSeries.createPriceLine({
	price: 70.0,
	color: "#eb52dc",
	width: 1,
});
rsiSeries.createPriceLine({
	price: 30.0,
	color: "#eb52dc",
	width: 1,
});
let bbSeries = [];
for (let i = 0; i < 3; i++) {
	bbSeries.push(priceChart.addLineSeries({
		color: "#5050ff",
		lineWidth: 1,
		priceLineVisible: false,
		lastValueVisible: false,
	}));
	bbSeries[i].applyOptions({
    priceFormat: {
      type: "price",
      precision: 4,
      minMove: 0.0001,
    },
  });
}

function updateCharts() {
	// OHLC
	const ohlc = [];
	for (let i = 0; i < window.global.database.candleCount; i++) {
		ohlc.push({
			time: window.global.database.time[i],
			open: window.global.database.open[i],
			high: window.global.database.high[i],
			low: window.global.database.low[i],
			close: window.global.database.close[i]
		});
	}
	candlestickSeries.setData(ohlc);
	
	// SMA
	//const sma = [];
	//for (let i = 0; i < window.global.database.candleCount; i++) {
	//	sma.push({
	//		time: window.global.database.time[i],
	//		value: window.global.database.indicators.sma[i]
	//	});
	//}
	//smaSeries.setData(sma);

	// BBANDS
	for (let i = 0; i < 3; i++) {
		const bbLine = [];
		for (let j = 0; j < window.global.database.candleCount; j++) {
			bbLine.push({
				time: window.global.database.time[j],
				value: window.global.database.indicators.bbands[i][j]
			});
		}

		bbSeries[i].setData(bbLine);
	}

	// RSI
	const rsi = [];
	for (let i = 0; i < window.global.database.candleCount; i++) {
		rsi.push({
			time: window.global.database.time[i],
			value: window.global.database.indicators.rsi[i]
		});
	}
	rsiSeries.setData(rsi);
}

export { updateCharts };