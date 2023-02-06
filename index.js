require("dotenv").config();
const WebSocket = require("ws");

const ws = new WebSocket(`${process.env.STREAM_URL}btcusdt@bookTicker`);

ws.onmessage = async (event) => {
    console.log(event.data)
}