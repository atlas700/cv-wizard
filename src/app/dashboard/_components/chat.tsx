"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storeAiGeneratedData } from "@/server/actions/ai-cv";
import { Loader2, Send } from "lucide-react";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate resume");
      }

      setAIResponse(data);

      const assistantMessage: Message = {
        role: "assistant",
        content: JSON.stringify(data, null, 2),
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          error instanceof DOMException && error.name === "AbortError"
            ? "Sorry, the request took too long. Please try again."
            : `Error: ${
                error instanceof Error
                  ? error.message
                  : "Failed to generate resume"
              }`,
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveData = () => {
    if (!aiResponse) return;

    startTransition(async () => {
      const result = await storeAiGeneratedData({ data: aiResponse });

      if (result.success) {
        redirect(`/dashboard/profiles/${result.profileId}/edit`);
      } else {
        toast({
          title: "Error",
          content: "Can't save your cv, please try again",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-7 gap-y-6 lg:gap-y-0 lg:gap-x-8">
      <div className="col-span-7 lg:col-span-3">
        <div className="max-w-2xl">
          <p className="text-gray-500 font-light ">
            when the data is correct then submit to create your cv and chose the
            cv template
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <p className="text-gray-500 font-light">
            if any of the information is not correct or typed incorrect please
            check and refill the data in the edit menu of the cv, if you mention
            the start date and not mention the end date of education or
            experience the ai won't know about the real dates until you mention
            both start and end dates,
          </p>
          <Button
            onClick={handleSaveData}
            className="self-start"
            disabled={isPending || isLoading || messages.length === 0}
          >
            {isPending ? (
              <div className="flex gap-1">
                <Loader2 className="size-5 animate-spin" />
                <span>Saving your cv</span>
              </div>
            ) : (
              <span>Create CV</span>
            )}
          </Button>
          {isPending && (
            <p className="text-gray-600 font-medium">
              You will be redirected to the cv edit page
            </p>
          )}
        </div>
      </div>
      <Card className="p-4 col-span-7 lg:col-span-4">
        <div className="bg-white rounded-lg">
          <div className="h-[70vh] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="p-4 text-gray-500 text-center">
                <p className="text-sm mt-2">
                  Example: "I am a software developer with 5 years of experience
                  in React and Node.js, graduated from MIT in 2019, currently
                  working at Google on cloud infrastructure projects."
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {message.content}
                  </pre>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-sm text-gray-500 ml-2">
                      Generating resume...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t p-4 flex flex-col md:flex-row gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your professional bio here..."
              className=" resize-none"
              rows={5}
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant={"accent"}
              disabled={isLoading || !input.trim()}
              className="disabled:cursor-not-allowed
            transition-colors"
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
