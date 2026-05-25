"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

export default function DowntownPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    const handleNotifyClick = () => {
        setIsModalOpen(true);
        setSubmitError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const name = e.currentTarget.elements.namedItem('name') ? (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value : '';
        const email = e.currentTarget.elements.namedItem('email') ? (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value : '';
        const consent = e.currentTarget.elements.namedItem('consent') ? (e.currentTarget.elements.namedItem('consent') as HTMLInputElement).checked : true;

        try {
            const apiUrl = getApiUrl();
            const requestUrl = `${apiUrl}/api/forms/downtown-invitations`;
            console.log('API URL:', requestUrl);
            console.log('Request Payload:', { name, email, consent });

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, consent }),
            });

            console.log('Response Status:', response.status);

            const result = await response.json();
            console.log('Response Payload:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }

            setIsModalOpen(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error: any) {
            console.error('Submission Error:', error);
            setSubmitError(error.message || 'Unable to submit invite request. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-[#f3ece3] font-plus-jakarta overflow-x-hidden relative selection:bg-[#d4af37]/30">
            <Header />

            {/* Ambient Backdrops */}
            <div className="absolute w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-[0.08] pointer-events-none z-0 top-[-10%] left-[-10%] bg-[radial-gradient(circle,#d4af37_0%,transparent_80%)]"></div>
            <div className="absolute w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-[0.08] pointer-events-none z-0 bottom-[-10%] right-[-10%] bg-[radial-gradient(circle,#8c6e43_0%,transparent_80%)]"></div>

            <main className="flex flex-col lg:flex-row w-screen min-h-screen lg:min-h-[750px] relative z-10 pt-[76px]">
                {/* Left Section (Content & Info) */}
                <section className="w-full lg:w-[43%] lg:flex-none flex items-center p-6 sm:p-10 lg:pl-24 lg:pr-16 lg:pt-28 lg:pb-16 relative z-20">
                    <div className="w-full max-w-full lg:max-w-[580px]">
                        <div className="font-montserrat text-[0.75rem] font-semibold tracking-[0.35em] text-[#8c6e43] mb-6 animate-fade-in-down">
                            THE LUXURY DESTINATION
                        </div>
                        <h1 className="font-montserrat font-extralight text-5xl sm:text-6xl lg:text-[5.2rem] tracking-[0.28em] text-[#f5dfbb] drop-shadow-[0_0_25px_rgba(245,223,187,0.15)] leading-tight mb-8 mr-[-0.28em] animate-fade-in-up" id="hero-main-title">
                            DOWNTOWN
                        </h1>
                        <div className="w-[120px] h-[1px] bg-gradient-to-r from-[#d4af37] to-transparent mb-9 origin-left scale-x-0 animate-scale-right"></div>
                        <h2 className="font-montserrat font-light text-2xl sm:text-3xl lg:text-[2.2rem] tracking-[0.38em] text-white mb-8 mr-[-0.38em] animate-fade-in-up">
                            COMING SOON
                        </h2>

                        <p className="font-plus-jakarta text-[1.05rem] font-light leading-relaxed text-[#a5a29d] mb-14 animate-fade-in-up">
                            The premium cinema experience reimagined by Connplex. Prepare for unmatched luxury, state-of-the-art audiovisual technology, and bespoke hospitality.
                        </p>

                        {/* CTA Button */}
                        <div className="mb-18 animate-fade-in-up">
                            <button 
                                className="group relative inline-flex items-center justify-center bg-transparent border border-[#c5a880]/40 text-[#f5dfbb] pt-[1.1rem] pb-[1.1rem] pr-12 pl-11 font-montserrat text-[0.85rem] font-semibold tracking-[0.25em] cursor-pointer rounded-[2px] overflow-hidden transition-all duration-500 hover:border-[#f5dfbb] hover:shadow-[0_0_25px_rgba(245,223,187,0.15)] hover:bg-[#c5a880]/[0.02]" 
                                onClick={handleNotifyClick}
                            >
                                <span className="relative z-10">NOTIFY ME</span>
                                <span className="relative z-10 flex items-center ml-[1.2rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:text-[#d4af37]">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-[#f5dfbb]/[0.08] to-transparent transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:left-full group-hover:duration-800" />
                            </button>
                        </div>

                        {/* Feature Highlights */}
                        <div className="flex items-center gap-[1.2rem] font-montserrat text-[0.72rem] font-medium tracking-[0.18em] text-[#c5a880] opacity-85 mb-16 flex-wrap animate-fade-in-up">
                            <span className="whitespace-nowrap">LUXURY SCREENS</span>
                            <span className="text-[#8c6e43] text-[0.8rem]">•</span>
                            <span className="whitespace-nowrap">VIP LOUNGES</span>
                            <span className="text-[#8c6e43] text-[0.8rem]">•</span>
                            <span className="whitespace-nowrap">CURATED EXPERIENCES</span>
                        </div>
                    </div>
                </section>

                {/* Right Section (Cinema Visual Showcase) */}
                <section className="w-full h-[40vh] sm:h-[48vh] min-h-[300px] sm:min-h-[380px] lg:flex-1 lg:h-full lg:min-h-0 bg-cover bg-no-repeat bg-[position:84%_center] relative overflow-hidden shadow-[inset_0_-40px_40px_rgba(5,5,5,0.95)] lg:shadow-[inset_100px_0_120px_rgba(5,5,5,0.95)] animate-zoom-out bg-[url('/img/363ae3a1-9296-45b4-8a62-e84d026b07f6.png')]">
                    {/* Smooth overlay that blends with the dark content column on left */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent lg:bg-gradient-to-r lg:from-[#050505] lg:via-[#050505]/98 lg:to-transparent z-5 pointer-events-none"></div>
                </section>
            </main>

            {/* Notify Me Modal (Interactive Popup) */}
            <div 
                className={`fixed inset-0 bg-[#030303]/85 backdrop-blur-[15px] z-[2000] flex justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
                id="notify-modal"
            >
                <div 
                    className={`bg-[radial-gradient(circle_at_top_left,#121212_0%,#080808_100%)] border border-[#c5a880]/25 rounded-[4px] p-8 sm:p-14 max-w-[550px] w-[calc(100%-3rem)] relative shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(197,168,128,0.05)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isModalOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-5'}`}
                >
                    <button className="absolute top-8 right-8 text-[#73716d] hover:text-[#f5dfbb] text-3xl font-light transition-colors duration-250 cursor-pointer" onClick={handleCloseModal} aria-label="Close Modal">&times;</button>
                    <div className="text-center mb-10">
                        <div className="font-montserrat text-2xl font-extralight tracking-[0.3em] text-[#f5dfbb]">CONNPLEX</div>
                        <div className="font-montserrat text-[0.55rem] font-medium tracking-[0.35em] text-[#8c6e43] mt-1.5">DOWNTOWN CINEMA</div>
                    </div>
                    <div className="dt-modal-body">
                        <h3 className="font-montserrat text-[1.1rem] font-medium tracking-[0.25em] text-[#f5dfbb] text-center mb-4">VIP LAUNCH INVITATION</h3>
                        <p className="font-plus-jakarta text-[0.88rem] line-height-[1.7] text-[#a5a29d] text-center mb-10">Be the first to experience the absolute height of cinema luxury. Enter your details below to receive updates, exclusive previews, and priority booking access.</p>

                        <form id="notify-form" className="flex flex-col gap-8" onSubmit={handleSubmit}>
                            <div className="relative">
                                <input name="name" type="text" id="user-name" placeholder="Full Name" required autoComplete="name" className="peer w-full py-3 bg-transparent border-b border-[#c5a880]/25 text-[#f3ece3] font-plus-jakarta text-sm outline-none transition-all duration-250 focus:border-[#d4af37] focus:shadow-[0_1px_0_#d4af37]" />
                                <label htmlFor="user-name" className="absolute top-3 left-0 text-[#73716d] font-montserrat text-xs tracking-[0.15em] pointer-events-none transition-all duration-250 peer-focus:top-[-1.1rem] peer-focus:text-[0.65rem] peer-focus:text-[#d4af37] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-1.1rem] peer-[:not(:placeholder-shown)]:text-[0.65rem] peer-[:not(:placeholder-shown)]:text-[#d4af37] peer-[:not(:placeholder-shown)]:font-semibold">Full Name</label>
                            </div>
                            <div className="relative">
                                <input name="email" type="email" id="user-email" placeholder="Email Address" required autoComplete="email" className="peer w-full py-3 bg-transparent border-b border-[#c5a880]/25 text-[#f3ece3] font-plus-jakarta text-sm outline-none transition-all duration-250 focus:border-[#d4af37] focus:shadow-[0_1px_0_#d4af37]" />
                                <label htmlFor="user-email" className="absolute top-3 left-0 text-[#73716d] font-montserrat text-xs tracking-[0.15em] pointer-events-none transition-all duration-250 peer-focus:top-[-1.1rem] peer-focus:text-[0.65rem] peer-focus:text-[#d4af37] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-1.1rem] peer-[:not(:placeholder-shown)]:text-[0.65rem] peer-[:not(:placeholder-shown)]:text-[#d4af37] peer-[:not(:placeholder-shown)]:font-semibold">Email Address</label>
                            </div>
                            <div className="flex items-start gap-4">
                                <input 
                                    name="consent" 
                                    type="checkbox" 
                                    id="user-consent" 
                                    required 
                                    defaultChecked 
                                    className="appearance-none w-4 h-4 border border-[#8c6e43] rounded-[2px] bg-transparent cursor-pointer relative top-[3px] shrink-0 transition-colors duration-250 checked:bg-[#d4af37] checked:border-[#d4af37] checked:after:content-[''] checked:after:absolute checked:after:w-[4px] checked:after:h-[8px] checked:after:border-r-2 checked:after:border-b-2 checked:after:border-[#050505] checked:after:top-[1px] checked:after:left-[5px] checked:after:rotate-45"
                                />
                                <label htmlFor="user-consent" className="font-plus-jakarta text-[0.8rem] leading-normal text-[#a5a29d] select-none cursor-pointer">I agree to receive VIP updates and exclusive invites from Connplex Downtown.</label>
                            </div>
                            {submitError && (
                                <div className="text-[#ff5252] text-[0.85rem] mb-4 font-semibold">
                                    ⚠️ {submitError}
                                </div>
                            )}
                            <button type="submit" className="w-full flex justify-center items-center gap-4 bg-[#d4af37] hover:bg-[#f5dfbb] text-[#050505] py-4.5 font-montserrat text-sm font-bold tracking-[0.2em] rounded-[2px] shadow-[0_10px_20px_rgba(197,168,128,0.15)] hover:shadow-[0_15px_30px_rgba(197,168,128,0.3)] hover:-translate-y-0.5 transition-all duration-500 group cursor-pointer" disabled={isSubmitting}>
                                <span>{isSubmitting ? 'REQUESTING...' : 'REQUEST EXCLUSIVE INVITE'}</span>
                                {!isSubmitting && (
                                    <svg viewBox="0 0 24 24" width="18" height="18" className="transition-transform duration-250 group-hover:translate-x-1">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <div 
                className={`fixed bottom-8 right-8 bg-[#0a0a0a]/95 border border-[#d4af37] rounded-[4px] p-5 flex items-center gap-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] z-[3000] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${showToast ? 'translate-y-0 scale-100 opacity-100 visible' : 'translate-y-[100px] scale-90 opacity-0 invisible pointer-events-none'}`} 
                id="toast-message"
            >
                <div className="w-8 h-8 rounded-full bg-[#c5a880]/10 text-[#d4af37] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <div className="font-montserrat text-[0.8rem] font-bold tracking-[0.15em] text-[#f5dfbb]">Access Requested</div>
                    <div className="font-plus-jakarta text-[0.78rem] text-[#a5a29d] mt-0.5">Check your inbox soon for your exclusive preview.</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
