import { Trade } from "ccxt";

export type ExchangeName = "bybit" | "mexc" | "okx" | "binance" | "coinbase";

export interface ExchangeInfo {
  name: ExchangeName;
  title: string;
  description: string;
}

export interface ExchangeConfig {
  apiKey: string;
  secret: string;
  demo: boolean;
}

export interface Config {
  exchange: string;
  [key: string]: ExchangeConfig;

}

export interface PTN {
  error: string;
  status: string;
}

export interface Signal extends Trade {
  status: string;
  timestamp: number;
  ptn: PTN;
}
