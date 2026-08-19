'use client';

import React, { useState } from 'react';

interface Message {
  id: string;
  sender: 'parent' | 'bot' | 'agent';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  contactName: string;
  phone: string;
  studentName: string;
  category: 'Attendance' | 'Fee Inquiry' | 'Sabaq Daily';
  unread: boolean;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    contactName: 'Br. Tariq Mehmood (Parent)',
    phone: '+91 98450 12345',
    studentName: 'Hamza Tariq (Para 14)',
    category: 'Attendance',
    unread: false,
    messages: [
      { id: '1', sender: 'parent', text: 'Assalamoalaikum, Hamza had a fever yesterday so he could not attend the morning Sabaq session in Bengaluru.', timestamp: '08:15 AM' },
      { id: '2', sender: 'bot', text: 'Walaikum Assalam. The AI Assistant has logged a verified Medical Leave in the LMS ledger. JazakAllah khair!', timestamp: '08:16 AM' },
    ],
  },
  {
    id: 'conv-2',
    contactName: 'Sr. Maryam Siddiqui (Mother)',
    phone: '+91 98480 98765',
    studentName: 'Zayd Siddiqui (Para 3)',
    category: 'Fee Inquiry',
    unread: true,
    messages: [
      { id: '1', sender: 'parent', text: 'Can I get the online challan for September semester fees for Hyderabad campus?', timestamp: '09:30 AM' },
      { id: '2', sender: 'agent', text: 'Walaikum Assalam. Your fee challan #CH-9921 is available for download in the portal (₹9,500).', timestamp: '09:32 AM' },
    ],
  },
  {
    id: 'conv-3',
    contactName: 'Ustadh Huzaifa Nadwi (Teacher)',
    phone: '+91 98200 45678',
    studentName: 'Hifz Class Halqa B (Mumbai)',
    category: 'Sabaq Daily',
    unread: false,
    messages: [
      { id: '1', sender: 'agent', text: 'Ustadh, please submit the Daur report for Halqa B before 2:00 PM.', timestamp: '10:00 AM' },
      { id: '2', sender: 'parent', text: 'Alhamdulillah submitted 18 students Sabaq cards for Mumbai campus.', timestamp: '10:15 AM' },
    ],
  },
];

export default function CommunicationGateway() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>('conv-1');
  const [inputText, setInputText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const activeConv = conversations.find(c => c.id === selectedId) || conversations[0];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedId) {
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Automated WhatsApp dispatch receipt acknowledged (Meta Cloud API 200 OK via +91 Indian Gateway).',
        timestamp: 'Just now',
      };
      setConversations(prev => prev.map(c => {
        if (c.id === selectedId) {
          return {
            ...c,
            messages: [...c.messages, botMsg]
          };
        }
        return c;
      }));
    }, 1000);
  };

  const filteredConversations = filterCategory === 'ALL'
    ? conversations
    : conversations.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Omnichannel Communication Gateway
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Parent &amp; Teacher WhatsApp Desk</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Meta Cloud API Inbound Gateway • Indian Phone Registry (+91) • Automated Attendance AI Ingestion
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl text-xs font-semibold">
          {['ALL', 'Attendance', 'Fee Inquiry', 'Sabaq Daily'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterCategory === cat ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan' : 'text-slate-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Conversations ({filteredConversations.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`p-4 cursor-pointer transition-all ${selectedId === conv.id ? 'bg-cyan-950/40 border-l-4 border-cyan-400' : 'hover:bg-slate-900/40'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">{conv.contactName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{conv.category}</span>
                </div>
                <div className="text-xs text-cyan-300 mb-1">{conv.studentName}</div>
                <div className="text-xs text-slate-400 truncate font-mono text-[11px]">{conv.phone}</div>
                <div className="text-xs text-slate-400 truncate mt-1">
                  {conv.messages[conv.messages.length - 1]?.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">{activeConv.contactName}</div>
              <div className="text-xs text-slate-400 font-mono text-[11px]">
                {activeConv.phone} • Student: <strong className="text-slate-200">{activeConv.studentName}</strong>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Meta +91 Ingress Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeConv.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-1">
                  {msg.sender === 'agent' ? 'Admin Agent' : msg.sender === 'bot' ? '🤖 AI Auto-Responder' : activeConv.contactName} • {msg.timestamp}
                </div>
                <div
                  className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'agent'
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-glow-cyan'
                      : msg.sender === 'bot'
                      ? 'bg-slate-900 border border-cyan-500/30 text-cyan-200 rounded-tl-none'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type verified response (sends via Meta Cloud API)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
            >
              Send &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
