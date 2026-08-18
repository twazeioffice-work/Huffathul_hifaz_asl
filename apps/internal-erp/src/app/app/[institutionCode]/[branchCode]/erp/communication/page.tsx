// Location: apps/internal-erp/src/app/app/[institutionCode]/[branchCode]/erp/communication/page.tsx

"use client";

import { useState, useEffect } from "react";
// import { customFetch } from "@/lib/apiClient"; // Assuming existing

export default function CommunicationThreadPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      // Mocking fetch for compilation
      // const res = await customFetch("/api/v1/communication/threads");
      // if (res.ok) {
      //   const data = await res.json();
      //   setMessages(data.messages);
      // }
      setMessages([
        { id: 1, direction: 'inbound', sender_phone: '+1234567890', message_body: 'Are classes open today?', created_at: new Date().toISOString() },
        { id: 2, direction: 'outbound', sender_phone: 'system_gateway', message_body: 'Yes, classes are open.', created_at: new Date().toISOString() }
      ]);
    } catch (err) {
      console.error("Failed to load dynamic message streams.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-lg p-6 space-y-4 max-w-4xl mx-auto h-[600px] flex flex-col justify-between">
      <h2 className="text-lg font-bold text-primary border-b border-border pb-2">Live Inbound Chat Streams</h2>
      
      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {isLoading ? (
          <p className="text-xs text-muted-foreground animate-pulse">Loading streams...</p>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-3 rounded text-xs max-w-xs ${
                msg.direction === 'inbound' 
                  ? 'bg-card border border-border text-foreground self-start' 
                  : 'bg-primary/20 text-primary self-end ml-auto'
              }`}
            >
              <div className="flex justify-between font-semibold text-[10px] text-muted-foreground mb-1">
                <span>{msg.sender_phone}</span>
                <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
              </div>
              <p>{msg.message_body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
