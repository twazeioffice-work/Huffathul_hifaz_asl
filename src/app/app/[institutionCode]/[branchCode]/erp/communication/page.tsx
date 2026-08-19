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
    phone: '+92 300 1234567',
    studentName: 'Hamza Tariq (Para 14)',
    category: 'Attendance',
    unread: false,
    messages: [
      { id: '1', sender: 'parent', text: 'Assalamoalaikum, Hamza had a fever yesterday so he could not attend the morning Sabaq session.', timestamp: '08:15 AM' },
      { id: '2', sender: 'bot', text: 'Walaikum Assalam. The AI Assistant has logged a verified Medical Leave in the LMS ledger. JazakAllah khair!', timestamp: '08:16 AM' },
    ],
  },
  {
    id: 'conv-2',
    contactName: 'Sr. Maryam Siddiqui (Mother)',
    phone: '+92 321 9876543',
    studentName: 'Zayd Siddiqui (Para 3)',
    category: 'Fee Inquiry',
    unread: true,
    messages: [
      { id: '1', sender: 'parent', text: 'Can I get the online challan for September semester fees?', timestamp: '09:30 AM' },
      { id: '2', sender: 'agent', text: 'Walaikum Assalam. Your fee challan #CH-9921 is available for download in the portal ($120).', timestamp: '09:32 AM' },
    ],
  },
  {
    id: 'conv-3',
    contactName: 'Ustadh Huzaifa (Teacher)',
    phone: '+92 333 4567890',
    studentName: 'Hifz Class Halqa B',
    category: 'Sabaq Daily',
    unread: false,
    messages: [
      { id: '1', sender: 'agent', text: 'Ustadh, please submit the Daur report for Halqa B before 2:00 PM.', timestamp: '10:00 AM' },
      { id: '2', sender: 'parent', text: 'Alhamdulillah submitted 18 students Sabaq cards.', timestamp: '10:15 AM' },
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
        text: 'Automated WhatsApp dispatch receipt acknowledged (Meta Cloud API 200 OK).',
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
    }, 1200);
  };

  const filteredConversations = filterCategory === 'ALL' 
    ? conversations 
    : conversations.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-slate-800/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> WhatsApp & SMS Gateway
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Omnichannel AI Helpdesk</h1>
          <p className="text-xs text-slate-400">Meta WhatsApp Cloud API v19.0 Integration • Automated Parent AI Assistant</p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Attendance', 'Fee Inquiry', 'Sabaq Daily'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        <div className="glass-panel rounded-2xl p-4 flex flex-col overflow-hidden border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex justify-between items-center">
            <span>Active Threads ({filteredConversations.length})</span>
            <span className="text-[10px] text-cyan-400 font-mono">Meta Live</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedId;
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-cyan-950/50 border-cyan-500/50 shadow-glow-cyan' 
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-white truncate">{conv.contactName}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{lastMsg?.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 font-medium mb-1">{conv.studentName}</div>
                  <p className="text-[11px] text-slate-400 truncate">{lastMsg?.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {activeConv.contactName}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {activeConv.category}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">{activeConv.phone} • Student: <strong className="text-slate-200">{activeConv.studentName}</strong></div>
            </div>
            <button 
              onClick={() => setInputText('Your monthly Sabaq report is ready to view in the parent portal.')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700"
            >
              + Sabaq Template
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/40">
            {activeConv.messages.map((msg) => {
              const isParent = msg.sender === 'parent';
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isParent ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-mono">
                    <span>{isParent ? 'Parent / Sender' : isBot ? '🤖 AI Automation' : 'Staff Admin'}</span>
                    <span>• {msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                      isParent
                        ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                        : isBot
                        ? 'bg-emerald-950/80 text-emerald-200 rounded-tr-none border border-emerald-500/40 shadow-glow-emerald'
                        : 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none shadow-glow-cyan'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type official WhatsApp response or parent notice... (Press Enter)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-sans"
            />
            <button
              onClick={handleSendMessage}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-glow-cyan active:scale-95"
            >
              Send Message &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
