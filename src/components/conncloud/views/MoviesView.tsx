import React, { useState, useMemo } from 'react';
import { ConnCloudStore, Movie, Show } from '../../../lib/conncloudData';

interface MoviesViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

const VISTA_FILM_CODES: Record<string, string> = {
  m1: 'F101',
  m2: 'F102',
  m3: 'F103',
  m4: 'F104',
  m5: 'F105',
  m6: 'F106'
};

export default function MoviesView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: MoviesViewProps) {
  const [subSection, setSubSection] = useState<'library' | 'today-sessions' | 'details' | 'allocation' | 'request'>('library');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'screening' | 'unscheduled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScreenFilter, setSelectedScreenFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'all' | 'week'>('today');

  // Show Request Form state
  const [requestForm, setRequestForm] = useState({
    title: '',
    reason: 'High local demographic demand',
    demand: 'High',
    notes: ''
  });

  const isAhilyanagar = selectedCinemaId === 'c5';
  const currentCinema = ConnCloudStore.getCinemas().find(c => c.cinemaId === selectedCinemaId);
  const cinemaName = selectedCinemaId === 'all' ? 'All Cinemas' : (currentCinema?.name || 'Selected Cinema');

  // Pull records from store
  const movies = ConnCloudStore.getMovies();
  const screens = ConnCloudStore.getScreens().filter(s => selectedCinemaId === 'all' || s.cinemaId === selectedCinemaId);
  const shows = ConnCloudStore.getShows().filter(sh => {
    const scr = ConnCloudStore.getScreens().find(s => s.screenId === sh.screenId);
    return selectedCinemaId === 'all' || scr?.cinemaId === selectedCinemaId;
  });

  // Calculate Today's date (or most recent date in shows)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const latestDateInShows = shows.length > 0 
    ? [...shows].sort((a, b) => b.date.localeCompare(a.date))[0].date 
    : todayDateStr;
  const activeShowDate = shows.some(s => s.date === todayDateStr) ? todayDateStr : latestDateInShows;

  // Today's live shows
  const todayShows = shows.filter(s => s.date === activeShowDate);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Helper to compute movie specific stats dynamically
  const getMovieStats = (movieId: string) => {
    const movieShows = shows.filter(sh => sh.movieId === movieId);
    const movieTodayShows = todayShows.filter(sh => sh.movieId === movieId);
    const ticketsSold = movieShows.reduce((acc, s) => acc + s.ticketsSold, 0);
    const totalCapacity = movieShows.reduce((acc, s) => acc + s.capacity, 0);
    const occupancy = totalCapacity > 0 ? Math.round((ticketsSold / totalCapacity) * 100) : 0;
    
    // Screens where this movie has shows
    const screenIds = Array.from(new Set(movieShows.map(s => s.screenId)));
    const movieScreens = screens.filter(sc => screenIds.includes(sc.screenId));
    
    // Revenue calculated by screen pricing
    const boxOffice = movieShows.reduce((acc, s) => {
      const scr = screens.find(sc => sc.screenId === s.screenId);
      const price = scr?.format.includes('IMAX') ? 350 : (scr?.name.toLowerCase().includes('couple') ? 280 : 240);
      return acc + (s.ticketsSold * price);
    }, 0);

    // Today's showtimes sorted
    const todayTimes = Array.from(new Set(movieTodayShows.map(s => s.time))).sort();

    // Is now playing
    const isNowPlaying = movieShows.length > 0;

    return {
      movieShows,
      movieTodayShows,
      ticketsSold,
      totalCapacity,
      occupancy,
      movieScreens,
      boxOffice,
      todayTimes,
      isNowPlaying
    };
  };

  // Aggregate totals
  const totalCinemaAdmissions = shows.reduce((acc, s) => acc + s.ticketsSold, 0);
  const totalCinemaBoxOffice = shows.reduce((acc, s) => {
    const scr = screens.find(sc => sc.screenId === s.screenId);
    const price = scr?.format.includes('IMAX') ? 350 : (scr?.name.toLowerCase().includes('couple') ? 280 : 240);
    return acc + (s.ticketsSold * price);
  }, 0);
  const totalCinemaCapacity = shows.reduce((acc, s) => acc + s.capacity, 0);
  const avgCinemaOccupancy = totalCinemaCapacity > 0 ? ((totalCinemaAdmissions / totalCinemaCapacity) * 100).toFixed(1) : '0';
  const activeMoviesCount = movies.filter(m => getMovieStats(m.movieId).isNowPlaying).length;

  // Filtered movies
  const filteredMovies = movies.filter(movie => {
    const stats = getMovieStats(movie.movieId);
    if (filterMode === 'screening' && !stats.isNowPlaying) return false;
    if (filterMode === 'unscheduled' && stats.isNowPlaying) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        movie.title.toLowerCase().includes(q) ||
        movie.genre.toLowerCase().includes(q) ||
        movie.language.toLowerCase().includes(q)
      );
    }
    return true;
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
      triggerNotification(`Show allocation for ${showId} updated to ${status}.`);
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
      {/* Vista API Live Telemetry Header (Ahilyanagar) */}
      {isAhilyanagar && (
        <div className="bg-gradient-to-r from-amber-500/15 via-black/40 to-transparent border border-amber-500/30 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
              <i className="fa-solid fa-film"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Vista Box Office Live Sync: Ahilyanagar</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE API CONNECTED
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CinemaID: Ahilyanagar
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                Real-time sessions, seating allocations, and box office ticket sync active from <code className="text-amber-300 text-[11px]">/api.asmx/GetDailyTicketAndFnbData</code>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-400">Sync: <strong className="text-white">Auto (06:00 AM)</strong></span>
            <button 
              onClick={() => triggerNotification('Triggered live session re-sync from Vista API for Ahilyanagar.')}
              className="cc-btn cc-btn-outline text-xs px-3 py-1 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrows-rotate text-amber-400"></i>
              <span>Re-sync Sessions</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111827] border border-white/5 p-3 rounded-xl">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => { setSubSection('library'); setSelectedMovie(null); }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              subSection === 'library' || subSection === 'details'
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fa-solid fa-clapperboard mr-1.5"></i>
            Movie Catalog &amp; Live Status
          </button>
          <button
            onClick={() => setSubSection('today-sessions')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all relative ${
              subSection === 'today-sessions' 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fa-solid fa-clock mr-1.5"></i>
            Today's Live Sessions
            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {todayShows.length} Live
            </span>
          </button>
          <button
            onClick={() => setSubSection('allocation')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              subSection === 'allocation' 
                ? 'bg-blue-600 text-white shadow shadow-blue-600/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fa-solid fa-calendar-days mr-1.5"></i>
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
            <i className="fa-solid fa-plus mr-1.5"></i>
            Request Release Film
          </button>
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span>Active Cinema:</span>
          <span className="font-bold text-white bg-black/40 px-2 py-1 rounded border border-white/10">
            {cinemaName}
          </span>
        </div>
      </section>

      {/* Cinema Overview Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="cc-card p-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Films in Screening</span>
          <div className="text-xl font-extrabold text-white flex items-center gap-1.5">
            <span>{activeMoviesCount}</span>
            <span className="text-[11px] font-normal text-emerald-400">/ {movies.length} Catalog</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Active on screens</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Today's Live Sessions</span>
          <div className="text-xl font-extrabold text-blue-400 flex items-center gap-1.5">
            <span>{todayShows.length} Shows</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              Today
            </span>
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Live POS schedule</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Total Cinema Box Office</span>
          <div className="text-xl font-extrabold text-emerald-400">
            {formatCurrency(totalCinemaBoxOffice)}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Gross ticket collections</span>
        </div>
        <div className="cc-card p-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Avg Seat Occupancy</span>
          <div className="text-xl font-extrabold text-[#f5b041]">
            {avgCinemaOccupancy}%
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">{totalCinemaAdmissions.toLocaleString('en-IN')} total admissions</span>
        </div>
      </div>

      {/* 1. LIBRARY & LIVE STATUS */}
      {subSection === 'library' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  filterMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                All Films ({movies.length})
              </button>
              <button
                onClick={() => setFilterMode('screening')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filterMode === 'screening'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Now Playing in {isAhilyanagar ? 'Ahilyanagar' : 'Cinema'} ({activeMoviesCount})
              </button>
              <button
                onClick={() => setFilterMode('unscheduled')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  filterMode === 'unscheduled'
                    ? 'bg-gray-700 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Catalog Archive ({movies.length - activeMoviesCount})
              </button>
            </div>

            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search film by title, genre..."
                className="cc-input pl-8 py-1.5 text-xs w-full sm:w-64"
              />
            </div>
          </div>

          {/* Film Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.map((movie) => {
              const stats = getMovieStats(movie.movieId);
              const vistaCode = VISTA_FILM_CODES[movie.movieId] || 'F100';

              return (
                <div 
                  key={movie.movieId}
                  onClick={() => handleMovieSelect(movie)}
                  className={`cc-card cursor-pointer transition-all duration-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between ${
                    stats.isNowPlaying ? 'border-white/10 bg-[#0d131f]' : 'opacity-75 bg-[#0b0f17]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Poster, Badges & Title */}
                    <div className="flex gap-3.5 items-start">
                      <div className="w-20 h-28 bg-gradient-to-b from-blue-950/80 to-black rounded-lg border border-white/10 flex flex-col items-center justify-center text-4xl shrink-0 shadow-md relative overflow-hidden">
                        <span>{movie.poster}</span>
                        <span className="text-[9px] font-mono font-bold text-amber-300/80 mt-1 block">
                          {vistaCode}
                        </span>
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#f5b041]/15 text-[#f5b041] border border-[#f5b041]/30 uppercase">
                            {movie.certification}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-white/5 text-gray-300">
                            {movie.language}
                          </span>
                          {stats.isNowPlaying ? (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              LIVE
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                              ARCHIVE
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-base truncate mt-1">{movie.title}</h4>
                        <p className="text-[11px] text-gray-400 truncate">{movie.genre} • {movie.duration} mins</p>
                        <p className="text-[10px] text-gray-500 truncate">Cast: {movie.cast.join(', ')}</p>
                      </div>
                    </div>

                    {/* Live Allocated Screens & Showtimes */}
                    {stats.isNowPlaying ? (
                      <div className="space-y-2 bg-black/30 p-2.5 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-400 font-bold uppercase tracking-wider">Allocated Screens:</span>
                          <span className="text-amber-300 font-semibold">
                            {stats.movieScreens.map(s => s.name.replace(/Connplex /i, '')).join(' | ') || 'Screen 1 & 2'}
                          </span>
                        </div>

                        {/* Today's Showtimes */}
                        {stats.todayTimes.length > 0 && (
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Today's Showtimes:</span>
                            <div className="flex flex-wrap gap-1">
                              {stats.todayTimes.map((time, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30"
                                >
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Live Performance Bar */}
                        <div className="pt-1">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-gray-400 font-medium">Box Office Gross:</span>
                            <span className="font-bold text-emerald-400">{formatCurrency(stats.boxOffice)}</span>
                          </div>
                          <div className="flex justify-between text-[10px] mb-1.5">
                            <span className="text-gray-400 font-medium">Tickets Sold:</span>
                            <span className="font-bold text-white">{stats.ticketsSold.toLocaleString('en-IN')} ({stats.occupancy}% occ.)</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${stats.occupancy > 80 ? 'bg-amber-400' : 'bg-blue-500'}`} 
                              style={{ width: `${Math.min(100, stats.occupancy)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-center text-[10px] text-gray-500">
                        <i className="fa-solid fa-pause mr-1"></i> Not currently scheduled in {cinemaName}. Click to view details or request allocation.
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-semibold">
                    <span>View Live Analytics &amp; Shows</span>
                    <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TODAY'S LIVE SESSIONS (VISTA POS SYNC) */}
      {subSection === 'today-sessions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#111827] border border-white/5 p-4 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Today's Live Show Schedule ({activeShowDate})
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {todayShows.length} Sessions Active
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time session occupancy, seat bookings, and gross collections synced from Vista POS Box Office feed.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => triggerNotification(`Exporting today's run sheet for ${cinemaName}...`)}
                className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-print text-gray-400"></i> Print Run Sheet
              </button>
              <button 
                onClick={() => triggerNotification('Re-fetching live session seating status from Vista API...')}
                className="cc-btn cc-btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-arrows-rotate text-amber-400"></i>
                <span>Sync Sessions</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayShows.map((sh, idx) => {
              const movie = movies.find(m => m.movieId === sh.movieId);
              const scr = screens.find(s => s.screenId === sh.screenId);
              const ticketPrice = scr?.format.includes('IMAX') ? 350 : (scr?.name.toLowerCase().includes('couple') ? 280 : 240);
              const sessionRevenue = sh.ticketsSold * ticketPrice;
              const occupancyPct = sh.capacity > 0 ? Math.round((sh.ticketsSold / sh.capacity) * 100) : 0;
              const seatsLeft = Math.max(0, sh.capacity - sh.ticketsSold);
              const vistaSessionId = `VS-${91024 + idx}`;

              return (
                <div key={sh.showId} className="cc-card p-4 space-y-3 bg-[#0d1320] border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-14 rounded bg-blue-950 border border-white/10 flex items-center justify-center text-2xl shadow">
                        {movie?.poster || '🎬'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{movie?.title}</span>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#f5b041]/20 text-[#f5b041]">
                            {movie?.certification}
                          </span>
                        </div>
                        <span className="text-xs text-amber-300 font-semibold block mt-0.5">
                          {scr?.name || 'Screen 1'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          Session: #{vistaSessionId} • {movie?.duration} mins
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-white block">{sh.time}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold inline-block mt-0.5 ${
                        sh.status === 'Completed' 
                          ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                      }`}>
                        {sh.status === 'Completed' ? 'Screening Finished' : 'Live / Active'}
                      </span>
                    </div>
                  </div>

                  {/* Seating progress bar */}
                  <div className="space-y-1.5 bg-black/30 p-2.5 rounded border border-white/5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-300">
                        Booked: <strong className="text-white">{sh.ticketsSold} / {sh.capacity} Seats</strong>
                      </span>
                      <span className={seatsLeft <= 5 ? 'text-amber-400 font-bold' : 'text-gray-400'}>
                        {seatsLeft > 0 ? `${seatsLeft} Seats Left` : 'HOUSEFULL'} ({occupancyPct}%)
                      </span>
                    </div>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${occupancyPct > 85 ? 'bg-amber-400' : 'bg-blue-500'}`} 
                        style={{ width: `${occupancyPct}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1">
                      <span className="text-gray-400">
                        Price: <strong className="text-gray-200">₹{ticketPrice}/ticket</strong>
                      </span>
                      <span className="text-emerald-400 font-bold">
                        Collection: {formatCurrency(sessionRevenue)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-1 text-xs">
                    <button 
                      onClick={() => triggerNotification(`Viewing live real-time seat layout for ${movie?.title} (${sh.time}) on ${scr?.name}`)}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <i className="fa-solid fa-chair text-[10px]"></i> View Seat Grid
                    </button>
                    <span className="text-[10px] text-gray-500 font-mono">Vista Box Office Synced</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MOVIE DETAILS & LIVE ANALYTICS */}
      {subSection === 'details' && selectedMovie && (() => {
        const stats = getMovieStats(selectedMovie.movieId);
        const vistaCode = VISTA_FILM_CODES[selectedMovie.movieId] || 'F100';

        return (
          <div className="space-y-6">
            <button 
              onClick={() => setSubSection('library')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Movie Catalog
            </button>
            
            <div className="cc-card flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-44 bg-gradient-to-b from-blue-950 to-black flex flex-col items-center justify-center text-6xl rounded-xl border border-white/10 shadow-xl shrink-0">
                <span>{selectedMovie.poster}</span>
                <span className="text-xs font-mono font-bold text-amber-300 mt-2 block">{vistaCode}</span>
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#f5b041]/15 text-[#f5b041] border border-[#f5b041]/20">
                    {selectedMovie.certification}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-gray-300">
                    {selectedMovie.language}
                  </span>
                  {stats.isNowPlaying ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Now Screening in {cinemaName}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-gray-500/10 text-gray-400">
                      Not Currently in Rotation
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-white">{selectedMovie.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {selectedMovie.genre} • {selectedMovie.duration} Mins • Released: {selectedMovie.releaseDate}
                </p>
                <div className="text-xs text-gray-300 font-medium">
                  Starring: <span className="text-gray-400">{selectedMovie.cast.join(', ')}</span>
                </div>
                <div className="text-xs text-gray-400">
                  Vista WebService Film Code: <code className="text-amber-300 font-mono">{vistaCode}</code> • Standard DCP 2K/4K DCI Compliant
                </div>
              </div>
            </div>

            {/* Dynamic Real-time Movie Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="cc-card">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Movie Admissions</span>
                <div className="text-2xl font-black text-white">{stats.ticketsSold.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 mt-2">Cumulative box office ticket sales in {cinemaName}</div>
              </div>
              <div className="cc-card">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Total Movie Gross</span>
                <div className="text-2xl font-black text-emerald-400">{formatCurrency(stats.boxOffice)}</div>
                <div className="text-xs text-gray-500 mt-2">Actual ticket collection share (Vista Synced)</div>
              </div>
              <div className="cc-card">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Average Occupancy</span>
                <div className="text-2xl font-black text-[#f5b041]">{stats.occupancy}%</div>
                <div className="text-xs text-gray-500 mt-2">Seating utilization levels across all scheduled shows</div>
              </div>
            </div>

            {/* Scheduled Shows for this film */}
            <div className="cc-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Screen Allocations &amp; Showtimes for {selectedMovie.title}
              </h3>
              {stats.movieShows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 font-bold">
                        <th className="pb-3">Show ID</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Time</th>
                        <th className="pb-3">Screen</th>
                        <th className="pb-3 text-center">Tickets Sold</th>
                        <th className="pb-3 text-center">Occupancy</th>
                        <th className="pb-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.movieShows.slice(0, 8).map((sh) => {
                        const scr = screens.find(s => s.screenId === sh.screenId);
                        const occ = sh.capacity > 0 ? Math.round((sh.ticketsSold / sh.capacity) * 100) : 0;
                        return (
                          <tr key={sh.showId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 font-semibold text-gray-300">{sh.showId}</td>
                            <td className="py-3 text-gray-300">{sh.date}</td>
                            <td className="py-3 text-gray-200 font-bold">{sh.time}</td>
                            <td className="py-3 text-amber-300">{scr?.name || 'Screen'}</td>
                            <td className="py-3 text-center font-bold text-white">{sh.ticketsSold} / {sh.capacity}</td>
                            <td className="py-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300">
                                {occ}%
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                sh.status === 'Completed' ? 'bg-gray-500/20 text-gray-400' : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {sh.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-4 text-center">No shows currently allocated for this film in {cinemaName}.</p>
              )}
            </div>
          </div>
        );
      })()}

      {/* 4. ALLOCATION PLANNER */}
      {subSection === 'allocation' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#111827] border border-white/5 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Show Allocation Scheduler &amp; Planner
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Manage movie showtimes, auditorium formats, and live allocation statuses.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <select 
                className="cc-input py-1 px-3 text-xs bg-[#1f2937]"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value as any)}
              >
                <option value="today">Today's Shows ({activeShowDate})</option>
                <option value="week">Past 7 Days</option>
                <option value="all">All 30-Day History</option>
              </select>

              <select 
                className="cc-input py-1 px-3 text-xs bg-[#1f2937]"
                value={selectedScreenFilter}
                onChange={(e) => setSelectedScreenFilter(e.target.value)}
              >
                <option value="all">All Screens ({screens.length})</option>
                {screens.map(s => (
                  <option key={s.screenId} value={s.screenId}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cc-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 font-bold">
                    <th className="pb-3">Show ID</th>
                    <th className="pb-3">Screen</th>
                    <th className="pb-3">Movie Allocated</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Show Time</th>
                    <th className="pb-3 text-center">Tickets Sold / Cap</th>
                    <th className="pb-3 text-center">Occupancy</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shows
                    .filter(sh => {
                      if (selectedScreenFilter !== 'all' && sh.screenId !== selectedScreenFilter) return false;
                      if (selectedDateFilter === 'today' && sh.date !== activeShowDate) return false;
                      return true;
                    })
                    .sort((a, b) => {
                      if (a.date !== b.date) return b.date.localeCompare(a.date);
                      return a.time.localeCompare(b.time);
                    })
                    .slice(0, 15)
                    .map((sh) => {
                      const m = movies.find(movie => movie.movieId === sh.movieId);
                      const scr = screens.find(s => s.screenId === sh.screenId);
                      if (!scr) return null;
                      const occ = sh.capacity > 0 ? Math.round((sh.ticketsSold / sh.capacity) * 100) : 0;

                      return (
                        <tr key={sh.showId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 font-semibold text-gray-300 font-mono">{sh.showId}</td>
                          <td className="py-3 text-gray-300 font-bold">{scr.name}</td>
                          <td className="py-3 font-semibold text-white">{m?.title}</td>
                          <td className="py-3 text-gray-400">{sh.date}</td>
                          <td className="py-3 text-gray-300 font-bold">{sh.time}</td>
                          <td className="py-3 text-center text-gray-300 font-semibold">{sh.ticketsSold} / {sh.capacity} seats</td>
                          <td className="py-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300">
                              {occ}%
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sh.status === 'Completed' 
                                ? 'bg-gray-500/15 text-gray-400' 
                                : (sh.status === 'Scheduled' ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400')
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
        </div>
      )}

      {/* 5. REQUEST FILM */}
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
                placeholder="e.g. Seeking exclusive placement on screen 1 couple recliner."
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
