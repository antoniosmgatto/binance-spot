require("dotenv").config();

const WebSocket = require("ws");
const ws = new WebSocket(`${process.env.STREAM_URL}btcusdt@bookTicker`);
const axios = require("axios");
const crypto = require("crypto");

const BUY_VALUE = 19000.00;
const SELL_VALUE = 21000.00
let isOpened = false;

ws.onmessage = async ({ data }) => {
  const parsedEvent = JSON.parse(data);
  const price = parseFloat(parsedEvent.a)

  console.log(`price ${price}`)

  if (price < BUY_VALUE && !isOpened) {
    console.log("buy")
    newOrder("BTCUSDT", "0.001", "BUY")
    isOpened = true;
  } else if (price < SELL_VALUE && isOpened) {
    console.log("sell")
    newOrder("BTCUSDT", "0.001", "SELL")
    isOpened = false;
  }
}

const newOrder = async (symbol, quantity, side) => {
  const data = { symbol, quantity, side };
  data.type = "MARKET";
  data.timestamp = Date.now();

  const signature = crypto.createHmac("sha256", process.env.SECRET_KEY)
  .update(new URLSearchParams(data).toString())
  .digest("hex");

  data.signature = signature;

  const result = await axios({
    method: "POST",
    url: `${process.env.API_URL}/v3/order?${new URLSearchParams(data)}`,
    headers: { "X-MBX-APIKEY": process.env.API_KEY }

  })

  return result;
}
