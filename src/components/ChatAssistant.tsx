"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Minus } from "lucide-react";
import Image from "next/image";

const AVATAR = "/uploads/blog/1772912858359-ex1gg8.gif";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !hasGreeted) {
      setMessages([
        {
          role: "assistant",
          content: "汪！你好呀～我是站长家的puppy崽崽 🐶 家长不在家，我来接客！有什么可以帮你的吗？",
        },
      ]);
      setHasGreeted(true);
    }
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, hasGreeted, minimized]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "喵？" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "网络好像断了~ 稍后再试试？" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Floating button
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="打开智能助手"
      >
        <div className="relative">
          <div className="h-20 w-20 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-xl shadow-black/10 transition-transform duration-300 group-hover:scale-110">
            <Image
              src={AVATAR}
              alt="智能助手"
              width={80}
              height={80}
              className="h-full w-full scale-[1.4] object-cover"
              unoptimized
            />
          </div>
          <span className="absolute bottom-1 right-1 block h-4 w-4 rounded-full border-[2.5px] border-white bg-emerald-500 shadow-sm">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
          </span>
        </div>
      </button>
    );
  }

  // Minimized bar
  if (minimized) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 flex cursor-pointer items-center gap-3 rounded-full bg-white/95 px-5 py-2.5 shadow-xl backdrop-blur transition-all hover:shadow-2xl border border-gray-100"
        onClick={() => setMinimized(false)}
      >
        <div className="relative h-9 w-9 overflow-hidden rounded-full">
          <Image src={AVATAR} alt="智能助手" width={36} height={36} className="h-full w-full object-cover" unoptimized />
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <span className="text-sm font-semibold text-gray-700">智能助手</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            setMinimized(false);
          }}
          className="ml-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[640px] w-[440px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl max-[450px]:bottom-0 max-[450px]:right-0 max-[450px]:h-full max-[450px]:w-full max-[450px]:rounded-none">
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/40">
          <Image src={AVATAR} alt="智能助手" width={48} height={48} className="h-full w-full object-cover" unoptimized />
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-indigo-500 bg-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">智能助手</h3>
          <p className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            在线 · 随时为你服务
          </p>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <Minus className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setMinimized(false);
          }}
          className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="mr-2.5 mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                <Image src={AVATAR} alt="智能助手" width={32} height={32} className="h-full w-full object-cover" unoptimized />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-md"
                  : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="mr-2.5 mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
              <Image src={AVATAR} alt="智能助手" width={32} height={32} className="h-full w-full object-cover" unoptimized />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-white px-5 py-3.5 shadow-sm border border-gray-100">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "0ms" }} />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "150ms" }} />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-4 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-[15px] outline-none transition-colors focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-100"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md transition-all hover:shadow-lg disabled:opacity-40 disabled:shadow-none"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
