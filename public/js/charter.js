const priceChartDiv = document.querySelector("#price-chart");
const rsiChartDiv = document.querySelector("#rsi-chart");

const config = {
	layout: {
		textColor: "#d1d4dc",
		background: {
			type: LightweightCharts.ColorType.Solid,
			color: "#1b202e",
		},
	},
	grid: {
		vertLines: {
			color: "#555555",
		},
		horzLines: {
			color: "#555555",
		},
	},
  rightPriceScale: {
    drawTicks: false,
  },
};

const priceChart = LightweightCharts.createChart(priceChartDiv, {
  width: priceChartDiv.clientWidth,
  height: priceChartDiv.clientHeight,
  layout: config.layout,
  grid: config.grid,
  rightPriceScale: config.rightPriceScale,
});

const rsiChart = LightweightCharts.createChart(rsiChartDiv, {
  width: rsiChartDiv.clientWidth,
  height: rsiChartDiv.clientHeight,
  layout: config.layout,
  grid: config.grid,
  rightPriceScale: config.rightPriceScale,
});

console.log("chart options : ", priceChart.options());

export { priceChart, rsiChart };
