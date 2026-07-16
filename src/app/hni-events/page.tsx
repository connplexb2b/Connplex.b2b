"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const posterImg = "/assets/odyssey-poster.jpg";
const uncoreLogo = "/assets/new_uncore_logo.png";
const EVENT_DATE = 1784384700000; // 2026-07-18T19:55:00+05:30

function useCountdown() {
  const [now, setNow] = useState(() => EVENT_DATE);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, EVENT_DATE - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, mounted };
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]" />
      <span className="text-[var(--gold)] text-xs tracking-[0.4em]">◆</span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]" />
    </div>
  );
}

export default function PremierNightPage() {
  const { d, h, m, s, mounted } = useCountdown();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const experiences = [
    { title: "Private Premiere", sub: "" },
    { title: "Luxury Welcome", sub: "" },
    { title: "Gourmet Experience", sub: "" },
    { title: "Premium Gifts", sub: "" },
    { title: "Red Carpet Moments", sub: "" },
    { title: "Elite Networking", sub: "" },
    { title: "Immersive Experience", sub: "" },
  ];

  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert("Please fill in all registration fields.");
      return;
    }

    if (!(window as any).Razorpay) {
      alert("Razorpay payment gateway is loading. Please try again in a moment.");
      return;
    }

    setIsPaying(true);
    try {
      // 1. Create order on the Next.js API endpoint
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }), // Amount in INR
      });
      const orderData = await res.json();

      if (!res.ok || !orderData.id) {
        alert(`Failed to initiate order. Details: ${orderData.details || orderData.error || "Please try again."}`);
        setIsPaying(false);
        return;
      }

      // 2. Configure checkout configuration options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Connplex Cinemas",
        description: "HNI Premier Night Registration - The Odyssey",
        image: uncoreLogo,
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Send payment signature details to backend for verification
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.status === "success") {
            alert("Booking & Payment Successful! We will contact you shortly with your digital invitation.");
            setGuestName("");
            setGuestEmail("");
            setGuestPhone("");
          } else {
            alert("Payment Verification Failed! Please check with your bank.");
          }
          setIsPaying(false);
        },
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone,
        },
        theme: {
          color: "#c19b62", // Custom gold theme color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed! Error description: ${response.error.description}`);
        setIsPaying(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay payment transaction setup failed:", error);
      alert("Payment transaction initialization error.");
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      {/* Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-[var(--gold)]/15">
        <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-1 md:grid-cols-3 items-center gap-2 md:gap-4">
          <a href="https://www.uncoredigital.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-2 md:gap-3 hover:opacity-80 transition order-2 md:order-1">
            <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-muted-foreground uppercase">hosted by</span>
            <img src={uncoreLogo} alt="Uncore Digital" className="h-5 md:h-7 w-auto shrink-0" />
          </a>
          <div className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 order-1 md:order-2">
            <span className="font-display text-xl md:text-2xl tracking-widest text-gold-gradient">CONNPLEX</span>
            <span className="text-[8px] md:text-[10px] tracking-[0.35em] text-muted-foreground">LUXURIANCE CINEMAS</span>
          </div>
          <a href="#book" className="hidden md:inline-block btn-gold hover:[&]:btn-gold-hover px-6 py-2.5 rounded-sm text-xs justify-self-end order-3">
            Book Now
          </a>
        </div>
      </nav>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16">
        <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-radial-glow)" }} />
        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
              <span className="text-foreground">Premier Night</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              Christopher Nolan's <em className="text-[var(--gold-soft)]">The Odyssey</em> — witnessed before the world, in a room built for the few.
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] text-muted-foreground mb-1">DATE</p>
                <p className="font-display text-2xl text-foreground">18 July 2026</p>
              </div>
              <div className="h-10 w-px bg-[var(--gold)]/30" />
              <div>
                <p className="text-xs tracking-[0.3em] text-muted-foreground mb-1">TIME</p>
                <p className="font-display text-2xl text-foreground">7:55 PM</p>
              </div>
              <div className="h-10 w-px bg-[var(--gold)]/30" />
              <div>
                <p className="text-xs tracking-[0.3em] text-muted-foreground mb-1">LOCATION</p>
                <p className="font-display text-xl md:text-2xl text-foreground max-w-[18ch]">Connplex Luxuriance Adani Shantigram</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#book" className="btn-gold hover:[&]:btn-gold-hover px-10 py-4 rounded-sm text-sm">Book Now</a>
              <a href="#experience" className="px-10 py-4 rounded-sm text-sm tracking-[0.15em] uppercase font-semibold border border-[var(--gold)]/40 text-foreground hover:bg-[var(--gold)]/10 transition">
                The Experience
              </a>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-[var(--gold)]/30 via-transparent to-[var(--gold)]/10 blur-2xl" />
            <div className="relative rounded-sm overflow-hidden border border-[var(--gold)]/30" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <img src={posterImg} alt="The Odyssey — a film by Christopher Nolan" className="w-full h-auto block" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-background border border-[var(--gold)]/40 px-5 py-3 text-xs tracking-[0.3em] text-[var(--gold-soft)]">
              07.18.26 · CONNPLEX
            </div>
          </div>
        </div>
      </section>
      {/* COUNTDOWN */}
      <section className="border-y border-[var(--gold)]/20 bg-card/40">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-xs tracking-[0.5em] text-muted-foreground mb-6">THE PREMIERE BEGINS IN</p>
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { v: d, l: "Days" },
              { v: h, l: "Hours" },
              { v: m, l: "Minutes" },
              { v: s, l: "Seconds" },
            ].map((x) => (
              <div key={x.l} className="border border-[var(--gold)]/20 py-6 px-2 bg-background/40">
                <div className="font-display text-4xl md:text-6xl text-gold-gradient tabular-nums">
                  {mounted ? String(x.v).padStart(2, "0") : "00"}
                </div>
                <div className="text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground mt-2">{x.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* EXPERIENCE */}
      <section id="experience" className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[var(--gold)] text-xs tracking-[0.5em] mb-4">WHERE CINEMA MEETS PRIVILEGE</p>
            <h2 className="font-display text-4xl md:text-6xl mb-4">
              An Evening <span className="text-gold-gradient italic">Reserved</span> for the Few
            </h2>
            <Divider />
            <p className="text-muted-foreground leading-relaxed">
              An exclusive premiere experience crafted for India's Ultra High Net Worth Individuals.
              Be the first to experience the magic before the world does.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-[var(--gold)]/20 mt-16 border border-[var(--gold)]/20">
            {experiences.map((ex) => (
              <div key={ex.title} className="bg-background p-6 text-center hover:bg-card transition group">
                <div className="w-10 h-10 mx-auto mb-4 border border-[var(--gold)]/40 rotate-45 flex items-center justify-center group-hover:border-[var(--gold)] transition">
                  <div className="w-2 h-2 bg-[var(--gold)] -rotate-45" />
                </div>
                <h3 className="font-display text-base text-[var(--gold-soft)] mb-2 uppercase tracking-wider">{ex.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{ex.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* EXCLUSIVITY STATS */}
      <section className="py-24 relative">
        <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-radial-glow)" }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="border border-[var(--gold)]/30 bg-card/60 backdrop-blur p-10 md:p-16">
            <div className="text-center mb-12">
              <h3 className="font-display text-3xl md:text-5xl">
                <span className="text-gold-gradient">Exclusivity</span> by Design
              </h3>
              <p className="text-muted-foreground mt-3 italic">Because true luxury isn't for everyone.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div>
                <div className="font-display text-6xl text-gold-gradient">70</div>
                <div className="text-xs tracking-[0.3em] text-muted-foreground mt-3">EXCLUSIVE INVITATIONS</div>
              </div>
              <div className="md:border-x border-[var(--gold)]/20">
                <div className="font-display text-6xl text-gold-gradient">₹1,000</div>
                <div className="text-xs tracking-[0.3em] text-muted-foreground mt-3">PER PERSON</div>
              </div>
              <div>
                <div className="font-display text-6xl text-gold-gradient">2–3 Hrs</div>
                <div className="text-xs tracking-[0.3em] text-muted-foreground mt-3">OF PURE LUXURY</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* QUOTE */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-display italic text-3xl md:text-5xl leading-tight text-[var(--gold-soft)]">
            "Not everyone gets a seat."
          </p>
          <Divider />
          <p className="text-xs tracking-[0.5em] text-muted-foreground">
            AN UNFORGETTABLE EVENING OF CINEMA · CONVERSATIONS · CLASS
          </p>
        </div>
      </section>
      {/* CTA / BOOK */}
      <section id="book" className="py-28 relative border-t border-[var(--gold)]/20">
        <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-radial-glow)" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <p className="text-[var(--gold)] text-xs tracking-[0.5em] mb-6">INVITE-ONLY REGISTRATION</p>
          <h2 className="font-display text-5xl md:text-7xl mb-6">
            Claim Your <span className="text-gold-gradient italic">Seat</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-4 leading-relaxed">
            Christopher Nolan's <em>The Odyssey</em> — an intimate premiere with Damon, Holland, Hathaway, Pattinson, Nyong'o, Zendaya & Theron on screen.
          </p>
          <p className="text-sm text-[var(--gold-soft)] mb-8 tracking-widest">
            18 JULY 2026  ·  7:55 PM  ·  CONNPLEX LUXURIANCE CINEMAS
          </p>

          {/* Premium Billing/Registration Form */}
          <div className="max-w-md mx-auto p-8 border border-[var(--gold)]/25 bg-card/60 backdrop-blur rounded-sm text-left mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-muted-foreground mb-1">FULL NAME</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Gaurav Kumar"
                  className="w-full bg-background border border-[var(--gold)]/25 px-4 py-2.5 text-sm rounded-sm text-foreground focus:outline-none focus:border-[var(--gold)] transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-muted-foreground mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="gaurav.kumar@example.com"
                  className="w-full bg-background border border-[var(--gold)]/25 px-4 py-2.5 text-sm rounded-sm text-foreground focus:outline-none focus:border-[var(--gold)] transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-muted-foreground mb-1">CONTACT NUMBER</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="9999999999"
                  className="w-full bg-background border border-[var(--gold)]/25 px-4 py-2.5 text-sm rounded-sm text-foreground focus:outline-none focus:border-[var(--gold)] transition"
                  required
                />
              </div>
              <button
                onClick={handlePayment}
                disabled={isPaying}
                className="w-full mt-6 inline-block text-center btn-gold hover:[&]:btn-gold-hover py-4 rounded-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPaying ? "Processing..." : "Book Now - ₹1,000"}
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground tracking-widest">Only 70 invitations available</p>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="border-t border-[var(--gold)]/20 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-widest text-gold-gradient">CONNPLEX</span>
            <span className="text-[9px] tracking-[0.35em] text-muted-foreground">LUXURIANCE CINEMAS</span>
          </div>
          <p className="text-xs text-muted-foreground tracking-widest">© 2026 · PREMIER NIGHTS · EXCLUSIVE · PRIVATE · EXTRAORDINARY</p>
        </div>
      </footer>
    </div>
  );
}
