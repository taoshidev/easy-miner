"use client";

import { useEffect, useState, useMemo, MouseEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useSignalStore from "@/app/store/signalStore";
import { saveConfig, getConfig } from "@/app/actions/config";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ExchangeConfig } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
  exchange: z.string(),
  apiKey: z.string().min(1, {
    message: "API Key must be at least 1 characters.",
  }),
  secret: z.string().min(1, {
    message: "API Secret must be at least 1 characters.",
  }),
  demo: z.boolean(),
});

interface UploadFormProps {
  onCancelAction: () => void;
  onSubmitAction: () => void;
  exchange: string;
}

export default function WatchForm({
  onCancelAction,
  onSubmitAction,
  exchange,
}: UploadFormProps) {
  const { isWatching, startWebSocket, stopWebSocket } = useSignalStore();
  const [isConnected, setIsConnected] = useState(false);
  const [, setError] = useState<Error | undefined>();
  const [editMode, setEditMode] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      exchange: exchange || "",
      apiKey: "",
      secret: "",
      demo: true,
    },
  });

  const handleSubmit = async (data: ExchangeConfig) => {
    const response = await saveConfig(data);

    if (response.data) {
      toast({
        title: "Success!",
        description: response.message,
      });

      setEditMode(false);
      setIsConnected(true);
    }

    onSubmitAction();
  };

  const onCancel = (e: MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    onCancelAction();
    setEditMode(false);
  };

  const onStart = async () => {
    startWebSocket(exchange);
    onCancelAction();

    toast({
      title: "Monitoring Active",
      description: `Watching for orders on ${exchange}`,
    });
  };

  const onStop = () => {
    stopWebSocket();
    onCancelAction();

    toast({
      title: "Monitoring Stopped",
      description: `You have stopped watching for orders on ${exchange}.`,
    });
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await getConfig();
        console.log(data);

        if (error) {
          throw new Error(error);
        }

        form.reset({
          exchange: exchange,
          apiKey: data.apiKey,
          secret: data.secret,
          demo: data.demo,
        });

        setEditMode(false);
        setIsConnected(true);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error", error);

          setError(error);
          toast({
            title: "Configuration Not Found!",
            description: `Add your exchange information in config`,
          });
        }

        setIsConnected(false);
        setEditMode(true);
      }
    };

    fetchConfig();
  }, [form, exchange]);

  const showEditMode = useMemo(() => {
    return editMode;
  }, [editMode]);

  const toggleEdit = () => {
    setEditMode(true);
  };

  return (
    <div>
      {!showEditMode ? (
        <div>
          <div className="w-full text-center py-20">
            {isConnected && (
              <Button variant="link" onClick={toggleEdit}>
                Edit Configuration
              </Button>
            )}
          </div>
          <div className="flex w-full gap-8">
            <Button className="w-full" onClick={onStart} disabled={isWatching}>
              {isWatching ? "Watching..." : "Start Watching"}
            </Button>
            <Button
              className="w-full"
              onClick={onStop}
              disabled={!isWatching}
              variant="secondary"
            >
              Stop Watching
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            className="grid w-full items-center gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="exchange"
              render={({ field }) => (
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              )}
            />
            <FormField
              disabled
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled
              control={form.control}
              name="secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your API Secret"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 w-full my-4">
              <FormField
                control={form.control}
                name="demo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl >
                      <div className="flex justify-end items-center space-x-2">
                        <Switch
                          disabled
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="demo">Demo Account</Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full gap-8">
              <Button className="w-full" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="w-full" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
