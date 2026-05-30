'use client';

import React, { useEffect } from 'react';
import './news.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NewsPage = () => {
    useEffect(() => {
        // 2. NEWS DETAILED MODAL DATA STORAGE
        const newsData: Record<string, { date: string, title: string, image: string, body: string, action: string }> = {
            "next-gen-auditorium": {
                date: "20 MAY 2024",
                title: "Connplex Unveils Its Next-Gen Auditorium",
                image: "/news/news_1.jpeg",
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
                action: `<button class="btn-solid" onclick="document.getElementById('news-modal-close-btn').click(); document.getElementById('connect-modal').classList.add('active'); document.getElementById('connect-modal').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';">BOOK TICKETS NOW <span class="btn-arrow">→</span></button>`
            },
            "movie-mania": {
                date: "10 MAY 2024",
                title: "Monthly Movie Mania",
                image: "/news/news_2.jpeg",
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
                action: `<button class="btn-solid" onclick="document.getElementById('news-modal-close-btn').click(); document.getElementById('connect-modal').classList.add('active'); document.getElementById('connect-modal').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';">EXPLORE SHOWTIMES <span class="btn-arrow">→</span></button>`
            },
            "private-screenings": {
                date: "02 MAY 2024",
                title: "Introducing Private Screenings",
                image: "/news/news_3.jpeg",
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
                action: `<button class="btn-solid" onclick="document.getElementById('news-modal-close-btn').click(); document.getElementById('connect-modal').classList.add('active'); document.getElementById('connect-modal').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';">INQUIRE ABOUT PRIVATE SCREENINGS <span class="btn-arrow">→</span></button>`
            },
            "privilege-card": {
                date: "25 APR 2024",
                title: "Privilege Card Benefits Just Got Better!",
                image: "/news/news_4.jpeg",
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
                action: `<button class="btn-solid" onclick="document.getElementById('news-modal-close-btn').click(); document.getElementById('connect-modal').classList.add('active'); document.getElementById('connect-modal').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';">APPLY FOR PRIVILEGE CARD <span class="btn-arrow">→</span></button>`
            }
        };

        // 3. NEWS DETAILS MODAL CONTROLLER
        const newsModal = document.getElementById('news-modal');
        const newsModalOverlay = document.getElementById('news-modal-overlay');
        const newsModalCloseBtn = document.getElementById('news-modal-close-btn');
        
        const modalImage = document.getElementById('modal-image') as HTMLImageElement;
        const modalDate = document.getElementById('modal-date');
        const modalTitle = document.getElementById('modal-title');
        const modalBodyText = document.getElementById('modal-body-text');
        const modalActionRow = document.getElementById('modal-action-row');

        const openNewsModal = (newsId: string) => {
            const item = newsData[newsId];
            if (!item) return;

            if (modalImage) {
                modalImage.src = item.image;
                modalImage.alt = item.title;
            }
            if (modalDate) modalDate.textContent = item.date;
            if (modalTitle) modalTitle.textContent = item.title;
            if (modalBodyText) modalBodyText.innerHTML = item.body;
            if (modalActionRow) modalActionRow.innerHTML = item.action;

            if (newsModal) {
                newsModal.classList.add('active');
                newsModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        };

        const closeNewsModal = () => {
            if (newsModal) {
                newsModal.classList.remove('active');
                newsModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        };

        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            const newsId = card.getAttribute('data-news-id');
            
            card.addEventListener('click', () => {
                if(newsId) openNewsModal(newsId);
            });

            card.addEventListener('keydown', (e: Event) => {
                const keyEvent = e as KeyboardEvent;
                if (keyEvent.key === 'Enter') {
                    if(newsId) openNewsModal(newsId);
                }
            });
        });

        if (newsModalCloseBtn) newsModalCloseBtn.addEventListener('click', closeNewsModal);
        if (newsModalOverlay) newsModalOverlay.addEventListener('click', closeNewsModal);

        // 4. CONNECT ENQUIRY FORM MODAL CONTROLLER
        const connectModal = document.getElementById('connect-modal');
        const connectModalOverlay = document.getElementById('connect-modal-overlay');
        const connectModalCloseBtn = document.getElementById('connect-modal-close-btn');
        const connectForm = document.getElementById('connect-form') as HTMLFormElement;
        const connectSuccess = document.getElementById('connect-success');
        const connectSuccessCloseBtn = document.getElementById('btn-connect-success-close');
        
        const openConnectModal = () => {
            if (connectForm) connectForm.reset();
            if (connectForm) connectForm.style.display = 'flex';
            if (connectSuccess) connectSuccess.style.display = 'none';

            if (connectModal) {
                connectModal.classList.add('active');
                connectModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        };

        const closeConnectModal = () => {
            if (connectModal) {
                connectModal.classList.remove('active');
                connectModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        };

        if (connectModalCloseBtn) connectModalCloseBtn.addEventListener('click', closeConnectModal);
        if (connectModalOverlay) connectModalOverlay.addEventListener('click', closeConnectModal);
        if (connectSuccessCloseBtn) connectSuccessCloseBtn.addEventListener('click', closeConnectModal);

        window.addEventListener('keydown', (e: Event) => {
            const keyEvent = e as KeyboardEvent;
            if (keyEvent.key === 'Escape') {
                if (newsModal && newsModal.classList.contains('active')) closeNewsModal();
                if (connectModal && connectModal.classList.contains('active')) closeConnectModal();
            }
        });

        if (connectForm) {
            connectForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const submitBtn = connectForm.querySelector('.btn-submit-connect') as HTMLButtonElement;
                if(!submitBtn) return;
                const originalText = submitBtn.innerHTML;

                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.75';
                submitBtn.innerHTML = 'TRANSMITTING ENQUIRY...';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.innerHTML = originalText;

                    connectForm.style.display = 'none';
                    if (connectSuccess) connectSuccess.style.display = 'flex';

                    const modalContainer = connectModal?.querySelector('.modal-container-small');
                    if (modalContainer) {
                        modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }, 1000);
            });
        }

        // 5. NEWSLETTER CLUB SUBSCRIPTION HANDLER
        const subscribeForm = document.getElementById('news-subscribe-form') as HTMLFormElement;
        const subscribeSuccess = document.getElementById('subscription-success');

        if (subscribeForm) {
            subscribeForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const subscribeBtn = subscribeForm.querySelector('.btn-subscribe') as HTMLButtonElement;
                if(!subscribeBtn) return;
                const originalText = subscribeBtn.innerHTML;

                subscribeBtn.disabled = true;
                subscribeBtn.style.opacity = '0.75';
                subscribeBtn.innerHTML = 'JOINING...';

                setTimeout(() => {
                    subscribeBtn.disabled = false;
                    subscribeBtn.style.opacity = '1';
                    subscribeBtn.innerHTML = originalText;

                    subscribeForm.style.display = 'none';
                    if (subscribeSuccess) subscribeSuccess.style.display = 'flex';
                }, 1000);
            });
        }
    }, []);

    return (
        <div className="news-page-wrapper">
            <Header />
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
                        <button className="btn-outline-news" onClick={() => { window.location.href = '#newsletter-section' }}>
                            VIEW ALL NEWS <span className="arrow">→</span>
                        </button>
                    </div>

                    <div className="news-grid">
                        <article className="news-card" data-news-id="next-gen-auditorium" tabIndex={0}
                            aria-label="Read more about Next-Gen Auditorium">
                            <div className="news-card-image-wrapper">
                                <img src="/news/news_1.jpeg" alt="Connplex Next-Gen Auditorium Screen and Recliners"
                                    className="news-card-img" />
                                <div className="card-overlay"></div>
                            </div>
                            <div className="news-card-content">
                                <time className="news-card-date" dateTime="2024-05-20">20 MAY 2024</time>
                                <h3 className="news-card-title">Connplex Unveils Its Next-Gen Auditorium</h3>
                                <p className="news-card-desc">A new era of cinematic luxury is here. Experience bigger screens, immersive sound, and unmatched comfort.</p>
                                <div className="news-card-footer">
                                    <span className="news-card-arrow" aria-hidden="true">→</span>
                                </div>
                            </div>
                        </article>

                        <article className="news-card" data-news-id="movie-mania" tabIndex={0}
                            aria-label="Read more about Monthly Movie Mania">
                            <div className="news-card-image-wrapper">
                                <img src="/news/news_2.jpeg" alt="Gourmet Cinema Popcorn and Soda Bundle"
                                    className="news-card-img" />
                                <div className="card-overlay"></div>
                            </div>
                            <div className="news-card-content">
                                <time className="news-card-date" dateTime="2024-05-10">10 MAY 2024</time>
                                <h3 className="news-card-title">Monthly Movie Mania</h3>
                                <p className="news-card-desc">Enjoy amazing films at exclusive prices all month long. Don't miss out on the magic!</p>
                                <div className="news-card-footer">
                                    <span className="news-card-arrow" aria-hidden="true">→</span>
                                </div>
                            </div>
                        </article>

                        <article className="news-card" data-news-id="private-screenings" tabIndex={0}
                            aria-label="Read more about Private Screenings">
                            <div className="news-card-image-wrapper">
                                <img src="/news/news_3.jpeg" alt="Luxury Private Cinema Screen Setup"
                                    className="news-card-img" />
                                <div className="card-overlay"></div>
                            </div>
                            <div className="news-card-content">
                                <time className="news-card-date" dateTime="2024-05-02">02 MAY 2024</time>
                                <h3 className="news-card-title">Introducing Private Screenings</h3>
                                <p className="news-card-desc">Celebrate your special moments with personalized screenings in a luxurious setting.</p>
                                <div className="news-card-footer">
                                    <span className="news-card-arrow" aria-hidden="true">→</span>
                                </div>
                            </div>
                        </article>

                        <article className="news-card" data-news-id="privilege-card" tabIndex={0}
                            aria-label="Read more about Privilege Card Benefits">
                            <div className="news-card-image-wrapper">
                                <img src="/news/news_4.jpeg" alt="Connplex Premium Privilege Membership Card"
                                    className="news-card-img" />
                                <div className="card-overlay"></div>
                            </div>
                            <div className="news-card-content">
                                <time className="news-card-date" dateTime="2024-04-25">25 APR 2024</time>
                                <h3 className="news-card-title">Privilege Card Benefits Just Got Better!</h3>
                                <p className="news-card-desc">More rewards, more experiences, more reasons to be a part of the Connplex family.</p>
                                <div className="news-card-footer">
                                    <span className="news-card-arrow" aria-hidden="true">→</span>
                                </div>
                            </div>
                        </article>
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

                            <form className="newsletter-form" id="news-subscribe-form" noValidate>
                                <div className="form-group-row">
                                    <input type="email" className="newsletter-input" placeholder="ENTER YOUR EMAIL ADDRESS"
                                        aria-label="Email address for subscription" required />
                                    <button type="submit" className="btn-solid btn-subscribe">
                                        SUBSCRIBE NOW <span className="btn-arrow">→</span>
                                    </button>
                                </div>
                            </form>

                            <div className="subscription-success" id="subscription-success" style={{ display: 'none' }} role="alert">
                                <svg className="success-check" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>WELCOME! YOU HAVE SUCCESSFULLY SUBSCRIBED TO CONNPLEX PRIVILEGES.</span>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <div className="news-modal" id="news-modal" aria-hidden="true" role="dialog" aria-modal="true"
                aria-labelledby="modal-title">
                <div className="news-modal-overlay" id="news-modal-overlay"></div>
                <div className="modal-container">
                    <button className="news-modal-close-btn" id="news-modal-close-btn" aria-label="Close modal">×</button>
                    <div className="modal-image-wrapper">
                        <img alt="" id="modal-image" />
                        <div className="modal-image-overlay"></div>
                    </div>
                    <div className="modal-details-content">
                        <span className="modal-date" id="modal-date"></span>
                        <h2 className="modal-title" id="modal-title"></h2>
                        <div className="modal-body-text" id="modal-body-text">
                        </div>
                        <div className="modal-action-row" id="modal-action-row">
                        </div>
                    </div>
                </div>
            </div>

            <div className="news-modal" id="connect-modal" aria-hidden="true" role="dialog" aria-modal="true"
                aria-labelledby="connect-modal-title">
                <div className="news-modal-overlay" id="connect-modal-overlay"></div>
                <div className="modal-container modal-container-small">
                    <button className="news-modal-close-btn" id="connect-modal-close-btn" aria-label="Close modal">×</button>
                    <div className="modal-details-content">
                        <h2 className="modal-title" id="connect-modal-title">LET'S CONNECT</h2>
                        <p className="connect-subtitle">Have a question or looking to book a premium event? Complete this short enquiry form, and our VIP concierge will reach out to you within 24 hours.</p>

                        <form className="connect-form" id="connect-form" noValidate>
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
                            <button type="submit" className="btn-solid btn-submit-connect" style={{ width: '100%', justifyContent: 'center' }}>
                                SUBMIT VIP INQUIRY <span className="btn-arrow">→</span>
                            </button>
                        </form>

                        <div className="connect-success" id="connect-success" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', padding: '2rem 0' }}>
                            <div className="success-icon-wrapper" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(223, 185, 115, 0.1)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="success-title" style={{ color: 'var(--text-white)', fontSize: '1.4rem', letterSpacing: '1px', fontWeight: 600, textTransform: 'uppercase' }}>Inquiry Submitted</h3>
                            <p className="success-message" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '360px' }}>Your VIP details have been securely transmitted to our corporate desk. An executive curator will call or email you shortly.</p>
                            <button type="button" className="btn-outline" id="btn-connect-success-close" style={{ marginTop: '1rem' }}>CLOSE WINDOW</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NewsPage;
