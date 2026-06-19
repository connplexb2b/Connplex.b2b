'use client';

import React, { useEffect } from 'react';
import './feedback.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

const FeedbackPage = () => {
    useEffect(() => {
        // 3. TEXTAREA CHARACTER COUNTER
        const messageTextarea = document.getElementById('message') as HTMLTextAreaElement;
        const charCounter = document.getElementById('char-counter');
        const maxChars = 1000;

        if (messageTextarea && charCounter) {
            messageTextarea.addEventListener('input', () => {
                const currentLength = messageTextarea.value.length;
                charCounter.textContent = `${currentLength}/${maxChars}`;

                if (currentLength >= maxChars * 0.9) {
                    charCounter.style.color = '#ff6b6b';
                    charCounter.style.fontWeight = 'bold';
                } else if (currentLength > 0) {
                    charCounter.style.color = 'var(--gold-primary)';
                    charCounter.style.fontWeight = 'normal';
                } else {
                    charCounter.style.color = 'rgba(138, 136, 133, 0.6)';
                    charCounter.style.fontWeight = 'normal';
                }
            });
        }

        // 4. MAIN FEEDBACK FORM SUBMISSION HANDLER
        const mainForm = document.getElementById('feedback-main-form') as HTMLFormElement;
        const successBox = document.getElementById('feedback-success-box');
        const resetFormBtn = document.getElementById('btn-reset-feedback');
        const formHeaderBlock = document.querySelector('.form-header-block') as HTMLElement;

        if (mainForm && successBox) {
            mainForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = mainForm.querySelector('.btn-submit-feedback') as HTMLButtonElement;
                const originalText = submitBtn.innerHTML;

                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.75';
                submitBtn.innerHTML = 'TRANSMITTING FEEDBACK...';

                const formData = new FormData(mainForm);
                const payload = {
                    fullName: formData.get('fullname'),
                    email: formData.get('email'),
                    phone: formData.get('phone') || '',
                    location: formData.get('location') || '',
                    feedbackType: formData.get('feedback_type'),
                    message: formData.get('message')
                };

                try {
                    const apiUrl = getApiUrl();
                    const response = await fetch(`${apiUrl}/api/forms/feedback`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.message || 'Submission failed. Please try again.');
                    }

                    // Submit to Zoho CRM in the background (Web-to-Lead)
                    try {
                        const fullNameVal = (payload.fullName as string || '').trim();
                        const nameParts = fullNameVal.split(' ');
                        const firstName = nameParts[0] || '';
                        const lastName = nameParts.slice(1).join(' ') || 'Unknown';

                        const zohoParams = new URLSearchParams();
                        zohoParams.append('xnQsjsdp', '373ea6cb21a136eb888d485bcdfd95c79e0554155268c9bd4c8e21d0830919bf');
                        zohoParams.append('xmIwtLD', '75b4402a483830be0619a44a8ec6e6d3b4f27a8f20958e76426d6f7ccfd02c4ab2976885c782b6cefe723be666af60e8');
                        zohoParams.append('actionType', 'TGVhZHM=');
                        zohoParams.append('returnURL', 'null');

                        zohoParams.append('First Name', firstName);
                        zohoParams.append('Last Name', lastName);
                        zohoParams.append('Email', payload.email as string || '');
                        zohoParams.append('Phone', payload.phone as string || '');
                        zohoParams.append('Company', fullNameVal || 'Individual'); // Mandatory in Zoho Lead
                        zohoParams.append('Lead Source', 'Feedback Website Form');
                        zohoParams.append('Description', payload.message as string || '');

                        // Custom fields for Feedback
                        zohoParams.append('LEADCF153', payload.location as string || '');
                        zohoParams.append('LEADCF154', payload.feedbackType as string || '');
                        zohoParams.append('aG9uZXlwb3Q', '');

                        console.log('Submitting Feedback to Zoho CRM...');
                        fetch('https://crm.zoho.in/crm/WebToLeadForm', {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: zohoParams.toString(),
                        })
                            .then(() => console.log('Zoho CRM Feedback submission request dispatched successfully'))
                            .catch(err => console.error('Zoho CRM Feedback dispatch failed:', err));
                    } catch (zohoErr) {
                        console.error('Failed to prepare Zoho CRM Feedback payload:', zohoErr);
                    }

                    mainForm.style.display = 'none';
                    if (formHeaderBlock) formHeaderBlock.style.display = 'none';
                    successBox.style.display = 'flex';

                    const feedbackSection = document.querySelector('.feedback-form-container');
                    if (feedbackSection) {
                        const offsetTop = feedbackSection.getBoundingClientRect().top + window.scrollY - 120;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                } catch (err: any) {
                    console.error('Feedback submission error:', err);
                    alert(err.message || 'Unable to transmit feedback at this time. Please try again.');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.innerHTML = originalText;
                }
            });
        }

        if (resetFormBtn && mainForm && successBox) {
            resetFormBtn.addEventListener('click', () => {
                mainForm.reset();
                
                if (charCounter) {
                    charCounter.textContent = `0/${maxChars}`;
                    charCounter.style.color = 'rgba(138, 136, 133, 0.6)';
                    charCounter.style.fontWeight = 'normal';
                }

                successBox.style.display = 'none';
                mainForm.style.display = 'flex';
                if (formHeaderBlock) formHeaderBlock.style.display = 'block';

                const feedbackSection = document.querySelector('.feedback-form-container');
                if (feedbackSection) {
                    const offsetTop = feedbackSection.getBoundingClientRect().top + window.scrollY - 120;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        }
    }, []);

    return (
        <>
            <Header />
            <div className="feedback-page-wrapper">
                <section className="hero-section" aria-label="Feedback Hero">
                <div className="hero-bg-wrapper">
                    <img src="/feedback/top_image_feedback.jpeg" alt="Connplex Premium Cinema Lounge Bar" className="hero-bg-img" />
                    <div className="hero-overlay"></div>
                </div>

                <div className="hero-container">
                    <div className="hero-text-column">
                        <span className="section-subtitle">WE VALUE YOUR VOICE</span>
                        <h1 className="hero-title animate-title">
                            YOUR FEEDBACK<br />
                            <span className="gold-text">HELPS US IMPROVE.</span>
                        </h1>
                        <div className="hero-divider"></div>
                        <p className="hero-desc">
                            At Connplex, we are committed to providing exceptional experiences. Share your thoughts, suggestions, or concerns with us.
                        </p>
                    </div>
                </div>
            </section>

            <main className="page-wrapper">
                <div className="feedback-layout">
                    
                    <section className="feedback-form-container" aria-label="Feedback Form Section">
                        <div className="form-header-block">
                            <span className="section-subtitle">SHARE YOUR FEEDBACK</span>
                            <p className="form-instructions">Please fill out the form below. We appreciate your time and input.</p>
                        </div>

                        <div className="feedback-success-box" id="feedback-success-box" style={{ display: 'none' }}>
                            <div className="success-icon-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3>THANK YOU FOR YOUR FEEDBACK</h3>
                            <p>Your submission has been received and routed to our Guest Relations Management team. We appreciate you taking the time to share your experience with us.</p>
                            <button className="btn-outline btn-reset-feedback" id="btn-reset-feedback">SUBMIT ANOTHER FORM</button>
                        </div>

                        <form className="feedback-form" id="feedback-main-form">
                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="fullname">FULL NAME <span className="required">*</span></label>
                                    <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" required autoComplete="name" />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="email">EMAIL ADDRESS <span className="required">*</span></label>
                                    <input type="email" id="email" name="email" placeholder="Enter your email address" required autoComplete="email" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="phone">PHONE NUMBER</label>
                                    <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" autoComplete="tel" />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="location">VISIT LOCATION</label>
                                    <div className="select-wrapper">
                                        <select id="location" name="location" defaultValue="">
                                            <option value="" disabled hidden>Select a Connplex location</option>
                                            <option value="Connplex Luxe Mumbai">Connplex Luxe Mumbai</option>
                                            <option value="Connplex Signature Delhi">Connplex Signature Delhi</option>
                                            <option value="Connplex Club Bangalore">Connplex Club Bangalore</option>
                                            <option value="Connplex Royale Hyderabad">Connplex Royale Hyderabad</option>
                                            <option value="Connplex Gold Pune">Connplex Gold Pune</option>
                                            <option value="Connplex Premium Chennai">Connplex Premium Chennai</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-field full-width">
                                <label>FEEDBACK TYPE <span className="required">*</span></label>
                                <div className="feedback-type-grid">
                                    
                                    <label className="feedback-type-card" htmlFor="type-general">
                                        <input type="radio" id="type-general" name="feedback_type" value="General Feedback" required />
                                        <div className="card-ui-content">
                                            <div className="type-icon-wrapper">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                            </div>
                                            <span className="type-label">General Feedback</span>
                                            <div className="custom-radio-dot"></div>
                                        </div>
                                    </label>

                                    <label className="feedback-type-card" htmlFor="type-compliment">
                                        <input type="radio" id="type-compliment" name="feedback_type" value="Compliment" />
                                        <div className="card-ui-content">
                                            <div className="type-icon-wrapper">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                </svg>
                                            </div>
                                            <span className="type-label">Compliment</span>
                                            <div className="custom-radio-dot"></div>
                                        </div>
                                    </label>

                                    <label className="feedback-type-card" htmlFor="type-concern">
                                        <input type="radio" id="type-concern" name="feedback_type" value="Concern" />
                                        <div className="card-ui-content">
                                            <div className="type-icon-wrapper">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                </svg>
                                            </div>
                                            <span className="type-label">Concern</span>
                                            <div className="custom-radio-dot"></div>
                                        </div>
                                    </label>

                                    <label className="feedback-type-card" htmlFor="type-suggestion">
                                        <input type="radio" id="type-suggestion" name="feedback_type" value="Suggestion" />
                                        <div className="card-ui-content">
                                            <div className="type-icon-wrapper">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M9 18h6"></path>
                                                    <path d="M10 22h4"></path>
                                                    <path d="M15.09 14c.18-.34.3-.72.3-1.12 0-1.43-1.07-2.6-2.39-2.6a2.5 2.5 0 0 0-2.39 2.6c0 .4.12.78.3 1.12A3.89 3.89 0 0 1 12 16a3.89 3.89 0 0 1-.91-2z"></path>
                                                    <path d="M12 2v1"></path>
                                                    <path d="M4.93 4.93l.7.7"></path>
                                                    <path d="M19.07 4.93l-.7.7"></path>
                                                    <path d="M2 12h1"></path>
                                                    <path d="M21 12h1"></path>
                                                </svg>
                                            </div>
                                            <span className="type-label">Suggestion</span>
                                            <div className="custom-radio-dot"></div>
                                        </div>
                                    </label>

                                </div>
                            </div>

                            <div className="form-field full-width">
                                <label htmlFor="message">YOUR MESSAGE <span className="required">*</span></label>
                                <div className="textarea-wrapper">
                                    <textarea id="message" name="message" placeholder="Share your feedback with us..." rows={6} maxLength={1000} required></textarea>
                                    <div className="char-counter" id="char-counter">0/1000</div>
                                </div>
                            </div>

                            <div className="form-actions-row">
                                <button type="submit" className="btn-outline btn-submit-feedback">
                                    SUBMIT FEEDBACK <span className="btn-arrow">→</span>
                                </button>
                                <p className="thanks-note">Thank you! Your feedback helps us create better experiences for you.</p>
                            </div>
                        </form>
                    </section>

                    <aside className="support-sidebar" aria-label="Immediate Assistance Information">
                        <div className="sidebar-luxury-card">
                            
                            <div className="card-segment assistance-segment">
                                <div className="sidebar-icon-header">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                    </svg>
                                </div>
                                <h2 className="sidebar-gold-title">NEED IMMEDIATE ASSISTANCE?</h2>
                                <p className="sidebar-subtitle">Our support team is here to help.</p>

                                <div className="support-channels">
                                    <div className="channel-row">
                                        <div className="channel-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                        </div>
                                        <a href="tel:+919924577556" className="channel-text">+91 9924577556</a>
                                    </div>
                                    
                                    <div className="channel-row">
                                        <div className="channel-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </div>
                                        <a href="mailto:feedback@connplex.com" className="channel-text">feedback@connplex.com</a>
                                    </div>

                                    <div className="channel-row">
                                        <div className="channel-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                        </div>
                                        <span className="channel-text font-narrow">Mon - Sun: 10:00 AM - 12:00 AM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-divider"></div>

                            <div className="card-segment commitment-segment">
                                <h3 className="sidebar-gold-title">WE'RE ALL EARS</h3>
                                <p className="commitment-paragraph">Every feedback we receive is carefully reviewed and helps us improve our service, facilities, and overall experience.</p>
                                <p className="commitment-footer">Thank you for being a part of the Connplex community.</p>
                            </div>

                        </div>
                    </aside>

                </div>
            </main>
            </div>
            <Footer />
        </>
    );
};

export default FeedbackPage;
