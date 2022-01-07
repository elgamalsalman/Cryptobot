import { updateCharts } from "./charter.js";
import { createBotCards, updateBotCards } from "./bots.js";

const url = window.location;

const ws = new WebSocket(`ws://${url.host}/${url.pathname}${url.search}`);

let isFirstMessage = true;

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data); 

	// console.log(`recieved data : `, data);

	if (type === "init") {
		window.global.database = data;
	}

	if (isFirstMessage) {
		createBotCards();
		isFirstMessage = false;
	}
	updateCharts();
	updateBotCards();
};