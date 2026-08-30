import React from 'react';

interface ReportsViewProps {
  triggerNotification: (msg: string) => void;
}

export default function ReportsView({ triggerNotification }: ReportsViewProps) {
  const handleDownload = (reportName: string) => {
    triggerNotification(`Downloading report: ${reportName}...`);
  };

  return (
    <div className="cc-card">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Report Center</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Daily Revenue Statement', type: 'Sales & Commercial', format: 'PDF / XLS' },
          { name: 'Daily Admissions Summary', type: 'Box Office Stats', format: 'PDF' },
          { name: 'F&B Gross Profit Margins', type: 'POS Inventory', format: 'XLS' },
          { name: 'Royalty Obligations Sheet', type: 'Finance & Compliance', format: 'PDF / CSV' },
          { name: 'Staff Attendance Ledger', type: 'Human Resources', format: 'XLS' },
          { name: 'Equipment SLA & Downtimes', type: 'Operations telemetry', format: 'PDF' }
        ].map((rep, idx) => (
          <div key={idx} className="p-4 rounded bg-black/25 border border-white/5 space-y-3 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">{rep.type}</span>
              <h4 className="font-bold text-white text-sm mt-1">{rep.name}</h4>
              <span className="text-[10px] text-gray-500 block mt-1">Available Format: {rep.format}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button 
                onClick={() => handleDownload(`${rep.name} (XLS)`)}
                className="cc-btn cc-btn-outline py-1 text-[10px]"
              >
                Download XLS
              </button>
              <button 
                onClick={() => handleDownload(`${rep.name} (PDF)`)}
                className="cc-btn cc-btn-outline py-1 text-[10px]"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
