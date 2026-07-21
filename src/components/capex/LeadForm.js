'use strict';
'use client';

import { useState } from 'react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    mobile: '',
    email: '',
    state: '',
    city: '',
    ownProperty: 'Yes', // 'Yes' or 'No'
    investmentCapacity: '',
    currentBusiness: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const states = [
    'Gujarat', 'Maharashtra', 'Rajasthan', 'MP', 'Karnataka', 'Telangana', 'Other'
  ];

  const citiesByState = {
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Maharashtra': [
      'Pune',
      'Nagpur',
      'Pimpri-Chinchwad',
      'Nashik',
      'Kalyan-Dombivli',
      'Vasai-Virar',
      'Chhatrapati Sambhajinagar (Aurangabad)',
      'Nanded',
      'Chandrapur',
      'Jalna',
      'Beed',
      'Dharashiv',
      'Akola',
      'Latur',
      'Parbhani'
    ],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    'MP': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
    'Other': ['Other City']
  };

  const investmentOptions = [
    '₹2 Cr - ₹5 Cr',
    '₹5 Cr - ₹10 Cr',
    'Other'
  ];

  const businessOptions = [
    'Real Estate',
    'Builder/Developer',
    'Retail',
    'Hospitality',
    'Manufacturing',
    'Investor',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { city: '' } : {}) // reset city if state changes
    }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleToggle = (value) => {
    setFormData((prev) => ({
      ...prev,
      ownProperty: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.state) newErrors.state = 'Please select a state';
    if (!formData.city) newErrors.city = 'Please select a city';
    if (!formData.investmentCapacity) newErrors.investmentCapacity = 'Please select your investment capacity';
    if (!formData.currentBusiness) newErrors.currentBusiness = 'Please select your current business';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    
    const localPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.mobile.trim(),
      state: formData.state,
      city: formData.city,
      preferredInvestment: formData.investmentCapacity,
      preferredCity: formData.city,
      company: formData.companyName.trim() || 'N/A',
      businessType: formData.currentBusiness,
      hasProperty: formData.ownProperty,
      timeframe: 'N/A',
      message: `[CAPEX Partnership Enquiry]\nProperty Owned: ${formData.ownProperty}\nInvestment Capacity: ${formData.investmentCapacity}\nCurrent Business: ${formData.currentBusiness}\nCompany: ${formData.companyName.trim() || 'N/A'}`
    };

    try {
      const response = await fetch('/api/forms/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err) {
      console.error('Failed to submit CAPEX lead form:', err);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      companyName: '',
      mobile: '',
      email: '',
      state: '',
      city: '',
      ownProperty: 'Yes',
      investmentCapacity: '',
      currentBusiness: ''
    });
    setErrors({});
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="bg-[#121212] border border-primary-gold/45 rounded-xl p-8 text-center text-white flex flex-col items-center justify-center min-h-[500px] shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-full border-2 border-primary-gold flex items-center justify-center text-primary-gold text-3xl mb-6 shadow-[0_0_20px_rgba(197,160,89,0.2)] animate-pulse">
          <i className="fa-solid fa-check"></i>
        </div>
        <h3 className="font-outfit font-extrabold text-2xl mb-4 tracking-wider uppercase text-primary-gold">
          Evaluation Scheduled
        </h3>
        <p className="text-text-secondary text-sm max-w-sm leading-relaxed mb-8 font-montserrat">
          Thank you, <span className="text-white font-bold">{formData.fullName}</span>. Your property details have been recorded. Our CAPEX partnership team will contact you at <span className="text-white font-bold">{formData.email}</span> within 24 hours.
        </p>
        <button
          onClick={handleReset}
          className="px-8 py-3 bg-primary-gold text-black font-bold uppercase tracking-wider text-xs hover:bg-hover-gold transition-all duration-300 rounded-none font-outfit shadow-lg shadow-primary-gold/15"
        >
          SUBMIT ANOTHER INQUIRY
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#121212]/90 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-[650px] mx-auto text-left font-montserrat backdrop-blur-md">
      <div className="mb-8 border-b border-white/5 pb-4">
        <h3 className="font-outfit font-extrabold text-lg uppercase text-white tracking-wider flex items-center gap-2">
          <span className="text-primary-gold">✦</span> Property Evaluation Form
        </h3>
        <p className="text-[11px] text-text-secondary mt-1 font-montserrat">
          Fill in your details below to schedule your commercial property assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-medium">
            Submission failed. Please check your network and try again.
          </div>
        )}
        
        {/* ROW 1: Name & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
              Full Name <span className="text-primary-gold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                <i className="fa-regular fa-user"></i>
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full bg-[#1A1A1C] border ${
                  errors.fullName ? 'border-red-500' : 'border-white/10'
                } focus:border-primary-gold pl-10 pr-4 py-3 text-xs text-white outline-none rounded-lg transition-all duration-300`}
              />
            </div>
            {errors.fullName && <span className="text-[10px] text-red-500 mt-1 block">{errors.fullName}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
              Company Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                <i className="fa-regular fa-building"></i>
              </span>
              <input
                type="text"
                name="companyName"
                placeholder="Optional"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full bg-[#1A1A1C] border border-white/10 focus:border-primary-gold pl-10 pr-4 py-3 text-xs text-white outline-none rounded-lg transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* ROW 2: Mobile & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
              Mobile Number <span className="text-primary-gold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                <i className="fa-solid fa-phone-flip"></i>
              </span>
              <input
                type="tel"
                name="mobile"
                placeholder="10-digit number"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full bg-[#1A1A1C] border ${
                  errors.mobile ? 'border-red-500' : 'border-white/10'
                } focus:border-primary-gold pl-10 pr-4 py-3 text-xs text-white outline-none rounded-lg transition-all duration-300`}
              />
            </div>
            {errors.mobile && <span className="text-[10px] text-red-500 mt-1 block">{errors.mobile}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
              Email Address <span className="text-primary-gold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                <i className="fa-regular fa-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-[#1A1A1C] border ${
                  errors.email ? 'border-red-500' : 'border-white/10'
                } focus:border-primary-gold pl-10 pr-4 py-3 text-xs text-white outline-none rounded-lg transition-all duration-300`}
              />
            </div>
            {errors.email && <span className="text-[10px] text-red-500 mt-1 block">{errors.email}</span>}
          </div>
        </div>

        {/* ROW 3: State & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
              State <span className="text-primary-gold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                <i className="fa-solid fa-map-location-dot"></i>
              </span>
              <select
                name="state"
                value={formData.state}
                onChange={handleSelectChange}
                className={`w-full bg-[#1A1A1C] border ${
                  errors.state ? 'border-red-500' : 'border-white/10'
                } focus:border-primary-gold pl-10 pr-10 py-3 text-xs text-white outline-none rounded-lg appearance-none cursor-pointer transition-all duration-300`}
              >
                <option value="" disabled>Select State</option>
                {states.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <i className="fa-solid fa-chevron-down text-[9px]"></i>
              </div>
            </div>
            {errors.state && <span className="text-[10px] text-red-500 mt-1 block">{errors.state}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
              City <span className="text-primary-gold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                <i className="fa-solid fa-city"></i>
              </span>
              <select
                name="city"
                value={formData.city}
                onChange={handleSelectChange}
                disabled={!formData.state}
                className={`w-full bg-[#1A1A1C] border ${
                  errors.city ? 'border-red-500' : 'border-white/10'
                } focus:border-primary-gold pl-10 pr-10 py-3 text-xs text-white outline-none rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300`}
              >
                <option value="" disabled>Select City</option>
                {formData.state && citiesByState[formData.state]?.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <i className="fa-solid fa-chevron-down text-[9px]"></i>
              </div>
            </div>
            {errors.city && <span className="text-[10px] text-red-500 mt-1 block">{errors.city}</span>}
          </div>
        </div>

        {/* ROW 4: Toggle Buttons */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
            Do you own a commercial property? <span className="text-primary-gold">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleToggle('Yes')}
              className={`py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 border rounded-lg ${
                formData.ownProperty === 'Yes'
                  ? 'bg-primary-gold border-primary-gold text-black shadow-lg shadow-primary-gold/15'
                  : 'bg-transparent border-white/10 text-white hover:border-white/30'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleToggle('No')}
              className={`py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 border rounded-lg ${
                formData.ownProperty === 'No'
                  ? 'bg-primary-gold border-primary-gold text-black shadow-lg shadow-primary-gold/15'
                  : 'bg-transparent border-white/10 text-white hover:border-white/30'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* ROW 5: Investment & Current Business */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
              Approximate Investment Capacity <span className="text-primary-gold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                <i className="fa-solid fa-wallet"></i>
              </span>
              <select
                name="investmentCapacity"
                value={formData.investmentCapacity}
                onChange={handleSelectChange}
                className={`w-full bg-[#1A1A1C] border ${
                  errors.investmentCapacity ? 'border-red-500' : 'border-white/10'
                } focus:border-primary-gold pl-10 pr-10 py-3 text-xs text-white outline-none rounded-lg appearance-none cursor-pointer transition-all duration-300`}
              >
                <option value="" disabled>Select Investment Capacity</option>
                {investmentOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <i className="fa-solid fa-chevron-down text-[9px]"></i>
              </div>
            </div>
            {errors.investmentCapacity && <span className="text-[10px] text-red-500 mt-1 block">{errors.investmentCapacity}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white mb-2 font-outfit">
              Current Business <span className="text-primary-gold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                <i className="fa-solid fa-briefcase"></i>
              </span>
              <select
                name="currentBusiness"
                value={formData.currentBusiness}
                onChange={handleSelectChange}
                className={`w-full bg-[#1A1A1C] border ${
                  errors.currentBusiness ? 'border-red-500' : 'border-white/10'
                } focus:border-primary-gold pl-10 pr-10 py-3 text-xs text-white outline-none rounded-lg appearance-none cursor-pointer transition-all duration-300`}
              >
                <option value="" disabled>Select Business</option>
                {businessOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <i className="fa-solid fa-chevron-down text-[9px]"></i>
              </div>
            </div>
            {errors.currentBusiness && <span className="text-[10px] text-red-500 mt-1 block">{errors.currentBusiness}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-primary-gold text-black font-bold uppercase tracking-[1.5px] py-3.5 mt-2 text-xs hover:bg-hover-gold active:translate-y-px transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-primary-gold/15 font-outfit rounded-lg"
        >
          {status === 'submitting' ? (
            <>
              <i className="fa-solid fa-spinner animate-spin text-sm"></i> SUBMITTING...
            </>
          ) : (
            <>
              Schedule My Property Evaluation <span className="text-sm font-normal">➔</span>
            </>
          )}
        </button>

        {/* Disclaimer */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 mt-3 font-outfit">
          <i className="fa-solid fa-lock text-[8px] text-primary-gold"></i>
          <span>Your information is secure and will not be shared.</span>
        </div>
      </form>
    </div>
  );
}
