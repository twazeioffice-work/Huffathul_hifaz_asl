'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MessageSquare, 
  ArrowUpRight, 
  CornerUpRight, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Send, 
  Search, 
  Filter, 
  X,
  ChevronRight,
  Info
} from 'lucide-react';

// =============================================================================
// TYPINGS & DATA MODELS (ALIGNED WITH POLYMORPHIC SCHEMAS)
// =============================================================================

export type UserRole = 'SUPER_ADMIN' | 'GLOBAL_OPERATIONS' | 'CENTER_ADMIN' | 'MANAGER' | 'USTAD' | 'PARENT';

export interface CaseMessage {
  id: string;
  sender_name: string;
  sender_role: UserRole;
  content: string;
  created_at: string;
}

export interface CommunicationCase {
  id: string;
  title: string;
  description: string;
  initiator_id: string;
  initiator_name: string;
  initiator_role: UserRole;
  target_role: UserRole;
  assigned_resolver_id?: string;
  assigned_resolver_name?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'APPEALED' | 'RESOLVED';
  severity: 'STANDARD' | 'SEVERE';
  created_at: string;
  updated_at: string;
  
  // Double-Party Handshake flags
  resolved_by_initiator: boolean;
  resolved_by_responder: boolean;
  
  // Escalation metadata
  escalated_at?: string;
  is_appealed: boolean;
  directive_notes?: string;
  diversion_deadline?: string;
  
  messages: CaseMessage[];
}

// Mock User Session Context for Testing
const CURRENT_USER = {
  id: 'usr_usthad_saeed',
  name: 'Ustad Saeed Al-Hasan',
  role: 'USTAD' as UserRole,
  branchId: 'br_suffat_hq_01'
};

// Simulated Database Records across the Polymorphic Tree
const MOCK_CASES: CommunicationCase[] = [
  {
    id: 'case_001',
    title: 'Student Health & Absenteeism - Saeed Al-Hasan',
    description: 'Student has registered high fever since Thursday. Requesting temporary sick leave and medical oversight in dormitory.',
    initiator_id: 'usr_parent_hasan',
    initiator_name: 'Hasan Bin Yusuf (Parent)',
    initiator_role: 'PARENT',
    target_role: 'USTAD',
    assigned_resolver_id: 'usr_usthad_saeed',
    assigned_resolver_name: 'Ustad Saeed Al-Hasan',
    status: 'IN_PROGRESS',
    severity: 'SEVERE',
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(), // 36 hours ago
    updated_at: new Date().toISOString(),
    resolved_by_initiator: false,
    resolved_by_responder: false,
    is_appealed: false,
    messages: [
      {
        id: 'msg_1',
        sender_name: 'Hasan Bin Yusuf (Parent)',
        sender_role: 'PARENT',
        content: 'Assalamu Alaikum, my son Saeed has a running temperature of 102F. Please verify if the center medical officer has examined him.',
        created_at: new Date(Date.now() - 36 * 3600000).toISOString()
      },
      {
        id: 'msg_2',
        sender_name: 'Ustad Saeed Al-Hasan',
        sender_role: 'USTAD',
        content: 'Wa Alaikum Assalam. I have updated his well-being log in the portal and informed the manager. The dispensary assistant will deliver meds shortly.',
        created_at: new Date(Date.now() - 24 * 3600000).toISOString()
      }
    ]
  },
  {
    id: 'case_002',
    title: 'Urgent Classroom Ventilation & Fan Upgrades',
    description: 'Classroom 3B ceiling fans are completely non-operational. High afternoon heat is impacting student memorization retention rates.',
    initiator_id: 'usr_usthad_saeed',
    initiator_name: 'Ustad Saeed Al-Hasan',
    initiator_role: 'USTAD',
    target_role: 'MANAGER',
    status: 'OPEN',
    severity: 'STANDARD',
    created_at: new Date(Date.now() - 84 * 3600000).toISOString(), // 84 hours ago (Exceeds 72hr SLA)
    updated_at: new Date(Date.now() - 80 * 3600000).toISOString(),
    resolved_by_initiator: false,
    resolved_by_responder: false,
    is_appealed: false,
    messages: [
      {
        id: 'msg_3',
        sender_name: 'Ustad Saeed Al-Hasan',
        sender_role: 'USTAD',
        content: 'Formally requesting the replacement of two burnt ceiling fans in the 3B Halqa hall. Standard classroom study metrics are dropping due to heat fatigue.',
        created_at: new Date(Date.now() - 84 * 3600000).toISOString()
      }
    ]
  },
  {
    id: 'case_003',
    title: 'Disputed Leave Extension Appeal - Batch 04',
    description: 'Escalated case regarding student holiday leave override. Local manager rejected extending leave for medical recovery.',
    initiator_id: 'usr_usthad_saeed',
    initiator_name: 'Ustad Saeed Al-Hasan',
    initiator_role: 'USTAD',
    target_role: 'SUPER_ADMIN',
    status: 'APPEALED',
    severity: 'SEVERE',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    resolved_by_initiator: false,
    resolved_by_responder: false,
    is_appealed: true,
    escalated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    directive_notes: 'Diverted to Center Admin. Ensure immediate medical board review and respond with resolution steps within 24 hours.',
    diversion_deadline: new Date(Date.now() + 12 * 3600000).toISOString(),
    messages: [
      {
        id: 'msg_4',
        sender_name: 'Ustad Saeed Al-Hasan',
        sender_role: 'USTAD',
        content: 'Local center management declined extending recovery leave for student Bilal. The physical health status logs show he is completely unfit for dormitory return.',
        created_at: new Date(Date.now() - 24 * 3600000).toISOString()
      },
      {
        id: 'msg_5',
        sender_name: 'Super Admin (HQ)',
        sender_role: 'SUPER_ADMIN',
        content: 'This appeal has been received. Redirecting back to Branch Nazim with strict administrative mandate. Finalize resolution immediately.',
        created_at: new Date(Date.now() - 12 * 3600000).toISOString()
      }
    ]
  }
];

// =============================================================================
// MAIN COMPONENT EXPORT
// =============================================================================

export default function UniversalCommunicationInbox() {
  const [sessionUser, setSessionUser] = useState(CURRENT_USER);
  const [cases, setCases] = useState<CommunicationCase[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<CommunicationCase | null>(MOCK_CASES[0]);
  const [newResponseText, setNewResponseText] = useState('');
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'APPEALED' | 'RESOLVED'>('ALL');
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  
  // New Case Form States
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDescription, setNewCaseDescription] = useState('');
  const [newCaseTarget, setNewCaseTarget] = useState<UserRole>('MANAGER');
  const [newCaseSeverity, setNewCaseSeverity] = useState<'STANDARD' | 'SEVERE'>('STANDARD');

  // Divert Form State
  const [divertNotes, setDivertNotes] = useState('');
  const [divertDeadline, setDivertDeadline] = useState('');
  const [showDivertPanel, setShowDivertPanel] = useState(false);

  // Filter cases based on search and current user role privileges
  const filteredCases = cases.filter(c => {
    // 1. Multi-tenant visibility logic: Ensure users only see what is within their role boundaries
    const isInitiator = c.initiator_id === sessionUser.id;
    const isAssignedResolver = c.assigned_resolver_id === sessionUser.id;
    
    // Super Admins see everything. Local admins/managers see things targeting their tier.
    const isGlobalViewer = ['SUPER_ADMIN', 'GLOBAL_OPERATIONS'].includes(sessionUser.role);
    const matchesTargetTier = c.target_role === sessionUser.role;
    
    const hasRolePrivilege = isInitiator || isAssignedResolver || isGlobalViewer || matchesTargetTier;
    
    if (!hasRolePrivilege) return false;

    // 2. Search filters
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.initiator_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 3. Status filters
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate if the selected case is eligible for an SLA-escalated Appeal
  // Rule: Case is older than 72 hours, not resolved, not already escalated, and the current user is the initiator
  const isEligibleForAppeal = (c: CommunicationCase): boolean => {
    if (c.is_appealed || c.status === 'RESOLVED') return false;
    if (c.initiator_id !== sessionUser.id) return false;
    
    const createdTime = new Date(c.created_at).getTime();
    const elapsedTimeHours = (Date.now() - createdTime) / 3600000;
    return elapsedTimeHours >= 72; // 72-hour baseline escalation window
  };

  // Handler: Submit message inside a thread
  const handleSendMessage = () => {
    if (!newResponseText.trim() || !selectedCase) return;

    const updatedCases = cases.map(c => {
      if (c.id === selectedCase.id) {
        const newMsg: CaseMessage = {
          id: `msg_${Date.now()}`,
          sender_name: sessionUser.name,
          sender_role: sessionUser.role,
          content: newResponseText,
          created_at: new Date().toISOString()
        };
        const updatedMessages = [...c.messages, newMsg];
        return {
          ...c,
          status: c.status === 'OPEN' ? 'IN_PROGRESS' : c.status,
          updated_at: new Date().toISOString(),
          messages: updatedMessages
        };
      }
      return c;
    });

    setCases(updatedCases);
    setNewResponseText('');
    
    // Refresh selected case context
    const current = updatedCases.find(c => c.id === selectedCase.id);
    if (current) setSelectedCase(current);
  };

  // Handler: Double-Party Resolution Handshake
  const handleResolutionHandshake = (party: 'initiator' | 'responder') => {
    if (!selectedCase) return;

    const updatedCases = cases.map(c => {
      if (c.id === selectedCase.id) {
        let updateFlags = {};
        if (party === 'initiator') {
          updateFlags = { resolved_by_initiator: !c.resolved_by_initiator };
        } else {
          updateFlags = { resolved_by_responder: !c.resolved_by_responder };
        }

        const nextCase = { ...c, ...updateFlags };
        
        // If BOTH parties have approved resolution, flip status cleanly to RESOLVED
        const finalStatus = (nextCase.resolved_by_initiator && nextCase.resolved_by_responder) 
          ? 'RESOLVED' 
          : c.status;

        return { ...nextCase, status: finalStatus, updated_at: new Date().toISOString() };
      }
      return c;
    });

    setCases(updatedCases);
    const current = updatedCases.find(c => c.id === selectedCase.id);
    if (current) setSelectedCase(current);
  };

  // Handler: Trigger Appeal to Higher Authority (SLA Escalation)
  const handleInitiateAppeal = () => {
    if (!selectedCase) return;

    const updatedCases = cases.map(c => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          status: 'APPEALED' as const,
          is_appealed: true,
          escalated_at: new Date().toISOString(),
          target_role: 'SUPER_ADMIN' as UserRole, // Elevate directly past local center admin
          updated_at: new Date().toISOString()
        };
      }
      return c;
    });

    setCases(updatedCases);
    const current = updatedCases.find(c => c.id === selectedCase.id);
    if (current) setSelectedCase(current);
  };

  // Handler: Divert Appeal Back to Branch with Strict Deadline and Instruction
  const handleDivertAppeal = () => {
    if (!selectedCase || !divertNotes.trim() || !divertDeadline) return;

    const updatedCases = cases.map(c => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          status: 'IN_PROGRESS' as const,
          target_role: 'CENTER_ADMIN' as UserRole, // Force back down to branch Nazim
          directive_notes: divertNotes,
          diversion_deadline: new Date(divertDeadline).toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return c;
    });

    setCases(updatedCases);
    setShowDivertPanel(false);
    setDivertNotes('');
    setDivertDeadline('');
    
    const current = updatedCases.find(c => c.id === selectedCase.id);
    if (current) setSelectedCase(current);
  };

  // Handler: Create New Case
  const handleCreateCase = () => {
    if (!newCaseTitle.trim() || !newCaseDescription.trim()) return;

    const newCase: CommunicationCase = {
      id: `case_${Date.now()}`,
      title: newCaseTitle,
      description: newCaseDescription,
      initiator_id: sessionUser.id,
      initiator_name: sessionUser.name,
      initiator_role: sessionUser.role,
      target_role: newCaseTarget,
      status: 'OPEN',
      severity: newCaseSeverity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved_by_initiator: false,
      resolved_by_responder: false,
      is_appealed: false,
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          sender_name: sessionUser.name,
          sender_role: sessionUser.role,
          content: newCaseDescription,
          created_at: new Date().toISOString()
        }
      ]
    };

    const nextCases = [newCase, ...cases];
    setCases(nextCases);
    setSelectedCase(newCase);
    setNewCaseModalOpen(false);
    
    // Reset Form Fields
    setNewCaseTitle('');
    setNewCaseDescription('');
    setNewCaseTarget('MANAGER');
    setNewCaseSeverity('STANDARD');
  };

  // Helper: Format relative timestamp
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#030712] text-slate-100 font-sans overflow-hidden antialiased">
      {/* 1. Header & Quick User Identity Swapper (For Testing Framework Verification) */}
      <header className="flex flex-wrap items-center justify-between px-6 py-4 bg-slate-900/40 border-b border-white/5 backdrop-blur-md z-10 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
            <MessageSquare className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Hierarchical Communications Portal</h1>
            <p className="text-xs text-slate-400">Universal Directed Acyclic Graph (DAG) Escalation Gateway</p>
          </div>
        </div>

        {/* Brand/User Identity Swapper - Strictly for Testing System Behaviors across roles */}
        <div className="flex items-center space-x-2 bg-slate-800/40 border border-white/10 p-1.5 rounded-xl text-xs">
          <span className="text-slate-400 px-2 font-medium">As Mode:</span>
          {[
            { role: 'USTAD' as UserRole, name: 'Ustad Saeed', id: 'usr_usthad_saeed' },
            { role: 'PARENT' as UserRole, name: 'Parent (Hasan)', id: 'usr_parent_hasan' },
            { role: 'SUPER_ADMIN' as UserRole, name: 'HQ Super Admin', id: 'usr_hq_super_admin' }
          ].map((profile) => (
            <button
              key={profile.role}
              onClick={() => {
                setSessionUser({
                  id: profile.id,
                  name: profile.name,
                  role: profile.role,
                  branchId: 'br_suffat_hq_01'
                });
                setSelectedCase(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-semibold ${
                sessionUser.role === profile.role 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {profile.role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Main Layout Shell */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: Cases Lists & Filters */}
        <aside className="w-96 flex flex-col bg-slate-950/60 border-r border-white/5 h-full overflow-hidden shrink-0">
          
          {/* List Controls */}
          <div className="p-4 space-y-3 bg-slate-900/20 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search cases, initiators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Filter className="h-3 w-3" />
                <span>Filter:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(['ALL', 'OPEN', 'APPEALED', 'RESOLVED'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                      statusFilter === status 
                        ? 'bg-slate-800 text-white border border-white/10' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setNewCaseModalOpen(true)}
              className="w-full py-2 px-4 bg-indigo-600/95 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-center space-x-2"
            >
              <span>Initiate Official Case</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Cases List Container - Customized thin scrollbars */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
            {filteredCases.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400 font-medium">No active communication cases</p>
                <p className="text-xs text-slate-500">Either search query didn't match or you have no authorized tickets in this tier.</p>
              </div>
            ) : (
              filteredCases.map(c => {
                const isSelected = selectedCase?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCase(c);
                      setShowDivertPanel(false);
                    }}
                    className={`w-full text-left p-4 hover:bg-slate-900/35 transition-all flex flex-col space-y-2 focus:outline-none ${
                      isSelected ? 'bg-indigo-600/10 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        c.status === 'APPEALED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animation-pulse' :
                        c.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {c.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatTimestamp(c.created_at)}
                      </span>
                    </div>

                    <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {c.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-medium">
                      <span>By: <b className="text-slate-300 font-semibold">{c.initiator_name}</b></span>
                      <span>Role: <span className="font-mono text-slate-400">{c.initiator_role}</span></span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: Case Detail and Thread View */}
        <main className="flex-1 flex flex-col bg-slate-950/30 overflow-hidden relative">
          {selectedCase ? (
            <>
              {/* Case Details Header */}
              <section className="p-6 bg-slate-900/30 border-b border-white/5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{selectedCase.id}</span>
                      <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
                      <span className={`text-xs font-bold ${selectedCase.severity === 'SEVERE' ? 'text-rose-400' : 'text-slate-400'}`}>
                        {selectedCase.severity} SEVERITY
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight">{selectedCase.title}</h2>
                  </div>

                  {/* Resolution Handshake Status Visualizer */}
                  <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/10 px-4 py-2 rounded-xl text-xs">
                    <Info className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Double-Party Verification</div>
                      <div className="flex items-center space-x-3 text-slate-300 font-medium">
                        <span className="flex items-center space-x-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${selectedCase.resolved_by_initiator ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                          <span>Initiator</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${selectedCase.resolved_by_responder ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                          <span>Responder</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-routing context visualizer (Target flow representation) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-slate-500 font-semibold text-[10px] uppercase">Created Time</div>
                      <div className="text-slate-300 font-medium font-mono">{formatTimestamp(selectedCase.created_at)}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-slate-500 font-semibold text-[10px] uppercase">Directed Target Level</div>
                      <div className="text-slate-300 font-medium font-mono">{selectedCase.target_role}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-slate-500 font-semibold text-[10px] uppercase">State Matrix</div>
                      <div className="text-slate-300 font-semibold">{selectedCase.status}</div>
                    </div>
                  </div>
                </div>

                {/* Display escalation or diversion notes if they are active */}
                {(selectedCase.directive_notes || selectedCase.diversion_deadline) && (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-semibold uppercase tracking-wider">
                      <AlertCircle className="h-4 w-4" />
                      <span>HQ Mandate Instruction &amp; SLA Directive</span>
                    </div>
                    {selectedCase.directive_notes && (
                      <p className="text-slate-300 italic leading-relaxed">
                        &quot;{selectedCase.directive_notes}&quot;
                      </p>
                    )}
                    {selectedCase.diversion_deadline && (
                      <div className="text-[11px] text-slate-400">
                        Action Required Deadline: <span className="text-amber-400 font-mono font-semibold">{formatTimestamp(selectedCase.diversion_deadline)}</span>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Thread Messages List Box */}
              <section className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                <div className="space-y-4">
                  {/* Case Origin Brief */}
                  <div className="p-4 bg-slate-900/25 border border-white/5 rounded-2xl space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Case Initialization Scope</div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{selectedCase.description}</p>
                  </div>

                  {/* Messaging Dialogue Nodes */}
                  {selectedCase.messages.map((msg, index) => {
                    const isCurrentUser = msg.sender_role === sessionUser.role;
                    return (
                      <div key={msg.id || index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl p-4 space-y-1.5 ${
                          isCurrentUser 
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/20 rounded-tr-none' 
                            : 'bg-slate-900/60 border border-white/5 text-slate-200 rounded-tl-none'
                        }`}>
                          <div className="flex items-center justify-between space-x-8 text-[10px] opacity-75 font-semibold">
                            <span>{msg.sender_name}</span>
                            <span className="font-mono">{msg.sender_role}</span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <div className="text-[9px] opacity-50 text-right font-mono">
                            {formatTimestamp(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Interactive Context Controls Footer */}
              <footer className="p-6 bg-slate-900/40 border-t border-white/5 space-y-4">
                
                {/* 1. Administrative Action Ribbons (Appeals, Diversions, Handshakes) */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 border border-white/5 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    {/* Handshake: Initiator Status Controls */}
                    <button
                      onClick={() => handleResolutionHandshake('initiator')}
                      disabled={selectedCase.status === 'RESOLVED'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                        selectedCase.resolved_by_initiator 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400 border border-white/5 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{selectedCase.resolved_by_initiator ? 'Initiator Agreed' : 'Agree (Initiator)'}</span>
                    </button>

                    {/* Handshake: Responder Status Controls */}
                    <button
                      onClick={() => handleResolutionHandshake('responder')}
                      disabled={selectedCase.status === 'RESOLVED'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                        selectedCase.resolved_by_responder 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400 border border-white/5 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{selectedCase.resolved_by_responder ? 'Responder Agreed' : 'Agree (Responder)'}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Escalation/Appeal Option (Programmatically unlocked based on SLA checks) */}
                    {isEligibleForAppeal(selectedCase) && (
                      <button
                        onClick={handleInitiateAppeal}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-rose-950/20 transition-all animation-pulse"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>Appeal to HQ (SLA Breach)</span>
                      </button>
                    )}

                    {/* Diversion: Visible to Higher Authorities to redirect cases down to Branch Admin */}
                    {['SUPER_ADMIN', 'GLOBAL_OPERATIONS'].includes(sessionUser.role) && selectedCase.status === 'APPEALED' && (
                      <button
                        onClick={() => setShowDivertPanel(!showDivertPanel)}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-amber-950/20 transition-all"
                      >
                        <CornerUpRight className="h-3.5 w-3.5" />
                        <span>Divert Back to Branch</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-Panel: Divert and Mandate parameters form */}
                {showDivertPanel && (
                  <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-2xl space-y-3">
                    <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <CornerUpRight className="h-4 w-4" />
                      <span>Set Diversion Mandate Directive</span>
                    </div>
                    
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Write dynamic instructions and resolution steps required by the Center Admin..."
                        value={divertNotes}
                        onChange={(e) => setDivertNotes(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      />
                      
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-[11px] text-slate-400 font-semibold uppercase">Resolution Deadline:</label>
                          <input
                            type="datetime-local"
                            value={divertDeadline}
                            onChange={(e) => setDivertDeadline(e.target.value)}
                            className="bg-slate-950 border border-white/15 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
                          />
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowDivertPanel(false)}
                            className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDivertAppeal}
                            disabled={!divertNotes.trim() || !divertDeadline}
                            className="px-4 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg disabled:opacity-50"
                          >
                            Dispatch Mandate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Standard Message Input Area */}
                <div className="flex items-center space-x-3">
                  <textarea
                    rows={1}
                    placeholder={selectedCase.status === 'RESOLVED' ? "This case is completed and resolved." : "Write official reply message..."}
                    value={newResponseText}
                    onChange={(e) => setNewResponseText(e.target.value)}
                    disabled={selectedCase.status === 'RESOLVED'}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none min-h-[46px] disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newResponseText.trim() || selectedCase.status === 'RESOLVED'}
                    className="p-3 bg-indigo-600/95 hover:bg-indigo-600 text-white rounded-2xl shadow-lg disabled:opacity-50 disabled:hover:bg-indigo-600/95 transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <MessageSquare className="h-12 w-12 text-slate-600" />
              <div>
                <h3 className="text-base font-bold text-slate-300">No Case Selected</h3>
                <p className="text-xs text-slate-500">Select a communication case from the left panel to review message threads.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. POP-UP MODAL: INITIATE OFFICIAL CASE */}
      {newCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setNewCaseModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight">Initiate Official Requirement Case</h2>
              <p className="text-xs text-slate-400">Cases are routed directly inside your institutional role-hierarchy bounds.</p>
            </div>

            <div className="space-y-4">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Subject / Requirement Title</label>
                <input
                  type="text"
                  placeholder="e.g. Disputed Grade Appeal - Student Bilal"
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              {/* Target Supervisor Field */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Target Supervisor Level</label>
                  <select
                    value={newCaseTarget}
                    onChange={(e) => setNewCaseTarget(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  >
                    {/* Allow targeting role tiers directly above initiator */}
                    {sessionUser.role === 'PARENT' && (
                      <>
                        <option value="USTAD">Ustad (Classroom Teacher)</option>
                        <option value="MANAGER">Manager (Operations)</option>
                      </>
                    )}
                    {sessionUser.role === 'USTAD' && (
                      <>
                        <option value="MANAGER">Manager (Operations)</option>
                        <option value="CENTER_ADMIN">Center Admin (Nazim)</option>
                      </>
                    )}
                    {sessionUser.role === 'MANAGER' && (
                      <option value="CENTER_ADMIN">Center Admin (Nazim)</option>
                    )}
                    {sessionUser.role === 'CENTER_ADMIN' && (
                      <option value="SUPER_ADMIN">HQ Super Admin</option>
                    )}
                    {sessionUser.role === 'SUPER_ADMIN' && (
                      <option value="SUPER_ADMIN">HQ Super Admin (Self-Target)</option>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Severity Category</label>
                  <select
                    value={newCaseSeverity}
                    onChange={(e) => setNewCaseSeverity(e.target.value as 'STANDARD' | 'SEVERE')}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none"
                  >
                    <option value="STANDARD">Standard Matters</option>
                    <option value="SEVERE">Severe (Urgent Welfare / Health)</option>
                  </select>
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Scope &amp; Description Description</label>
                <textarea
                  rows={4}
                  placeholder="Clearly outline the official requirement or appeal. Be as detailed as possible to prevent local-tier delay..."
                  value={newCaseDescription}
                  onChange={(e) => setNewCaseDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCaseModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCase}
                  disabled={!newCaseTitle.trim() || !newCaseDescription.trim()}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-50 text-white hover:bg-indigo-500 font-semibold text-sm rounded-xl shadow-lg disabled:opacity-50"
                >
                  File Official Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
