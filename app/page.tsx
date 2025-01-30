"use client";

import { useEffect } from "react";
import { last } from "lodash";
import Image from 'next/image'

import { useToast } from "@/hooks/use-toast";
import { Signal } from "@/types";
import { toastContent } from "@/utils";

import useSignalStore from "@/app/store/signalStore";

import Start from "@/features/start/components/start";
import Watch from "@/features/watch/components/watch";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { toast } = useToast();
  const { signals } = useSignalStore();

  useEffect(() => {
    if (signals.length) {
      toast(toastContent(last(signals) as Signal));
    }
  }, [toast, signals]);

  return (
    <div className="h-full flex flex-col items-center justify-items-center -8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex gap-8 row-start-2 items-center sm:items-start">
        <div className="w-[500px]">
          <div className="my-10 flex flex-col justify-center items-center">
            <Image
              className='mb-4'
              src="/easy-miner.png"
              width={75}
              height={65}
              alt="easy miner logo"
            />
            <div>
              <p className='text-xs italic text-muted-foreground'>let&apos;s make it easy.</p>
            </div>
          </div>

          <Tabs defaultValue="watch" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="watch">Watch Signals</TabsTrigger>
              <TabsTrigger value="miner" disabled>
                Start Miner
              </TabsTrigger>
            </TabsList>
            <TabsContent value="watch">
              <Watch />
            </TabsContent>
            <TabsContent value="miner">
              <Start />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
