import React, { useState } from 'react';
import { useLiveApi } from '@/hooks/useLiveApi'; // Custom unified client SWR hook
import { AlertCircle, CheckCircle2, ShieldAlert, Send } from 'lucide-react';

interface CaseDetailProps {
  caseId: string;
  currentUserRole: 'USTAD' | 'NAZIM' | 'SUPER_ADMIN' | 'GLOBAL_OPERATIONS';
}

export const CaseDetailView: React.FC<CaseDetailProps> = ({ caseId, currentUserRole }) => {
  const { data: caseDetail, mutate } = useLiveApi(`/welfare-cases/${caseId}`);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!caseDetail) {
    return <div className="text-white animate-pulse">Loading secure case records...</div>;
  }

  const handlePostReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    await fetch(`/api/v1/welfare-cases/${caseId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_body: replyText }),
    });
    setReplyText('');
    setSubmitting(false);
    mutate();
  };

  const handleResolveAction = async () => {
    await fetch(`/api/v1/welfare-cases/${caseId}/resolve`, { method: 'POST' });
    mutate();
  };

  const isUnresolved = caseDetail.status !== 'RESOLVED';
  const myResolutionAcknowledged = currentUserRole === 'USTAD' ? caseDetail.ustad_resolved : caseDetail.admin_resolved;

  return (
    <div className="w-full max-w-4xl p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
      {/* Dynamic Status Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold tracking-wider text-teal-400 uppercase">OFFICIAL STUDENT WELFARE CASE</span>
          <h2 className="text-xl font-bold text-white mt-1">{caseDetail.title}</h2>
        </div>
        
        {/* Visual Badges matching current state */}
        <div className="flex items-center gap-2">
          {caseDetail.status === 'PENDING_LOCAL_RESPONSE' && (
            <span className="flex items-center gap-1 px-3 py-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              <AlertCircle size={14} /> Local Processing
            </span>
          )}
          {caseDetail.status === 'DIVERTED_WITH_DEADLINE' && (
            <span className="flex items-center gap-1 px-3 py-1 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full animate-pulse">
              <ShieldAlert size={14} /> HQ Deadline Action
            </span>
          )}
          {caseDetail.status === 'RESOLVED' && (
            <span className="flex items-center gap-1 px-3 py-1 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              <CheckCircle2 size={14} /> Fully Resolved
            </span>
          )}
        </div>
      </div>

      {/* Case Overview Details */}
      <div className="my-4 text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl">
        <p className="font-semibold text-white mb-2">Original Proposal / Issue:</p>
        {caseDetail.initial_content}
      </div>

      {/* SLA / Escalation Deadlines */}
      {caseDetail.status === 'DIVERTED_WITH_DEADLINE' && (
        <div className="p-4 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-300">HQ Directive Enforced</p>
            <p className="text-xs text-rose-200 mt-1">
              " {caseDetail.hq_special_message} "
            </p>
            <p className="text-xs font-semibold text-rose-300 mt-2">
              Action Deadline: {new Date(caseDetail.resolution_deadline).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Double Resolution Handshake Dashboard */}
      {isUnresolved && (
        <div className="p-4 mb-6 bg-slate-950 rounded-xl border border-white/5">
          <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Double-Party Resolution Matrix</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-xs text-slate-300">Ustad Agreement</span>
              <span className={`text-xs px-2 py-0.5 rounded ${caseDetail.ustad_resolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {caseDetail.ustad_resolved ? 'RESOLVED ✓' : 'UNRESOLVED ✗'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-xs text-slate-300">Center Admin Agreement</span>
              <span className={`text-xs px-2 py-0.5 rounded ${caseDetail.admin_resolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {caseDetail.admin_resolved ? 'RESOLVED ✓' : 'UNRESOLVED ✗'}
              </span>
            </div>
          </div>
          
          {/* Proactive Action Button */}
          {!myResolutionAcknowledged ? (
            <button
              onClick={handleResolveAction}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-emerald-900 bg-emerald-400 hover:bg-emerald-300 active:scale-95 transition-all rounded-lg"
            >
              <CheckCircle2 size={16} /> Mark This Matter Resolved from My End
            </button>
          ) : (
            <p className="mt-4 text-xs text-center text-slate-400 italic">
              ⏳ You have marked this resolved. Waiting for the other party to acknowledge and finalize...
            </p>
          )}
        </div>
      )}

      {/* Chronological Chat Thread */}
      <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {caseDetail.messages?.map((msg: any) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg text-sm ${msg.sender_profile_id === caseDetail.sender_profile_id ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100 ml-8' : 'bg-slate-800 border border-slate-700 text-slate-200 mr-8'}`}
          >
            <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400">
              <span className="font-bold">{msg.sender_name}</span>
              <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
            {msg.message_body}
          </div>
        ))}
      </div>

      {/* Response Input */}
      {isUnresolved && (
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-white/10">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write official response note..."
            className="flex-1 bg-transparent border-none text-white text-sm outline-none px-2 py-1"
          />
          <button
            onClick={handlePostReply}
            disabled={submitting}
            className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
