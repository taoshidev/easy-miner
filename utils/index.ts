import { formatDistance, format } from "date-fns";

import { Signal } from "@/types";

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
) {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    });

    return formatter.format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return amount.toString();
  }
}

export const toastContent = (signal: Signal) => {
  let title = "";
  let description = "";

  if (signal.info.orderStatus === "New") {
    title = "New Order Created";
    description = `${signal.symbol}: ${signal.side} ${signal.amount} at ${formatCurrency(signal.price)}`;
  }

  if (signal.info.orderStatus === "Cancelled") {
    title = "Order Cancelled";
    description = `${signal.symbol}: ${signal.side} ${signal.amount} at ${formatCurrency(signal.price)}`;
  }

  if (signal.info.orderStatus === "Filled") {
    title = "Order Sent to PTN";
    description = `${signal.symbol}: ${signal.side} ${signal.amount} at ${formatCurrency(signal.price)}`;
  }

  return { title, description };
};

export const timeAgo = (time: string) => {
  return formatDistance(new Date(time), new Date(), { addSuffix: true });
};

export const formatDate = (time: string | number) => {
  return format(time, "MM/dd/yyyy hh:mm:ss aaa");
};
