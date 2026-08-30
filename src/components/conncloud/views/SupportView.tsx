import React, { useState } from 'react';

interface SupportViewProps {
  triggerNotification: (msg: string) => void;
}

export default function SupportView({ triggerNotification }: SupportViewProps) {
  const [subTab, setSubTab] = useState<'tickets' | 'chat' | 'knowledge' | 'training' | 'emergency'>('tickets');
  
  // Tickets log state
  const [tickets, setTickets] = useState([
    { id: 'tkt_102', subject: 'Inward F&B GST reconciliation mismatch', category: 'Finance', priority: 'High', date: '2026-08-29', status: 'In Progress' },
    { id: 'tkt_089', subject: 'HVAC screen 3 compressor belt noise dispatch', category: 'Operations', priority: 'Medium', date: '2026-08-22', status: 'Resolved' }
  ]);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Finance',
    priority: 'Medium',
    desc: ''
  });

  // Chat message simulator state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: 'Welcome to ConnCloud Corporate Live Support. Rakesh, how can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject) return;

    const newTkt = {
      id: `tkt_${Date.now().toString().slice(-3)}`,
      subject: wizardFormMapSubject(ticketForm.subject),
      category: ticketForm.category,
      priority: ticketForm.priority,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };

    setTickets(prev => [newTkt, ...prev]);
    triggerNotification(`Support ticket raised. Case ID: ${newTkt.id}`);
    setTicketForm({ subject: '', category: 'Finance', priority: 'Medium', desc: '' });
  };

  const wizardFormMapSubject = (s: string) => s;

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
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'tickets', label: 'Support Tickets' },
          { id: 'chat', label: 'Live Chat Support' },
          { id: 'knowledge', label: 'Knowledge Base' },
          { id: 'training', label: 'Training Center' },
          { id: 'emergency', label: 'Emergency Protocol' }
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 font-display">My Opened Tickets</h3>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-3.5 bg-black/20 border border-white/5 rounded text-xs flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{t.subject}</span>
                      <span className="text-[10px] text-gray-400 font-mono">#{t.id}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">Category: {t.category} • Logged: {t.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Priority</label>
                  <select 
                    className="cc-input"
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
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
                />
              </div>

              <button type="submit" className="w-full cc-btn cc-btn-accent text-blue-950 font-bold mt-4">
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. CHAT */}
      {subTab === 'chat' && (
        <div className="cc-card max-w-lg mx-auto flex flex-col h-[400px]">
          <div className="p-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-300">Live Support Chat</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span> Online Helpdesk
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 cc-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[80%] p-3 rounded-lg text-xs leading-relaxed ${
                  msg.sender === 'agent' 
                    ? 'bg-white/5 text-gray-200 self-start mr-auto' 
                    : 'bg-blue-600 text-white self-end ml-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              className="cc-input flex-1 text-xs" 
              placeholder="Send message to Helpdesk..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="cc-btn cc-btn-accent px-4 py-1 text-xs">Send</button>
          </form>
        </div>
      )}

      {/* 3. KNOWLEDGE BASE */}
      {subTab === 'knowledge' && (
        <div className="cc-card space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">ConnCloud Knowledge Repository</h3>
          <div className="space-y-3.5">
            {[
              { q: 'How to calculate Net Royalty Payable on ticket revenues?', a: 'Royalty is strictly based on standard ticket sales collections net of tax (18% GST). Standard royalty index defaults to 12.0% unless specified under local franchise agreements.' },
              { q: 'What is the standard SLA troubleshooting projector laser alarms?', a: 'High/Critical alarms auto-dispatchSony field engineers. Low/Medium alarms require logging operations tickets manually. Target SLAs range from 2h (Critical) to 24h (Standard).' }
            ].map((faq, idx) => (
              <div key={idx} className="p-3.5 bg-black/20 border border-white/5 rounded text-xs space-y-2">
                <span className="font-bold text-white block">{faq.q}</span>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TRAINING */}
      {subTab === 'training' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Staff Learning modules</h3>
          <div className="space-y-4 text-xs">
            {[
              { course: 'Digital Box Office POS Management V2', duration: '45 mins', status: 'Completed' },
              { course: 'Food Hygiene standards compliance training', duration: '60 mins', status: 'Pending' }
            ].map((course, idx) => (
              <div key={idx} className="p-3 bg-black/20 border border-white/5 rounded flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">{course.course}</span>
                  <span className="text-[10px] text-gray-500 block mt-1">Duration: {course.duration}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  course.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {course.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. EMERGENCY */}
      {subTab === 'emergency' && (
        <div className="cc-card border-l-4 border-l-red-500 bg-red-500/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i> Emergency Corporate Protocol Contacts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <div className="p-4 rounded bg-black/40 border border-red-500/10 space-y-2 text-xs">
              <span className="font-bold text-white block">Corporate Operations Desk</span>
              <p className="text-gray-400 font-mono">+91 22 4589 1100</p>
              <p className="text-gray-500">ops@connplex.com</p>
            </div>
            <div className="p-4 rounded bg-black/40 border border-red-500/10 space-y-2 text-xs">
              <span className="font-bold text-white block">Critical Technical Escalations</span>
              <p className="text-gray-400 font-mono">+91 22 4589 1199</p>
              <p className="text-gray-500">support.cloud@connplex.com</p>
            </div>
            <div className="p-4 rounded bg-black/40 border border-red-500/10 space-y-2 text-xs">
              <span className="font-bold text-white block">Safety / Fire Marshal Services</span>
              <p className="text-gray-400 font-mono">101 / +91 99999 88888</p>
              <p className="text-gray-500">Immediate dispatch local station</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
