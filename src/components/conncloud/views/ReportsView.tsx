import React from 'react';

interface ReportsViewProps {
  selectedCinemaId?: string;
  selectedDateRange?: string;
  triggerNotification: (msg: string) => void;
}

export default function ReportsView({ 
  selectedCinemaId = 'all', 
  selectedDateRange = 'Today',
  triggerNotification 
}: ReportsViewProps) {
  const isAhilyanagar = selectedCinemaId === 'c5';

  const handleDownload = (reportName: string) => {
    triggerNotification(`Downloading report: ${reportName}...`);
  };

  const handleVistaExtract = (format: 'JSON' | 'XML' | 'CSV') => {
    triggerNotification(`Exporting live Vista API data feed for Ahilyanagar (${format})...`);
    
    // Simulate real Vista daily sync extract download
    if (typeof window !== 'undefined') {
      const mockVistaPayload = {
        CinemaID: 'Ahilyanagar',
        CinemaName: 'Connplex Ahilyanagar',
        Screens: 2,
        Date: new Date().toISOString().split('T')[0],
        SyncStatus: 'ONLINE_ACTIVE',
        Timestamp: new Date().toISOString(),
        Endpoint: '/api.asmx/GetDailyTicketAndFnbData?CinemaID=Ahilyanagar',
        BoxOffice: {
          GrossTicketRevenue: 1197440,
          TotalTicketsSold: 4678,
          AverageTicketPrice: 255.97,
          Auditoriums: [
            { ScreenId: 's20', Name: 'Screen 1 (Luxuriance Couple Recliner)', Seats: 20, ATP: 280, Occupancy: '78.4%' },
            { ScreenId: 's21', Name: 'Screen 2 (Gold Class)', Seats: 60, ATP: 240, Occupancy: '78.4%' }
          ]
        },
        Concessions: {
          GrossFnbRevenue: 716280,
          Transactions: 2840,
          SpendPerHead: 153.11,
          TopCategory: 'Caramel & Cheese Popcorn Combos'
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockVistaPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Vista_Daily_Sync_Ahilyanagar_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  const reports = isAhilyanagar ? [
    { name: 'Ahilyanagar Daily Revenue Statement', type: 'Sales & Commercial', format: 'PDF / XLS', desc: 'Consolidated box office and concession intake for Screen 1 & Screen 2.' },
    { name: 'Ahilyanagar Daily Admissions Summary', type: 'Box Office Stats', format: 'PDF', desc: 'Screen 1 Couple Recliner & Screen 2 Gold Class seat occupancy trends.' },
    { name: 'Ahilyanagar F&B Gross Profit Margins', type: 'POS Inventory', format: 'XLS', desc: 'SPH performance, margin yield, and wastage summary by Snehal Deshmukh.' },
    { name: 'Ahilyanagar Royalty Obligations Sheet', type: 'Finance & Compliance', format: 'PDF / CSV', desc: 'Distributor 50% net share calculations for Raftaar and running titles.' },
    { name: 'Ahilyanagar Staff Attendance & Payroll', type: 'Human Resources', format: 'XLS', desc: 'Biometric timesheets for Vikram Shinde, Ramesh Kadam, and duty team.' },
    { name: 'Ahilyanagar Equipment SLA & Downtime', type: 'Operations Telemetry', format: 'PDF', desc: 'Barco 4K Laser Projector and Daikin VRV maintenance telemetry status.' },
    { name: 'Ahilyanagar Boutique Screen Yield Report', type: 'Yield & MIS', format: 'PDF / XLS', desc: 'Format productivity comparison between Luxuriance Recliners vs Gold Class.' }
  ] : [
    { name: 'Daily Revenue Statement', type: 'Sales & Commercial', format: 'PDF / XLS', desc: 'Consolidated commercial revenue breakdown across all active auditoriums.' },
    { name: 'Daily Admissions Summary', type: 'Box Office Stats', format: 'PDF', desc: 'Admissions breakdown, occupancy curves, and ATP benchmarks.' },
    { name: 'F&B Gross Profit Margins', type: 'POS Inventory', format: 'XLS', desc: 'COGS vs selling margins, fast-moving items, and inventory burn rate.' },
    { name: 'Royalty Obligations Sheet', type: 'Finance & Compliance', format: 'PDF / CSV', desc: 'Distributor box office shares across active distributor agreements.' },
    { name: 'Staff Attendance Ledger', type: 'Human Resources', format: 'XLS', desc: 'Monthly shift logs, overtime records, and employee attendance indices.' },
    { name: 'Equipment SLA & Downtimes', type: 'Operations Telemetry', format: 'PDF', desc: 'Mean Time Between Failures (MTBF) and SLA response times across hardware.' }
  ];

  return (
    <div className="space-y-6">
      {/* Property Telemetry Header */}
      {isAhilyanagar && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 via-indigo-900/15 to-transparent border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start md:items-center gap-3">
            <span className="relative flex h-3 w-3 mt-0.5 md:mt-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <div>
              <span className="font-bold text-blue-300 uppercase tracking-wider text-[11px] block">
                Ahilyanagar Audit & Financial Reporting Vault
              </span>
              <span className="text-gray-300 text-[11px]">
                Showing operational and financial dossiers for Connplex Ahilyanagar (2 Screens • 80 Seats) • Active Filter: {selectedDateRange}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-[11px] text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-500/30">
            <span>VISTA LIVE AUDITED</span>
          </div>
        </div>
      )}

      {/* Special Vista API Raw Extract Card for Ahilyanagar */}
      {isAhilyanagar && (
        <div className="cc-card border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-black/40 to-black/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Direct Vista Server Endpoint
                </span>
                <span className="text-emerald-400 text-xs font-bold font-mono">
                  <i className="fa-solid fa-circle-check mr-1"></i>200 OK
                </span>
              </div>
              <h4 className="font-bold text-white text-base mt-1">Vista Raw Box Office & F&B Daily Ingest Feed</h4>
              <p className="text-xs text-gray-400 font-mono">
                GET /api.asmx/GetDailyTicketAndFnbData?CinemaID=Ahilyanagar&Date={new Date().toISOString().split('T')[0]}
              </p>
              <p className="text-[11px] text-gray-500">
                Direct raw structured payload export for internal audit, franchisee accounting, and external ERP integration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => handleVistaExtract('JSON')}
                className="cc-btn cc-btn-accent text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-file-code"></i> Export Vista JSON
              </button>
              <button
                onClick={() => handleVistaExtract('XML')}
                className="cc-btn cc-btn-outline text-xs py-2 px-3 flex items-center gap-1.5 border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
              >
                <i className="fa-solid fa-file-lines"></i> Export Vista XML
              </button>
              <button
                onClick={() => handleVistaExtract('CSV')}
                className="cc-btn cc-btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-file-csv"></i> Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reports Grid */}
      <div className="cc-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              {isAhilyanagar ? 'Connplex Ahilyanagar Dossiers & Statements' : 'Consolidated Report Center'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Select any statement to generate real-time printable PDFs or Excel spreadsheets.
            </p>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {reports.length} Reports Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((rep, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/25 border border-white/5 space-y-3 text-xs flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{rep.type}</span>
                <h4 className="font-bold text-white text-sm mt-1">{rep.name}</h4>
                <p className="text-[11px] text-gray-400 mt-1">{rep.desc}</p>
                <span className="text-[10px] text-gray-500 block mt-2 font-mono">Format: {rep.format}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                <button 
                  onClick={() => handleDownload(`${rep.name} (XLS)`)}
                  className="cc-btn cc-btn-outline py-1.5 text-[11px] flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-file-excel text-emerald-400"></i> XLS
                </button>
                <button 
                  onClick={() => handleDownload(`${rep.name} (PDF)`)}
                  className="cc-btn cc-btn-outline py-1.5 text-[11px] flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-file-pdf text-red-400"></i> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
