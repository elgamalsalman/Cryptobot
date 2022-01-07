window.global = {};

const url = new URL(window.location.href);
window.global.base = url.searchParams.get("base");
window.global.quote = url.searchParams.get("quote");
window.global.symbol = window.global.base + window.global.quote;

window.global.config = {
	layout: {
		textColor: "#d1d4dc",
		background: {
			type: LightweightCharts.ColorType.Solid,
			color: "#131722f9",
		},
	},
	grid: {
		vertLines: {
			color: "#3347",
		},
		horzLines: {
			color: "#3347",
		},
	},
  rightPriceScale: {
    drawTicks: false,
  },
};