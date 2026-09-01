"use client";
import { motion, Variants } from "framer-motion";
import { Ticket, TrendingUp, Smartphone } from "lucide-react";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function CinemaAdsPage() {
  return (
    <div className="cinemaads-theme">
      <header>
        <div className="container header-content">
          <div className="logo">
            <Image
              src="/img/Connplex-Cinemas-Gradient.png"
              alt="Connplex Cinema Logo"
              width={200}
              height={50}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <nav className="nav-links">
            <a href="#about">Explore</a>
            <a href="#about-us">About Us</a>
            <a href="#location">Location</a>
          </nav>
        </div>
      </header>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-glow" />
          <div className="container">
            <motion.div
              className="hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 variants={fadeUp} className="hero-title">
                Apply for <span className="text-gradient"><span style={{ whiteSpace: "nowrap" }}>Connplex Cinemas</span> Franchise</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="hero-subtitle">
                Be Part of India’s Fastest-Growing Smart Luxury Cinema Network
              </motion.p>
            </motion.div>
          </div>
        </section>
        {/* Features Section */}
        <section id="about" className="section container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="features-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginTop: 0 }}>
              {/* Card 1: Book Ticket */}
              <motion.a
                href="https://ticketing.theconnplex.com/"
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                className="feature-card glass-panel"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div className="feature-icon" style={{ background: 'transparent', width: 'auto', height: 'auto', marginBottom: '24px' }}>
                  <Image src="/img/book-tickets.png" alt="Book Ticket" width={200} height={200} style={{ objectFit: 'contain' }} />
                </div>
                <button className="btn-primary" style={{ width: '100%', pointerEvents: 'none' }}>Book Ticket</button>
              </motion.a>
              {/* Card 2: Investors Section */}
              <motion.a
                href="https://forms.zohopublic.in/connplex/form/FIAAPPLYNOW/formperma/82m_7wvwlQPKvK19Z1aQwtI_mawIvaNVFUVF14j9n4A"
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                className="feature-card glass-panel"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div className="feature-icon" style={{ background: 'transparent', width: 'auto', height: 'auto', marginBottom: '24px' }}>
                  <Image src="/img/apply-franchise.png" alt="Apply For Franchise" width={200} height={200} style={{ objectFit: 'contain' }} />
                </div>
                <button className="btn-primary" style={{ width: '100%', pointerEvents: 'none', background: 'var(--text-primary)', color: 'black' }}>Apply For Franchise</button>
              </motion.a>
              {/* Card 3: Download App */}
              <motion.div
                onClick={() => {
                  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
                  if (/android/i.test(userAgent)) {
                    window.open("https://play.google.com/store/apps/details?id=com.connplex", "_blank");
                  } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
                    window.open("https://apps.apple.com/in/app/connplex-cinemas-tickets/id6497171599", "_blank");
                  } else {
                    window.open("https://play.google.com/store/apps/details?id=com.connplex", "_blank");
                  }
                }}
                variants={fadeUp}
                className="feature-card glass-panel"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div className="feature-icon" style={{ background: 'transparent', width: 'auto', height: 'auto', marginBottom: '24px' }}>
                  <Image src="/img/mobile-Notification.png" alt="Download App" width={200} height={200} style={{ objectFit: 'contain' }} />
                </div>
                <button className="btn-primary" style={{ width: '100%', pointerEvents: 'none', background: 'var(--accent-gold)', color: 'black' }}>Download App</button>
              </motion.div>
            </div>
          </motion.div>
        </section>
        {/* About Section */}
        <section id="about-us" className="section container" style={{ paddingBottom: '40px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="showtimes-header">
              <motion.h2 variants={fadeUp}>About Us</motion.h2>
            </div>
            <motion.div variants={fadeUp} className="glass-panel" style={{ padding: '40px', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '16px' }}>
                Connplex Cinemas is rewriting the rules of movie-going in India. As the nation’s first and fastest-growing chain of Smart Luxury Cinemas, Connplex has built a strong footprint with 300+ screens across 15+ states and 35+ operational franchises - and continues to expand aggressively.
              </p>
              <p style={{ marginBottom: '16px' }}>
                What sets Connplex apart is its holistic approach. Beyond screening films, it engages in film marketing, in-film branding, advertising, distribution, and rights management across Bollywood, Gujarati, and regional cinema, making it a complete entertainment ecosystem.
              </p>
              <p style={{ marginBottom: '16px' }}>
                For audiences, Connplex offers the perfect blend of comfort and technology: plush seating, advanced 2K projection, Dolby surround sound, gourmet F&B, and seamless booking via our own web & app. Our exclusive loyalty program ensures deeper connections with movie lovers.
              </p>
              <p>
                For investors and partners, Connplex provides a scalable and future-ready business model. With modular formats - Luxuriance, Signature, and Smart - it adapts to diverse markets without compromising on quality.
              </p>
            </motion.div>
          </motion.div>
        </section>
        {/* Cinema Formats Section */}
        <section id="formats" className="section container" style={{ paddingTop: '0' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="showtimes-header">
              <motion.h2 variants={fadeUp}>Our Cinema Formats</motion.h2>
            </div>
            <div className="features-grid">
              {[
                {
                  title: "Luxuriance",
                  subtitle: "The Ultimate Luxury Cinema Experience",
                  desc: "Designed for the discerning moviegoer, this model features ultra-luxurious interiors, state-of-the-art technology, gourmet snacks, and a boutique cinema experience like no other. From luxurious recliners to personalised service, every detail is crafted for indulgence.",
                  image: "/img/LUX.jpeg"
                },
                {
                  title: "Signature",
                  subtitle: "Modern Cinema for Urban Markets",
                  desc: "Connplex Signature offers a smart, scalable cinema solution tailored for growing urban markets. Combining modern technology, comfortable design, and operational efficiency, it delivers a premium movie experience that drives strong customer engagement and sustainable business growth.",
                  image: "/img/SIG.jpeg"
                },
                {
                  title: "Smart",
                  subtitle: "The Scalable Cinema Solution for Emerging Markets",
                  desc: "Connplex Smart delivers a streamlined, cost-effective cinema solution ideal for emerging markets and smaller towns, with rapid setup and low operational complexity. Engineered for flexibility and speed, it ensures a quality movie-going experience tailored to local audiences while maximizing returns.",
                  image: "/img/SMART.jpeg"
                }
              ].map((format, idx) => (
                <motion.div key={idx} variants={fadeUp} className="feature-card glass-panel" style={{ textAlign: 'left', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                    <Image src={format.image} alt={format.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '32px' }}>
                    <h3 className="text-gradient" style={{ marginBottom: '8px' }}>{format.title}</h3>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600 }}>{format.subtitle}</h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{format.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
        {/* Footer / Location */}
        <footer id="location">
          <div className="container">
            <div className="footer-content">
              <div className="footer-col">
                <div style={{ marginBottom: '16px' }}>
                  <Image
                    src="/img/Connplex-Cinemas-Gradient.png"
                    alt="Connplex Cinema Logo"
                    width={180}
                    height={45}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <p>Connplex Cinemas is India’s fastest-growing luxurious Cinema chain, redefining the way audiences experience movies, Connplex brings together cutting-edge technology, stylish comfort, and accessible pricing to create cinematic environments that truly stand apart. With a rapidly growing footprint of 300+ screens and 35+ franchise locations, we build on a strong legacy in film marketing and distribution dating back to 2009.</p>
              </div>
              <div className="footer-col">
                <h4>Location</h4>
                <p>Connplex Cinemas Limited,</p>
                <p>Krish Cubical, Block C: (1001 to 1008), 10th Floor,</p>
                <p>Opp. Avalon Hotel Road, SBR - Sindhu Bhavan Marg,</p>
                <p>Thaltej, Ahmedabad, Gujarat - 380059</p>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <p>Email: feedback@theconnplex.com</p>
                <p>Phone: +91 9924577556</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Connplex Cinema. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
