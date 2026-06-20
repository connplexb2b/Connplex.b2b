"use client";

import React, { useState } from 'react';

export default function AdvertiseForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    websiteUrl: '',
    city: '',
    state: '',
    promoteDetails: '',
    opportunity: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const opportunities = [
    "On-Screen Advertising (Before Movie)",
    "Digital Screen Advertising",
    "Lobby Branding",
    "Standee & Display Activations"
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const firstNameTrim = formData.firstName.trim();
    const lastNameTrim = formData.lastName.trim();
    const fullName = `${firstNameTrim} ${lastNameTrim || 'Unknown'}`.trim();

    // Compile custom fields into the message field for DB compatibility and clean reporting
    const compiledMessage = `
[Advertising Enquiry]
Website URL: ${formData.websiteUrl.trim() || 'N/A'}
What to Promote: ${formData.promoteDetails.trim()}
Opportunity Interested In: ${formData.opportunity}
`.trim();

    const localPayload = {
      fullName,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      message: compiledMessage,
      preferredInvestment: 'N/A',
      preferredCity: 'N/A',
      hasProperty: 'N/A',
      timeframe: 'N/A',
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

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        websiteUrl: '',
        city: '',
        state: '',
        promoteDetails: '',
        opportunity: '',
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black py-20 border-t border-[#C9A84C]/10 px-[15px] sm:px-[28px] lg:px-[5%] relative z-10">
      <div className="max-w-[840px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white uppercase">
            Put your brand in the spotlight
          </h2>
        </div>
        {success ? (
          <div className="bg-[#080808] border border-[#C9A84C]/25 rounded-2xl p-8 md:p-12 text-center shadow-[0_10px_35px_rgba(201,168,76,0.04)] animate-fade-in-up">
            <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C9A84C]/20">
              <span className="text-[#C9A84C] text-2xl font-bold">✓</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              Enquiry Submitted
            </h3>
            <p className="text-sm text-[#aaa] leading-relaxed max-w-[420px] mx-auto font-normal">
              Thank you for your campaign enquiry. An advertising solutions representative will contact you shortly with custom media kits.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-8 bg-transparent hover:bg-white/5 text-white/80 hover:text-white border border-white/15 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 uppercase"
            >
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#080808] border border-white/5 rounded-2xl p-6 sm:p-10 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col gap-6"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                  First Name <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none text-sm transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                  Last Name <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none text-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                  Email Address <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john.doe@example.com"
                  className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none text-sm transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                  Phone Number <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 99887 76655"
                  className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none text-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2 text-left sm:col-span-1">
                <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                  City <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Mumbai"
                  className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none text-sm transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-2 text-left sm:col-span-1">
                <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                  State <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="Maharashtra"
                  className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none text-sm transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-2 text-left sm:col-span-1">
                <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none text-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                Advertising Opportunity Interested In <span className="text-[#C9A84C]">*</span>
              </label>
              <div className="relative">
                <select
                  name="opportunity"
                  value={formData.opportunity}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white outline-none text-sm transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Advertising Opportunity</option>
                  {opportunities.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#111] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                What would you like to promote? <span className="text-[#C9A84C]">*</span>
              </label>
              <textarea
                name="promoteDetails"
                value={formData.promoteDetails}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Briefly describe your product, brand, service, or campaign message..."
                className="w-full bg-[#111] border border-white/5 focus:border-[#C9A84C]/60 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none text-sm transition-all duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] hover:bg-[#b0913f] disabled:bg-[#C9A84C]/45 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-[2px] text-xs mt-2"
            >
              {loading ? 'Submitting request...' : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
