import { Trade, exchanges } from "ccxt";

export interface MinerData {
  testnet: boolean;
  wallet: string;
  debug: boolean;
  dashboard: boolean;
}

export interface ExchangeInfo {
  name: keyof typeof exchanges;
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
  [key: string]: string | ExchangeConfig;
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
