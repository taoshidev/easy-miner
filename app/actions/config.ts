"use server";

import { type ExchangeConfig } from "@/types";

const API_URL = process.env.API_URL;

const config = {
  port: 8080,
  "signal-server": "http://127.0.0.1:3005",
  "ptn-path":
    "/Users/kenneth/Projects/taoshi/KenTensor/proprietary-trading-network",
  exchange: "mexc",
  mexc: {
    apiKey: "mx0vglvJuWdImkwR7O",
    secret: "6996d47878d64942a0b5eb528206dc11",
    market: "spot",
    demo: false,
  },
};

export async function saveConfig(data: ExchangeConfig) {
  try {
    const response = await fetch(`${API_URL}/save-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return {
      status: response.status,
      message: result.message || "Configuration saved",
      data: result.data,
      error: !response.ok
        ? result.error || "Failed to save configuration"
        : undefined,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to save configuration",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getConfig(exchange?: string) {
  return {
    status: 200,
    message: "Configuration retrieved",
    data: config,
  };

  try {
    const url = exchange
      ? `${API_URL}/get-config?exchange=${exchange}`
      : `${API_URL}/get-config`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to get configuration");
    }

    return {
      status: response.status,
      message: result.message || "Configuration retrieved",
      data: result.data,
      error: !response.ok
        ? result.error || "Failed to get configuration"
        : undefined,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to get configuration",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
