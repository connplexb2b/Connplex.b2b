'use client';

import React, { useEffect, useState } from 'react';
import './news.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

interface Article {
  _id?: string;
  slug: string;
  title: string;
  date: string;
  shortDesc: string;
  imagePath: string;
  body: string;
  isActive: boolean;
  order: number;
  buttonText?: string;
}

const DEFAULT_NEWS: Article[] = [
  {
    slug: "next-gen-auditorium",
    date: "20 MAY 2024",
    title: "Connplex Unveils Its Next-Gen Auditorium",
    imagePath: "/news/news_1.jpeg",
    shortDesc: "A new era of cinematic luxury is here. Experience bigger screens, immersive sound, and unmatched comfort.",
    body: `
        <p><strong>Connplex Cinemas is proud to announce the official launch of our Next-Generation Auditorium, setting a new benchmark for cinematic luxury in India.</strong></p>
        <p>Designed for the ultimate film connoisseur, the new auditorium features a state-of-the-art 4K Dual Laser Projection system that delivers stunning contrast, incredible brightness, and millions of vibrant colors. Accompanying this visual masterpiece is a customized 64-channel Dolby Atmos sound system, enveloping the audience in realistic audio from all directions.</p>
        <p>But the innovation doesn't stop at screen and sound. The auditorium offers premium leather recliners with private USB charging ports, heated seating options, and an integrated waiter-on-call service so you can enjoy gourmet meals during your movie without leaving your seat.</p>
        <ul>
            <li><span><strong>Visuals:</strong> Dual Laser 4K Projection System with HDR10 support.</span></li>
            <li><span><strong>Acoustics:</strong> 64-Channel immersive Dolby Atmos surround sound.</span></li>
            <li><span><strong>Seating:</strong> Premium plush Italian leather full-recliners.</span></li>
            <li><span><strong>Service:</strong> Personal digital butler for in-seat gourmet dining.</span></li>
        </ul>
        <p>Experience the future of movies today. Bookings are now open for all upcoming blockbuster releases.</p>
    `,
    buttonText: "BOOK TICKETS NOW",
    isActive: true,
    order: 0
  },
  {
    slug: "movie-mania",
    date: "10 MAY 2024",
    title: "Monthly Movie Mania",
    imagePath: "/news/news_2.jpeg",
    shortDesc: "Enjoy amazing films at exclusive prices all month long. Don't miss out on the magic!",
    body: `
        <p><strong>Unleash your passion for cinema with our monthly Movie Mania, featuring unprecedented ticket pricing, exclusive combos, and double loyalty rewards.</strong></p>
        <p>Every Tuesday and Thursday throughout the month, Connplex Premium Cinemas invites you to experience selected masterpieces at a flat price. This promotion is designed to celebrate both Hollywood blockbusters and regional cinema favorites, making high-end movie-going accessible to all our patrons.</p>
        <p>Additionally, our concession stands are offering a 30% discount on gourmet snack combos, including our famous golden truffle popcorn and bespoke sparkling mocktails. Connplex Privilege members will also earn double reward points on all purchases made during Movie Mania days.</p>
        <ul>
            <li><span><strong>Flat Ticket Prices</strong> on all standard screenings every Tuesday & Thursday.</span></li>
            <li><span><strong>30% Off</strong> on all gourmet concession combos.</span></li>
            <li><span><strong>Double Reward Points</strong> for Privilege Card members.</span></li>
            <li><span><strong>Exclusive Giveaways</strong> during select weekend screenings.</span></li>
        </ul>
        <p>Gather your family and friends, and join us to indulge in pure cinematic joy. Terms and conditions apply.</p>
    `,
    buttonText: "EXPLORE SHOWTIMES",
    isActive: true,
    order: 1
  },
  {
    slug: "private-screenings",
    date: "02 MAY 2024",
    title: "Introducing Private Screenings",
    imagePath: "/news/news_3.jpeg",
    shortDesc: "Celebrate your special moments with personalized screenings in a luxurious setting.",
    body: `
        <p><strong>Transform your next gathering into an extraordinary red-carpet event with Connplex Private Screenings.</strong></p>
        <p>Whether you are celebrating a milestone birthday, hosting a corporate product launch, or planning an intimate family reunion, our private cinema rentals offer an unmatched level of privacy, luxury, and customization. You can choose to screen the latest theatrical releases, classic movies, or even stream personal gaming tournaments on the giant silver screen.</p>
        <p>Our dedicated events team will curate every detail of your evening, from custom red-carpet arrivals and ambient floral design to a tailored multi-course menu prepared by our executive chefs.</p>
        <ul>
            <li><span><strong>Exclusive Cinema Access:</strong> Fully private auditorium hire.</span></li>
            <li><span><strong>Custom Playlists:</strong> Latest blockbusters, timeless classics, or gaming setups.</span></li>
            <li><span><strong>Bespoke Catering:</strong> Tailored menus, fine wines, and artisanal mocktails.</span></li>
            <li><span><strong>Red Carpet Service:</strong> VIP entrance, photography, and dedicated event butler.</span></li>
        </ul>
        <p>Let us create memories that last a lifetime. Get in touch with our event curators today to request a quote.</p>
    `,
    buttonText: "INQUIRE ABOUT PRIVATE SCREENINGS",
    isActive: true,
    order: 2
  },
  {
    slug: "privilege-card",
    date: "25 APR 2024",
    title: "Privilege Card Benefits Just Got Better!",
    imagePath: "/news/news_4.jpeg",
    shortDesc: "More rewards, more experiences, more reasons to be a part of the Connplex family.",
    body: `
        <p><strong>Elevate your lifestyle with the newly enhanced Connplex Privilege Membership, offering a gateway to ultimate cinema luxury.</strong></p>
        <p>We are delighted to introduce a premium suite of privileges designed to reward our most loyal patrons. The Connplex Privilege Card is not just a loyalty program; it is your passport to curated entertainment, offering priority booking, exclusive lounge access, and premium ticket upgrades.</p>
        <p>New cardholders will immediately receive complimentary welcome vouchers, free popcorn upgrades, and invitations to exclusive member-only advance movie previews. Experience cinema the way it was always meant to be experienced.</p>
        <ul>
            <li><span><strong>15% Reward Back:</strong> Earn points on every ticket and concession spend.</span></li>
            <li><span><strong>Priority Lounge Access:</strong> Relax in luxury before your show starts.</span></li>
            <li><span><strong>Free Ticket Upgrades:</strong> Complimentary upgrades to gold recliner seating.</span></li>
            <li><span><strong>Advance Previews:</strong> Invites to exclusive screenings before official release.</span></li>
        </ul>
        <p>Apply for your Connplex Privilege Card online or visit any of our box office locations to join today.</p>
    `,
    buttonText: "APPLY FOR PRIVILEGE CARD",
    isActive: true,
    order: 3
  }
];

const NewsPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
    const [enquirySuccess, setEnquirySuccess] = useState(false);
    const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/admin/news');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setArticles(data);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch news:", err);
            }
            setArticles(DEFAULT_NEWS);
            setLoading(false);
        };
        fetchNews();
    }, []);

    useEffect(() => {
        if (selectedArticle || isConnectModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedArticle, isConnectModalOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedArticle(null);
                setIsConnectModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleConnectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmittingEnquiry(true);

        const form = e.currentTarget;
        const fullName = (form.querySelector('#connect-name') as HTMLInputElement)?.value;
        const email = (form.querySelector('#connect-email') as HTMLInputElement)?.value;
        const phone = (form.querySelector('#connect-phone') as HTMLInputElement)?.value;
        const subject = (form.querySelector('#connect-interest') as HTMLSelectElement)?.value;
        const message = (form.querySelector('#connect-message') as HTMLTextAreaElement)?.value;

        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/api/forms/general-inquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, phone, subject, message }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Submission failed. Please try again.');
            }

            setEnquirySuccess(true);
            const modalContainer = document.querySelector('.modal-container-small');
            if (modalContainer) {
                modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err: any) {
            console.error('Enquiry submission error:', err);
            alert(err.message || 'Unable to process your enquiry at this time. Please try again.');
        } finally {
            setSubmittingEnquiry(false);
        }
    };

    const handleSubscribeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmittingNewsletter(true);

        const form = e.currentTarget;
        const emailInput = form.querySelector('.newsletter-input') as HTMLInputElement;
        const email = emailInput?.value;

        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/api/forms/newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Subscription failed. Please try again.');
            }

            setNewsletterSuccess(true);
        } catch (err: any) {
            console.error('Newsletter subscription error:', err);
            alert(err.message || 'Unable to join newsletter at this time. Please try again.');
        } finally {
            setSubmittingNewsletter(false);
        }
    };

    return (
        <>
            <Header />
            <div className="news-page-wrapper">
                <section className="hero-section" aria-label="News & Promotions Hero">
                    <div className="hero-bg-wrapper">
                        <img src="/news/top_image.jpeg" alt="Connplex Premium Cinema Lobby Lounge" className="hero-bg-img" />
                        <div className="hero-overlay"></div>
                    </div>

                    <div className="hero-container">
                        <div className="hero-text-column">
                            <span className="section-subtitle">NEWS & UPCOMING PROMOTIONS</span>
                            <h1 className="hero-title">
                                STAY UPDATED.<br />
                                <span className="gold-text">STAY INSPIRED.</span>
                            </h1>
                            <div className="hero-divider"></div>
                            <p className="hero-desc">
                                Discover the latest from Connplex Cinemas — exciting announcements, special offers, and
                                experiences designed for you.
                            </p>
                        </div>
                    </div>
                </section>

                <main className="page-wrapper">
                    <section className="news-section" aria-labelledby="latest-news-title">
                        <div className="news-header">
                            <div className="title-with-line">
                                <h2 className="section-title" id="latest-news-title">LATEST NEWS</h2>
                                <span className="gold-line" aria-hidden="true"></span>
                            </div>
                            <button className="btn-outline-news" onClick={() => { document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                VIEW ALL NEWS <span className="arrow">→</span>
                            </button>
                        </div>

                        <div className="news-grid">
                            {loading ? (
                                <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '2px' }}>LOADING LATEST NEWS...</p>
                            ) : articles.length === 0 ? (
                                <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '1px' }}>NO NEWS ARTICLES AVAILABLE AT THE MOMENT.</p>
                            ) : (
                                articles.map((article) => (
                                    <article 
                                        key={article.slug}
                                        className="news-card" 
                                        data-news-id={article.slug} 
                                        tabIndex={0}
                                        onClick={() => setSelectedArticle(article)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setSelectedArticle(article);
                                            }
                                        }}
                                        aria-label={`Read more about ${article.title}`}
                                    >
                                        <div className="news-card-image-wrapper">
                                            <img src={article.imagePath || "/news/news_1.jpeg"} alt={article.title} className="news-card-img" />
                                            <div className="card-overlay"></div>
                                        </div>
                                        <div className="news-card-content">
                                            <time className="news-card-date">{article.date}</time>
                                            <h3 className="news-card-title">{article.title}</h3>
                                            <p className="news-card-desc">{article.shortDesc}</p>
                                            <div className="news-card-footer">
                                                <span className="news-card-arrow" aria-hidden="true">→</span>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="newsletter-section" id="newsletter-section" aria-labelledby="newsletter-title">
                        <div className="newsletter-card">
                            <div className="newsletter-content">
                                <h2 className="newsletter-title" id="newsletter-title">JOIN THE LUXURY CINEMA CLUB</h2>
                                <p className="newsletter-desc">
                                    Subscribe to receive early notifications of special ticket offers, premium launches,
                                    and private VIP cinema updates straight to your inbox.
                                </p>

                                {!newsletterSuccess ? (
                                    <form className="newsletter-form" id="news-subscribe-form" onSubmit={handleSubscribeSubmit} noValidate>
                                        <div className="form-group-row">
                                            <input type="email" className="newsletter-input" placeholder="ENTER YOUR EMAIL ADDRESS"
                                                aria-label="Email address for subscription" required />
                                            <button type="submit" className="btn-solid btn-subscribe" disabled={submittingNewsletter}>
                                                {submittingNewsletter ? 'JOINING...' : 'SUBSCRIBE NOW'} <span className="btn-arrow">→</span>
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="subscription-success" id="subscription-success" style={{ display: 'flex' }} role="alert">
                                        <svg className="success-check" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span>WELCOME! YOU HAVE SUCCESSFULLY SUBSCRIBED TO CONNPLEX PRIVILEGES.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                <div className={`news-modal ${selectedArticle ? 'active' : ''}`} id="news-modal" aria-hidden={!selectedArticle} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="news-modal-overlay" id="news-modal-overlay" onClick={() => setSelectedArticle(null)}></div>
                    <div className="modal-container">
                        <button className="news-modal-close-btn" id="news-modal-close-btn" aria-label="Close modal" onClick={() => setSelectedArticle(null)}>×</button>
                        {selectedArticle && (
                            <>
                                <div className="modal-image-wrapper">
                                    <img src={selectedArticle.imagePath} alt={selectedArticle.title} id="modal-image" />
                                    <div className="modal-image-overlay"></div>
                                </div>
                                <div className="modal-details-content">
                                    <span className="modal-date" id="modal-date">{selectedArticle.date}</span>
                                    <h2 className="modal-title" id="modal-title">{selectedArticle.title}</h2>
                                    <div className="modal-body-text" id="modal-body-text" dangerouslySetInnerHTML={{ __html: selectedArticle.body }}></div>
                                    <div className="modal-action-row" id="modal-action-row">
                                        <button 
                                            className="btn-solid" 
                                            onClick={() => {
                                                setSelectedArticle(null);
                                                setIsConnectModalOpen(true);
                                            }}
                                        >
                                            {selectedArticle.buttonText || "LET'S CONNECT"} <span className="btn-arrow">→</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={`news-modal ${isConnectModalOpen ? 'active' : ''}`} id="connect-modal" aria-hidden={!isConnectModalOpen} role="dialog" aria-modal="true" aria-labelledby="connect-modal-title">
                    <div className="news-modal-overlay" id="connect-modal-overlay" onClick={() => setIsConnectModalOpen(false)}></div>
                    <div className="modal-container modal-container-small">
                        <button className="news-modal-close-btn" id="connect-modal-close-btn" aria-label="Close modal" onClick={() => setIsConnectModalOpen(false)}>×</button>
                        <div className="modal-details-content">
                            <h2 className="modal-title" id="connect-modal-title">LET'S CONNECT</h2>
                            <p className="connect-subtitle">Have a question or looking to book a premium event? Complete this short enquiry form, and our VIP concierge will reach out to you within 24 hours.</p>

                            {!enquirySuccess ? (
                                <form className="connect-form" id="connect-form" onSubmit={handleConnectSubmit} noValidate>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="connect-name">YOUR FULL NAME</label>
                                            <input type="text" id="connect-name" placeholder="John Doe" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="connect-email">EMAIL ADDRESS</label>
                                            <input type="email" id="connect-email" placeholder="john@example.com" required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="connect-phone">PHONE NUMBER</label>
                                            <input type="tel" id="connect-phone" placeholder="+91 99999 99999" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="connect-interest">INTERESTED IN</label>
                                            <select id="connect-interest" required defaultValue="">
                                                <option value="" disabled>SELECT REASON</option>
                                                <option value="Private Booking">Private Screening Booking</option>
                                                <option value="Franchise">Franchise Inquiry</option>
                                                <option value="Privilege Card">Privilege Membership</option>
                                                <option value="General Support">General Cinema Feedback</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="connect-message">ENQUIRY DETAILS</label>
                                        <textarea id="connect-message" rows={4} placeholder="How can our concierge assist you today?"
                                            required></textarea>
                                    </div>
                                    <button type="submit" className="btn-solid btn-submit-connect" style={{ width: '100%', justifyContent: 'center' }} disabled={submittingEnquiry}>
                                        {submittingEnquiry ? 'TRANSMITTING ENQUIRY...' : 'SUBMIT VIP INQUIRY'} <span className="btn-arrow">→</span>
                                    </button>
                                </form>
                            ) : (
                                <div className="connect-success" id="connect-success" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', padding: '2rem 0' }}>
                                    <div className="success-icon-wrapper" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(223, 185, 115, 0.1)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <h3 className="success-title" style={{ color: 'var(--text-white)', fontSize: '1.4rem', letterSpacing: '1px', fontWeight: 600, textTransform: 'uppercase' }}>Inquiry Submitted</h3>
                                    <p className="success-message" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '360px' }}>Your VIP details have been securely transmitted to our corporate desk. An executive curator will call or email you shortly.</p>
                                    <button type="button" className="btn-outline" id="btn-connect-success-close" onClick={() => { setIsConnectModalOpen(false); setEnquirySuccess(false); }} style={{ marginTop: '1rem' }}>CLOSE WINDOW</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NewsPage;
