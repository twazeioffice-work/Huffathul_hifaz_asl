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
  { id: 'AFF-891', madrasahName: 'Jamia Darul Uloom Al-Huda', location: 'Hyderabad, Telangana', principalName: 'Mufti Ismail Qasmi', studentsCount: 180, status: 'PENDING' },
  { id: 'AFF-892', madrasahName: 'Suffat-ul Quran Academy', location: 'Kozhikode, Kerala', principalName: 'Qari Bilal Nadwi', studentsCount: 95, status: 'PENDING' },
  { id: 'AFF-890', madrasahName: 'Al-Furqan Islamic Institute', location: 'Lucknow, Uttar Pradesh', principalName: 'Maulana Tariq Azmi', studentsCount: 240, status: 'APPROVED' },
];

const INITIAL_POSTS: CommunityPost[] = [
  { id: 'P-1', author: 'Dr. Abdul Rahman (Chief Academic Officer)', role: 'HQ Central Board (Hyderabad)', title: 'Standardized Sabaq Evaluation Rubric 2026', content: 'All affiliated Indian branches (Bengaluru, Mumbai, Hyderabad, Kerala) are requested to download the updated Tajweed certification guidelines from the reports portal.', timestamp: '2 hours ago', likes: 14 },
  { id: 'P-2', author: 'Qari Abdullah (Hifz Supervisor)', role: 'Bengaluru Campus', title: 'National Inter-Madrasah Qirat Competition Date Announcement', content: 'The inter-campus Qirat and Hifz competition will commence on the 15th of next month InshaAllah at the Bengaluru auditorium.', timestamp: '1 day ago', likes: 29 },
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
      role: 'Global Admin (India Hub)',
      title: newTitle.trim(),
      content: newContent.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts([newEntry, ...posts]);
    setNewTitle('');
    setNewContent('');
    showToast('Community announcement broadcasted across all Indian branches!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-white/90 border border-indigo-500/40 text-indigo-200 shadow-glow-cyan backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Decentralized Community Network
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-black font-semibold tracking-tight">Indian Madrasah Affiliations &amp; Forum</h1>
        <p className="text-xs md:text-sm text-slate-700 font-medium mt-1">
          Cross-Madrasah Knowledge Sharing • Accreditation Approvals • Regional Teacher Forum (All India)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-black font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Broadcast Regional Notice
            </h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Announcement Title (e.g. Karnataka Regional Hifz Workshop)..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-black font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
              />
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={3}
                placeholder="Compose directive for affiliated teachers and administrators across India..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-black font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
                >
                  Publish Announcement &rarr;
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-medium">Community Broadcast Feed</h3>
            {posts.map(post => (
              <div key={post.id} className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-slate-200 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-black font-semibold text-sm">{post.author}</div>
                    <div className="text-xs text-indigo-400 font-semibold">{post.role} • {post.timestamp}</div>
                  </div>
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-500/40 text-slate-700 font-medium hover:text-rose-400 text-xs transition-all"
                  >
                    <span>❤️</span>
                    <span className="font-bold">{post.likes}</span>
                  </button>
                </div>
                <h4 className="text-sm font-bold text-black font-medium">{post.title}</h4>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{post.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-medium">Affiliation Approvals</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30 font-bold">
                {requests.filter(r => r.status === 'PENDING').length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="p-4 rounded-xl bg-white/60 border border-slate-200/80 space-y-3">
                  <div>
                    <div className="font-bold text-black font-semibold text-sm">{req.madrasahName}</div>
                    <div className="text-xs text-slate-700 font-medium">{req.location} • <strong className="text-slate-800 font-medium">{req.studentsCount} Students</strong></div>
                    <div className="text-xs text-slate-700 font-medium">Principal: <span className="text-cyan-400">{req.principalName}</span></div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      req.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400' :
                      req.status === 'REJECTED' ? 'bg-rose-950 text-rose-400' :
                      'bg-amber-950 text-amber-400'
                    }`}>
                      {req.status}
                    </span>

                    {req.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(req.id, req.madrasahName)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-700 font-medium hover:text-rose-400 text-[11px] font-semibold transition-all"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleApprove(req.id, req.madrasahName)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-bold hover:brightness-110 shadow-glow-emerald transition-all"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
