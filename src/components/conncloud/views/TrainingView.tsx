import React, { useState } from 'react';
import { ConnCloudStore, TrainingModule, StaffOrientation, TrainingCertification } from '../../../lib/conncloudData';

interface TrainingViewProps {
  selectedCinemaId: string;
  selectedDateRange: string;
  triggerNotification: (msg: string) => void;
}

export default function TrainingView({
  selectedCinemaId,
  selectedDateRange,
  triggerNotification
}: TrainingViewProps) {
  const [subSection, setSubSection] = useState<'modules' | 'orientation' | 'certifications' | 'drills'>('modules');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Store data
  const [modules, setModules] = useState<TrainingModule[]>(() => ConnCloudStore.getTrainingModules());
  const [orientations, setOrientations] = useState<StaffOrientation[]>(() => ConnCloudStore.getStaffOrientations());
  const [certifications, setCertifications] = useState<TrainingCertification[]>(() => ConnCloudStore.getCertifications());

  // Modals state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  // Add module form state
  const [moduleForm, setModuleForm] = useState({
    title: '',
    category: 'Hospitality & Service' as TrainingModule['category'],
    durationHours: '4',
    totalLessons: '6',
    passingScore: '85',
    description: '',
    mandatoryFor: 'All Departments'
  });

  // Enroll form state
  const [enrollForm, setEnrollForm] = useState({
    employeeName: '',
    department: 'Ticketing',
    role: 'Box Office Trainee',
    mentor: 'Jahnvi Gupta',
    orientationBatch: 'Cohort 2026-Sep'
  });

  const categories = ['all', 'Onboarding', 'Safety & Compliance', 'Hospitality & Service', 'Technical & Projection', 'F&B Hygiene', 'POS & Ticketing'];

  // Filtered modules
  const filteredModules = modules.filter(m => {
    const catMatch = selectedCategory === 'all' || m.category === selectedCategory;
    const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  // KPI Calculations
  const totalCourses = modules.length;
  const activeOrientees = orientations.filter(o => o.status === 'In Progress').length;
  const completedOrientations = orientations.filter(o => o.status === 'Completed').length;
  const certificationComplianceRate = orientations.length > 0 
    ? Math.round((completedOrientations / orientations.length) * 100) 
    : 100;

  // Handle Create Module
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title || !moduleForm.durationHours) return;

    const newMod = ConnCloudStore.addTrainingModule({
      title: moduleForm.title,
      category: moduleForm.category,
      durationHours: parseFloat(moduleForm.durationHours) || 4,
      totalLessons: parseInt(moduleForm.totalLessons, 10) || 6,
      mandatoryFor: [moduleForm.mandatoryFor],
      passingScore: parseInt(moduleForm.passingScore, 10) || 80,
      status: 'Active',
      description: moduleForm.description || 'Standard Operating Procedure and compliance training course.',
      thumbnailIcon: moduleForm.category === 'Technical & Projection' ? 'fa-video' : (moduleForm.category === 'F&B Hygiene' ? 'fa-utensils' : (moduleForm.category === 'Safety & Compliance' ? 'fa-fire-extinguisher' : 'fa-graduation-cap'))
    });

    setModules(ConnCloudStore.getTrainingModules());
    setIsAddModuleOpen(false);
    setModuleForm({
      title: '',
      category: 'Hospitality & Service',
      durationHours: '4',
      totalLessons: '6',
      passingScore: '85',
      description: '',
      mandatoryFor: 'All Departments'
    });
    triggerNotification(`Created training course: ${newMod.title}`);
  };

  // Handle Enroll Staff
  const handleEnrollStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.employeeName) return;

    const newOrient = ConnCloudStore.enrollStaffInOrientation({
      employeeId: `st_${Date.now()}`,
      employeeName: enrollForm.employeeName,
      department: enrollForm.department,
      role: enrollForm.role,
      joinDate: new Date().toISOString().split('T')[0],
      orientationBatch: enrollForm.orientationBatch,
      mentor: enrollForm.mentor,
      totalModules: 6
    });

    setOrientations(ConnCloudStore.getStaffOrientations());
    setIsEnrollOpen(false);
    setEnrollForm({
      employeeName: '',
      department: 'Ticketing',
      role: 'Box Office Trainee',
      mentor: 'Jahnvi Gupta',
      orientationBatch: 'Cohort 2026-Sep'
    });
    triggerNotification(`Enrolled ${newOrient.employeeName} in ${newOrient.orientationBatch}.`);
  };

  // Progress update simulation
  const handleAdvanceModule = (orientationId: string, employeeName: string) => {
    ConnCloudStore.updateOrientationProgress(orientationId, 1);
    setOrientations(ConnCloudStore.getStaffOrientations());
    triggerNotification(`Logged completed lesson for ${employeeName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] border border-white/5 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              <i className="fa-solid fa-graduation-cap text-[10px]"></i>
              Connplex Cinema Academy & HR Development
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {certificationComplianceRate}% Onboarding Verified
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2 tracking-tight text-white">Training & Orientation Management</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage employee onboarding cohorts, FSSAI hygiene guidelines, projection booth certifications, fire drills, and SOP compliance.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={() => setIsAddModuleOpen(true)}
            className="cc-btn cc-btn-accent text-xs"
          >
            <i className="fa-solid fa-plus"></i> New Training SOP
          </button>
          <button 
            onClick={() => setIsEnrollOpen(true)}
            className="cc-btn cc-btn-outline text-xs"
          >
            <i className="fa-solid fa-user-plus"></i> Enroll New Hire
          </button>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Academy Modules</span>
            <i className="fa-solid fa-book-bookmark text-blue-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-white">{totalCourses} Active Courses</div>
          <div className="text-[10px] text-gray-400 mt-1">Covering 6 core cinema disciplines</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Active Orientees</span>
            <i className="fa-solid fa-users-line text-[#f5b041] text-xs"></i>
          </div>
          <div className="text-xl font-bold text-[#f5b041]">{activeOrientees} Trainees</div>
          <div className="text-[10px] text-gray-400 mt-1">Current onboarding cohort cycle</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Certified Staff Rate</span>
            <i className="fa-solid fa-award text-emerald-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-emerald-400">{certificationComplianceRate}% Passed</div>
          <div className="text-[10px] text-gray-400 mt-1">All regulatory criteria satisfied</div>
        </div>

        <div className="cc-card">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Upcoming Safety Drill</span>
            <i className="fa-solid fa-fire-extinguisher text-rose-400 text-xs"></i>
          </div>
          <div className="text-xl font-bold text-rose-400">12 Sep 2026</div>
          <div className="text-[10px] text-gray-400 mt-1">Mandatory quarterly evacuation drill</div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="flex flex-wrap gap-1 bg-[#111827] border border-white/5 p-2 rounded-xl">
        <button
          onClick={() => setSubSection('modules')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'modules'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-chalkboard-user mr-1.5"></i> Training Modules & SOPs
        </button>
        <button
          onClick={() => setSubSection('orientation')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'orientation'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-user-graduate mr-1.5"></i> New Hire Orientation Cohorts
        </button>
        <button
          onClick={() => setSubSection('certifications')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'certifications'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-stamp mr-1.5"></i> Certifications Ledger
        </button>
        <button
          onClick={() => setSubSection('drills')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
            subSection === 'drills'
              ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <i className="fa-solid fa-person-running mr-1.5"></i> Mandatory Drills & Safety
        </button>
      </section>

      {/* 1. TRAINING MODULES TAB */}
      {subSection === 'modules' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-[#111827]/60 p-3 rounded-lg border border-white/5">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {cat === 'all' ? 'All Modules' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search training courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cc-input pl-9 w-full text-xs"
              />
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((mod) => {
              const completionPct = mod.enrolledCount > 0 
                ? Math.round((mod.completedCount / mod.enrolledCount) * 100) 
                : 0;
              return (
                <div 
                  key={mod.moduleId}
                  className="cc-card p-5 flex flex-col justify-between hover:border-[#f5b041]/40 transition-all rounded-xl border border-white/5 bg-[#111827]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-base">
                        <i className={`fa-solid ${mod.thumbnailIcon || 'fa-book'}`}></i>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-gray-300 border border-white/10">
                        {mod.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 my-4 p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-center">
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase">Duration</span>
                        <strong className="text-white font-mono">{mod.durationHours} hrs</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase">Lessons</span>
                        <strong className="text-white font-mono">{mod.totalLessons}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase">Pass Score</span>
                        <strong className="text-emerald-400 font-mono">{mod.passingScore}%</strong>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Staff Completed:</span>
                        <span className="font-mono text-white font-bold">{mod.completedCount} / {mod.enrolledCount} ({completionPct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${completionPct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      Mandatory: <strong className="text-gray-300">{mod.mandatoryFor.join(', ')}</strong>
                    </span>
                    <button
                      onClick={() => triggerNotification(`Launching interactive SOP preview: ${mod.title}`)}
                      className="cc-btn cc-btn-outline py-1 px-3 text-xs"
                    >
                      Review SOP
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12 cc-card">
              <i className="fa-solid fa-graduation-cap text-3xl text-gray-600 mb-2"></i>
              <p className="text-sm text-gray-400">No training modules found.</p>
            </div>
          )}
        </div>
      )}

      {/* 2. ORIENTATION COHORTS TAB */}
      {subSection === 'orientation' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                New Hire Orientation & 14-Day Onboarding Pipeline
              </h3>
              <p className="text-xs text-gray-500">Mentored training roadmap for new employees joining cinema teams.</p>
            </div>
            <button 
              onClick={() => setIsEnrollOpen(true)}
              className="cc-btn cc-btn-primary text-xs"
            >
              <i className="fa-solid fa-user-plus mr-1"></i> Enroll Trainee
            </button>
          </div>

          <div className="space-y-3">
            {orientations.map((item) => (
              <div 
                key={item.orientationId}
                className="p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-300 text-xs">
                    {item.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.employeeName}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-gray-300">
                        {item.department} • {item.role}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Batch: <span className="font-mono text-gray-300">{item.orientationBatch}</span> • 
                      Mentor: <strong className="text-white">{item.mentor}</strong> • 
                      Joined: <span className="font-mono">{item.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-end">
                  {/* Progress info */}
                  <div className="w-44 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Modules: {item.modulesCompleted} / {item.totalModules}</span>
                      <span className="font-mono font-bold text-white">{item.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.status === 'Completed' ? 'bg-emerald-500' : (item.status === 'Overdue' ? 'bg-amber-500' : 'bg-blue-500')
                        }`}
                        style={{ width: `${item.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    item.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : (item.status === 'Overdue'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20')
                  }`}>
                    {item.status}
                  </span>

                  {item.status !== 'Completed' ? (
                    <button
                      onClick={() => handleAdvanceModule(item.orientationId, item.employeeName)}
                      className="cc-btn cc-btn-accent py-1 px-3 text-xs whitespace-nowrap"
                    >
                      <i className="fa-solid fa-check mr-1"></i> Pass Step
                    </button>
                  ) : (
                    <button
                      onClick={() => triggerNotification(`Downloading official orientation certificate for ${item.employeeName}...`)}
                      className="cc-btn cc-btn-outline py-1 px-3 text-xs whitespace-nowrap"
                    >
                      <i className="fa-solid fa-award mr-1"></i> Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CERTIFICATIONS TAB */}
      {subSection === 'certifications' && (
        <div className="cc-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Staff Qualifications & Training Certifications
              </h3>
              <p className="text-xs text-gray-500">Verified course completion credentials with tamper-proof certificate numbers.</p>
            </div>
            <button 
              onClick={() => triggerNotification('Exporting All Staff Certified Credentials (PDF)...')}
              className="cc-btn cc-btn-outline text-xs"
            >
              <i className="fa-solid fa-download mr-1"></i> Export Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-semibold">Certificate ID</th>
                  <th className="pb-3 font-semibold">Certified Employee</th>
                  <th className="pb-3 font-semibold">Course / Qualification</th>
                  <th className="pb-3 font-semibold text-center">Score</th>
                  <th className="pb-3 font-semibold">Issue Date</th>
                  <th className="pb-3 font-semibold">Validity Until</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((c) => (
                  <tr key={c.certId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-blue-400">{c.certificateNumber}</td>
                    <td className="py-3 font-bold text-white">{c.staffName}</td>
                    <td className="py-3 text-gray-300 font-medium">{c.moduleTitle}</td>
                    <td className="py-3 text-center font-mono font-bold text-emerald-400">{c.score}%</td>
                    <td className="py-3 text-gray-400 font-mono text-[11px]">{c.issuedDate}</td>
                    <td className="py-3 text-gray-300 font-mono text-[11px]">{c.validUntil}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => triggerNotification(`Downloading official certificate: ${c.certificateNumber}`)}
                        className="cc-btn cc-btn-outline py-1 px-2.5 text-[10px]"
                      >
                        <i className="fa-solid fa-file-pdf mr-1"></i> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SAFETY DRILLS TAB */}
      {subSection === 'drills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Auditorium Fire Evacuation & Panic Mitigation Drill', date: '12 Sep 2026', time: '08:30 AM (Pre-opening)', participants: 'All 24 cinema crew members', frequency: 'Quarterly', status: 'Scheduled', icon: 'fa-fire-extinguisher text-red-400' },
            { title: 'Barco / Christie Laser Safety & Emergency Power Shutoff', date: '28 Aug 2026', time: '11:30 PM (Post-show)', participants: 'Duty managers & projectionists', frequency: 'Bi-annual', status: 'Completed', icon: 'fa-triangle-exclamation text-[#f5b041]' },
            { title: 'FSSAI Food Recall & Popcorn Dispenser Sanitation Protocol', date: '05 Aug 2026', time: '09:00 AM', participants: 'F&B team & housekeeping', frequency: 'Monthly', status: 'Completed', icon: 'fa-utensils text-emerald-400' },
            { title: 'Red Carpet Crowd Control & VIP Security Protocols', date: '20 Sep 2026', time: '04:00 PM', participants: 'Guest relations & security team', frequency: 'Event-driven', status: 'Scheduled', icon: 'fa-shield-halved text-blue-400' }
          ].map((drill, idx) => (
            <div key={idx} className="cc-card p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <i className={`fa-solid ${drill.icon} text-lg`}></i>
                  <div>
                    <h4 className="font-bold text-white text-xs">{drill.title}</h4>
                    <span className="text-[10px] text-gray-400">Cadence: {drill.frequency}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  drill.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {drill.status}
                </span>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Scheduled Timing:</span>
                  <span className="font-mono text-white">{drill.date} • {drill.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Crew:</span>
                  <span className="text-gray-300">{drill.participants}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => triggerNotification(`Logged attendance roster for drill: ${drill.title}`)}
                  className="cc-btn cc-btn-outline py-1 px-3 text-xs"
                >
                  <i className="fa-solid fa-clipboard-check mr-1"></i> Roster Sign-Off
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD TRAINING MODULE */}
      {isAddModuleOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <i className="fa-solid fa-chalkboard-user text-[#f5b041]"></i> Create Training SOP Module
              </h3>
              <button onClick={() => setIsAddModuleOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddModule} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Course / SOP Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Recliner Customer Hospitality SOP"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
                  <select
                    value={moduleForm.category}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="cc-input"
                  >
                    <option value="Hospitality & Service">Hospitality & Service</option>
                    <option value="Safety & Compliance">Safety & Compliance</option>
                    <option value="Technical & Projection">Technical & Projection</option>
                    <option value="F&B Hygiene">F&B Hygiene</option>
                    <option value="POS & Ticketing">POS & Ticketing</option>
                    <option value="Onboarding">Onboarding</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={moduleForm.durationHours}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, durationHours: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Total Lessons</label>
                  <input
                    type="number"
                    value={moduleForm.totalLessons}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, totalLessons: e.target.value }))}
                    className="cc-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Pass Score (%)</label>
                  <input
                    type="number"
                    value={moduleForm.passingScore}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, passingScore: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Mandatory For Departments</label>
                <input
                  type="text"
                  placeholder="e.g. Guest Relations, Ticketing, Duty Managers"
                  value={moduleForm.mandatoryFor}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, mandatoryFor: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Course Objective</label>
                <textarea
                  rows={2}
                  placeholder="Summary of learning milestones..."
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModuleOpen(false)}
                  className="cc-btn cc-btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn cc-btn-accent py-2 px-4"
                >
                  Publish Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ENROLL TRAINEE */}
      {isEnrollOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/30">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                Enroll Trainee in Orientation
              </h3>
              <button onClick={() => setIsEnrollOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleEnrollStaff} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">New Hire Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Soni"
                  value={enrollForm.employeeName}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, employeeName: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Department</label>
                  <select
                    value={enrollForm.department}
                    onChange={(e) => setEnrollForm(prev => ({ ...prev, department: e.target.value }))}
                    className="cc-input"
                  >
                    <option value="Ticketing">Ticketing</option>
                    <option value="F&B">F&B</option>
                    <option value="Operations">Operations</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Role / Designation</label>
                  <input
                    type="text"
                    value={enrollForm.role}
                    onChange={(e) => setEnrollForm(prev => ({ ...prev, role: e.target.value }))}
                    className="cc-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Assigned Senior Mentor</label>
                <input
                  type="text"
                  value={enrollForm.mentor}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, mentor: e.target.value }))}
                  className="cc-input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Orientation Cohort Batch</label>
                <input
                  type="text"
                  value={enrollForm.orientationBatch}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, orientationBatch: e.target.value }))}
                  className="cc-input font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEnrollOpen(false)}
                  className="cc-btn cc-btn-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cc-btn cc-btn-primary py-2 px-4"
                >
                  Enroll Trainee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
