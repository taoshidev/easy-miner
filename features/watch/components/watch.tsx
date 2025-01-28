"use client";

import {useState, useCallback, useMemo, useEffect} from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { upperCase, find } from "lodash";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WatchForm from "@/features/watch/components/watch-form";

import useSignalStore from "@/app/store/signalStore";
import { EXCHANGES } from "@/constants";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import {Config, ExchangeInfo, Signal} from "@/types";
import {getConfig} from "@/app/actions/config";

export default function Watch() {
  const { signals, exchange: currentExchange } = useSignalStore();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  const handleDialogToggle = (dialog: string | null) => {
    setOpenDialog(dialog);
  };

  const disabledTrigger = useCallback(
    (exchange: ExchangeInfo) => {
      return !!(currentExchange && currentExchange !== exchange.name);
    },
    [currentExchange],
  );


  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await getConfig();

      setConfig(data);
    }


    if (!config) {
      fetchConfig();
    }

  }, [getConfig])

  const currentExchangeInfo = useMemo(() => {
    if (!config?.exchange || !EXCHANGES.length) return null;
    const foundExchange = find(EXCHANGES, (ex) => ex.name.toLowerCase() === config.exchange.toLowerCase());
    return foundExchange || null;
  }, [config?.exchange]);

  if (!config?.exchange || !currentExchangeInfo) {
    return null;
  }


  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Watch Signals</CardTitle>
          <CardDescription>
            Set Up Your Exchange or Start Monitoring Orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
              <Dialog
                open={openDialog === currentExchangeInfo.name}
                onOpenChange={() =>
                  handleDialogToggle(openDialog ? null : currentExchangeInfo.name)
                }
              >
                <DialogTrigger
                  disabled={disabledTrigger(currentExchangeInfo)}
                  className={cn(
                    "flex-1 rounded-md border px-4 py-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                    disabledTrigger(currentExchangeInfo) &&
                    "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="flex justify-center items-center gap-2">
                    <div className="text-xs">{upperCase(currentExchangeInfo.name)}</div>
                    {currentExchange === currentExchangeInfo.name && (
                      <CircleCheck size={14} className="text-green-500">
                        connected
                      </CircleCheck>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                  <DialogTitle>{currentExchangeInfo.title}</DialogTitle>
                  <DialogDescription>
                    {currentExchangeInfo.description}
                  </DialogDescription>
                  </DialogHeader>
                  <WatchForm
                    exchange={currentExchangeInfo.name}
                    onSubmitAction={() =>
                      handleDialogToggle(openDialog ? null : currentExchangeInfo.name)
                    }
                    onCancelAction={() => handleDialogToggle(null)}
                  />
                </DialogContent>
              </Dialog>
          </div>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger className="text-xs text-center w-full mt-4 hover:underline hover:cursor-pointer">
          View Recent Signals
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <div className="mx-auto w-full">
            <DialogHeader className="mb-4">
              <DialogTitle>Recent Signals</DialogTitle>
              <DialogDescription>
                View your most recent signals.
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Trade Pair</TableHead>
                  <TableHead className="text-xs">Trade Type</TableHead>
                  <TableHead className="text-xs">Order Type</TableHead>
                  <TableHead className="text-xs">Direction</TableHead>
                  <TableHead className="text-xs">Time</TableHead>
                  <TableHead className="text-xs">Order Status</TableHead>
                  <TableHead className="text-xs">PTN Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signals
                  .slice()
                  .reverse()
                  .map((signal: Signal, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-xs">{signal.symbol}</TableCell>
                      <TableCell className="text-xs">
                        {signal.info.category}
                      </TableCell>
                      <TableCell className="text-xs">{signal.type}</TableCell>
                      <TableCell className="text-xs">{signal.side}</TableCell>
                      <TableCell className="text-xs">
                        {formatDate(signal.timestamp)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {signal.info.orderStatus}
                      </TableCell>
                      <TableCell className="text-xs">
                        {signal.ptn.error ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="xs" variant="outline">
                                View Error
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="mb-4">
                                  Error Logs
                                </DialogTitle>
                                <DialogDescription asChild>
                                  <SyntaxHighlighter
                                    language="bash"
                                    style={a11yDark}
                                  >
                                    {signal.ptn.error}
                                  </SyntaxHighlighter>
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          signal.ptn.status
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
