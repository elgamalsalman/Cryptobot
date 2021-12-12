import { priceChart, rsiChart } from "/js/charter.js";

let coinDatabase;
const symbol = window.location.pathname.slice(1);

const ws = new WebSocket(`ws://localhost:3000/${symbol}`);

const candlestickSeries = priceChart.addCandlestickSeries();
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
}
bbSeries.push(priceChart.addAreaSeries());

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);

	//console.log(data);

	if (type === "init") {
		// OHLC
		const ohlc = [];
		for (let i = 0; i < data.candleCount; i++) {
			ohlc.push({
				time: data.time[i],
				open: data.open[i],
				high: data.high[i],
				low: data.low[i],
				close: data.close[i]
			});
		}
		candlestickSeries.setData(ohlc);
		
		// SMA
		//const sma = [];
		//for (let i = 0; i < data.candleCount; i++) {
		//	sma.push({
		//		time: data.time[i],
		//		value: data.indicators.sma[i]
		//	});
		//}
		//smaSeries.setData(sma);

		// BBANDS
		for (let i = 0; i < 3; i++) {
			const bbLine = [];
			for (let j = 0; j < data.candleCount; j++) {
				bbLine.push({
					time: data.time[j],
					value: data.indicators.bbands[i][j]
				});
			}

			bbSeries[i].setData(bbLine);
		}

		// RSI
		const rsi = [];
		for (let i = 0; i < data.candleCount; i++) {
			rsi.push({
				time: data.time[i],
				value: data.indicators.rsi[i]
			});
		}
		rsiSeries.setData(rsi);
	}
};
