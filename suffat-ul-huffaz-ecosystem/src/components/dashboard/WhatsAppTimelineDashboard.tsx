"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Send, CheckCheck, ShieldAlert, Clock, UserCheck, 
  Search, Bot, Sparkles, AlertCircle, RefreshCw, ChevronRight, Phone
} from "lucide-react";

export interface ChatMessage {
  id: string;
  senderPhone: string;
  senderType: "PARENT" | "STAFF" | "SYSTEM" | "AI_ASSISTANT";
  senderName: string;
  resolvedProfileId?: string;
  resolvedProfileName?: string;
  messageType: "text" | "image" | "document";
  bodyText: string;
  mediaUrl?: string;
  timestamp: string;
  deliveryStatus: "SENT" | "DELIVERED" | "READ" | "FAILED";
}

export interface ChatThread {
  id: string; 
  parentPhone: string;
  parentName: string;
  studentName: string;
  studentId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  assignedAgent?: string;
}

export const useWhatsAppHelpdesk = (tenantId: string) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchActiveThreads = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        setThreads([
          {
            id: "THR-1092",
            parentPhone: "+919846012345",
            parentName: "Siddique Rahman",
            studentName: "Abdullah Siddiqui",
            studentId: "STU-501",
            lastMessage: "Thank you for the update on the Tajweed exams.",
            lastMessageTime: "10:14 AM",
            unreadCount: 0,
            status: "OPEN",
            assignedAgent: "Ustad Jameel"
          },
          {
            id: "THR-2011",
            parentPhone: "+919846098765",
            parentName: "Zahra Begum",
            studentName: "Fatima Zahra",
            studentId: "STU-502",
            lastMessage: "Is there school van service available tomorrow?",
            lastMessageTime: "09:30 AM",
            unreadCount: 2,
            status: "OPEN"
          },
          {
            id: "THR-0021",
            parentPhone: "+919543881210",
            parentName: "Yaseen Malik",
            studentName: "Muhammad Malik",
            studentId: "STU-509",
            lastMessage: "Fee payment confirmation reference has been uploaded.",
            lastMessageTime: "Yesterday",
            unreadCount: 0,
            status: "RESOLVED",
            assignedAgent: "Finance Officer"
          }
        ]);
      } catch (err: any) {
        setError("Failed to stream real-time chat registers.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveThreads();
  }, [tenantId]);

  const loadThreadTimeline = async (thread: ChatThread) => {
    setActiveThread(thread);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setMessages([
        {
          id: "MSG-01",
          senderPhone: thread.parentPhone,
          senderType: "PARENT",
          senderName: thread.parentName,
          bodyText: "Assalamu Alaikum, I wanted to check the timing for the upcoming Hifz evaluation.",
          timestamp: "09:15 AM",
          messageType: "text",
          deliveryStatus: "READ"
        },
        {
          id: "MSG-02",
          senderPhone: "SYSTEM",
          senderType: "SYSTEM",
          senderName: "LMS Automation Engine",
          bodyText: "Auto-acknowledgement: Your query has been logged under ID SUH-HLP-992.",
          timestamp: "09:16 AM",
          messageType: "text",
          deliveryStatus: "SENT"
        },
        {
          id: "MSG-03",
          senderPhone: "+919999000011",
          senderType: "STAFF",
          senderName: "Ustad Jameel",
          bodyText: "Wa Alaikumussalam. The evaluation for Abdullah is scheduled tomorrow, August 20, at 10:30 AM.",
          timestamp: "09:45 AM",
          messageType: "text",
          deliveryStatus: "READ"
        },
        {
          id: "MSG-04",
          senderPhone: thread.parentPhone,
          senderType: "PARENT",
          senderName: thread.parentName,
          bodyText: thread.lastMessage,
          timestamp: "10:14 AM",
          messageType: "text",
          deliveryStatus: "DELIVERED"
        }
      ]);
    } catch (err) {
      setError("Failed to retrieve conversation timeline.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!activeThread || !text.trim()) return;
    setSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      const newMsg: ChatMessage = {
        id: `MSG-${Date.now()}`,
        senderPhone: "+919999000011",
        senderType: "STAFF",
        senderName: "Ustad Jameel",
        bodyText: text,
        timestamp: "Now",
        messageType: "text",
        deliveryStatus: "SENT"
      };

      setMessages((prev) => [...prev, newMsg]);
      
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? { ...t, lastMessage: text, lastMessageTime: "Now" }
            : t
        )
      );
    } catch (err) {
      setError("Outbound webhook dispatch failed.");
    } finally {
      setSending(false);
    }
  };

  return {
    threads,
    activeThread,
    messages,
    loading,
    sending,
    error,
    searchText,
    setSearchText,
    loadThreadTimeline,
    sendMessage
  };
};

export const WhatsAppTimelineDashboard: React.FC<{ tenantId: string }> = ({ tenantId }) => {
  const {
    threads,
    activeThread,
    messages,
    loading,
    sending,
    searchText,
    setSearchText,
    loadThreadTimeline,
    sendMessage
  } = useWhatsAppHelpdesk(tenantId);

  const [inputMessage, setInputMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050506] font-sans text-slate-100">
      
      {/* LEFT COLUMN: RESOLVED THREADS LIST (Width 380px) */}
      <div className="flex w-[380px] flex-col border-r border-neutral-800 bg-[#0A0A0C]">
        
        {/* Navigation Header matches Apple-spec universal dashboard */}
        <div className="h-16 px-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-semibold">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <span>Omnichannel Helpdesk</span>
          </div>
        </div>

        {/* Search header panel */}
        <div className="p-4 border-b border-neutral-800">
          <div className="relative flex items-center bg-[#151518] rounded-xl border border-neutral-800 focus-within:border-neutral-700 transition-all">
            <Search className="absolute left-3.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search parent name or student ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic active threads render list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
          {threads.map((thread) => {
            const isActive = activeThread?.id === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => loadThreadTimeline(thread)}
                className={`relative cursor-pointer p-4 transition-all duration-150 flex items-start space-x-3 hover:bg-[#121215] ${
                  isActive ? "bg-[#16161C] border-l-2 border-royal-blue" : ""
                }`}
              >
                {/* Visual Avatar Placeholder */}
                <div className="relative flex-shrink-0 h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center font-mono font-bold text-xs text-slate-300">
                  {thread.parentName.split(" ").map(n => n[0]).join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {thread.parentName}
                    </h4>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {thread.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-[10px] text-neutral-400 truncate mb-1">
                    Student: <span className="text-slate-200">{thread.studentName} ({thread.studentId})</span>
                  </p>

                  <p className="text-xs text-neutral-500 truncate">
                    {thread.lastMessage}
                  </p>
                </div>

                {/* Unread Message Pill Indicator */}
                {thread.unreadCount > 0 && (
                  <span className="flex-shrink-0 bg-blue-500 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-full">
                    {thread.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE TIMELINE & MESSAGING BOX (Adaptive Width) */}
      <div className="flex-1 flex flex-col bg-[#050506]">
        {activeThread ? (
          <>
            {/* Active Thread Meta Panel */}
            <div className="h-16 border-b border-neutral-800 bg-[#0A0A0C] px-6 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-white">
                    {activeThread.parentName}
                  </h3>
                  <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                    {activeThread.studentId}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center">
                    <Phone className="h-3 w-3 mr-1" /> {activeThread.parentPhone}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Parent of <span className="text-slate-300 font-medium">{activeThread.studentName}</span> • Assigned to: <span className="text-neutral-400">{activeThread.assignedAgent || "Unassigned"}</span>
                </p>
              </div>

              {/* Status Header Badge */}
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  <Sparkles className="h-3 w-3 mr-1 animate-pulse" /> Active Session
                </span>
              </div>
            </div>

            {/* Chat Messages Scrolling Timeline viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#050506] to-[#08080C]">
              {messages.map((msg) => {
                const isOutbound = msg.senderType === "STAFF" || msg.senderType === "SYSTEM" || msg.senderType === "AI_ASSISTANT";
                
                return (
                  <div
                    key={msg.id}
                    className={`flex w-full ${isOutbound ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] space-y-1 ${isOutbound ? "items-end" : "items-start"}`}>
                      {/* Sender Meta Block */}
                      <span className="text-[9px] font-mono text-neutral-500 block">
                        {msg.senderName} • {msg.timestamp}
                      </span>

                      {/* Content Bubble (Apple spec rounded design) */}
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.senderType === "AI_ASSISTANT" 
                            ? "bg-purple-900/20 border border-purple-500/25 text-purple-200" 
                            : msg.senderType === "SYSTEM"
                            ? "bg-neutral-800/40 border border-neutral-700/20 text-neutral-300"
                            : isOutbound
                            ? "bg-[#0066cc] text-white" // Apple iOS Link Blue Accent
                            : "bg-[#1C1C1E] text-slate-100"
                        }`}
                      >
                        {msg.bodyText}
                      </div>

                      {/* Outbound delivery tick trackers */}
                      {isOutbound && (
                        <div className="flex justify-end items-center space-x-1">
                          <span className="text-[8px] font-mono text-neutral-600 uppercase">
                            {msg.deliveryStatus}
                          </span>
                          <CheckCheck className={`h-3 w-3 ${
                            msg.deliveryStatus === "READ" ? "text-emerald-400" : "text-neutral-500"
                          }`} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Inbound typing and message composition container */}
            <div className="p-4 border-t border-neutral-800 bg-[#0A0A0C]">
              <div className="flex items-center space-x-3 bg-[#151518] rounded-xl border border-neutral-800 px-3 py-2">
                <input
                  type="text"
                  placeholder="Type an outbound WhatsApp message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
                
                {/* AI Helper Assistant Smart Hook */}
                <button
                  onClick={() => setInputMessage("Assalamu Alaikum. This is to confirm that the requested details have been securely updated.")}
                  className="rounded-lg p-2 text-purple-400 hover:bg-purple-500/10 transition-all flex items-center space-x-1"
                  title="Generate Smart AI response template"
                >
                  <Bot className="h-4 w-4" />
                  <span className="text-[10px] font-mono hidden md:inline">Quick-Draft</span>
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={sending || !inputMessage.trim()}
                  className="rounded-lg bg-[#0066cc] hover:bg-blue-600 text-white p-2 transition-all disabled:opacity-40 disabled:hover:bg-[#0066cc]"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty timeline placeholder view */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="h-12 w-12 text-neutral-700 animate-pulse mb-4" />
            <h3 className="text-sm font-bold text-white">No Conversation Selected</h3>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-sm">
              Select an active conversation register from the left panel to review parent chat logs, student details, and dispatcher telemetry.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
