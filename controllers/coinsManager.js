import { botConfig } from "../config.js";
import CoinInterface from "../models/coinInterface.js";

const coinUserCount = new Map();
const coinInterfaces = new Map();

const addCoinUser = (symbol, botMetaData) => {
  const currCount = coinUserCount.get(symbol);
  if (!currCount) {
    coinUserCount.set(symbol, 1);
    coinInterfaces.set(symbol, new CoinInterface(symbol));
		if (botMetaData) coinInterfaces.get(symbol).hookBot(botMetaData);
  } else {
		coinUserCount.set(symbol, currCount + 1);
		if (botMetaData) coinInterfaces.get(symbol).hookBot(botMetaData);
	}

	console.log("coinInterfaces:-");
	for (let [currSymbol] of coinInterfaces.entries()) {
		console.log(`\t${currSymbol}`);
	}
};

const removeCoinUser = (symbol) => {
  const currCount = coinUserCount.get(symbol);
  if (currCount === 1) {
    coinUserCount.delete(symbol);
    coinInterfaces.delete(symbol);
  } else coinUserCount.set(symbol, currCount - 1);

	console.log("coinInterfaces:-");
	for (let [currSymbol] of coinInterfaces.entries()) {
		console.log(`\t${currSymbol}`);
	}
};

const launchCoins = () => {
	console.log("launching coins");
  for (let botMetaData of botConfig) {
    addCoinUser(botMetaData.symbol, botMetaData);
  }
};

export {
	addCoinUser,
	removeCoinUser,
	launchCoins,
	coinInterfaces,
};