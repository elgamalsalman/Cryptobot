import RandomBot from "./bots/randomBot.js";
import RSIBot from "./bots/rsiBot.js";
import BBandsBot from "./bots/bbandsBot.js";

const botDict = {};
botDict[RandomBot.name] = RandomBot;
botDict[RSIBot.name] = RSIBot;
botDict[BBandsBot.name] = BBandsBot;

export default botDict;