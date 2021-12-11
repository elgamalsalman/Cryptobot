import { symbol, interval } from "../config.js";
import Database from "../models/database.js";

const coinDatabase = new Database(symbol, interval);

export default coinDatabase;