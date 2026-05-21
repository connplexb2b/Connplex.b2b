import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Capex for Developers | Connplex Cinemas',
    description: 'Scalable cinema infrastructure designed for premium experiences and long-term growth. Explore investment models with Connplex Cinemas.',
};

const CapexPage = () => {
    return (
        <div className="bg-black text-white font-outfit min-h-screen flex flex-col justify-between">
            <Header />
            <main className="flex-grow">
                <section className="relative w-full min-h-screen bg-[url('/capex/top_image.png')] bg-no-repeat bg-center bg-cover flex flex-col justify-between px-[20px] sm:px-[8%] pt-[100px] md:pt-[120px] pb-[50px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/20 z-10"></div>
                    
                    <div className="relative z-20 max-w-[700px] pt-12.5 mb-10">
                        <h1 className="font-extrabold text-[2.2rem] sm:text-[2.8rem] md:text-[3.5rem] lg:text-[4.8rem] leading-[1.1] tracking-[3px] mb-6 text-white uppercase reveal-up">
                            <span className="text-[#C5A059]">CAPEX</span><br />
                            FOR THE<br />
                            FUTURE OF<br />
                            CINEMA<span className="text-[#C5A059]">.</span>
                        </h1>
                        <div className="w-[50px] h-[2px] bg-[#C5A059] mb-[30px] reveal-up-delay"></div>
                        <p className="text-lg sm:text-[1.3rem] text-[#b0b0b0] leading-[1.6] mb-[45px] max-w-[500px] reveal-up-delay">
                            Scalable cinema infrastructure designed for premium experiences and long-term growth.
                        </p>
                        <a href="mailto:franchise@connplex.com" className="inline-flex items-center px-[35px] py-[18px] border border-[#C5A059] text-white no-underline text-base font-semibold tracking-[1.5px] hover:bg-[#C5A059] hover:text-black transition-all duration-400 bg-transparent group reveal-up-delay-2">
                            CONTACT US
                            <span className="ml-[20px] transition-transform duration-300 group-hover:translate-x-1.25 group-hover:-translate-y-1.25">↗</span>
                        </a>
                    </div>

                    <div className="relative z-20 mt-[60px] w-full slide-up-delay">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-black/70 backdrop-blur-[15px] border border-[#C5A059]/30 rounded-[4px] py-[35px]">
                            
                            {/* Item 1 */}
                            <div className="flex flex-col sm:flex-row items-center justify-center px-[30px] py-[15px] sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10 text-center sm:text-left group">
                                <div className="text-[2rem] text-[#C5A059] sm:mr-[15px] mb-2.5 sm:mb-0 transition-transform duration-300 group-hover:scale-115">
                                    <i className="fa-solid fa-gear"></i>
                                </div>
                                <div className="flex flex-col text-[0.8rem] font-bold tracking-[1.2px] text-white uppercase leading-[1.4]">
                                    <span>LOW OPERATIONAL</span>
                                    <span>COMPLEXITY</span>
                                </div>
                            </div>
                            
                            {/* Item 2 */}
                            <div className="flex flex-col sm:flex-row items-center justify-center px-[30px] py-[15px] sm:py-0 border-b sm:border-b-0 lg:border-r border-white/10 text-center sm:text-left group">
                                <div className="text-[2rem] text-[#C5A059] sm:mr-[15px] mb-2.5 sm:mb-0 transition-transform duration-300 group-hover:scale-115">
                                    <i className="fa-solid fa-chart-line"></i>
                                </div>
                                <div className="flex flex-col text-[0.8rem] font-bold tracking-[1.2px] text-white uppercase leading-[1.4]">
                                    <span>PREMIUM ROI</span>
                                    <span>POTENTIAL</span>
                                </div>
                            </div>
                            
                            {/* Item 3 */}
                            <div className="flex flex-col sm:flex-row items-center justify-center px-[30px] py-[15px] sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10 text-center sm:text-left group">
                                <div className="text-[2rem] text-[#C5A059] sm:mr-[15px] mb-2.5 sm:mb-0 transition-transform duration-300 group-hover:scale-115">
                                    <i className="fa-solid fa-layer-group"></i>
                                </div>
                                <div className="flex flex-col text-[0.8rem] font-bold tracking-[1.2px] text-white uppercase leading-[1.4]">
                                    <span>SMART</span>
                                    <span>INFRASTRUCTURE</span>
                                </div>
                            </div>
                            
                            {/* Item 4 */}
                            <div className="flex flex-col sm:flex-row items-center justify-center px-[30px] py-[15px] sm:py-0 border-0 text-center sm:text-left group">
                                <div className="text-[2rem] text-[#C5A059] sm:mr-[15px] mb-2.5 sm:mb-0 transition-transform duration-300 group-hover:scale-115">
                                    <i className="fa-solid fa-expand"></i>
                                </div>
                                <div className="flex flex-col text-[0.8rem] font-bold tracking-[1.2px] text-white uppercase leading-[1.4]">
                                    <span>SCALABLE</span>
                                    <span>FORMATS</span>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CapexPage;
