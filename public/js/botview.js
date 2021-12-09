const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = event => {
	console.log(event);
};

console.log("Hello World");