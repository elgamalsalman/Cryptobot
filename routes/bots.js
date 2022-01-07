import path from "path";

import express from "express";

import { defaultExchange } from "../config.js";
import binanceClient from "../controllers/binanceManager.js";

const router = express.Router();

router.get("/", (request, response, next) => {
	response.redirect(`/charts?base=${defaultExchange.base}&quote=${defaultExchange.quote}`);
});

router.get("/charts", (request, response, next) => {
	const { base, quote } = request.query;
	if (base !== base.toUpperCase() || quote !== quote.toUpperCase()) {
		response.redirect(`/charts?base=${base.toUpperCase()}&quote=${quote.toUpperCase()}`);
	} else {
		const symbol = base + quote;
		binanceClient.isSymbolValid(symbol)
			.then(isValid => {
				if (isValid) {
					console.log(`${symbol} is valid`);
					response.sendFile(path.join(process.cwd(), "views", "botview.html")); 
				} else {
					console.log(`${symbol} is invalid`);
					response.sendFile(path.join(process.cwd(), "views", "404.html"));
				}
			});
	}
});


export default router;