'use strict';

import Header from '@/components/capex/Header';
import Footer from '@/components/capex/Footer';
import LeadForm from '@/components/capex/LeadForm';

export default function Home() {
  const developersReasons = [
    { title: 'Increase Property Footfall', icon: 'fa-users' },
    { title: 'Higher Commercial Value', icon: 'fa-arrow-up-right-dots' },
    { title: 'Premium Brand Association', icon: 'fa-gem' },
    { title: 'Long-Term Stable Revenue', icon: 'fa-chart-line' },
    { title: 'Professional Operations', icon: 'fa-briefcase' },
    { title: 'End-to-End Execution', icon: 'fa-cubes' },
    { title: 'National Marketing Support', icon: 'fa-bullhorn' },
    { title: 'Future Ready Cinema Technology', icon: 'fa-microchip' }
  ];

  const realEstateBenefits = [
    { 
      title: 'Increased visitor traffic', 
      desc: 'Drive high-volume, recurring footfall that benefits adjacent retail and F&B outlets.',
      icon: 'fa-arrow-trend-up', 
      image: '/ideal_mall_new.png' 
    },
    { 
      title: 'Better leasing opportunities', 
      desc: 'Attract premium national brands eager to lease space near a major entertainment anchor.',
      icon: 'fa-key', 
      image: '/ideal_mixed_use_new.png' 
    },
    { 
      title: 'Higher property valuation', 
      desc: 'Enhance the overall asset value of your commercial development with a reputable anchor tenant.',
      icon: 'fa-money-bill-trend-up', 
      image: '/ideal_commercial_new.png' 
    },
    { 
      title: 'Improved business ecosystem', 
      desc: 'Create a synergistic commercial hub where cinema-goers spend on shopping and dining.',
      icon: 'fa-network-wired', 
      image: '/ideal_mall.png' 
    },
    { 
      title: 'Enhanced customer engagement', 
      desc: 'Increase dwell time and customer loyalty with a state-of-the-art recreation center.',
      icon: 'fa-face-smile', 
      image: '/ideal_building.png' 
    },
    { 
      title: 'Increased rental potential', 
      desc: 'Command higher rental yields and premium square-footage rates for surrounding spaces.',
      icon: 'fa-building-circle-arrow-right', 
      image: '/lobby.png' 
    }
  ];

  const connplexAdvantage = [
    { title: 'Fastest Setup' },
    { title: 'End-to-End Project Management' },
    { title: 'Smart, Signature & Luxuriance Formats' },
    { title: 'Stable Long-Term Revenue' },
    { title: 'Annual Returns' },
    { title: 'Latest Projection & Sound Technology' },
    { title: 'Diverse Content Portfolio' }
  ];

  const capexPartnerBenefits = [
    { title: 'MG + Revenue Share Model', desc: 'Predictable fixed returns combined with variable upside.' },
    { title: '5-Year Lock-in', desc: 'Guaranteed long-term lease contract ensuring rental stability.' },
    { title: '12% Annual Return on CAPEX', desc: 'Highly attractive yields compared to traditional real estate assets.' },
    { title: 'Additional Revenue Share Opportunity', desc: 'Benefit directly from cinema operations growth.' }
  ];

  const propertyRequirements = [
    { label: 'Minimum Carpet Area', value: '7,000 sq. ft.' },
    { label: 'Clear Height', value: '10–16 ft' },
    { label: 'Investment Model', value: '₹3,500/sq. ft. + GST' }
  ];

  const operationsWeHandle = [
    { title: 'Cinema Design', icon: 'fa-pen-ruler' },
    { title: 'Interior Execution', icon: 'fa-paint-roller' },
    { title: 'Technology Installation', icon: 'fa-laptop-code' },
    { title: 'Movie Programming', icon: 'fa-clapperboard' },
    { title: 'Staff Recruitment', icon: 'fa-user-plus' },
    { title: 'Daily Operations', icon: 'fa-gears' },
    { title: 'Marketing & Promotions', icon: 'fa-hashtag' },
    { title: 'Customer Acquisition', icon: 'fa-magnet' }
  ];

  const trustItems = [
    { title: '300+ Signed Screens', icon: 'fa-video' },
    { title: '90+ Locations', icon: 'fa-map-location-dot' },
    { title: 'Professional Operations', icon: 'fa-user-tie' },
    { title: 'National Brand', icon: 'fa-award' },
    { title: 'Premium Cinema Formats', icon: 'fa-crown' },
    { title: 'Dedicated Expansion Team', icon: 'fa-people-group' }
  ];

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-[90px] bg-black text-white">
        
        {/* HERO SECTION */}
        <section id="hero" className="relative w-full min-h-[calc(100vh-90px)] flex items-center pt-20 pb-28 px-6 sm:px-[6%] md:px-[8%] bg-black overflow-hidden border-b border-white/5">
          <div className="absolute top-[20%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Full section background cinema image blending to solid black on the left */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none">
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 lg:via-black/35 to-transparent z-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/80 z-20"></div>
            <img 
              src="/hero_new.png" 
              alt="Cinema Auditorium Background" 
              className="w-full h-full object-cover object-center lg:object-right opacity-90 filter brightness-110"
            />
          </div>

          <div className="relative z-20 max-w-7xl w-full mx-auto">
            <div className="max-w-3xl flex flex-col text-left">
              <span className="text-primary-gold uppercase tracking-[4px] text-xs font-bold mb-4 font-outfit reveal-up">
                INDIA'S FASTEST GROWING CINEMA CHAIN
              </span>
              <h1 className="font-outfit font-extrabold text-[2rem] sm:text-[2.8rem] md:text-[3.6rem] lg:text-[4rem] leading-[1.15] tracking-[1px] mb-6 text-white uppercase reveal-up-delay">
                Turn Your Commercial Space Into a <br />
                <span className="text-primary-gold bg-gradient-to-r from-primary-gold to-[#f5d085] bg-clip-text text-transparent">High-Performing Entertainment Destination</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-text-secondary leading-[1.6] max-w-2xl mb-8 reveal-up-delay-2 font-montserrat">
                Partner with Connplex Cinemas and transform your vacant or underutilized commercial property into a profitable cinema destination that increases footfall, rental value, and long-term returns.
              </p>

              {/* Stats / Badges inside Hero */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10 reveal-up-delay-2 border-l-2 border-primary-gold/40 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-outfit font-bold text-sm sm:text-base">300+</span>
                  <span className="text-text-secondary text-[10px] sm:text-xs uppercase tracking-wider">Signed Screens</span>
                </div>
                <div className="w-[1px] h-4 bg-white/10 hidden sm:block self-center"></div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-outfit font-bold text-sm sm:text-base">90+</span>
                  <span className="text-text-secondary text-[10px] sm:text-xs uppercase tracking-wider">Locations</span>
                </div>
                <div className="w-[1px] h-4 bg-white/10 hidden sm:block self-center"></div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-outfit font-bold text-sm sm:text-base">Trusted</span>
                  <span className="text-text-secondary text-[10px] sm:text-xs uppercase tracking-wider">Across India</span>
                </div>
              </div>

              <div className="reveal-up-delay-2">
                <a 
                  href="#proposal-form" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-gold text-black font-bold uppercase tracking-wider text-xs transition-all duration-300 rounded-none font-outfit hover:bg-hover-gold hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Book a Free Property Evaluation <span className="ml-3 text-sm">➔</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: WHY CONNPLEX */}
        <section id="why-connplex" className="py-28 px-6 sm:px-[6%] md:px-[8%] bg-black relative border-b border-white/5 overflow-hidden">
          {/* Full section background cinema lobby image */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 lg:via-black/60 to-transparent z-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20"></div>
            <img 
              src="/lobby.png" 
              alt="Connplex Cinema Lobby Background" 
              className="w-full h-full object-cover object-center lg:object-right opacity-60 filter brightness-110"
            />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content (6 Cols) */}
            <div className="lg:col-span-6 text-left font-montserrat bg-black/40 backdrop-blur-sm p-6 lg:p-10 border border-white/5 rounded-2xl">
              <span className="text-primary-gold uppercase tracking-[3px] text-xs font-bold mb-3 block font-outfit">
                WHY CONNPLEX?
              </span>
              <h2 className="font-outfit font-extrabold text-[2.2rem] sm:text-[2.8rem] tracking-[1px] uppercase text-white mb-2 leading-tight">
                More Than a Cinema.
              </h2>
              <h3 className="font-outfit font-bold text-lg sm:text-xl text-primary-gold mb-6 uppercase tracking-wider">
                We Create Destinations.
              </h3>
              
              <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-[1.8] font-montserrat">
                <p>
                  Connplex Cinemas partners with developers and property owners to build premium entertainment destinations that attract families, increase footfall, and enhance the value of commercial real estate.
                </p>
                <p>
                  Our experienced team manages everything—from design and technology to operations and marketing—allowing partners to benefit from a professionally operated cinema business backed by a growing national brand.
                </p>
              </div>
            </div>

            {/* Right Content (6 Cols) - Grid of advantages */}
            <div className="lg:col-span-6 flex flex-col bg-black/85 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative z-20">
              <div className="mb-6">
                <h4 className="font-outfit font-bold text-sm uppercase tracking-wider text-white border-b border-primary-gold/30 pb-3 inline-block">
                  Why Developers Choose Connplex
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-montserrat">
                {developersReasons.map((reason, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#0b0b0b] border border-white/5 hover:border-primary-gold/30 p-4 flex items-start gap-3 transition-all duration-300 group hover:-translate-y-0.5 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full border border-primary-gold/20 flex items-center justify-center text-primary-gold bg-black/40 text-xs shrink-0 group-hover:bg-primary-gold group-hover:text-black transition-all duration-300">
                      <i className={`fa-solid ${reason.icon}`}></i>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white mt-1.5 group-hover:text-primary-gold transition-colors duration-300 font-outfit">
                      {reason.title}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-white/40 italic mt-6 font-montserrat">
                These advantages reflect Connplex's scalable operating model and support system.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: REAL ESTATE BENEFITS */}
        <section id="real-estate-benefits" className="py-28 px-6 sm:px-[6%] md:px-[8%] bg-[#080808] relative border-b border-white/5">
          <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-primary-gold uppercase tracking-[3px] text-xs font-bold font-outfit mb-3 block">
                REAL ESTATE BENEFITS
              </span>
              <h2 className="font-outfit font-extrabold text-[2.2rem] sm:text-[3rem] tracking-[1px] uppercase text-white leading-tight">
                Your Property Deserves More Than Empty Space.
              </h2>
              <p className="text-sm sm:text-base text-text-secondary mt-4 max-w-2xl mx-auto font-montserrat">
                A Connplex cinema becomes an anchor attraction for your development, driving footfall and elevating adjacent commercial spaces.
              </p>
              <div className="w-[60px] h-[1px] bg-primary-gold mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {realEstateBenefits.map((benefit, idx) => (
                <div 
                  key={idx} 
                  className="relative aspect-[4/3] border border-white/10 overflow-hidden group rounded-xl bg-black cursor-pointer transition-all duration-500 hover:border-primary-gold/60 hover:shadow-[0_12px_40px_rgba(197,160,89,0.25)] hover:-translate-y-1.5"
                >
                  {/* Clean gradient overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/35 to-black/10 pointer-events-none transition-all duration-500 group-hover:via-black/40"></div>
                  
                  <img 
                    src={benefit.image} 
                    alt={benefit.title} 
                    className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-105 filter brightness-100 group-hover:brightness-110"
                  />
                  
                  {/* Card Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between z-20 bg-black/30 group-hover:bg-black/15 transition-colors duration-500">
                    <div className="w-10 h-10 border border-primary-gold/40 flex items-center justify-center text-primary-gold bg-black/75 text-sm self-start group-hover:bg-primary-gold group-hover:text-black group-hover:border-primary-gold transition-all duration-300 rounded-lg">
                      <i className={`fa-solid ${benefit.icon}`}></i>
                    </div>
                    
                    <div className="flex flex-col bg-black/75 p-4 border-t border-white/5 backdrop-blur-sm">
                      <span className="font-outfit font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white group-hover:text-primary-gold transition-colors duration-300 leading-snug mb-1">
                        {benefit.title}
                      </span>
                      <span className="text-[10px] sm:text-xs text-text-secondary leading-normal font-montserrat">
                        {benefit.desc}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-xs text-white/40 font-montserrat">
                These benefits are highlighted for developers, owners, and brokers in the brochure.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: CAPEX PARTNERSHIP & CONNPLEX ADVANTAGE */}
        <section id="capex-partnership" className="py-28 px-6 sm:px-[6%] md:px-[8%] bg-black relative border-b border-white/5 overflow-hidden">
          <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] bg-primary-gold/5 rounded-full blur-[120px] pointer-events-none z-10"></div>
          
          <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Why CAPEX Owners Partner */}
            <div className="lg:col-span-7 flex flex-col text-left font-montserrat">
              <span className="text-primary-gold uppercase tracking-[3px] text-xs font-bold mb-3 block font-outfit">
                CAPEX PARTNERSHIP MODEL
              </span>
              <h2 className="font-outfit font-extrabold text-[2.2rem] sm:text-[2.8rem] tracking-[1px] text-white leading-tight uppercase mb-4">
                Earn More From Your <br /> Commercial Asset
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-[1.8] mb-10 max-w-2xl">
                Our CAPEX partnership model is designed to help commercial property owners generate predictable long-term income while Connplex manages cinema operations.
              </p>

              {/* Financial Benefits Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {capexPartnerBenefits.map((benefit, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#0b0b0b] border border-white/10 p-6 rounded-lg relative overflow-hidden group hover:border-primary-gold/30 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary-gold/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="text-primary-gold font-outfit font-black text-2xl mb-3 flex items-center gap-2">
                      <span className="text-base text-[#D4AF37]">✦</span>
                      {benefit.title === '12% Annual Return on CAPEX' ? (
                        <span className="text-3xl text-white font-extrabold">12%</span>
                      ) : benefit.title === '5-Year Lock-in' ? (
                        <span className="text-3xl text-white font-extrabold">5 Yr</span>
                      ) : (
                        <span className="text-lg text-white font-bold">{benefit.title.split(' ')[0]}</span>
                      )}
                    </div>
                    
                    <h4 className="font-outfit font-bold text-xs uppercase tracking-wider text-white mb-2 leading-relaxed font-outfit">
                      {benefit.title}
                    </h4>
                    <p className="text-[11px] text-text-secondary leading-relaxed font-montserrat">
                      {benefit.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Structured Investment Terms Table */}
              <div className="border border-white/10 rounded-lg overflow-hidden bg-black/60 backdrop-blur-md mt-8">
                <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0b0b0b] flex items-center justify-between">
                  <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-primary-gold">
                    CAPEX Investment Parameters
                  </h4>
                  <span className="text-[10px] bg-primary-gold/10 text-primary-gold font-bold px-2 py-0.5 uppercase">
                    Verified
                  </span>
                </div>
                <div className="divide-y divide-white/5 font-montserrat">
                  <div className="p-4 flex justify-between items-center text-xs">
                    <span className="text-white font-bold">Annual ROI</span>
                    <span className="text-primary-gold font-extrabold text-sm font-outfit">12% Return on CAPEX</span>
                  </div>
                  <div className="p-4 flex justify-between items-center text-xs">
                    <span className="text-white font-bold">Lease Security</span>
                    <span className="text-text-secondary font-medium">5-Year Lock-in Contract</span>
                  </div>
                  <div className="p-4 flex justify-between items-center text-xs">
                    <span className="text-white font-bold">Payout Structure</span>
                    <span className="text-text-secondary font-medium">Minimum Guarantee (MG) + Revenue Share</span>
                  </div>
                  <div className="p-4 flex justify-between items-center text-xs">
                    <span className="text-white font-bold">Additional Upside</span>
                    <span className="text-text-secondary font-medium">Margin share on F&B & screen premium tickets</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: The Connplex Advantage with Showcase Image */}
            <div className="lg:col-span-5 bg-[#0b0b0b]/90 border border-white/10 p-8 rounded-xl backdrop-blur-md relative z-20">
              
              {/* Premium Showcase Image */}
              <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-[16/10] mb-6 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  src="/hero_cinema.png" 
                  alt="Cinema Luxury Seating" 
                  className="w-full h-full object-cover filter brightness-105 contrast-105"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-primary-gold text-black font-outfit font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-none shadow-lg">
                    Premium Seating Formats
                  </span>
                </div>
              </div>

              <span className="text-primary-gold uppercase tracking-[2px] text-[10px] font-bold mb-2 block font-outfit">
                THE CONNPLEX ADVANTAGE
              </span>
              <h3 className="font-outfit font-extrabold text-xl sm:text-2xl text-white uppercase mb-6 tracking-wide border-b border-white/5 pb-4">
                A Partnership <br /> Built for Growth
              </h3>

              <div className="mb-4">
                <span className="text-xs font-bold uppercase text-white tracking-wider">We Offer:</span>
              </div>
              
              <ul className="space-y-4 font-montserrat">
                {connplexAdvantage.map((offer, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <span className="w-5 h-5 rounded-full border border-primary-gold/45 flex items-center justify-center text-primary-gold text-[10px] shrink-0 mt-0.5 group-hover:bg-primary-gold group-hover:text-black transition-colors duration-300">
                      ✓
                    </span>
                    <span className="text-xs text-text-secondary font-medium leading-relaxed group-hover:text-white transition-colors duration-300 font-outfit">
                      {offer.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* SECTION: PROPERTY REQUIREMENTS */}
        <section id="property-requirements" className="py-28 px-6 sm:px-[6%] md:px-[8%] bg-[#080808] relative border-b border-white/5">
          <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Requirements */}
            <div className="lg:col-span-6 flex flex-col text-left font-montserrat">
              <span className="text-primary-gold uppercase tracking-[3px] text-xs font-bold mb-3 block font-outfit">
                CRITERIA FOR PARTNERSHIP
              </span>
              <h2 className="font-outfit font-extrabold text-[2.2rem] sm:text-[2.8rem] tracking-[1px] text-white leading-tight uppercase mb-6">
                Is Your Property <br /> Suitable?
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-[1.8] mb-8">
                We are actively looking for commercial properties meeting the following criteria:
              </p>

              {/* Table details */}
              <div className="border border-white/10 rounded-lg overflow-hidden bg-black/40 backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0b0b0b]">
                      <th className="p-4 sm:p-5 font-outfit text-xs font-bold uppercase tracking-wider text-primary-gold">Requirement</th>
                      <th className="p-4 sm:p-5 font-outfit text-xs font-bold uppercase tracking-wider text-primary-gold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyRequirements.map((req, idx) => (
                      <tr key={idx} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors duration-300">
                        <td className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-white font-outfit uppercase tracking-wide">{req.label}</td>
                        <td className="p-4 sm:p-5 text-xs sm:text-sm text-text-secondary font-medium">{req.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: We Handle Everything */}
            <div className="lg:col-span-6 flex flex-col text-left font-montserrat">
              <span className="text-primary-gold uppercase tracking-[3px] text-xs font-bold mb-3 block font-outfit">
                END-TO-END OPERATIONS
              </span>
              <h2 className="font-outfit font-extrabold text-[2.2rem] sm:text-[2.8rem] tracking-[1px] text-white leading-tight uppercase mb-6">
                We Handle Everything
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-[1.8] mb-8">
                Once you partner with Connplex, our dedicated team manages the entire process:
              </p>

              <div className="grid grid-cols-2 gap-4">
                {operationsWeHandle.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 bg-[#0b0b0b] border border-white/5 hover:border-primary-gold/20 p-4 transition-all duration-300 group rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full border border-primary-gold/15 flex items-center justify-center text-primary-gold bg-black/40 text-xs shrink-0 group-hover:bg-primary-gold group-hover:text-black transition-all duration-300">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white group-hover:text-primary-gold transition-colors duration-300 font-outfit">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-white/40 italic mt-6 leading-relaxed">
                This aligns with the brochure's operational commitment, including company-managed standards, staffing, maintenance, marketing, and audience acquisition.
              </p>
            </div>

          </div>
        </section>

        {/* FORM SECTION: LET'S DISCUSS YOUR PROPERTY */}
        <section id="proposal-form" className="py-28 px-6 sm:px-[6%] md:px-[8%] bg-black relative overflow-hidden">
          {/* Full section background cinema seats image blending to solid black */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 select-none">
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 lg:via-black/50 to-black/25 z-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20"></div>
            <img 
              src="/auditorium_new.jpg" 
              alt="Cinema Auditorium Background" 
              className="w-full h-full object-cover object-center lg:object-right opacity-70 filter brightness-110"
            />
          </div>

          <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-primary-gold/5 rounded-full blur-[120px] pointer-events-none z-10"></div>
          
          <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col text-left font-montserrat">
              <span className="text-primary-gold uppercase tracking-[3px] text-xs font-bold mb-3 block font-outfit">
                LET'S DISCUSS YOUR PROPERTY
              </span>
              <h2 className="font-outfit font-extrabold text-[2.2rem] sm:text-[3rem] tracking-[1px] text-white leading-tight uppercase mb-6">
                Request a Free <br /> Property Assessment
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-[1.8] mb-12 max-w-[500px]">
                <p>
                  If you own or represent a commercial property, mall, mixed-use development, or high-street retail space, our expansion team would love to evaluate its potential.
                </p>
                <p>
                  Complete the form below, and our CAPEX partnership specialists will contact you within 24 hours.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 font-outfit">
                <div className="flex flex-col items-center justify-center p-3 border border-white/10 bg-white/[0.02] rounded-lg hover:border-primary-gold/30 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="w-10 h-10 border border-primary-gold/30 flex items-center justify-center text-primary-gold text-sm mb-2 rounded-full bg-black/40">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">Confidential</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 border border-white/10 bg-white/[0.02] rounded-lg hover:border-primary-gold/30 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="w-10 h-10 border border-primary-gold/30 flex items-center justify-center text-primary-gold text-sm mb-2 rounded-full bg-black/40">
                    <i className="fa-solid fa-shield"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">No Obligation</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 border border-white/10 bg-white/[0.02] rounded-lg hover:border-primary-gold/30 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="w-10 h-10 border border-primary-gold/30 flex items-center justify-center text-primary-gold text-sm mb-2 rounded-full bg-black/40">
                    <i className="fa-solid fa-file-signature"></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">Free Evaluation</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
              <LeadForm />
            </div>

          </div>
        </section>

        {/* SECTION: TRUST SECTION */}
        <section id="trust" className="py-24 px-6 sm:px-[6%] md:px-[8%] bg-[#080808] relative border-b border-white/5 overflow-hidden">
          <div className="absolute top-[40%] right-[-15%] w-[400px] h-[400px] bg-primary-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto text-center">
            <span className="text-primary-gold uppercase tracking-[3px] text-xs font-bold font-outfit mb-3 block">
              PARTNER WITH US
            </span>
            <h2 className="font-outfit font-extrabold text-[2.2rem] sm:text-[3rem] tracking-[1.5px] uppercase text-white mb-16 font-outfit">
              Join India's Fastest Growing <br /> Cinema Expansion
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {trustItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-black/40 border border-white/10 hover:border-primary-gold/30 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group rounded-xl"
                >
                  <div className="w-12 h-12 rounded-full border border-primary-gold/20 flex items-center justify-center text-primary-gold bg-black/60 text-lg mb-4 group-hover:bg-primary-gold group-hover:text-black transition-all duration-300">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <span className="font-outfit font-bold text-xs uppercase tracking-wider text-white group-hover:text-primary-gold transition-colors duration-300 leading-snug">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
