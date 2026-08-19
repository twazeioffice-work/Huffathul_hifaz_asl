'use client';

import React, { useState } from 'react';

interface AffiliationRequest {
  id: string;
  madrasahName: string;
  location: string;
  principalName: string;
  studentsCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface CommunityPost {
  id: string;
  author: string;
  role: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
}

const INITIAL_REQUESTS: AffiliationRequest[] = [
  { id: 'AFF-891', madrasahName: 'Jamia Darul Uloom Al-Huda', location: 'Hyderabad Campus', principalName: 'Mufti Ismail', studentsCount: 180, status: 'PENDING' },
  { id: 'AFF-892', madrasahName: 'Suffat-ul Quran Academy', location: 'Sukkur Branch', principalName: 'Qari Bilal', studentsCount: 95, status: 'PENDING' },
  { id: 'AFF-890', madrasahName: 'Al-Furqan Islamic Institute', location: 'Rawalpindi', principalName: 'Maulana Tariq', studentsCount: 240, status: 'APPROVED' },
];

const INITIAL_POSTS: CommunityPost[] = [
  { id: 'P-1', author: 'Dr. Abdul Rahman (Chief Academic Officer)', role: 'HQ Central Board', title: 'Standardized Sabaq Evaluation Rubric 2026', content: 'All affiliated branches are requested to download the updated Tajweed certification guidelines from the reports portal.', timestamp: '2 hours ago', likes: 14 },
  { id: 'P-2', author: 'Qari Abdullah (Hifz Supervisor)', role: 'Gulshan Campus', title: 'Annual Hifz Competition Date Announcement', content: 'The inter-campus Qirat and Hifz testbed competition will commence on the 15th of next month InshaAllah.', timestamp: '1 day ago', likes: 29 },
];

export default function CommunityAffiliationsDashboard() {
  const [requests, setRequests] = useState<AffiliationRequest[]>(INITIAL_REQUESTS);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string, name: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    showToast(`Affiliation for ${name} APPROVED! Cryptographic tenant ID issued.`);
  };

  const handleReject = (id: string, name: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    showToast(`Affiliation request for ${name} declined.`);
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newEntry: CommunityPost = {
      id: Date.now().toString(),
      author: 'HQ Administrator (Current User)',
      role: 'Global Admin',
      title: newTitle.trim(),
      content: newContent.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts([newEntry, ...posts]);
    setNewTitle('');
    setNewContent('');
    showToast('Community announcement broadcasted across all branches!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-indigo-200 shadow-glow-cyan backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Decentralized Community Network
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Community & Institutional Affiliations</h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Cross-Madrasah Knowledge Sharing • Accreditation Approvals • Regional Teacher Forum
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Affiliation Approvals</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                {requests.filter(r => r.status === 'PENDING').length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-200">{req.madrasahName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                      req.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                      'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">
                    {req.location} • Principal: <strong className="text-slate-300">{req.principalName}</strong> ({req.studentsCount} Students)
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleApprove(req.id, req.madrasahName)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id, req.madrasahName)}
                        className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-medium transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleCreatePost} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Broadcast Community Announcement</div>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Announcement Title (e.g. Hifz Sanad Examination Guidelines)..."
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 font-sans"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write detailed notice or circular to all registered branch teachers..."
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 font-sans resize-none"
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-glow-cyan active:scale-95"
              >
                Publish Notice &rarr;
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{post.author}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">{post.role} • {post.timestamp}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 text-xs transition-all active:scale-95"
                  >
                    <span>❤️</span>
                    <span className="font-bold font-mono text-[11px]">{post.likes}</span>
                  </button>
                </div>
                <h3 className="text-sm font-bold text-slate-100 pt-1">{post.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
