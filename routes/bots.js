import path from "path";

import express from "express";
import ccxt from "ccxt";

import { defaultSymbol } from "../config.js";

const router = express.Router();
const binanceClient = new ccxt.binance();

router.get("/", (request, response, next) => {
	response.redirect(`/${defaultSymbol}`);
});

router.get("/404", (request, response, next) => {
	response.sendFile(path.join(process.cwd(), "views", "404.html"));
});

router.get("/:symbol", (request, response, next) => {
	const symbol = request.params.symbol;
	if (symbol !== symbol.toUpperCase()) {
		console.log("redirecting");
		response.redirect(`/${symbol.toUpperCase()}`);
	} else {
		binanceClient.fetchMarkets()
			.then(markets => {
				const matchingSymbol = markets.map(market => market.id).find(id => id === symbol);
				if (!matchingSymbol) {
					response.redirect("/404");
				} else {
					response.sendFile(path.join(process.cwd(), "views", "botview.html"));
				}
			});
	}
});


export default router;
