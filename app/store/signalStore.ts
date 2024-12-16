import { create } from "zustand";

import { WEBSOCKET_URL } from "@/constants";
import { Signal } from "@/types";

interface SignalsState {
  signals: Signal[];
  exchange: string;
  isWatching: boolean;
  error: string | null;
  startWebSocket: (exchange: string) => void;
  stopWebSocket: () => void;
  addSignal: (newSignal: Signal[]) => void;
  clearError: () => void;
}

const useOrdersStore = create<SignalsState>((set, get) => {
  let ws: WebSocket | null = null;

  return {
    signals: [],
    isWatching: false,
    exchange: "",
    error: null,

    startWebSocket: (exchange: string) => {
      if (get().isWatching) return;

      ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        console.log("Socket WebSocket connection opened");
        set({
          exchange,
          isWatching: true,
          error: null,
        });
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          set((state) => {
            const existingIndex = state.signals.findIndex(
              (s) => s.info.orderId === message.data.info.orderId,
            );

            if (existingIndex >= 0) {
              const updatedSignals = [...state.signals];

              updatedSignals[existingIndex] = {
                ...updatedSignals[existingIndex],
                ...message.data,
              };

              return { signals: updatedSignals, error: null };
            }

            return {
              signals: [...state.signals, message.data],
              error: null,
            };
          });
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          set({ error: "Failed to parse server message" });
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        set({ isWatching: false });
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        set({
          error: "WebSocket connection error",
          isWatching: false,
        });
      };
    },

    stopWebSocket: () => {
      if (ws) {
        ws.close();
        ws = null;
        set({ isWatching: false, exchange: "" });
      }
    },

    addSignal: (newSignal: Signal[]) => {
      set((state) => ({ signals: [...state.signals, ...newSignal] }));
    },

    clearError: () => {
      set({ error: null });
    },
  };
});

export default useOrdersStore;
