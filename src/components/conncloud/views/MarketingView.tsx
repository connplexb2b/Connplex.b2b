import React, { useState } from 'react';
import { ConnCloudStore, MarketingCampaign } from '../../../lib/conncloudData';

interface MarketingViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
  initialSubSection?: string;
}

export type MarketingSubSection = 
  | 'dashboard' 
  | 'create' 
  | 'promotions' 
  | 'posters' 
  | 'assets' 
  | 'toolkit' 
  | 'events' 
  | 'analytics' 
  | 'guidelines';

export default function MarketingView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification,
  initialSubSection
}: MarketingViewProps) {
  const resolveSubSection = (sec?: string): MarketingSubSection => {
    if (!sec) return 'dashboard';
    const s = sec.toLowerCase();
    if (s.includes('create') || s.includes('wizard') || s.includes('new')) return 'create';
    if (s.includes('promo') || s.includes('coupon') || s.includes('discount')) return 'promotions';
    if (s.includes('post')) return 'posters';
    if (s.includes('asset') || s.includes('media')) return 'assets';
    if (s.includes('tool') || s.includes('social')) return 'toolkit';
    if (s.includes('event') || s.includes('charter')) return 'events';
    if (s.includes('analy') || s.includes('metric') || s.includes('roi')) return 'analytics';
    if (s.includes('guide') || s.includes('brand')) return 'guidelines';
    if (s.includes('camp')) return 'dashboard';
    return 'dashboard';
  };

  const [subSection, setSubSection] = useState<MarketingSubSection>(() => resolveSubSection(initialSubSection));

  React.useEffect(() => {
    if (initialSubSection) {
      setSubSection(resolveSubSection(initialSubSection));
    }
  }, [initialSubSection]);

  // Pull campaigns & movies
  const campaigns = ConnCloudStore.getCampaigns().filter(c => selectedCinemaId === 'all' || c.cinemaId === selectedCinemaId);
  const movies = ConnCloudStore.getMovies();
  const cinemas = ConnCloudStore.getCinemas();

  // 8-Step Campaign Creation Workflow State
  // Create → Select Movie → Select Cinema → Audience → Creative → Schedule → Approval → Publish
  const [workflowStep, setWorkflowStep] = useState(1);
  const [campaignWorkflowForm, setCampaignWorkflowForm] = useState({
    name: '',
    movieId: movies[0]?.movieId || 'm1',
    cinemaId: selectedCinemaId === 'all' ? (cinemas[0]?.cinemaId || 'c1') : selectedCinemaId,
    audience: 'All Cinegoers (Ages 18-45)',
    creativeAsset: 'Key Visual Poster & 15s Instagram Reel',
    budget: '25000',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    approvalStatus: 'Pending Corporate Approval'
  });

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workflowStep < 8) {
      setWorkflowStep(prev => prev + 1);
    } else {
      // Step 8: Publish
      ConnCloudStore.addCampaign({
        name: campaignWorkflowForm.name || 'Connplex Blockbuster Push',
        movieId: campaignWorkflowForm.movieId,
        cinemaId: campaignWorkflowForm.cinemaId,
        audience: campaignWorkflowForm.audience,
        budget: parseFloat(campaignWorkflowForm.budget) || 25000,
        startDate: campaignWorkflowForm.startDate,
        endDate: campaignWorkflowForm.endDate,
        status: 'Active'
      });
      triggerNotification(`Campaign "${campaignWorkflowForm.name}" approved, published, and live across channels!`);
      setWorkflowStep(1);
      setSubSection('dashboard');
    }
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const subSectionsList: { id: MarketingSubSection; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Campaign Dashboard', icon: 'fa-bullhorn' },
    { id: 'create', label: 'Create Campaign (Workflow)', icon: 'fa-wand-magic-sparkles' },
    { id: 'promotions', label: 'Promotions & Coupons', icon: 'fa-tag' },
    { id: 'posters', label: 'Poster Library', icon: 'fa-image' },
    { id: 'assets', label: 'Marketing Assets', icon: 'fa-photo-film' },
    { id: 'toolkit', label: 'Social Toolkit', icon: 'fa-share-nodes' },
    { id: 'events', label: 'Local Events & Charters', icon: 'fa-champagne-glasses' },
    { id: 'analytics', label: 'Campaign Analytics', icon: 'fa-chart-column' },
    { id: 'guidelines', label: 'Brand Guidelines', icon: 'fa-palette' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        {subSectionsList.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSubSection(sec.id)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              subSection === sec.id 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${sec.icon} text-[11px]`}></i>
            <span>{sec.label}</span>
          </button>
        ))}
      </section>

      {/* 1. CAMPAIGN DASHBOARD */}
      {subSection === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">Active Campaigns</span>
              <div className="text-3xl font-extrabold text-white">{campaigns.length}</div>
              <span className="text-xs text-emerald-400 mt-2 block">Running across digital &amp; cinema lobby</span>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">Total Reach</span>
              <div className="text-3xl font-extrabold text-blue-400">142,500+</div>
              <span className="text-xs text-gray-400 mt-2 block">Impressions generated</span>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">Avg Click-Through Rate</span>
              <div className="text-3xl font-extrabold text-[#f5b041]">4.82%</div>
              <span className="text-xs text-emerald-400 mt-2 block">+1.2% above industry benchmark</span>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">Marketing ROI</span>
              <div className="text-3xl font-extrabold text-emerald-400">3.8x</div>
              <span className="text-xs text-gray-400 mt-2 block">Ticket revenue multiplier</span>
            </div>
          </div>

          <div className="cc-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Active Campaign Register</h3>
              <button onClick={() => setSubSection('create')} className="cc-btn cc-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                <i className="fa-solid fa-plus"></i> Launch Campaign
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
                          c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">Movie focus: <strong className="text-white">{m?.title || 'Featured'}</strong> • Target: {c.audience}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Budget: {formatCurrency(c.budget)} • Dates: {c.startDate} to {c.endDate}</div>
                    </div>

                    <div className="flex gap-6 text-right w-full md:w-auto justify-between md:justify-end">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Reach</span>
                        <span className="text-sm font-bold text-white block mt-0.5">{c.reach || '42,000'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">CTR</span>
                        <span className="text-sm font-bold text-white block mt-0.5">{c.ctr || '4.6%'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">ROI</span>
                        <span className="text-sm font-bold text-[#f5b041] block mt-0.5">{c.roi || '3.5x'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATE CAMPAIGN WORKFLOW */}
      {/* Workflow: Create → Select Movie → Select Cinema → Audience → Creative → Schedule → Approval → Publish */}
      {subSection === 'create' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Campaign Creation Workflow</h3>
              <p className="text-xs text-gray-500">Step-by-step corporate promotional campaign wizard</p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Step {workflowStep} of 8
            </span>
          </div>

          {/* Workflow Stepper Bar */}
          <div className="overflow-x-auto pb-4 mb-6">
            <div className="flex items-center min-w-[700px] gap-2">
              {[
                '1. Details',
                '2. Movie',
                '3. Cinema',
                '4. Audience',
                '5. Creative',
                '6. Schedule',
                '7. Approval',
                '8. Publish'
              ].map((stepName, sIdx) => {
                const stepNum = sIdx + 1;
                const isPassed = workflowStep > stepNum;
                const isCurrent = workflowStep === stepNum;
                return (
                  <div key={stepName} className="flex-1 flex items-center gap-2">
                    <button
                      onClick={() => setWorkflowStep(stepNum)}
                      className={`w-full py-1.5 px-2 rounded text-[11px] font-bold text-center transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow'
                          : (isPassed ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'bg-black/20 text-gray-500 border border-white/5')
                      }`}
                    >
                      {stepName}
                    </button>
                    {stepNum < 8 && <i className="fa-solid fa-chevron-right text-[10px] text-gray-600"></i>}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleStepSubmit} className="space-y-4 max-w-xl mx-auto text-xs">
            {workflowStep === 1 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Step 1: Campaign Overview</h4>
                <div>
                  <label className="text-gray-400 block mb-1">Campaign Title</label>
                  <input 
                    type="text" 
                    value={campaignWorkflowForm.name}
                    onChange={(e) => setCampaignWorkflowForm({ ...campaignWorkflowForm, name: e.target.value })}
                    placeholder="e.g. Resident Evil Weekend Flash Pass"
                    className="w-full cc-input py-2"
                    required
                  />
                </div>
              </div>
            )}

            {workflowStep === 2 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Step 2: Select Focus Movie</h4>
                <div>
                  <label className="text-gray-400 block mb-1">Title</label>
                  <select 
                    value={campaignWorkflowForm.movieId}
                    onChange={(e) => setCampaignWorkflowForm({ ...campaignWorkflowForm, movieId: e.target.value })}
                    className="w-full cc-input py-2"
                  >
                    {movies.map(m => (
                      <option key={m.movieId} value={m.movieId}>{m.title} ({m.language || 'Hindi'})</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {workflowStep === 3 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Step 3: Target Cinema Allocation</h4>
                <div>
                  <label className="text-gray-400 block mb-1">Cinema Property</label>
                  <select 
                    value={campaignWorkflowForm.cinemaId}
                    onChange={(e) => setCampaignWorkflowForm({ ...campaignWorkflowForm, cinemaId: e.target.value })}
                    className="w-full cc-input py-2"
                  >
                    <option value="all">All Franchise Properties</option>
                    {cinemas.map(c => (
                      <option key={c.cinemaId} value={c.cinemaId}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {workflowStep === 4 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Step 4: Target Audience Segment</h4>
                <div>
                  <label className="text-gray-400 block mb-1">Demographics</label>
                  <select 
                    value={campaignWorkflowForm.audience}
                    onChange={(e) => setCampaignWorkflowForm({ ...campaignWorkflowForm, audience: e.target.value })}
                    className="w-full cc-input py-2"
                  >
                    <option value="All Cinegoers (Ages 18-45)">All Cinegoers (Ages 18-45)</option>
                    <option value="Couple Recliner VIP Guests">Couple Recliner VIP Guests</option>
                    <option value="College & Youth Cinephiles">College &amp; Youth Cinephiles</option>
                    <option value="Corporate & B2B Partners">Corporate &amp; B2B Partners</option>
                  </select>
                </div>
              </div>
            )}

            {workflowStep === 5 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Step 5: Creative Media Assets</h4>
                <div>
                  <label className="text-gray-400 block mb-1">Selected Assets</label>
                  <input 
                    type="text"
                    value={campaignWorkflowForm.creativeAsset}
                    onChange={(e) => setCampaignWorkflowForm({ ...campaignWorkflowForm, creativeAsset: e.target.value })}
                    className="w-full cc-input py-2"
                  />
                </div>
              </div>
            )}

            {workflowStep === 6 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Step 6: Schedule &amp; Budget</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">Start Date</label>
                    <input 
                      type="date"
                      value={campaignWorkflowForm.startDate}
                      onChange={(e) => setCampaignWorkflowForm({ ...campaignWorkflowForm, startDate: e.target.value })}
                      className="w-full cc-input py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">End Date</label>
                    <input 
                      type="date"
                      value={campaignWorkflowForm.endDate}
                      onChange={(e) => setCampaignWorkflowForm({ ...campaignWorkflowForm, endDate: e.target.value })}
                      className="w-full cc-input py-1.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Campaign Budget (₹)</label>
                  <input 
                    type="number"
                    value={campaignWorkflowForm.budget}
                    onChange={(e) => setCampaignWorkflowForm({ ...campaignWorkflowForm, budget: e.target.value })}
                    className="w-full cc-input py-2"
                  />
                </div>
              </div>
            )}

            {workflowStep === 7 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Step 7: Corporate Approval Status</h4>
                <div className="p-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <i className="fa-solid fa-circle-check mr-2"></i>
                  <span>Brand compliance pre-verified by Central Marketing Desk. Authorized for immediate deployment.</span>
                </div>
              </div>
            )}

            {workflowStep === 8 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Step 8: Final Confirmation &amp; Publish</h4>
                <div className="p-4 rounded bg-black/20 border border-white/5 space-y-2 text-xs">
                  <div><strong>Campaign:</strong> {campaignWorkflowForm.name}</div>
                  <div><strong>Target Audience:</strong> {campaignWorkflowForm.audience}</div>
                  <div><strong>Budget:</strong> {formatCurrency(parseFloat(campaignWorkflowForm.budget) || 25000)}</div>
                  <div><strong>Runtime:</strong> {campaignWorkflowForm.startDate} to {campaignWorkflowForm.endDate}</div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              {workflowStep > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setWorkflowStep(prev => prev - 1)}
                  className="cc-btn cc-btn-outline py-1.5 px-4 text-xs"
                >
                  Back
                </button>
              ) : <div></div>}
              <button type="submit" className="cc-btn cc-btn-primary py-1.5 px-5 text-xs font-bold">
                {workflowStep === 8 ? 'Publish Campaign' : 'Continue Step'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. PROMOTIONS & COUPONS */}
      {subSection === 'promotions' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Promotional Discount Coupons</h3>
          <div className="space-y-3">
            {[
              { code: 'AHILYA20', desc: '20% off Couple Recliner shows at Connplex Ahilyanagar', status: 'Active', usage: '142 used', limit: '500 max' },
              { code: 'CONNMONSOON', desc: '15% Off family ticket bundle bookings', status: 'Active', usage: '820 used', limit: '1,000 max' },
              { code: 'UPIFREEFNB', desc: 'Free fountain beverage with UPI checkout payments', status: 'Active', usage: '1,450 used', limit: '2,000 max' }
            ].map(p => (
              <div key={p.code} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">{p.code}</span>
                    <span className="text-[10px] text-gray-400">({p.usage} of {p.limit})</span>
                  </div>
                  <p className="text-gray-300 mt-1">{p.desc}</p>
                </div>
                <span className="px-2.5 py-1 rounded font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs self-start sm:self-auto">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. POSTER LIBRARY */}
      {subSection === 'posters' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">High-Resolution Key Art &amp; Standees</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {movies.map((m) => (
              <div key={m.movieId} className="bg-black/20 rounded border border-white/5 p-3 text-center space-y-3">
                <div className="h-28 bg-blue-950/40 rounded border border-white/5 flex items-center justify-center text-5xl">
                  {m.poster}
                </div>
                <div>
                  <span className="font-bold text-white block truncate">{m.title}</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Asset kit: 24 MB • 4K Print Ready</span>
                </div>
                <button 
                  onClick={() => triggerNotification(`Downloading official poster kit for ${m.title}...`)}
                  className="w-full cc-btn cc-btn-outline py-1 text-[10px]"
                >
                  <i className="fa-solid fa-download"></i> Download Kit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MARKETING ASSETS */}
      {subSection === 'assets' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Official Brand &amp; Digital Marketing Collateral</h3>
          <div className="space-y-3">
            {[
              { title: 'Connplex Vector Logo Pack (SVG, AI, Transparent PNG)', size: '14.2 MB', category: 'Brand Assets' },
              { title: 'Cinema Lobby Display Video Teaser Loop (1080p 60fps)', size: '240.5 MB', category: 'Lobby Video' },
              { title: 'Boutique Luxuriance Couple Recliner Feature Reel', size: '180.0 MB', category: 'Social Video' },
              { title: 'Concession Stand Acrylic Menu Mockup Templates', size: '8.4 MB', category: 'Print Ready' }
            ].map((a, idx) => (
              <div key={idx} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block">{a.title}</strong>
                  <span className="text-gray-400 text-[11px]">{a.category} • Size: {a.size}</span>
                </div>
                <button 
                  onClick={() => triggerNotification(`Downloading ${a.title}...`)}
                  className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SOCIAL TOOLKIT */}
      {subSection === 'toolkit' && (
        <div className="cc-card space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Social Media Copywriting Toolkit</h3>
          <div className="space-y-4">
            {[
              { channel: 'Instagram / Facebook Post', text: '🍿 Weekend movie plans? Level up with the Blockbuster Combo set: 1x Jumbo Caramel Popcorn + 2x Ice Cold Pepsi Sodas. Available at all Connplex Cinema food counters. Fasten your seatbelts! #ConnplexExperience' },
              { channel: 'WhatsApp Broadcast Message', text: '🎬 Exclusive Ahilyanagar Flash Pass: Enjoy 20% off luxury couple recliner bookings this Friday to Sunday. Use code AHILYA20 on our official web portal!' },
              { channel: 'X / Twitter Post', text: '🔥 Housefull alerts across active shows today! Book your recliner seats directly on the ConnCloud web portal to skip the queues. #ConnplexCinemas' }
            ].map((tool, idx) => (
              <div key={idx} className="p-3.5 rounded bg-black/25 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{tool.channel}</span>
                  <button 
                    onClick={() => triggerNotification('Social copy copied to clipboard.')}
                    className="cc-btn cc-btn-outline px-2.5 py-1 text-[10px] flex items-center gap-1"
                  >
                    <i className="fa-solid fa-copy"></i> Copy Text
                  </button>
                </div>
                <p className="bg-black/40 p-2.5 rounded text-gray-300 font-mono select-all text-[11px]">{tool.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. LOCAL EVENTS & CHARTERS */}
      {subSection === 'events' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Local Events &amp; Auditorium Charters</h3>
          <div className="space-y-3">
            {[
              { client: 'Kalyani Steels Regional Engineers Corporate Charter', date: '2026-09-16', screen: 'Screen 2 Gold Class', guests: '60 Guests', status: 'Confirmed' },
              { client: 'Rotary Club of Ahilyanagar Annual Film Evening', date: '2026-09-22', screen: 'Screen 1 Couple Recliner', guests: '20 Couples', status: 'Reserved' },
              { client: 'Birthday VIP Screening (Private Reservation)', date: '2026-09-28', screen: 'Screen 1 Couple Recliner', guests: '20 Guests', status: 'Inquiry' }
            ].map(ev => (
              <div key={ev.client} className="p-3 bg-black/20 rounded border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-white text-sm block">{ev.client}</strong>
                  <span className="text-gray-400 text-[11px]">{ev.screen} • {ev.guests} • Date: {ev.date}</span>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold self-start sm:self-auto ${
                  ev.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {ev.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. CAMPAIGN ANALYTICS */}
      {subSection === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Total Ad Spend</span>
              <div className="text-3xl font-extrabold text-white">₹68,500</div>
              <div className="text-xs text-gray-400 mt-2">Across Meta, Google &amp; Local Out-of-Home</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Generated Box Office Intake</span>
              <div className="text-3xl font-extrabold text-emerald-400">₹2,60,300</div>
              <div className="text-xs text-gray-400 mt-2">Direct trackable coupon redemptions</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Blended Acquisition Cost (CAC)</span>
              <div className="text-3xl font-extrabold text-blue-400">₹28 / patron</div>
              <div className="text-xs text-gray-400 mt-2">Highly cost-effective patron acquisition</div>
            </div>
          </div>
        </div>
      )}

      {/* 9. BRAND GUIDELINES */}
      {subSection === 'guidelines' && (
        <div className="cc-card space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Brand Identity Guidelines</h3>
          <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <p>Connplex Cinemas maintains a premium, sleek corporate aesthetic. All franchise assets, local printouts, and digital campaigns must conform to the standard palette.</p>
            <div className="grid grid-cols-3 gap-2.5 py-2.5">
              <div className="p-3 bg-[#0c0f16] rounded border border-white/5 text-center">
                <span className="font-mono block">#0B1220</span>
                <span className="text-[10px] text-gray-400 block mt-1 uppercase">Main Dark</span>
              </div>
              <div className="p-3 bg-[#1e40af] rounded text-white text-center">
                <span className="font-mono block">#1E40AF</span>
                <span className="text-[10px] text-blue-200 block mt-1 uppercase">Primary Blue</span>
              </div>
              <div className="p-3 bg-[#f5b041] rounded text-black text-center font-bold">
                <span className="font-mono block">#F5B041</span>
                <span className="text-[10px] text-yellow-950 block mt-1 uppercase">Gold Accent</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 font-semibold italic">Do not skew, stretch, or alter the color hues of the official Connplex logo vector files.</p>
          </div>
        </div>
      )}
    </div>
  );
}
