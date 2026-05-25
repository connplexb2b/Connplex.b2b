"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

const ConnplexStudioPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isModalActive, setIsModalActive] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleNotifyClick = () => {
        setIsModalActive(true);
        document.body.style.overflow = "hidden";
    };

    const handleCloseModal = () => {
        setIsModalActive(false);
        document.body.style.overflow = "";
        // Reset state after animation
        setTimeout(() => {
            setFormSubmitted(false);
            setEmail('');
            setName('');
            setSubmitError(null);
        }, 600);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const apiUrl = getApiUrl();
            const requestUrl = `${apiUrl}/api/forms/studio-invitations`;
            console.log('API URL:', requestUrl);
            console.log('Request Payload:', { name, email });

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            console.log('Response Status:', response.status);

            const result = await response.json();
            console.log('Response Payload:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }

            setFormSubmitted(true);
        } catch (error: any) {
            console.error('Submission Error:', error);
            setSubmitError(error.message || 'Unable to submit request. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="bg-[#050505] bg-cover bg-[center_center] lg:bg-[right_center] bg-no-repeat font-montserrat text-white min-h-screen overflow-x-hidden relative flex flex-col justify-between"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.95) 0%, rgba(5, 5, 5, 0.85) 50%, rgba(5, 5, 5, 0.95) 100%), url('/connplex-studio.png')`
            }}
        >
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-[10%] w-[30vw] h-[30vw] -translate-y-1/2 bg-[radial-gradient(circle,rgba(223,186,115,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-[1]"></div>

            {/* Page Loader */}
            <div className={`fixed top-0 left-0 w-full h-full bg-[#050505] flex flex-col justify-center items-center z-[9999] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isLoading ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'}`}>
                <div className="flex flex-col items-center gap-6">
                    <div className="text-[clamp(1.5rem,4vw,2.5rem)] font-extralight tracking-[0.35em] text-[#dfba73] drop-shadow-[0_0_20px_rgba(223,186,115,0.3)] animate-[studio-pulse-glow_2s_infinite_ease-in-out]">CONNPLEX</div>
                    <div className="w-[180px] h-[1.5px] bg-[#dfba73]/15 relative overflow-hidden rounded-[1px]">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#dfba73] to-transparent animate-[studio-load-progress_2s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>

            <div className="w-full min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative z-[2] box-border max-w-[1600px] mx-auto">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex items-center my-auto w-full justify-center lg:justify-start text-center lg:text-left py-12">
                    <div className="max-w-[620px] flex flex-col items-center lg:items-start w-full">
                        <h1 className="flex flex-col gap-2">
                            <span className="text-[clamp(2.4rem,5.5vw,4.8rem)] font-extralight tracking-[0.16em] text-white leading-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] animate-[studio-slideUp_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:0.7s] opacity-0">CONNPLEX</span>
                            <span className="text-[clamp(2.4rem,5.5vw,4.8rem)] font-normal tracking-[0.18em] leading-[1.1] bg-[linear-gradient(135deg,#edd8a5_0%,#dfba73_35%,#aa7c11_70%,#edd8a5_100%)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[studio-metallic-sweep_8s_linear_infinite,studio-slideUp_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:0.85s] opacity-0 relative inline-block">
                                STUDI<span className="relative inline-block bg-[radial-gradient(circle,#ffffff_10%,#edd8a5_50%,#dfba73_100%)] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(223,186,115,0.8)] animate-[studio-o-pulse_3s_infinite_ease-in-out]">O</span>
                            </span>
                        </h1>
                        <div className="text-[clamp(0.9rem,1.8vw,1.25rem)] font-light tracking-[0.58em] text-white mt-7 mb-7 opacity-90 uppercase animate-[studio-slideUp_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:1s] opacity-0">COMING SOON</div>
                        <p className="font-cormorant text-[clamp(1.2rem,2.2vw,1.65rem)] font-light italic text-[#e5e5e5] tracking-wide leading-relaxed mb-11 animate-[studio-slideUp_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:1.15s] opacity-0">Stories. Crafted to Perfection.</p>
                        
                        <button 
                            className="bg-transparent border border-[#dfba73]/35 hover:border-[#dfba73] text-[#dfba73] hover:text-white py-[1.1rem] px-[2.5rem] font-montserrat text-[0.85rem] font-medium tracking-[0.28em] uppercase cursor-pointer inline-flex items-center gap-[1.8rem] relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-[1px] hover:shadow-[0_0_35px_rgba(223,186,115,0.28),inset_0_0_15px_rgba(223,186,115,0.05)] hover:bg-[#dfba73]/3 active:scale-98 animate-[studio-slideUp_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:1.3s] opacity-0 group w-full sm:w-auto justify-center" 
                            onClick={handleNotifyClick}
                        >
                            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-[#dfba73]/8 to-transparent transition-all duration-500 group-hover:left-full"></div>
                            <span>NOTIFY ME</span>
                            <span className="w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                </main>

                {/* Footer */}
                <footer className="flex justify-center lg:justify-start items-center animate-[studio-fadeIn_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards] [animation-delay:0.5s] opacity-0 w-full mt-8">
                    <div className="flex items-center">
                        <span className="text-[0.72rem] font-medium tracking-[0.22em] text-[#a4a4a4] select-none">FOLLOW US</span>
                        <span className="text-[0.8rem] text-[#dfba73]/35 mx-[1.2rem] font-light">|</span>
                        <div className="flex gap-[1.3rem]">
                            <a href="#" className="text-[#dfba73] hover:text-white flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:drop-shadow-[0_0_6px_rgba(223,186,115,0.8)]" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="text-[#dfba73] hover:text-white flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:drop-shadow-[0_0_6px_rgba(223,186,115,0.8)]" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a href="#" className="text-[#dfba73] hover:text-white flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:drop-shadow-[0_0_6px_rgba(223,186,115,0.8)]" aria-label="YouTube">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Notification Modal Overlay */}
            <div className={`fixed top-0 left-0 w-full h-full bg-black/70 backdrop-blur-[25px] flex justify-center items-center z-[999] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] p-6 sm:p-8 ${isModalActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className={`bg-[#0a0a0a]/85 border border-[#dfba73]/25 w-full max-w-[520px] p-6 sm:p-12 relative rounded-[2px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(223,186,115,0.05)] transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${isModalActive ? 'scale-100 translate-y-0' : 'scale-90 translate-y-5'}`}>
                    <button className="absolute top-6 right-6 bg-transparent border-none text-[#a4a4a4] hover:text-white cursor-pointer p-2 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-90" onClick={handleCloseModal} aria-label="Close modal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    {!formSubmitted ? (
                        <div className="flex flex-col text-left">
                            <div className="text-[0.65rem] font-semibold tracking-[0.35em] text-[#dfba73] mb-4 uppercase">EXCLUSIVE ACCESS</div>
                            <h2 className="text-[clamp(1.4rem,3vw,1.85rem)] font-light tracking-[0.18em] text-white mb-5">REQUEST INVITATION</h2>
                            <p className="text-[0.9rem] leading-relaxed text-[#bcbcbc] mb-9 font-light">
                                Be the first to experience Connplex Studio. Subscribe for private screenings, executive previews, and launch event invitations.
                            </p>
                            
                            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                                <div className="relative w-full">
                                    <input 
                                        type="text" 
                                        id="user-name" 
                                        required 
                                        placeholder=" " 
                                        autoComplete="off"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full py-3 bg-transparent border-b border-[#dfba73]/25 text-white font-montserrat text-[0.95rem] outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-[#dfba73] peer"
                                    />
                                    <label htmlFor="user-name" className="absolute left-0 top-3 text-[#a4a4a4] text-[0.95rem] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] font-light tracking-wider peer-focus:top-[-1.1rem] peer-focus:text-[0.72rem] peer-focus:text-[#dfba73] peer-focus:tracking-[0.12em] peer-[:not(:placeholder-shown)]:top-[-1.1rem] peer-[:not(:placeholder-shown)]:text-[0.72rem] peer-[:not(:placeholder-shown)]:text-[#dfba73] peer-[:not(:placeholder-shown)]:tracking-[0.12em]">Your Name</label>
                                    <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-[#dfba73] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:left-0 peer-focus:w-full"></span>
                                </div>
                                <div className="relative w-full">
                                    <input 
                                        type="email" 
                                        id="user-email" 
                                        required 
                                        placeholder=" " 
                                        autoComplete="off"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full py-3 bg-transparent border-b border-[#dfba73]/25 text-white font-montserrat text-[0.95rem] outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-[#dfba73] peer"
                                    />
                                    <label htmlFor="user-email" className="absolute left-0 top-3 text-[#a4a4a4] text-[0.95rem] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] font-light tracking-wider peer-focus:top-[-1.1rem] peer-focus:text-[0.72rem] peer-focus:text-[#dfba73] peer-focus:tracking-[0.12em] peer-[:not(:placeholder-shown)]:top-[-1.1rem] peer-[:not(:placeholder-shown)]:text-[0.72rem] peer-[:not(:placeholder-shown)]:text-[#dfba73] peer-[:not(:placeholder-shown)]:tracking-[0.12em]">Email Address</label>
                                    <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-[#dfba73] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:left-0 peer-focus:w-full"></span>
                                </div>
                                {submitError && (
                                    <div style={{ color: '#ff5252', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 500 }}>
                                        ⚠️ {submitError}
                                    </div>
                                )}
                                <button type="submit" className="bg-transparent border border-[#dfba73] hover:bg-[#dfba73] text-[#dfba73] hover:text-[#050505] py-[1.1rem] px-8 font-montserrat text-[0.8rem] font-semibold tracking-[0.2em] cursor-pointer flex items-center justify-center gap-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full mt-4 rounded-[1px] hover:shadow-[0_0_25px_rgba(223,186,115,0.35)] group" disabled={isSubmitting}>
                                    <span>{isSubmitting ? 'REQUESTING ACCESS...' : 'REQUEST ACCESS'}</span>
                                    {!isSubmitting && (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center animate-[studio-fadeIn_0.6s_ease-out]">
                            <div className="w-[70px] h-[70px] rounded-full border border-[#dfba73] flex items-center justify-center text-[#dfba73] mb-7 shadow-[0_0_20px_rgba(223,186,115,0.2)] animate-[studio-fadeIn_0.8s_ease-out]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-light tracking-[0.18em] text-white mb-5">ACCESS REQUESTED</h3>
                            <p className="text-[0.92rem] leading-relaxed text-[#bcbcbc] mb-9 font-light max-w-[400px]">
                                Thank you. Your request is registered under the email address <strong>{email}</strong>. An exclusive curator will reach out to you shortly.
                            </p>
                            <button type="button" className="bg-transparent border border-[#dfba73]/30 hover:border-[#dfba73] text-[#a4a4a4] hover:text-white py-[0.9rem] px-10 font-montserrat text-[0.75rem] tracking-[0.18em] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-[1px] hover:shadow-[0_0_15px_rgba(223,186,115,0.15)]" onClick={handleCloseModal}>DISMISS</button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ConnplexStudioPage;
