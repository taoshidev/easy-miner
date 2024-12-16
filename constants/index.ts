import { ExchangeInfo } from "@/types";

export const API_URL = "http://localhost:8080/api";
export const WEBSOCKET_URL = "ws://localhost:8080";

export const EXCHANGES: ExchangeInfo[] = [
  {
    name: "bybit",
    title: "Add your Bybit API keys",
    description: "Add your Bybit API keys to start trading.",
  },
  {
    name: "mexc",
    title: "Add your Mexc API keys",
    description: "Add your Mexc API keys to start trading.",
  },
  {
    name: "okx",
    title: "Add your OKX API keys",
    description: "Add your Bybit API keys to start trading.",
  },
  {
    name: "binance",
    title: "Add your Binance API keys",
    description: "Add your Binance API keys to start trading.",
  },
];
