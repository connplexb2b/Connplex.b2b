import React, { useState } from 'react';
import { ConnCloudStore, Movie, Show } from '../../../lib/conncloudData';

interface MoviesViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function MoviesView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: MoviesViewProps) {
  const [subSection, setSubSection] = useState<'library' | 'details' | 'allocation' | 'request'>('library');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Show Request Form state
  const [requestForm, setRequestForm] = useState({
    title: '',
    reason: 'High local demographic demand',
    demand: 'High',
    notes: ''
  });

  // Pull records
  const movies = ConnCloudStore.getMovies();
  const screens = ConnCloudStore.getScreens().filter(s => selectedCinemaId === 'all' || s.cinemaId === selectedCinemaId);
  const shows = ConnCloudStore.getShows().filter(sh => {
    const scr = ConnCloudStore.getScreens().find(s => s.screenId === sh.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setSubSection('details');
  };

  const handleAllocationChange = (showId: string, status: Show['status']) => {
    const showsList = ConnCloudStore.getShows();
    const show = showsList.find(s => s.showId === showId);
    if (show) {
      show.status = status;
      // In a real application, we would write back to the store
      triggerNotification(`Show allocation for show ${showId} updated to ${status}.`);
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.title) return;
    triggerNotification(`Movie request for "${requestForm.title}" submitted to corporate queue.`);
    setRequestForm({ title: '', reason: 'High local demographic demand', demand: 'High', notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => { setSubSection('library'); setSelectedMovie(null); }}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'library' || subSection === 'details'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Movie Library Catalog
        </button>
        <button
          onClick={() => setSubSection('allocation')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'allocation' 
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Show Allocation Planner
        </button>
        <button
          onClick={() => setSubSection('request')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'request' 
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Request Release Film
        </button>
      </section>

      {/* 1. LIBRARY */}
      {subSection === 'library' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div 
              key={movie.movieId}
              onClick={() => handleMovieSelect(movie)}
              className="cc-card cursor-pointer hover:border-blue-500/30 flex gap-4 items-start"
            >
              <div className="w-16 h-20 bg-blue-950 flex items-center justify-center text-3xl rounded border border-white/5">
                {movie.poster}
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[8px] font-bold bg-[#f5b041]/10 text-[#f5b041] border border-[#f5b041]/20 uppercase">{movie.certification}</span>
                <h4 className="font-bold text-white text-sm mt-1">{movie.title}</h4>
                <p className="text-[10px] text-gray-400">{movie.genre} • {movie.duration} mins</p>
                <p className="text-[10px] text-gray-500 font-semibold">{movie.language}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. MOVIE DETAILS */}
      {subSection === 'details' && selectedMovie && (
        <div className="space-y-6">
          <button 
            onClick={() => setSubSection('library')}
            className="text-xs text-blue-400 hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Library Catalog
          </button>
          
          <div className="cc-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-44 bg-blue-950 flex items-center justify-center text-6xl rounded border border-white/10 shadow-lg">
              {selectedMovie.poster}
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#f5b041]/15 text-[#f5b041] border border-[#f5b041]/20">{selectedMovie.certification}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-gray-300">{selectedMovie.language}</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">{selectedMovie.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{selectedMovie.genre} • {selectedMovie.duration} Mins • Released: {selectedMovie.releaseDate}</p>
              <div className="text-xs text-gray-300 font-medium">Cast: <span className="text-gray-400">{selectedMovie.cast.join(', ')}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Show analytics for this specific movie */}
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Movie Admissions</span>
              <div className="text-2xl font-black text-white">8,450</div>
              <div className="text-xs text-gray-500 mt-2">Cumulative box office ticket sales</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Total Movie Gross</span>
              <div className="text-2xl font-black text-emerald-400">₹18.59L</div>
              <div className="text-xs text-gray-500 mt-2">Ticket collection share (GST-exempt P&L)</div>
            </div>
            <div className="cc-card">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Average Occupancy</span>
              <div className="text-2xl font-black text-[#f5b041]">78.4%</div>
              <div className="text-xs text-gray-500 mt-2">Seating utilization levels across schedules</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ALLOCATION */}
      {subSection === 'allocation' && (
        <div className="cc-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Show Allocation Scheduler</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-bold">
                  <th className="pb-3">Show ID</th>
                  <th className="pb-3">Screen</th>
                  <th className="pb-3">Movie Allocated</th>
                  <th className="pb-3">Show Time</th>
                  <th className="pb-3 text-center">Allocated Capacity</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {shows.slice(0, 10).map((sh) => {
                  const m = movies.find(movie => movie.movieId === sh.movieId);
                  const scr = screens.find(s => s.screenId === sh.screenId);
                  if (!scr) return null;
                  return (
                    <tr key={sh.showId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-gray-300">{sh.showId}</td>
                      <td className="py-3 text-gray-300 font-bold">{scr.name}</td>
                      <td className="py-3 font-semibold text-white">{m?.title}</td>
                      <td className="py-3 text-gray-400">{sh.time}</td>
                      <td className="py-3 text-center text-gray-300">{sh.capacity} seats</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sh.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : (sh.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400')
                        }`}>
                          {sh.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        {sh.status === 'Scheduled' ? (
                          <select 
                            className="cc-input py-0.5 px-2 text-[10px] bg-[#1f2937]"
                            value={sh.status}
                            onChange={(e) => handleAllocationChange(sh.showId, e.target.value as any)}
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Cancelled">Cancel Show</option>
                          </select>
                        ) : (
                          <span className="text-gray-500 text-[10px] font-semibold">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REQUEST */}
      {subSection === 'request' && (
        <div className="cc-card max-w-lg mx-auto">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Request Release Film Release</h3>
          <p className="text-xs text-gray-500 mb-6">Franchise partners can request upcoming releases and scheduling locks for their specific screens.</p>
          
          <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400">Movie Title</label>
              <input 
                type="text" 
                className="cc-input"
                placeholder="e.g. Tiger 4 (2026 Release)"
                value={requestForm.title}
                onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Request Reason</label>
                <select 
                  className="cc-input"
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                >
                  <option value="High local demographic demand">High local demographic demand</option>
                  <option value="Holiday weekend block placement">Holiday weekend block placement</option>
                  <option value="Regional film promotion festival">Regional film promotion festival</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Expected Local Demand</label>
                <select 
                  className="cc-input"
                  value={requestForm.demand}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, demand: e.target.value }))}
                >
                  <option value="High">High Demand (80%+ Occupancy)</option>
                  <option value="Moderate">Moderate Demand (50%-80%)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400">Special Notes for Corporate Ops</label>
              <textarea 
                className="cc-input min-h-[80px]"
                placeholder="e.g. Seeking exclusive placement on screen 1 IMAX."
                value={requestForm.notes}
                onChange={(e) => setRequestForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <button type="submit" className="w-full cc-btn cc-btn-accent text-blue-950 font-bold mt-4">
              Submit Film Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
