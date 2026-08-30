import React, { useState } from 'react';
import { ConnCloudStore, MarketingCampaign } from '../../../lib/conncloudData';

interface MarketingViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function MarketingView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: MarketingViewProps) {
  const [subSection, setSubSection] = useState<'campaigns' | 'toolkit' | 'posters' | 'guidelines'>('campaigns');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Wizard state
  const [wizardForm, setWizardForm] = useState({
    name: '',
    movieId: 'm1',
    audience: 'All Cinegoers',
    budget: '',
    startDate: '',
    endDate: ''
  });

  // Pull campaigns
  const campaigns = ConnCloudStore.getCampaigns().filter(c => selectedCinemaId === 'all' || c.cinemaId === selectedCinemaId);
  const movies = ConnCloudStore.getMovies();

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardForm.name || !wizardForm.budget) return;

    ConnCloudStore.addCampaign({
      name: wizardForm.name,
      movieId: wizardForm.movieId,
      cinemaId: selectedCinemaId === 'all' ? 'c1' : selectedCinemaId,
      audience: wizardForm.audience,
      budget: parseFloat(wizardForm.budget),
      startDate: wizardForm.startDate || new Date().toISOString().split('T')[0],
      endDate: wizardForm.endDate || new Date().toISOString().split('T')[0],
      status: 'Scheduled'
    });

    triggerNotification(`Marketing Campaign "${wizardForm.name}" created and scheduled.`);
    setIsWizardOpen(false);
    setWizardForm({ name: '', movieId: 'm1', audience: 'All Cinegoers', budget: '', startDate: '', endDate: '' });
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {[
          { id: 'campaigns', label: 'Active Campaigns' },
          { id: 'toolkit', label: 'Social Media Toolkit' },
          { id: 'posters', label: 'Poster Assets Library' },
          { id: 'guidelines', label: 'Brand Guidelines' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubSection(sec.id as any)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              subSection === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </section>

      {/* 1. CAMPAIGNS */}
      {subSection === 'campaigns' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Marketing Campaigns</h3>
            <button onClick={() => setIsWizardOpen(true)} className="cc-btn cc-btn-accent text-xs">
              <i className="fa-solid fa-plus"></i> Create Marketing Campaign
            </button>
          </div>

          <div className="space-y-4">
            {campaigns.map((c) => {
              const m = movies.find(mov => mov.movieId === c.movieId);
              return (
                <div key={c.campaignId} className="p-4 rounded bg-black/20 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{c.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">Movie target: <span className="text-white font-semibold">{m?.title || 'Relational'}</span> • Audience: {c.audience}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Budget: {formatCurrency(c.budget)} • Schedule: {c.startDate} to {c.endDate}</div>
                  </div>

                  <div className="flex gap-6 text-right w-full md:w-auto justify-between md:justify-end">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Reach</span>
                      <span className="text-sm font-bold text-white block mt-0.5">{c.reach}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">CTR</span>
                      <span className="text-sm font-bold text-white block mt-0.5">{c.ctr}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">ROI</span>
                      <span className="text-sm font-bold text-[#f5b041] block mt-0.5">{c.roi}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SOCIAL MEDIA TOOLKIT */}
      {subSection === 'toolkit' && (
        <div className="cc-card space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Social Media Copywriting Prompts</h3>
          
          <div className="space-y-4">
            {[
              { channel: 'Instagram/Facebook post', title: 'Blockbuster Combo Promotion copy', text: '🍿 Weekend movie plans? Level up with the Blockbuster Combo set: 1x Jumbo Caramel Popcorn + 2x Ice Cold Pepsi Sodas. Available at all Connplex Cinema food counters. Fasten your seatbelts!' },
              { channel: 'X / Twitter announcement', title: 'Action release booking push', text: '🔥 Raftaar is running occupancy limits of 90%+ this week at Gandhinagar Screen 1 Gold. Lock your seats now on the Connplex web portal and skip the queues. #ConnplexExperience' }
            ].map((tool, idx) => (
              <div key={idx} className="p-4 rounded bg-black/25 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{tool.title}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold bg-white/5 px-2 py-0.5 rounded">{tool.channel}</span>
                </div>
                <p className="bg-black/40 p-3 rounded text-gray-300 font-mono select-all select-text whitespace-pre-wrap">{tool.text}</p>
                <button 
                  onClick={() => triggerNotification('Social copy copied to clipboard.')}
                  className="cc-btn cc-btn-outline px-2.5 py-1 text-[10px] flex items-center gap-1"
                >
                  <i className="fa-solid fa-copy"></i> Copy Text
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. POSTERS */}
      {subSection === 'posters' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Promotional Assets Library</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {movies.map((m) => (
              <div key={m.movieId} className="bg-black/20 rounded border border-white/5 p-3 text-center space-y-3">
                <div className="h-28 bg-blue-950/40 rounded border border-white/5 flex items-center justify-center text-5xl">
                  {m.poster}
                </div>
                <div>
                  <span className="font-bold text-white block truncate">{m.title}</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Asset kit: 24 MB</span>
                </div>
                <button 
                  onClick={() => triggerNotification(`Downloading promo kit for ${m.title}`)}
                  className="w-full cc-btn cc-btn-outline py-1 text-[10px]"
                >
                  <i className="fa-solid fa-download"></i> Download Kit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. GUIDELINES */}
      {subSection === 'guidelines' && (
        <div className="cc-card space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Brand Identity Guidelines</h3>
          <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <p>Connplex Cinemas maintains a premium, sleek corporate aesthetic. All franchise assets, local printouts, and digital campaigns must conform to the standard palette.</p>
            <div className="grid grid-cols-3 gap-2.5 py-2.5">
              <div className="p-3 bg-[#0c0f16] rounded border border-white/5 text-center">
                <span className="font-mono block">#0B1220</span>
                <span className="text-[10px] text-gray-400 block mt-1 uppercase">Main dark</span>
              </div>
              <div className="p-3 bg-[#2563eb] rounded text-white text-center">
                <span className="font-mono block">#1E40AF</span>
                <span className="text-[10px] text-blue-200 block mt-1 uppercase">Primary Blue</span>
              </div>
              <div className="p-3 bg-[#c19b62] rounded text-black text-center font-bold">
                <span className="font-mono block">#F5B041</span>
                <span className="text-[10px] text-yellow-950 block mt-1 uppercase">Gold Accent</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 font-semibold italic">Do not skew, stretch, or alter the color hues of the official Connplex logo vector files.</p>
          </div>
        </div>
      )}

      {/* CAMPAIGN WIZARD MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300">Create Marketing Campaign</h3>
              <button onClick={() => setIsWizardOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleWizardSubmit} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Campaign Name</label>
                <input 
                  type="text" 
                  className="cc-input" 
                  placeholder="e.g. Independence Day Special Discount"
                  value={wizardForm.name}
                  onChange={(e) => setWizardForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Movie Target</label>
                  <select 
                    className="cc-input"
                    value={wizardForm.movieId}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, movieId: e.target.value }))}
                  >
                    {movies.map(m => (
                      <option key={m.movieId} value={m.movieId}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Audience Group</label>
                  <select 
                    className="cc-input"
                    value={wizardForm.audience}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, audience: e.target.value }))}
                  >
                    <option value="All Cinegoers">All Cinegoers</option>
                    <option value="Family Segment">Family Segment</option>
                    <option value="Youth demographic">Youth / Teenagers</option>
                    <option value="VIP Loyalty members">VIP Loyalty members</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Budget (INR)</label>
                  <input 
                    type="number" 
                    className="cc-input" 
                    placeholder="₹"
                    value={wizardForm.budget}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, budget: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Start Date</label>
                  <input 
                    type="date" 
                    className="cc-input" 
                    value={wizardForm.startDate}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">End Date</label>
                  <input 
                    type="date" 
                    className="cc-input" 
                    value={wizardForm.endDate}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <button type="submit" className="w-full cc-btn cc-btn-accent text-blue-950 font-bold mt-6">
                Publish & Schedule Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
