'use client';

import React, { useEffect } from 'react';
import './career.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CareerPage = () => {
    useEffect(() => {
        // 2. SMOOTH SCROLLING FOR BUTTONS
        const scrollButtons = document.querySelectorAll('.scroll-to-jobs');
        const openingsSection = document.getElementById('openings-section');

        scrollButtons.forEach(btn => { 
            btn.addEventListener('click', () => {
                if (openingsSection) {
                    const navHeight = document.querySelector('.navbar')?.clientHeight || 80;
                    const sectionPosition = openingsSection.getBoundingClientRect().top + window.scrollY;
                    
                    window.scrollTo({
                        top: sectionPosition - navHeight - 20,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 3. APPLICATION MODAL CONTROLS (POP-UP FORM)
        const modal = document.getElementById('application-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const careerForm = document.getElementById('career-form') as HTMLFormElement;
        const successScreen = document.getElementById('modal-success');
        const successCloseBtn = document.getElementById('btn-success-close');
        
        // Modal Text Fields
        const modalJobTitle = document.getElementById('modal-job-title');
        const modalJobMeta = document.getElementById('modal-job-meta');
        
        // Form pre-fill targets
        const formJobId = document.getElementById('form-job-id') as HTMLInputElement;
        const formJobTitle = document.getElementById('form-job-title') as HTMLInputElement;
        const formDeptSelect = document.getElementById('applicant-dept') as HTMLSelectElement;

        const fileUploadZone = document.getElementById('file-upload-zone');
        const fileInput = document.getElementById('applicant-resume') as HTMLInputElement;
        const fileDisplay = document.getElementById('selected-file-display');

        const openModal = (jobId = '', jobTitle = 'General Application', jobDept = '', jobLoc = '') => {
            if (careerForm) {
                careerForm.reset();
                careerForm.style.display = 'flex';
            }
            if (successScreen) successScreen.style.display = 'none';
            if (fileDisplay) {
                fileDisplay.style.display = 'none';
                fileDisplay.innerHTML = '';
            }
            if (fileUploadZone) fileUploadZone.classList.remove('dragover');

            if (jobId) {
                if (formJobId) formJobId.value = jobId;
                if (formJobTitle) formJobTitle.value = jobTitle;
                if (modalJobTitle) modalJobTitle.textContent = jobTitle;
                if (modalJobMeta) modalJobMeta.textContent = `${jobLoc} • ${jobDept}`;
                
                if (formDeptSelect) {
                    for (let i = 0; i < formDeptSelect.options.length; i++) {
                        if (formDeptSelect.options[i].value === jobDept) {
                            formDeptSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            } else {
                if (formJobId) formJobId.value = 'general';
                if (formJobTitle) formJobTitle.value = 'General Profile Submission';
                if (modalJobTitle) modalJobTitle.textContent = 'Let\'s Create Something Great';
                if (modalJobMeta) modalJobMeta.textContent = 'Corporate HQ • General Applications';
                if (formDeptSelect) {
                    formDeptSelect.value = 'Other';
                }
            }

            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
            }
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
        };

        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            const viewBtn = card.querySelector('.btn-view-details');
            
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const jobId = card.getAttribute('data-job-id') || '';
                    const jobTitle = card.getAttribute('data-job-title') || '';
                    const jobDept = card.getAttribute('data-job-dept') || '';
                    const jobLoc = card.getAttribute('data-job-loc') || '';
                    openModal(jobId, jobTitle, jobDept, jobLoc);
                });
            }

            card.addEventListener('click', () => {
                const jobId = card.getAttribute('data-job-id') || '';
                const jobTitle = card.getAttribute('data-job-title') || '';
                const jobDept = card.getAttribute('data-job-dept') || '';
                const jobLoc = card.getAttribute('data-job-loc') || '';
                openModal(jobId, jobTitle, jobDept, jobLoc);
            });
        });

        const ctaSendProfileBtn = document.getElementById('btn-cta-send-profile');
        if (ctaSendProfileBtn) {
            ctaSendProfileBtn.addEventListener('click', () => {
                openModal('', 'Creative Talent Profile', 'Other', 'India Hubs');
            });
        }

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEscape);

        // 4. PREMIUM FILE UPLOAD (DRAG & DROP + INPUT HOOKS)
        if (fileUploadZone && fileInput) {
            fileUploadZone.addEventListener('click', () => {
                fileInput.click();
            });

            const handleFileSelection = (file: File) => {
                if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                        alert('File size exceeds the 10MB limit. Please upload a smaller resume.');
                        fileInput.value = '';
                        if (fileDisplay) {
                            fileDisplay.style.display = 'none';
                            fileDisplay.innerHTML = '';
                        }
                        return;
                    }
                    
                    if (fileDisplay) {
                        fileDisplay.innerHTML = `&#128196; Selected: <strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                        fileDisplay.style.display = 'inline-block';
                    }
                } else {
                    if (fileDisplay) {
                        fileDisplay.style.display = 'none';
                        fileDisplay.innerHTML = '';
                    }
                }
            };

            fileInput.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files.length > 0) {
                    handleFileSelection(target.files[0]);
                }
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                fileUploadZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileUploadZone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'dragend', 'drop'].forEach(eventName => {
                fileUploadZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileUploadZone.classList.remove('dragover');
                }, false);
            });

            fileUploadZone.addEventListener('drop', (e) => {
                const dt = (e as DragEvent).dataTransfer;
                if (dt && dt.files.length > 0) {
                    fileInput.files = dt.files;
                    handleFileSelection(dt.files[0]);
                }
            }, false);
        }

        // 5. INTERACTIVE FORM SUBMISSION HANDLER
        if (careerForm) {
            careerForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const submitBtn = careerForm.querySelector('.btn-submit-app') as HTMLButtonElement;
                if (submitBtn) {
                    const originalBtnContent = submitBtn.innerHTML;
                    
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.75';
                    submitBtn.innerHTML = 'PROCESSING APPLICATION <span class="loader-dots">...</span>';

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = originalBtnContent;
                        
                        careerForm.style.display = 'none';
                        if (successScreen) successScreen.style.display = 'flex';
                        
                        const modalContainer = document.querySelector('.modal-container');
                        if (modalContainer) {
                            modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 1200);
                }
            });
        }

        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', closeModal);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className="career-page">
            <Header />
            {/* Hero Section */}
            <section className="hero-section" aria-label="Careers Hero">
                <div className="hero-bg-wrapper">
                    <img src="/career/Top page image.jpeg" alt="Cinema film projector background" className="hero-bg-img" />
                    <div className="hero-overlay"></div>
                </div>

                <div className="hero-container">
                    <div className="hero-text-column">
                        <span className="section-subtitle">CAREERS AT CONNPLEX</span>
                        <h1 className="hero-title animate-title">
                            SHAPE STORIES.<br />
                            SHAPE <span className="gold-text">THE FUTURE.</span>
                        </h1>
                        <div className="hero-divider"></div>
                        <p className="hero-desc">
                            At Connplex, cinema is more than entertainment—it’s an experience that stays with you. Be part of a
                            team that’s redefining luxury, innovation, and excellence in every frame.
                        </p>
                        <button className="btn-outline scroll-to-jobs" aria-label="Explore Opportunities">
                            EXPLORE OPPORTUNITIES <span className="btn-arrow">→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Container */}
            <main className="page-wrapper">
                {/* Why Join Connplex Section */}
                <section className="why-join-section" aria-label="Why Join Connplex">
                    <div className="section-header">
                        <span className="section-subtitle centered">WHY JOIN CONNPLEX</span>
                        <h2 className="section-title centered">MORE THAN A JOB. <span className="gold-text">A JOURNEY.</span></h2>
                    </div>

                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon-container">
                                <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 className="benefit-title">IMPACTFUL WORK</h3>
                            <p className="benefit-text">Create moments that matter and experiences that inspire.</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon-container">
                                <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10"></line>
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="14"></line>
                                    <path d="M4 4h4v4H4z"></path>
                                </svg>
                            </div>
                            <h3 className="benefit-title">GROW & LEARN</h3>
                            <p className="benefit-text">Continuous learning opportunities to help you evolve and lead.</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon-container">
                                <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon
                                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                    </polygon>
                                </svg>
                            </div>
                            <h3 className="benefit-title">EXCITING CULTURE</h3>
                            <p className="benefit-text">A collaborative, inclusive and dynamic environment that celebrates ideas.</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon-container">
                                <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                            </div>
                            <h3 className="benefit-title">EMPLOYEE FIRST</h3>
                            <p className="benefit-text">Wellness, recognition and support—because our people come first.</p>
                        </div>
                    </div>
                </section>

                {/* Current Openings Section */}
                <section className="openings-section" id="openings-section" aria-label="Current Openings">
                    <div className="openings-container">

                        <div className="openings-text-column">
                            <span className="section-subtitle">CURRENT OPENINGS</span>
                            <h2 className="section-title">FIND YOUR NEXT<br /><span className="gold-text">EXPERIENCE</span></h2>
                            <div className="openings-divider"></div>
                            <p className="openings-desc">
                                Explore exciting career opportunities across departments and locations. Your next big role is
                                waiting.
                            </p>
                            <button className="btn-outline scroll-to-jobs" aria-label="View All Open Vacancies">
                                VIEW ALL OPEN VACANCIES <span className="btn-arrow">→</span>
                            </button>
                        </div>

                        <div className="openings-list-column">
                            <div className="jobs-list">

                                <div className="job-card" data-job-id="theatre-ops-mgr" data-job-title="Theatre Operations Manager"
                                    data-job-dept="Operations" data-job-loc="Bengaluru">
                                    <div className="job-card-left">
                                        <h3 className="job-title">Theatre Operations Manager</h3>
                                        <span className="job-meta">Bengaluru &bull; Operations</span>
                                    </div>
                                    <div className="job-card-right">
                                        <button className="btn-view-details"
                                            aria-label="View Details for Theatre Operations Manager">
                                            VIEW DETAILS <span className="arrow">&rarr;</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="job-card" data-job-id="guest-exp-exec" data-job-title="Guest Experience Executive"
                                    data-job-dept="Customer Experience" data-job-loc="Mumbai">
                                    <div className="job-card-left">
                                        <h3 className="job-title">Guest Experience Executive</h3>
                                        <span className="job-meta">Mumbai &bull; Customer Experience</span>
                                    </div>
                                    <div className="job-card-right">
                                        <button className="btn-view-details"
                                            aria-label="View Details for Guest Experience Executive">
                                            VIEW DETAILS <span className="arrow">&rarr;</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="job-card" data-job-id="finance-analyst" data-job-title="Finance Analyst"
                                    data-job-dept="Finance" data-job-loc="Pune">
                                    <div className="job-card-left">
                                        <h3 className="job-title">Finance Analyst</h3>
                                        <span className="job-meta">Pune &bull; Finance</span>
                                    </div>
                                    <div className="job-card-right">
                                        <button className="btn-view-details" aria-label="View Details for Finance Analyst">
                                            VIEW DETAILS <span className="arrow">&rarr;</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="job-card" data-job-id="marketing-spec" data-job-title="Marketing Specialist"
                                    data-job-dept="Marketing" data-job-loc="Bengaluru">
                                    <div className="job-card-left">
                                        <h3 className="job-title">Marketing Specialist</h3>
                                        <span className="job-meta">Bengaluru &bull; Marketing</span>
                                    </div>
                                    <div className="job-card-right">
                                        <button className="btn-view-details" aria-label="View Details for Marketing Specialist">
                                            VIEW DETAILS <span className="arrow">&rarr;</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

            </main>

            {/* CTA Section */}
            <section className="cta-section" aria-label="Let's Create Together">
                <div className="cta-card">
                    <div className="cta-bg-wrapper">
                        <img src="/career/Bottom page image.jpeg"
                            alt="Luxurious modern cinema theater interior lounge background"
                            className="cta-bg-img" />
                        <div className="cta-overlay"></div>
                    </div>

                    <div className="cta-content-container">
                        <div className="cta-text-side">
                            <span className="section-subtitle">DON'T SEE THE RIGHT ROLE?</span>
                            <h2 className="cta-title">
                                LET'S CREATE<br />
                                SOMETHING GREAT<br />
                                <span className="gold-text">TOGETHER.</span>
                            </h2>
                            <p className="cta-desc">
                                We’re always on the lookout for passionate individuals who share our love for cinema and
                                innovation.
                            </p>
                            <button className="btn-solid" id="btn-cta-send-profile" aria-label="Send Us Your Profile">
                                SEND US YOUR PROFILE <span className="btn-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Career Application Modal */}
            <div className="application-modal" id="application-modal" aria-hidden="true" role="dialog">
                <div className="modal-overlay" id="modal-overlay"></div>
                <div className="modal-container">
                    <button className="modal-close-btn" id="modal-close-btn" aria-label="Close Dialog">&times;</button>

                    <div className="modal-body">
                        <div className="modal-header">
                            <span className="modal-subtitle">CAREER OPPORTUNITY</span>
                            <h3 className="modal-title" id="modal-job-title">Apply for Position</h3>
                            <p className="modal-meta" id="modal-job-meta">Department &bull; Location</p>
                        </div>

                        <form className="modal-form" id="career-form">
                            <input type="hidden" name="job_id" id="form-job-id" />
                            <input type="hidden" name="job_title" id="form-job-title" />

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="applicant-name">Full Name *</label>
                                    <input type="text" id="applicant-name" name="fullname" required placeholder="John Doe" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="applicant-email">Email Address *</label>
                                    <input type="email" id="applicant-email" name="email" required
                                        placeholder="john.doe@example.com" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="applicant-phone">Phone Number *</label>
                                    <input type="tel" id="applicant-phone" name="phone" required placeholder="+91 98765 43210" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="applicant-dept">Preferred Department *</label>
                                    <select id="applicant-dept" name="department" required defaultValue="">
                                        <option value="" disabled>Select Department</option>
                                        <option value="Operations">Operations</option>
                                        <option value="Customer Experience">Customer Experience</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Other">Other / General Profile</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Resume / CV Upload *</label>
                                <div className="file-upload-zone" id="file-upload-zone">
                                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    <p className="upload-prompt">Drag & drop your resume here, or <span
                                        className="gold-text-underline">browse files</span></p>
                                    <p className="upload-limits">Supports PDF, DOC, DOCX up to 10MB</p>
                                    <input type="file" id="applicant-resume" name="resume" accept=".pdf,.doc,.docx" required
                                        style={{ display: 'none' }} />
                                    <div className="selected-file-display" id="selected-file-display"></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="applicant-msg">Why do you want to join Connplex? *</label>
                                <textarea id="applicant-msg" name="message" rows={4} required
                                    placeholder="Tell us about your passion for cinema operations or guest hospitality..."></textarea>
                            </div>

                            <button type="submit" className="btn-solid btn-submit-app">
                                SUBMIT APPLICATION <span className="btn-arrow">→</span>
                            </button>
                        </form>

                        <div className="modal-success" id="modal-success" style={{ display: 'none' }}>
                            <div className="success-icon-container">
                                <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h4>APPLICATION SUBMITTED!</h4>
                            <p className="success-message">Thank you for your interest in joining Connplex Cinemas. Our Corporate
                                Development and HR team will review your profile and reach out within 3 to 5 business days.</p>
                            <button className="btn-outline" id="btn-success-close">CLOSE WINDOW</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CareerPage;
