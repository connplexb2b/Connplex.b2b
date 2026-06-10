"use client";

import React, { useState } from 'react';
import { getApiUrl } from '@/utils/api';

export default function SpectraXForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    // Map fields for local database (sending N/A for removed fields to bypass Mongoose validation)
    const localPayload = {
      fullName,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      message: formData.message.trim(),
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

      // Submit to Zoho CRM in the background (Web-to-Lead)
      try {
        const zohoParams = new URLSearchParams();
        zohoParams.append('xnQsjsdp', '9d75c1ec9a9ce89c1cfde5512ee7be07aeb6ae92d5477978cc7f09d73e0cebca');
        zohoParams.append('xmIwtLD', '47701f059aba5ae3d9a8d34438d171279271c6d7dd42b4f15387889d32a2e308d0dc40500d53bfff4f42dd4952cbc0a9');
        zohoParams.append('actionType', 'TGVhZHM=');
        zohoParams.append('returnURL', 'null');
        zohoParams.append('First Name', firstNameTrim);
        zohoParams.append('Last Name', lastNameTrim || 'Unknown');
        zohoParams.append('Email', formData.email.trim());
        zohoParams.append('Phone', formData.phone.trim());
        zohoParams.append('City', formData.city.trim());
        zohoParams.append('State', formData.state.trim());
        zohoParams.append('Company', fullName || 'Individual');
        zohoParams.append('LEADCF126', 'B2B Franchise'); // Business Type (Mandatory in Zoho)
        zohoParams.append('LEADCF10', 'Less than 1 Crore'); // Investment Range (Mandatory in Zoho)
        zohoParams.append('Description', `Spectra X Technology Enquiry: ${formData.message.trim()}`);
        zohoParams.append('aG9uZXlwb3Q', '');

        console.log('Submitting Spectra X enquiry to Zoho CRM...');
        fetch('https://crm.zoho.in/crm/WebToLeadForm', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: zohoParams.toString(),
        })
          .then(() => console.log('Zoho CRM submission request dispatched successfully'))
          .catch(err => console.error('Zoho CRM dispatch failed:', err));
      } catch (zohoErr) {
        console.error('Failed to prepare Zoho CRM payload:', zohoErr);
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black pt-10 pb-20 border-t border-[#C9A84C]/10 px-[15px] sm:px-[28px] lg:px-[5%]">
      <div className="max-w-[760px] mx-auto">
        {success ? (
          <div className="bg-[#080808] border border-[#C9A84C]/25 rounded-2xl p-8 md:p-12 text-center shadow-[0_10px_35px_rgba(201,168,76,0.04)] animate-fade-in-up">
            <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C9A84C]/20">
              <span className="text-[#C9A84C] text-2xl font-bold">✓</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              Request Submitted
            </h3>
            <p className="text-sm text-[#aaa] leading-relaxed max-w-[420px] mx-auto font-normal">
              Thank you for your interest in Spectra X. A cinema technology consultant will contact you shortly with the requested information.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-8 bg-transparent hover:bg-white/5 text-white/80 hover:text-white border border-white/15 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 uppercase"
            >
              Submit Another Request
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 text-left">
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

              <div className="flex flex-col gap-2 text-left">
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
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="text-[0.68rem] font-bold tracking-[1.5px] text-white/50 uppercase">
                Enquiry Message <span className="text-[#C9A84C]">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Tell us about your cinema facility, layout dimensions, or project timeline..."
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
