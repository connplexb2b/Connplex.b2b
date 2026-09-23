'use client';

import React, { useEffect } from 'react';

export default function ConnCloudErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ConnCloud] Caught runtime error:', error);
  }, [error]);

  const handleHardReset = () => {
    try {
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('cc_') || key.startsWith('franchisee_')) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch {}
    reset();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="conncloud-body flex items-center justify-center min-h-screen bg-[#0b1220] text-white p-6">
      <div className="max-w-md w-full bg-[#111827] border border-white/10 rounded-2xl p-8 text-center shadow-2xl space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">ConnCloud Console Notice</h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            The workspace encountered a temporary rendering interruption. Click below to restore full operational status.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-600/20"
          >
            Retry View
          </button>
          <button
            onClick={handleHardReset}
            className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 font-semibold text-xs border border-white/10 transition-colors"
          >
            Clear Cache &amp; Reload
          </button>
        </div>
      </div>
    </div>
  );
}
