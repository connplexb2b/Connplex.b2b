import React, { useState } from 'react';
import { ConnCloudStore, GroupBooking, GroupPackage } from '../../../lib/conncloudData';

interface GroupBookingViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function GroupBookingView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: GroupBookingViewProps) {
  const [subSection, setSubSection] = useState<'pipeline' | 'packages' | 'calendar'>('pipeline');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Store data
  const [bookings, setBookings] = useState<GroupBooking[]>(() => {
    return ConnCloudStore.getGroupBookings();
  });
  const packages = ConnCloudStore.getGroupPackages();
  const cinemas = ConnCloudStore.getCinemas();
  const screens = ConnCloudStore.getScreens();

  // Modals state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [activeQuoteBooking, setActiveQuoteBooking] = useState<GroupBooking | null>(null);

  // New booking form state
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    organization: '',
    contactNumber: '',
    email: '',
    cinemaId: selectedCinemaId === 'all' ? 'c1' : selectedCinemaId,
    screenId: 's1',
    eventType: 'Corporate Screening' as GroupBooking['eventType'],
    date: '',
    timeSlot: '10:00 AM - 01:30 PM',
    guestCount: '100',
    movieTitle: 'Raftaar',
    fnbPackage: 'Gold VIP Combo' as GroupBooking['fnbPackage'],
    advancePaid: '30000',
    specialRequests: ''
  });

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const cinemaMatch = selectedCinemaId === 'all' || b.cinemaId === selectedCinemaId;
    const typeMatch = typeFilter === 'all' || b.eventType === typeFilter;
    const statusMatch = statusFilter === 'all' || b.status === statusFilter;
    const searchMatch = b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    return cinemaMatch && typeMatch && statusMatch && searchMatch;
  });

  // KPI Metrics
  const totalBookingsCount = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed');
  const totalRevenue = confirmedBookings.reduce((acc, b) => acc + b.totalQuoted, 0);
  const totalGuests = confirmedBookings.reduce((acc, b) => acc + b.guestCount, 0);
  const pendingInquiries = bookings.filter(b => b.status === 'Inquiry' || b.status === 'Quote Sent').length;

  // Handle Create Booking
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.clientName || !bookingForm.organization || !bookingForm.date) return;

    const guestCount = parseInt(bookingForm.guestCount, 10) || 50;
    
    // Auto-calculate estimate: Base ₹25,000 + (guests * 250) + (FnB * guests)
    const fnbPerGuest = bookingForm.fnbPackage === 'Platinum Gourmet' ? 250 : 
                        bookingForm.fnbPackage === 'Gold VIP Combo' ? 180 : 
                        bookingForm.fnbPackage === 'Silver Combo' ? 120 : 0;
    const totalQuoted = 25000 + (guestCount * 220) + (guestCount * fnbPerGuest);
    const advancePaid = parseFloat(bookingForm.advancePaid) || 0;

    const newBooking = ConnCloudStore.addGroupBooking({
      clientName: bookingForm.clientName,
      organization: bookingForm.organization,
      contactNumber: bookingForm.contactNumber,
      email: bookingForm.email,
      cinemaId: bookingForm.cinemaId,
      screenId: bookingForm.screenId,
      eventType: bookingForm.eventType,
      date: bookingForm.date,
      timeSlot: bookingForm.timeSlot,
      guestCount,
      movieTitle: bookingForm.movieTitle,
      fnbPackage: bookingForm.fnbPackage,
      totalQuoted,
      advancePaid,
      paymentStatus: advancePaid >= totalQuoted ? 'Fully Paid' : (advancePaid > 0 ? 'Advance Paid' : 'Pending Advance'),
      status: advancePaid > 0 ? 'Confirmed' : 'Quote Sent',
      specialRequests: bookingForm.specialRequests
    });

    setBookings(ConnCloudStore.getGroupBookings());
    setIsNewBookingOpen(false);
    setBookingForm({
      clientName: '',
      organization: '',
      contactNumber: '',
      email: '',
      cinemaId: selectedCinemaId === 'all' ? 'c1' : selectedCinemaId,
      screenId: 's1',
      eventType: 'Corporate Screening',
      date: '',
      timeSlot: '10:00 AM - 01:30 PM',
      guestCount: '100',
      movieTitle: 'Raftaar',
      fnbPackage: 'Gold VIP Combo',
      advancePaid: '30000',
      specialRequests: ''
    });

    triggerNotification(`Created group booking ${newBooking.bookingId} for ${newBooking.organization}.`);
  };

  // Status transition handler
  const handleUpdateStatus = (bookingId: string, newStatus: GroupBooking['status']) => {
    ConnCloudStore.updateGroupBookingStatus(bookingId, newStatus);
    setBookings(ConnCloudStore.getGroupBookings());
    triggerNotification(`Booking ${bookingId} status updated to ${newStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] border border-white/5 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
              <i className="fa-solid fa-users text-[10px]"></i>
              B2B Corporate & Event Bookings
            </span>
            {pendingInquiries > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f5b041]/20 text-[#f5b041] border border-[#f5b041]/30">
                {pendingInquiries} Active Inquir{pendingInquiries > 1 ? 'ies' : 'y'}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold mt-2 tracking-tight text-white">Group Bookings & Private Screenings</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage corporate townhalls, bulk school outings, private auditorium hires, VIP screenings, and group catering.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={() => setIsNewBookingOpen(true)}
            className="cc-btn cc-btn-accent text-xs"
          >
            <i className="fa-solid fa-plus"></i> New Group Booking
          </button>
          <button 
            onClick={() => triggerNotification('Downloading Corporate Tariff & Group Booking Brochure...')}
            className="cc-btn cc-btn-outline text-xs"
          >
            <i className="fa-solid fa-file-pdf"></i> Download Tariff Card
          </button>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Group Events</span>
            <i className="fa-solid fa-calendar-check text-blue-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{totalBookingsCount} Total Bookings</div>
          <div className="text-[10px] text-emerald-400 mt-1">{confirmedBookings.length} Confirmed / Executed</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Confirmed Value</span>
            <i className="fa-solid fa-indian-rupee-sign text-emerald-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-emerald-400">{formatCurrency(totalRevenue)}</div>
          <div className="text-[10px] text-gray-400 mt-1">Direct corporate billing pipeline</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Corporate Guests</span>
            <i className="fa-solid fa-user-group text-[#f5b041] text-xs"></i>
          </div>
          <div className="text-xl font-bold text-[#f5b041]">{totalGuests.toLocaleString('en-IN')} Attendees</div>
          <div className="text-[10px] text-gray-400 mt-1">High-value F&B attachment rate</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Inquiry Conversion</span>
            <i className="fa-solid fa-funnel-dollar text-purple-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">
            {totalBookingsCount > 0 ? Math.round((confirmedBookings.length / totalBookingsCount) * 100) : 0}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">+8.4% YoY performance</div>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setSubSection('pipeline')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'pipeline'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-table-list mr-1.5"></i> Bookings & Inquiries Pipeline
        </button>
        <button
          onClick={() => setSubSection('packages')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'packages'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-gem mr-1.5"></i> Curated Screening Packages
        </button>
        <button
          onClick={() => setSubSection('calendar')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'calendar'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-calendar-days mr-1.5"></i> Screen Slot Holds & Timetable
        </button>
      </section>

      {/* 1. PIPELINE TAB */}
      {subSection === 'pipeline' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-[#111827]/60 p-3 rounded-lg border border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="cc-input text-xs py-1.5"
              >
                <option value="all">All Event Types</option>
                <option value="Corporate Screening">Corporate Screening</option>
                <option value="School Edu-Trip">School Edu-Trip</option>
                <option value="Birthday / Celebration">Birthday / Celebration</option>
                <option value="Private Theatre Rental">Private Theatre Rental</option>
                <option value="Bulk Premiere">Bulk Premiere</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cc-input text-xs py-1.5"
              >
                <option value="all">All Statuses</option>
                <option value="Inquiry">Inquiry</option>
                <option value="Quote Sent">Quote Sent</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative w-full lg:w-72">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search organization, client or movie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cc-input pl-9 w-full text-xs"
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="cc-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3 font-semibold">Ref ID</th>
                    <th className="pb-3 font-semibold">Client & Organization</th>
                    <th className="pb-3 font-semibold">Cinema & Screen</th>
                    <th className="pb-3 font-semibold">Date & Slot</th>
                    <th className="pb-3 font-semibold text-center">Headcount</th>
                    <th className="pb-3 font-semibold">Movie / Content</th>
                    <th className="pb-3 font-semibold">Catering</th>
                    <th className="pb-3 font-semibold text-right">Quoted Value</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => {
                    const cinemaName = cinemas.find(c => c.cinemaId === b.cinemaId)?.name || 'Connplex';
                    const screenName = screens.find(s => s.screenId === b.screenId)?.name || 'Audi 1';
                    return (
                      <tr key={b.bookingId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-mono font-bold text-blue-400">{b.bookingId}</td>
                        <td className="py-3">
                          <div className="font-bold text-white">{b.organization}</div>
                          <div className="text-[10px] text-gray-400">{b.clientName} • {b.contactNumber}</div>
                        </td>
                        <td className="py-3">
                          <span className="text-white font-medium block">{cinemaName}</span>
                          <span className="text-[10px] text-[#f5b041] font-semibold">{screenName}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-gray-200 font-mono block">{b.date}</span>
                          <span className="text-[10px] text-gray-400">{b.timeSlot}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded font-mono font-bold bg-white/5 text-white">
                            {b.guestCount}
                          </span>
                        </td>
                        <td className="py-3 text-gray-300 font-medium line-clamp-1 max-w-[140px] pt-4">
                          {b.movieTitle}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-gray-300 border border-white/10">
                            {b.fnbPackage}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="font-bold text-emerald-400 font-mono">{formatCurrency(b.totalQuoted)}</div>
                          <div className={`text-[10px] font-mono ${
                            b.paymentStatus === 'Fully Paid' ? 'text-emerald-400' : (b.paymentStatus === 'Advance Paid' ? 'text-blue-400' : 'text-amber-400')
                          }`}>
                            {b.paymentStatus}
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'Confirmed' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : (b.status === 'Quote Sent' 
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                  : (b.status === 'Completed' ? 'bg-purple-500/10 text-purple-400' : 'bg-amber-500/10 text-amber-400'))
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveQuoteBooking(b)}
                              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                              title="View Quotation Summary"
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            {b.status === 'Quote Sent' && (
                              <button
                                onClick={() => handleUpdateStatus(b.bookingId, 'Confirmed')}
                                className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 text-[10px] font-bold border border-emerald-500/30"
                              >
                                Confirm
                              </button>
                            )}
                            {b.status === 'Inquiry' && (
                              <button
                                onClick={() => handleUpdateStatus(b.bookingId, 'Quote Sent')}
                                className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 text-[10px] font-bold border border-blue-500/30"
                              >
                                Send Quote
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-10">
                <i className="fa-solid fa-calendar-xmark text-3xl text-gray-600 mb-2"></i>
                <p className="text-sm text-gray-400">No group bookings found matching filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PACKAGES TAB */}
      {subSection === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.packageId}
              className="cc-card p-5 flex flex-col justify-between hover:border-[#f5b041]/40 transition-all rounded-xl border border-white/5 bg-[#111827]"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f5b041]/10 text-[#f5b041] border border-[#f5b041]/20 uppercase">
                    Min {pkg.minGuests} Guests
                  </span>
                  <i className="fa-solid fa-crown text-[#f5b041] text-xs"></i>
                </div>

                <h3 className="text-base font-bold text-white mt-2">{pkg.title}</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{pkg.description}</p>

                <div className="my-4 p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="text-xs text-gray-400">Base Hire Fee</div>
                  <div className="text-xl font-bold text-white mt-0.5">{formatCurrency(pkg.basePrice)}</div>
                  <div className="text-[10px] text-emerald-400 mt-1">+ {formatCurrency(pkg.pricePerGuest)} / additional guest</div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Package Inclusions</span>
                  {pkg.includes.map((inc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <i className="fa-solid fa-check text-emerald-400 text-[10px]"></i>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setBookingForm(prev => ({ ...prev, eventType: 'Corporate Screening' }));
                  setIsNewBookingOpen(true);
                }}
                className="w-full mt-6 cc-btn cc-btn-outline text-xs"
              >
                Book Package
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. CALENDAR & SLOTS TAB */}
      {subSection === 'calendar' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Auditorium Slot Holds & Screen Reservations
              </h3>
              <p className="text-xs text-gray-500">Scheduled group screenings and private rental calendar.</p>
            </div>
            <button 
              onClick={() => triggerNotification('Refreshing screen calendar telemetry...')}
              className="cc-btn cc-btn-outline text-xs"
            >
              <i className="fa-solid fa-arrows-rotate"></i> Sync Schedule
            </button>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.bookingId} className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600/10 border border-blue-500/20 flex flex-col items-center justify-center font-mono">
                    <span className="text-[10px] text-blue-400 font-bold uppercase">{b.date.split('-')[1]}</span>
                    <span className="text-base font-bold text-white">{b.date.split('-')[2]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{b.organization}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-gray-300">
                        {b.eventType}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      <i className="fa-regular fa-clock mr-1 text-gray-500"></i> {b.timeSlot} • 
                      <i className="fa-solid fa-film ml-2 mr-1 text-gray-500"></i> {b.movieTitle} • 
                      <i className="fa-solid fa-users ml-2 mr-1 text-gray-500"></i> {b.guestCount} Guests
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400 font-mono">{formatCurrency(b.totalQuoted)}</div>
                    <div className="text-[10px] text-gray-400">Advance: {formatCurrency(b.advancePaid)}</div>
                  </div>
                  <button 
                    onClick={() => setActiveQuoteBooking(b)}
                    className="cc-btn cc-btn-outline py-1 px-3 text-xs"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: NEW GROUP BOOKING */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-users text-blue-400"></i> Register Group Booking
              </h3>
              <button onClick={() => setIsNewBookingOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto cc-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Organization / Corporate Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wipro Enterprises"
                    value={bookingForm.organization}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, organization: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Contact Person Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankit Sharma"
                    value={bookingForm.clientName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, clientName: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9820112233"
                    value={bookingForm.contactNumber}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                    className="cc-input font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. events@wipro.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Event Type</label>
                  <select
                    value={bookingForm.eventType}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, eventType: e.target.value as any }))}
                    className="cc-input"
                  >
                    <option value="Corporate Screening">Corporate Screening</option>
                    <option value="School Edu-Trip">School Edu-Trip</option>
                    <option value="Birthday / Celebration">Birthday / Celebration</option>
                    <option value="Private Theatre Rental">Private Theatre Rental</option>
                    <option value="Bulk Premiere">Bulk Premiere</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Cinema Location</label>
                  <select
                    value={bookingForm.cinemaId}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, cinemaId: e.target.value }))}
                    className="cc-input"
                  >
                    {cinemas.map(c => (
                      <option key={c.cinemaId} value={c.cinemaId}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Event Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Time Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 01:00 PM"
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Guest Count</label>
                  <input
                    type="number"
                    min={20}
                    value={bookingForm.guestCount}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Movie / Presentation</label>
                  <input
                    type="text"
                    placeholder="e.g. Raftaar or Corporate Slides"
                    value={bookingForm.movieTitle}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, movieTitle: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">F&B Hospitality Package</label>
                  <select
                    value={bookingForm.fnbPackage}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, fnbPackage: e.target.value as any }))}
                    className="cc-input"
                  >
                    <option value="Silver Combo">Silver Combo (Popcorn + Drink)</option>
                    <option value="Gold VIP Combo">Gold VIP Combo (Burger + Popcorn + Drink)</option>
                    <option value="Platinum Gourmet">Platinum Gourmet (3-Course Buffet)</option>
                    <option value="None">None (Only Hall Rental)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Advance Deposit Collected (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  value={bookingForm.advancePaid}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, advancePaid: e.target.value }))}
                  className="cc-input font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Special Audio-Visual or Hospitality Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need podium with 2 wireless mics, HDMI cable hookup..."
                  value={bookingForm.specialRequests}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsNewBookingOpen(false)}
                  className="cc-btn cc-btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn cc-btn-accent py-2 px-4"
                >
                  Confirm & Reserve Hall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUOTE PREVIEW */}
      {activeQuoteBooking && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                Booking Dossier: {activeQuoteBooking.bookingId}
              </h3>
              <button onClick={() => setActiveQuoteBooking(null)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Organization:</span>
                  <span className="font-bold text-white">{activeQuoteBooking.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Client / Contact:</span>
                  <span className="text-gray-300">{activeQuoteBooking.clientName} ({activeQuoteBooking.contactNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Event Date & Time:</span>
                  <span className="text-gray-300">{activeQuoteBooking.date} • {activeQuoteBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Headcount:</span>
                  <span className="font-bold text-white">{activeQuoteBooking.guestCount} Attendees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Content / Film:</span>
                  <span className="text-[#f5b041] font-semibold">{activeQuoteBooking.movieTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Catering Choice:</span>
                  <span className="text-gray-300">{activeQuoteBooking.fnbPackage}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex justify-between text-gray-400">
                  <span>Total Quoted Package:</span>
                  <span className="font-bold text-white font-mono">{formatCurrency(activeQuoteBooking.totalQuoted)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Advance Paid:</span>
                  <span className="text-emerald-400 font-mono font-bold">{formatCurrency(activeQuoteBooking.advancePaid)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Balance Due:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {formatCurrency(Math.max(0, activeQuoteBooking.totalQuoted - activeQuoteBooking.advancePaid))}
                  </span>
                </div>
              </div>

              {activeQuoteBooking.specialRequests && (
                <div className="p-2.5 rounded bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-200">
                  <span className="font-bold block text-[10px] uppercase text-blue-400">Special Instructions:</span>
                  {activeQuoteBooking.specialRequests}
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-white/5">
                <button
                  onClick={() => triggerNotification(`Dispatched official PDF quote to ${activeQuoteBooking.email}`)}
                  className="cc-btn cc-btn-primary py-2 px-3 text-xs"
                >
                  <i className="fa-solid fa-paper-plane mr-1"></i> Send Invoice & Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
