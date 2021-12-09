import path from "path";
import http from "http";

import express from "express";
import { WebSocketServer } from "ws";

const port = 3000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", ws => {
	console.log("New connection!");
	//wss.emit("welcome message", { data: "hello!" });
});


app.use("/", express.static(path.join(process.cwd(), "public")));

app.get("/", (request, response, next) => {
  response.sendFile(path.join(process.cwd(), "views", "botview.html"));
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});