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
        <div className="bg-[#050505] min-h-screen text-[#f3ece3] font-outfit overflow-x-hidden relative selection:bg-[#d4af37]/30 antialiased">
            <Header />

            {/* Ambient Backdrops */}
            <div className="absolute w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-[0.08] pointer-events-none z-0 top-[-10%] left-[-10%] bg-[radial-gradient(circle,#d4af37_0%,transparent_80%)]"></div>
            <div className="absolute w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-[0.08] pointer-events-none z-0 bottom-[-10%] right-[-10%] bg-[radial-gradient(circle,#8c6e43_0%,transparent_80%)]"></div>

            <main className="flex flex-col lg:flex-row w-screen min-h-screen lg:min-h-[750px] relative z-10 pt-[76px]">
                <section className="w-full lg:w-[43%] lg:flex-none flex items-center p-6 sm:p-10 lg:pl-24 lg:pr-16 lg:pt-28 lg:pb-16 relative z-20">
                    <div className="w-full max-w-full lg:max-w-[580px]">
                        <div className="mb-10">
                            <h1 className="text-[3.5rem] sm:text-[5rem] lg:text-[7rem] font-extrabold leading-none tracking-[-0.01em] uppercase mb-3 animate-fade-in-up" id="hero-main-title">
                                <span className="text-white">DOWN</span>
                                <span 
                                    className="text-[#d5b263]"
                                    style={{ textShadow: '0 0 30px rgba(213, 178, 99, 0.35)' }}
                                >
                                    TOWN
                                </span>
                            </h1>
                            <p className="text-[11px] font-normal tracking-[0.35em] text-white/30 uppercase animate-fade-in-up">THE LUXURY DESTINATION BY CONNPLEX</p>
                        </div>

                        <div className="mb-[50px]">
                            <h2 className="text-[1.8rem] sm:text-[2.2rem] font-extralight tracking-[0.5em] text-white uppercase mb-5 animate-fade-in-up">COMING SOON</h2>
                            <div 
                                className="h-px bg-gradient-to-r from-[#f5dfbb] to-transparent mb-[25px] origin-left scale-x-0 animate-scale-right" 
                            />
                            <p className="text-[15px] font-light text-white/65 tracking-[0.05em] leading-[1.8] max-w-[480px] animate-fade-in-up">
                                The premium cinema experience reimagined by Connplex. Prepare for unmatched luxury, state-of-the-art audiovisual technology, and bespoke hospitality.
                            </p>
                        </div>

                        <div className="mb-[60px] animate-fade-in-up">
                            <button 
                                className="group relative inline-flex items-center gap-5 px-[50px] py-[18px] bg-transparent border border-[#f5dfbb] text-white text-xs font-medium tracking-[0.25em] uppercase cursor-pointer rounded-sm overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-black hover:border-[#f5dfbb] z-10"
                                onClick={handleNotifyClick}
                            >
                                <span className="absolute inset-y-0 left-[-100%] group-hover:left-0 w-full bg-[#f5dfbb] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] z-[-1]"></span>
                                <span>NOTIFY ME</span>
                                <svg className="w-[18px] h-2.5 stroke-current fill-none transition-transform duration-400 group-hover:translate-x-1.5" viewBox="0 0 18 10">
                                    <path d="M1 5h16M12 1l5 4-5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Feature Highlights */}
                        <div className="flex items-center gap-[1.2rem] text-[0.72rem] font-bold tracking-[0.14em] text-[#c5a880] opacity-85 mb-16 flex-wrap animate-fade-in-up">
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
                        <div className="text-2xl font-black tracking-[0.15em] text-[#f5dfbb]">CONNPLEX</div>
                        <div className="text-[0.6rem] font-extrabold tracking-[0.25em] text-[#8c6e43] mt-1.5">DOWNTOWN CINEMA</div>
                    </div>
                    <div className="dt-modal-body">
                        <h3 className="text-[1.1rem] font-bold tracking-[0.18em] text-[#f5dfbb] text-center mb-4">VIP LAUNCH INVITATION</h3>
                        <p className="text-[0.88rem] leading-relaxed text-[#a5a29d] text-center mb-10">Be the first to experience the absolute height of cinema luxury. Enter your details below to receive updates, exclusive previews, and priority booking access.</p>

                        <form id="notify-form" className="flex flex-col gap-8" onSubmit={handleSubmit}>
                            <div className="relative">
                                <input name="name" type="text" id="user-name" placeholder="Full Name" required autoComplete="name" className="peer w-full py-3 bg-transparent border-b border-[#c5a880]/25 text-[#f3ece3] text-sm outline-none transition-all duration-250 focus:border-[#d4af37] focus:shadow-[0_1px_0_#d4af37]" />
                                <label htmlFor="user-name" className="absolute top-3 left-0 text-[#73716d] text-xs tracking-[0.12em] font-medium pointer-events-none transition-all duration-250 peer-focus:top-[-1.1rem] peer-focus:text-[0.65rem] peer-focus:text-[#d4af37] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-1.1rem] peer-[:not(:placeholder-shown)]:text-[0.65rem] peer-[:not(:placeholder-shown)]:text-[#d4af37] peer-[:not(:placeholder-shown)]:font-semibold">Full Name</label>
                            </div>
                            <div className="relative">
                                <input name="email" type="email" id="user-email" placeholder="Email Address" required autoComplete="email" className="peer w-full py-3 bg-transparent border-b border-[#c5a880]/25 text-[#f3ece3] text-sm outline-none transition-all duration-250 focus:border-[#d4af37] focus:shadow-[0_1px_0_#d4af37]" />
                                <label htmlFor="user-email" className="absolute top-3 left-0 text-[#73716d] text-xs tracking-[0.12em] font-medium pointer-events-none transition-all duration-250 peer-focus:top-[-1.1rem] peer-focus:text-[0.65rem] peer-focus:text-[#d4af37] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[-1.1rem] peer-[:not(:placeholder-shown)]:text-[0.65rem] peer-[:not(:placeholder-shown)]:text-[#d4af37] peer-[:not(:placeholder-shown)]:font-semibold">Email Address</label>
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
                                <label htmlFor="user-consent" className="text-[0.8rem] leading-normal text-[#a5a29d] select-none cursor-pointer">I agree to receive VIP updates and exclusive invites from Connplex Downtown.</label>
                            </div>
                            {submitError && (
                                <div className="text-[#ff5252] text-[0.85rem] mb-4 font-semibold">
                                    ⚠️ {submitError}
                                </div>
                            )}
                            <button type="submit" className="w-full flex justify-center items-center gap-4 bg-[#d4af37] hover:bg-[#f5dfbb] text-[#050505] py-4.5 text-sm font-bold tracking-[0.15em] rounded-[2px] shadow-[0_10px_20px_rgba(197,168,128,0.15)] hover:shadow-[0_15px_30px_rgba(197,168,128,0.3)] hover:-translate-y-0.5 transition-all duration-500 group cursor-pointer" disabled={isSubmitting}>
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
                    <div className="text-[0.8rem] font-bold tracking-[0.12em] text-[#f5dfbb]">Access Requested</div>
                    <div className="text-[0.78rem] text-[#a5a29d] mt-0.5">Check your inbox soon for your exclusive preview.</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
