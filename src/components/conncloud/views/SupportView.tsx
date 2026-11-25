import React, { useState } from 'react';

interface SupportViewProps {
  selectedCinemaId?: string;
  triggerNotification?: (msg: string) => void;
  initialSubTab?: string;
}

export type SupportStatus = 'New' | 'Assigned' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';

interface TicketItem {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  status: SupportStatus;
  assignee: string;
  slaHours: number;
  elapsedHours: number;
  description: string;
  comments: { author: string; time: string; text: string }[];
}

export default function SupportView({ selectedCinemaId = 'all', triggerNotification, initialSubTab }: SupportViewProps) {
  const isAhilyanagar = selectedCinemaId === 'c5';
  const partnerName = isAhilyanagar ? 'Vikram' : 'Rakesh';

  const resolveSubTab = (tab?: string): 'tickets' | 'chat' | 'knowledge' | 'training' | 'emergency' => {
    if (!tab) return 'tickets';
    const t = tab.toLowerCase();
    if (t.includes('chat')) return 'chat';
    if (t.includes('know')) return 'knowledge';
    if (t.includes('train')) return 'training';
    if (t.includes('emerg')) return 'emergency';
    return 'tickets';
  };

  const [subTab, setSubTab] = useState<'tickets' | 'chat' | 'knowledge' | 'training' | 'emergency'>(() => resolveSubTab(initialSubTab));

  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(resolveSubTab(initialSubTab));
    }
  }, [initialSubTab]);
  
  // Tickets log state with full 6-stage lifecycle
  const [tickets, setTickets] = useState<TicketItem[]>(() => isAhilyanagar ? [
    { 
      id: 'TKT-AH-101', 
      subject: 'Vista API automated daily sync telemetry check', 
      category: 'Operations', 
      priority: 'Low', 
      date: '2026-08-30', 
      status: 'Resolved',
      assignee: 'NOC Lead Engineer (Devendra K)',
      slaHours: 24,
      elapsedHours: 4,
      description: 'Periodic audit check of /api.asmx/GetDailyTicketAndFnbData daily ingest throughput for Ahilyanagar.',
      comments: [
        { author: 'Vikram Shinde', time: '10:00 AM', text: 'Checked Box Office sync status. Data matches local ledger.' },
        { author: 'Devendra K (NOC)', time: '11:15 AM', text: 'Sync endpoint verified. Response payload 200 OK.' }
      ]
    },
    { 
      id: 'TKT-AH-102', 
      subject: 'Screen 1 couple recliner motor sensor check', 
      category: 'Operations', 
      priority: 'Medium', 
      date: '2026-08-25', 
      status: 'In Progress',
      assignee: 'Regional Hardware Tech (Arun M)',
      slaHours: 12,
      elapsedHours: 6,
      description: 'Recliner A3 footrest sensor showing delayed retraction response.',
      comments: [
        { author: 'Vikram Shinde', time: '02:00 PM', text: 'Auditorium maintenance check noticed sluggish actuator motor.' },
        { author: 'Arun M (Field Tech)', time: '03:30 PM', text: 'Replacement sensor dispatched from regional hub.' }
      ]
    }
  ] : [
    { 
      id: 'TKT-HQ-201', 
      subject: 'Inward F&B GST reconciliation mismatch', 
      category: 'Finance', 
      priority: 'High', 
      date: '2026-08-29', 
      status: 'In Progress',
      assignee: 'Senior Tax Officer (Kavita R)',
      slaHours: 24,
      elapsedHours: 14,
      description: 'Input Tax Credit invoice for syrup canisters showing 12% vs 18% expected GST.',
      comments: [
        { author: 'Rakesh Patel', time: '09:30 AM', text: 'Attached vendor tax invoice for verification.' }
      ]
    },
    { 
      id: 'TKT-HQ-202', 
      subject: 'HVAC screen 3 compressor belt noise dispatch', 
      category: 'Operations', 
      priority: 'Medium', 
      date: '2026-08-22', 
      status: 'Resolved',
      assignee: 'Daikin Field Engineer',
      slaHours: 8,
      elapsedHours: 5,
      description: 'Chiller unit belt tension adjustment required before weekend evening rush.',
      comments: [
        { author: 'Operations Lead', time: '04:00 PM', text: 'Belt replaced and tested. Sound level under 42dB.' }
      ]
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Finance',
    priority: 'Medium' as TicketItem['priority'],
    desc: ''
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: `Welcome to ConnCloud Corporate Live Support. ${partnerName}, how can I assist ${isAhilyanagar ? 'your Ahilyanagar cinema team' : 'you'} today?` }
  ]);

  React.useEffect(() => {
    setChatMessages([
      { sender: 'agent', text: `Welcome to ConnCloud Corporate Live Support. ${isAhilyanagar ? 'Vikram' : 'Rakesh'}, how can I assist ${isAhilyanagar ? 'your Ahilyanagar cinema team' : 'you'} today?` }
    ]);
  }, [selectedCinemaId, isAhilyanagar]);

  const [chatInput, setChatInput] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject) return;

    const newTkt: TicketItem = {
      id: `TKT-${isAhilyanagar ? 'AH' : 'HQ'}-${Date.now().toString().slice(-3)}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      assignee: 'Unassigned (Auto-Routing)',
      slaHours: ticketForm.priority === 'Critical' ? 4 : (ticketForm.priority === 'High' ? 12 : 24),
      elapsedHours: 0,
      description: ticketForm.desc || 'Support request submitted via partner desk.',
      comments: [
        { author: isAhilyanagar ? 'Vikram Shinde' : 'Rakesh Patel', time: 'Just now', text: ticketForm.desc || 'Ticket registered.' }
      ]
    };

    setTickets(prev => [newTkt, ...prev]);
    if (triggerNotification) triggerNotification(`Support ticket raised. Case ID: ${newTkt.id}`);
    setTicketForm({ subject: '', category: 'Finance', priority: 'Medium', desc: '' });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText || !selectedTicket) return;

    const updated = {
      ...selectedTicket,
      comments: [
        ...selectedTicket.comments,
        { author: isAhilyanagar ? 'Vikram Shinde' : 'Rakesh Patel', time: 'Just now', text: newCommentText }
      ]
    };

    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTicket(updated);
    setNewCommentText('');
    if (triggerNotification) triggerNotification(`Comment posted to ticket ${selectedTicket.id}.`);
  };

  const handleStatusUpdate = (ticketId: string, nextStatus: SupportStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const u = { ...t, status: nextStatus };
        if (selectedTicket?.id === ticketId) setSelectedTicket(u);
        return u;
      }
      return t;
    }));
    if (triggerNotification) triggerNotification(`Ticket ${ticketId} status updated to ${nextStatus}.`);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: chatInput }
    ]);
    
    const userText = chatInput;
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'agent', text: `Thanks for the details. I have forwarded your query about "${userText}" to the regional operations desk. Ticket queued.` }
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'tickets', label: 'Support Tickets & Lifecycle' },
          { id: 'chat', label: 'Live Chat Support' },
          { id: 'knowledge', label: 'Knowledge Base (120 SOPs)' },
          { id: 'training', label: 'Training Modules' },
          { id: 'emergency', label: 'Emergency Hotline Contacts' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubTab(sec.id as any)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              subTab === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </section>

      {/* 1. TICKETS */}
      {subTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 cc-card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 font-display">My Opened Support Tickets</h3>
                <p className="text-xs text-gray-500">Statuses: New → Assigned → In Progress → Waiting → Resolved → Closed</p>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {tickets.length} Total Tickets
              </span>
            </div>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 bg-black/20 border rounded text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer transition-colors ${
                    selectedTicket?.id === t.id ? 'border-blue-500 bg-blue-950/20' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{t.subject}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        t.priority === 'Critical' ? 'bg-red-500/20 text-red-300' : (t.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400')
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Category: {t.category} • Assignee: <strong>{t.assignee}</strong> • Logged: {t.date}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      SLA: {t.elapsedHours}h of {t.slaHours}h elapsed ({t.slaHours - t.elapsedHours}h remaining)
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      t.status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : (t.status === 'In Progress' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30')
                    }`}>
                      {t.status}
                    </span>
                    <button className="text-gray-400 hover:text-white px-2 py-1 bg-white/5 rounded text-[11px]">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raise Ticket Form */}
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Raise Support Ticket</h3>
            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Subject</label>
                <input 
                  type="text" 
                  className="cc-input"
                  placeholder="Summary of issue..."
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
                  <select 
                    className="cc-input"
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Finance">Finance / Invoices</option>
                    <option value="Operations">Operations / Telemetry</option>
                    <option value="Ticketing">Ticketing Systems</option>
                    <option value="F&B POS">F&B Counter POS</option>
                    <option value="Hardware">Projection &amp; Sound</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Priority</label>
                  <select 
                    className="cc-input"
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  >
                    <option value="Low">Low (24h SLA)</option>
                    <option value="Medium">Medium (12h SLA)</option>
                    <option value="High">High (6h SLA)</option>
                    <option value="Critical">Critical (2h Emergency SLA)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Trouble Description</label>
                <textarea 
                  className="cc-input min-h-[80px]"
                  placeholder="Provide precise details of error log..."
                  value={ticketForm.desc}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, desc: e.target.value }))}
                ></textarea>
              </div>

              <button type="submit" className="w-full cc-btn cc-btn-primary py-2 text-xs font-bold">
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAILS DRAWER / MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-400 font-bold">{selectedTicket.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedTicket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mt-1">{selectedTicket.subject}</h3>
                <span className="text-xs text-gray-400">Assignee: {selectedTicket.assignee} • Priority: {selectedTicket.priority}</span>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-white text-lg">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="p-3 bg-black/30 rounded border border-white/5 space-y-1">
                <strong className="text-gray-400 text-[10px] uppercase">Description</strong>
                <p className="text-gray-300">{selectedTicket.description}</p>
              </div>

              {/* Status transition controls */}
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded border border-white/5">
                <span className="text-gray-400">Update Status:</span>
                {(['New', 'Assigned', 'In Progress', 'Waiting', 'Resolved', 'Closed'] as SupportStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusUpdate(selectedTicket.id, st)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      selectedTicket.status === st ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Comments / Timeline */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">Timeline &amp; Conversation</h4>
                {selectedTicket.comments.map((c, i) => (
                  <div key={i} className="p-3 bg-black/20 rounded border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <strong className="text-blue-300">{c.author}</strong>
                      <span className="text-gray-500">{c.time}</span>
                    </div>
                    <p className="text-gray-300">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddComment} className="p-4 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add reply or comment to ticket..."
                className="flex-1 cc-input text-xs py-2"
                required
              />
              <button type="submit" className="cc-btn cc-btn-primary px-4 text-xs font-bold">Reply</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. LIVE CHAT */}
      {subTab === 'chat' && (
        <div className="cc-card flex flex-col h-[500px]">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 cc-pulse-live"></span>
              <div>
                <h4 className="font-bold text-white text-sm">ConnCloud Corporate NOC Helpdesk</h4>
                <span className="text-[10px] text-gray-400">Live 24/7 Franchise Support Operations</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Operator ID: #NOC-MUM-402</span>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 cc-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-black/30 border border-white/5 text-gray-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-white/5 flex gap-2">
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type urgent inquiry or question for central desk..."
              className="flex-1 cc-input text-xs"
            />
            <button type="submit" className="cc-btn cc-btn-primary px-4 text-xs">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {/* 3. KNOWLEDGE BASE */}
      {subTab === 'knowledge' && (
        <div className="space-y-4">
          <div className="cc-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Cinema Standard Operating Procedures (SOPs)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { title: 'Barco 4K Laser Projector Daily Power-Up & Dust Purge SOP', category: 'Projection Engineering', reads: '140 views' },
                { title: 'Concession Intermission Fast-Line Rush Management Protocol', category: 'F&B Operations', reads: '310 views' },
                { title: 'VIP Couple Recliner Sanitization & Ultrasonic Cleansing', category: 'Housekeeping', reads: '95 views' },
                { title: 'Municipal Entertainment Tax & GST Inward Filing SOP', category: 'Accounts & Tax', reads: '215 views' }
              ].map((k, idx) => (
                <div key={idx} className="p-4 rounded bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1">{k.category}</span>
                  <strong className="text-white text-sm block mb-1">{k.title}</strong>
                  <span className="text-gray-500 text-[10px]">{k.reads} • Updated Aug 2026</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TRAINING CENTER */}
      {subTab === 'training' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Staff Certification &amp; Training Library</h3>
          <div className="space-y-3 text-xs">
            {[
              { name: 'Module 1: Connplex Brand Identity & VIP Guest Etiquette', status: 'Completed', length: '45 mins video' },
              { name: 'Module 2: Cinema Box Office POS & Vista Interface Mastery', status: 'Completed', length: '60 mins video' },
              { name: 'Module 3: Food Safety & High-Volume Intermission Operations', status: 'Completed', length: '40 mins video' }
            ].map((m, i) => (
              <div key={i} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center">
                <div>
                  <strong className="text-white block">{m.name}</strong>
                  <span className="text-gray-400 text-[11px]">{m.length}</span>
                </div>
                <span className="px-2.5 py-1 rounded text-emerald-400 bg-emerald-500/10 font-bold text-[11px]">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. EMERGENCY HOTLINE */}
      {subTab === 'emergency' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Emergency Escalation Contact Matrix</h3>
          <div className="space-y-3 text-xs">
            {[
              { role: 'Central Technical Support NOC Hotline', contact: '+91 22 6120 8000', timing: '24 Hours / 365 Days', email: 'noc@theconnplex.com' },
              { role: 'Chief Projection & Hardware Engineer (Barco Desk)', contact: '+91 98200 11982', timing: 'Immediate Priority Dispatch', email: 'hardware@theconnplex.com' },
              { role: 'Maharashtra Regional Operations General Manager', contact: '+91 98920 44102', timing: 'Operational Hours (08:00 - 02:00)', email: 'maharashtra.ops@theconnplex.com' }
            ].map(em => (
              <div key={em.role} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <strong className="text-white text-sm block">{em.role}</strong>
                  <span className="text-gray-400 text-[11px]">Availability: {em.timing} • Email: {em.email}</span>
                </div>
                <div className="font-mono font-bold text-amber-400 text-sm self-start sm:self-auto bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                  {em.contact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
