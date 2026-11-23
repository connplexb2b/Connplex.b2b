'use client';

import React, { useState, useEffect, useRef } from 'react';
import './career.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

interface JobOpening {
    id: string;
    title: string;
    company: string;
    department: string;
    location: string;
    employmentType: string;
    experience: string;
    salary?: string;
    qualification?: string;
    preferred?: string;
    about: string;
    responsibilities: {
        category?: string;
        items: string[];
    }[];
    skills?: string[];
    technicalSkills?: string[];
    competencies?: string[];
    requirements?: string[];
}

const JOB_OPENINGS: JobOpening[] = [
    {
        id: 'legal-executive',
        title: 'Legal Executive',
        company: 'Connplex Cinemas Ltd.',
        department: 'Legal',
        location: 'Ahmedabad – Head Office',
        employmentType: 'Full-Time',
        experience: '1–3 Years',
        qualification: 'LL.B. / B.L. from a recognized university',
        preferred: 'LL.M. / CS qualification or relevant corporate legal experience',
        about: 'Connplex Cinemas Ltd. is looking for a proactive, detail-oriented, and commercially aware Legal Executive to support the Legal Department in handling contracts, legal documentation, compliance, litigation coordination, and day-to-day legal matters of the organization.\n\nThe candidate will work closely with Management, Business Development, Franchise, Finance, HR, Operations, Projects, and external legal counsels to ensure timely and effective legal support to the business.',
        responsibilities: [
            {
                category: '1. Contract Drafting & Review',
                items: [
                    'Draft, review, vet, and negotiate agreements, contracts, MOUs, NDAs, LOIs, legal notices, and other legal documents.',
                    'Handle franchise agreements, vendor agreements, lease/license agreements, service agreements, and commercial contracts.',
                    'Identify contractual risks and recommend appropriate legal safeguards.',
                    'Coordinate with internal departments for timely execution of agreements.'
                ]
            },
            {
                category: '2. Legal Research & Advisory Support',
                items: [
                    'Conduct legal research on applicable laws, regulations, and business-related legal matters.',
                    'Assist the Legal Department in providing practical legal support to various business functions.',
                    'Analyse legal issues and assist in developing appropriate risk-mitigation measures.'
                ]
            },
            {
                category: '3. Litigation & Dispute Management',
                items: [
                    'Coordinate with external advocates, consultants, and legal counsels.',
                    'Assist in handling litigation, arbitration, legal notices, and court-related documentation.',
                    'Maintain litigation records, case updates, and follow-up trackers.',
                    'Ensure timely submission and follow-up of documents required for legal proceedings.'
                ]
            },
            {
                category: '4. Property & Real Estate Matters',
                items: [
                    'Assist with legal due diligence for new cinema projects, franchise opportunities, property transactions, and business arrangements.',
                    'Support property, lease, land, registration, and related legal documentation.',
                    'Review title/property-related documents and coordinate with external legal professionals wherever required.'
                ]
            },
            {
                category: '5. Compliance & Documentation',
                items: [
                    'Assist in corporate and statutory compliance activities as required.',
                    'Monitor contract renewals, expiry dates, obligations, and compliance requirements.',
                    'Maintain organized records of agreements, notices, legal correspondence, and other legal documents.',
                    'Ensure proper documentation and confidentiality of sensitive legal and business information.'
                ]
            },
            {
                category: '6. MIS & Reporting',
                items: [
                    'Prepare legal MIS, contract trackers, litigation trackers, and status reports for Management.',
                    'Maintain an updated database of agreements, renewals, legal matters, and pending actions.',
                    'Provide timely updates to the Head of Legal / Management.'
                ]
            },
            {
                category: '7. Coordination & General Legal Support',
                items: [
                    'Coordinate with Management and various departments on legal requirements.',
                    'Follow up with internal teams and external counsels to ensure timely completion of legal matters.',
                    'Perform other legal responsibilities assigned by the Head of Legal / Management.'
                ]
            }
        ],
        skills: [
            'Strong legal drafting and contract review skills.',
            'Good knowledge of Contract Law, Company Law, Property Law, and applicable commercial laws.',
            'Basic understanding of litigation, arbitration, and legal proceedings.',
            'Strong legal research and analytical skills.',
            'Excellent written and verbal communication skills.',
            'Good negotiation and problem-solving abilities.',
            'Proficiency in MS Word, Excel, and PowerPoint.',
            'Ability to manage multiple assignments and meet deadlines.',
            'Strong attention to detail.',
            'High level of integrity, professionalism, and confidentiality.',
            'Ability to work effectively with internal teams and external legal professionals.'
        ]
    },
    {
        id: 'it-executive',
        title: 'IT Executive',
        company: 'Connplex Cinemas Limited',
        department: 'IT',
        location: 'Ahmedabad, Gujarat',
        employmentType: 'Full-Time',
        experience: '2–4 Years',
        salary: '₹30,000 per month',
        qualification: "Bachelor's Degree / Diploma in IT, Computer Science, or a related field",
        about: "Connplex Cinemas Limited is looking for a talented and enthusiastic IT Executive to join our growing team! If you're passionate about technology and looking to grow your career in the entertainment industry, we'd love to hear from you!",
        responsibilities: [
            {
                category: 'Key Responsibilities',
                items: [
                    'Provide hardware and software support to employees',
                    'Manage desktops, laptops, printers, CCTV, and biometric systems',
                    'Troubleshoot network, internet, and system issues',
                    'Maintain IT assets and documentation',
                    'Support POS systems and IT infrastructure across cinema locations',
                    'Coordinate with vendors for IT equipment and AMC services'
                ]
            }
        ],
        requirements: [
            "Bachelor's Degree/Diploma in IT, Computer Science, or a related field",
            '2–4 years of experience in IT Support/System Administration',
            'Strong knowledge of Windows OS, networking, hardware troubleshooting, and Microsoft Office',
            'Good communication and problem-solving skills',
            'Willingness to travel to cinema locations when required'
        ]
    },
    {
        id: 'junior-architect',
        title: 'Junior Architect',
        company: 'Connplex Cinemas Ltd.',
        department: 'Architecture & Design',
        location: 'Ahmedabad / Project Sites',
        employmentType: 'Full-Time',
        experience: '0–2 Years',
        salary: '₹25,000 – ₹30,000 CTC per month (depending on skills and experience)',
        qualification: 'B.Arch – Bachelor of Architecture from a recognized institution (Freshers with strong software skills and a good portfolio can apply; 0–2 years of relevant experience preferred)',
        about: 'Connplex Cinemas is looking for a creative and detail-oriented Junior Architect to join our Architecture & Design team. The candidate will support the design and execution of cinema projects, including cinema interiors, commercial spaces, layouts, working drawings, 3D visualization, and site coordination.',
        responsibilities: [
            {
                category: 'Key Responsibilities',
                items: [
                    'Assist in the architectural and interior design of cinema projects.',
                    'Prepare 2D plans, elevations, sections, layouts, and working drawings.',
                    'Develop 3D models and realistic renders for cinema interiors and architectural concepts.',
                    'Assist Senior Architects in design development and project documentation.',
                    'Prepare detailed drawings for execution and coordinate design revisions.',
                    'Conduct site visits, take measurements, and support site execution teams.',
                    'Coordinate with contractors, vendors, consultants, and internal project teams.',
                    'Assist in material selection, finishes, furniture layouts, lighting, and interior detailing.',
                    'Prepare design presentations, mood boards, and project proposals.',
                    'Ensure drawings and designs are accurate and aligned with Connplex project standards.',
                    'Maintain proper records of drawings, revisions, and project documentation.',
                    'Support multiple projects while meeting deadlines.'
                ]
            }
        ],
        skills: [
            'AutoCAD – Mandatory',
            'SketchUp – Mandatory',
            'Enscape / V-Ray / Lumion – Preferred',
            'Basic knowledge of architectural and interior detailing.',
            'Good understanding of construction drawings and materials.',
            'Strong visualization and design skills.',
            'Good knowledge of MS Office, especially PowerPoint and Excel.',
            'Good communication and coordination skills.',
            'Willingness to travel to project sites when required.'
        ]
    },
    {
        id: 'senior-architect',
        title: 'Senior Architect',
        company: 'Connplex Cinemas Ltd.',
        department: 'Projects & Design',
        location: 'Ahmedabad (Head Office) / Project Sites',
        employmentType: 'Full-Time',
        experience: '5–8 Years',
        salary: '₹50,000/- per month (Performance-based annual appraisal as per company policy)',
        qualification: "Bachelor's Degree in Architecture (B.Arch); M.Arch is an added advantage. 5–8 years of relevant experience in commercial, multiplex, retail, or hospitality projects. COA Registration preferred.",
        about: 'We are seeking an experienced Senior Architect to lead architectural design, planning, and execution of commercial projects, including cinema, retail, and mixed-use developments. The ideal candidate will oversee projects from concept to completion, coordinate with consultants and contractors, ensure statutory compliance, and mentor the design team.',
        responsibilities: [
            {
                category: 'Key Responsibilities',
                items: [
                    'Lead architectural planning, concept development, and detailed design.',
                    'Prepare and review architectural drawings, layouts, BOQs, and construction documents.',
                    'Coordinate with structural, MEP, interior, and external consultants.',
                    'Ensure compliance with local building by-laws, NBC, fire safety, and statutory approvals.',
                    'Conduct regular site visits to monitor quality, progress, and design implementation.',
                    'Resolve technical issues during project execution.',
                    'Review contractor drawings and material specifications.',
                    'Manage project timelines, budgets, and deliverables.',
                    'Present design concepts to management and stakeholders.',
                    'Mentor Junior Architects and Design Engineers.',
                    'Ensure documentation, revisions, and project records are maintained accurately.',
                    'Support value engineering and cost optimization initiatives.'
                ]
            }
        ],
        technicalSkills: [
            'AutoCAD',
            'SketchUp',
            'Revit (Preferred)',
            'Lumion / Enscape',
            'Photoshop',
            'MS Office',
            'Knowledge of BIM and construction documentation'
        ],
        competencies: [
            'Leadership and team management',
            'Strong design and technical knowledge',
            'Project management',
            'Excellent communication and presentation skills',
            'Problem-solving and decision-making',
            'Time management and attention to detail'
        ]
    }
];

const CareerPage = () => {
    const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'details' | 'apply'>('details');

    // Form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const modalContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Open modal to view job details
    const handleOpenJobDetails = (job: JobOpening) => {
        setSelectedJob(job);
        setModalMode('details');
        setDepartment(job.department);
        setIsSuccess(false);
        setErrorMessage('');
        setIsModalOpen(true);
        if (modalContainerRef.current) {
            modalContainerRef.current.scrollTop = 0;
        }
    };

    // Switch from details to application form
    const handleSwitchToApply = () => {
        setModalMode('apply');
        if (modalContainerRef.current) {
            modalContainerRef.current.scrollTop = 0;
        }
    };

    // Open modal directly for general application
    const handleOpenGeneralApply = () => {
        setSelectedJob(null);
        setModalMode('apply');
        setDepartment('Other');
        setIsSuccess(false);
        setErrorMessage('');
        setIsModalOpen(true);
        if (modalContainerRef.current) {
            modalContainerRef.current.scrollTop = 0;
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setErrorMessage('');
    };

    // Body scroll lock & ESC key listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                handleCloseModal();
            }
        };

        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen]);

    // Scroll to openings section
    const scrollToOpenings = () => {
        const openingsSection = document.getElementById('openings-section');
        if (openingsSection) {
            const navHeight = document.querySelector('.navbar')?.clientHeight || 80;
            const sectionPosition = openingsSection.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: sectionPosition - navHeight - 20,
                behavior: 'smooth'
            });
        }
    };

    // File selection handler with size check (10MB limit)
    const handleFileChange = (file: File | null) => {
        if (!file) {
            setSelectedFile(null);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds the 10MB limit. Please upload a smaller resume.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        setSelectedFile(file);
    };

    // Form submission
    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        const payload = {
            fullName,
            email,
            phone,
            position: selectedJob ? selectedJob.title : (department || 'General Application'),
            experience: department || '',
            coverLetter: message,
            cvUrl: selectedFile ? selectedFile.name : ''
        };

        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/api/forms/career-application`, {
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

            setIsSuccess(true);
            setFullName('');
            setEmail('');
            setPhone('');
            setMessage('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (modalContainerRef.current) {
                modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err: any) {
            console.error('Career application submission error:', err);
            setErrorMessage(err.message || 'Unable to process your application at this time. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <div className="career-page">
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
                            <button
                                className="btn-outline scroll-to-jobs"
                                aria-label="Explore Opportunities"
                                onClick={scrollToOpenings}
                            >
                                EXPLORE OPPORTUNITIES <span className="btn-arrow">&rarr;</span>
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
                                    Explore exciting career opportunities across departments and locations. Your next big role is waiting.
                                </p>
                                <button
                                    className="btn-outline scroll-to-jobs"
                                    aria-label="View All Open Vacancies"
                                    onClick={scrollToOpenings}
                                >
                                    VIEW ALL OPEN VACANCIES <span className="btn-arrow">&rarr;</span>
                                </button>
                            </div>

                            <div className="openings-list-column">
                                <div className="jobs-list">
                                    {JOB_OPENINGS.map((job) => (
                                        <div
                                            key={job.id}
                                            className="job-card"
                                            data-job-id={job.id}
                                            data-job-title={job.title}
                                            data-job-dept={job.department}
                                            data-job-loc={job.location}
                                            onClick={() => handleOpenJobDetails(job)}
                                        >
                                            <div className="job-card-left">
                                                <h3 className="job-title">{job.title}</h3>
                                                <span className="job-meta">
                                                    {job.location} &bull; {job.department}
                                                </span>
                                            </div>
                                            <div className="job-card-right">
                                                <button
                                                    className="btn-view-details"
                                                    aria-label={`View Details for ${job.title}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenJobDetails(job);
                                                    }}
                                                >
                                                    VIEW DETAILS <span className="arrow">&rarr;</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* CTA Section */}
                <section className="cta-section" aria-label="Let's Create Together">
                    <div className="cta-card">
                        <div className="cta-bg-wrapper">
                            <img
                                src="/career/Bottom page image.jpeg"
                                alt="Luxurious modern cinema theater interior lounge background"
                                className="cta-bg-img"
                            />
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
                                    We’re always on the lookout for passionate individuals who share our love for cinema and innovation.
                                </p>
                                <button
                                    className="btn-solid"
                                    id="btn-cta-send-profile"
                                    aria-label="Send Us Your Profile"
                                    onClick={handleOpenGeneralApply}
                                >
                                    SEND US YOUR PROFILE <span className="btn-arrow">&rarr;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive Career Application & Job Details Modal */}
                <div
                    className={`application-modal ${isModalOpen ? 'active' : ''}`}
                    id="application-modal"
                    aria-hidden={!isModalOpen}
                    role="dialog"
                >
                    <div className="modal-overlay" id="modal-overlay" onClick={handleCloseModal}></div>
                    <div className="modal-container" ref={modalContainerRef}>
                        <button
                            className="modal-close-btn"
                            id="modal-close-btn"
                            aria-label="Close Dialog"
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>

                        <div className="modal-body">
                            {isSuccess ? (
                                <div className="modal-success" id="modal-success">
                                    <div className="success-icon-container">
                                        <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <h4>APPLICATION SUBMITTED!</h4>
                                    <p className="success-message">
                                        Thank you for your interest in joining Connplex Cinemas. Our Corporate
                                        Development and HR team will review your profile and reach out within 3 to 5 business days.
                                    </p>
                                    <button className="btn-outline" id="btn-success-close" onClick={handleCloseModal}>
                                        CLOSE WINDOW
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="modal-header">
                                        <span className="modal-subtitle">
                                            {selectedJob ? 'CAREER OPPORTUNITY' : 'GENERAL TALENT APPLICATION'}
                                        </span>
                                        <h3 className="modal-title" id="modal-job-title">
                                            {selectedJob
                                                ? (modalMode === 'details' ? selectedJob.title : `Apply for ${selectedJob.title}`)
                                                : 'Let\'s Create Something Great'}
                                        </h3>
                                        <p className="modal-meta" id="modal-job-meta">
                                            {selectedJob
                                                ? `${selectedJob.location} • ${selectedJob.department}`
                                                : 'Corporate HQ • General Applications'}
                                        </p>

                                        {selectedJob && (
                                            <div className="job-badges-grid">
                                                <span className="job-badge">
                                                    <span className="job-badge-icon">📍</span> {selectedJob.location}
                                                </span>
                                                <span className="job-badge">
                                                    <span className="job-badge-icon">🏢</span> {selectedJob.department}
                                                </span>
                                                <span className="job-badge">
                                                    <span className="job-badge-icon">💼</span> {selectedJob.employmentType}
                                                </span>
                                                <span className="job-badge">
                                                    <span className="job-badge-icon">⏳</span> {selectedJob.experience}
                                                </span>
                                                {selectedJob.salary && (
                                                    <span className="job-badge badge-gold">
                                                        <span className="job-badge-icon">💰</span> {selectedJob.salary}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {selectedJob && (
                                        <div className="modal-tabs">
                                            <button
                                                type="button"
                                                className={`modal-tab-btn ${modalMode === 'details' ? 'active' : ''}`}
                                                onClick={() => setModalMode('details')}
                                            >
                                                Job Description
                                            </button>
                                            <button
                                                type="button"
                                                className={`modal-tab-btn ${modalMode === 'apply' ? 'active' : ''}`}
                                                onClick={handleSwitchToApply}
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    )}

                                    {modalMode === 'details' && selectedJob ? (
                                        <div className="job-details-content">
                                            {/* About the Role */}
                                            <div className="job-details-section">
                                                <h4 className="job-section-title">About the Role</h4>
                                                <p className="job-section-desc">{selectedJob.about}</p>
                                            </div>

                                            {/* Qualification & Requirements */}
                                            {selectedJob.qualification && (
                                                <div className="job-details-section">
                                                    <h4 className="job-section-title">Qualification</h4>
                                                    <p className="job-section-desc">{selectedJob.qualification}</p>
                                                    {selectedJob.preferred && (
                                                        <p className="job-section-desc" style={{ marginTop: '0.4rem', color: '#dfb973' }}>
                                                            <strong>Preferred:</strong> {selectedJob.preferred}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Key Responsibilities */}
                                            {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                                                <div className="job-details-section">
                                                    <h4 className="job-section-title">Key Responsibilities</h4>
                                                    {selectedJob.responsibilities.map((group, idx) => (
                                                        <div key={idx} className="job-responsibility-category">
                                                            {group.category && (
                                                                <h5 className="job-category-heading">{group.category}</h5>
                                                            )}
                                                            <ul className="job-bullets-list">
                                                                {group.items.map((item, itemIdx) => (
                                                                    <li key={itemIdx}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Required Skills & Competencies */}
                                            {selectedJob.skills && selectedJob.skills.length > 0 && (
                                                <div className="job-details-section">
                                                    <h4 className="job-section-title">Required Skills & Competencies</h4>
                                                    <ul className="job-bullets-list">
                                                        {selectedJob.skills.map((skill, idx) => (
                                                            <li key={idx}>{skill}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Requirements (e.g. IT Executive) */}
                                            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                                                <div className="job-details-section">
                                                    <h4 className="job-section-title">Requirements</h4>
                                                    <ul className="job-bullets-list">
                                                        {selectedJob.requirements.map((req, idx) => (
                                                            <li key={idx}>{req}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Technical Skills (e.g. Senior Architect) */}
                                            {selectedJob.technicalSkills && selectedJob.technicalSkills.length > 0 && (
                                                <div className="job-details-section">
                                                    <h4 className="job-section-title">Technical Skills</h4>
                                                    <ul className="job-bullets-list">
                                                        {selectedJob.technicalSkills.map((tech, idx) => (
                                                            <li key={idx}>{tech}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Key Competencies (e.g. Senior Architect) */}
                                            {selectedJob.competencies && selectedJob.competencies.length > 0 && (
                                                <div className="job-details-section">
                                                    <h4 className="job-section-title">Key Competencies</h4>
                                                    <ul className="job-bullets-list">
                                                        {selectedJob.competencies.map((comp, idx) => (
                                                            <li key={idx}>{comp}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Salary Note if applicable */}
                                            {selectedJob.salary && (
                                                <div className="job-details-section">
                                                    <h4 className="job-section-title">Compensation</h4>
                                                    <p className="job-section-desc">
                                                        <strong>CTC:</strong> {selectedJob.salary}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="job-details-actions">
                                                <button
                                                    type="button"
                                                    className="btn-solid"
                                                    onClick={handleSwitchToApply}
                                                    style={{ width: '100%', justifyContent: 'center' }}
                                                >
                                                    APPLY FOR THIS POSITION <span className="btn-arrow">&rarr;</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form className="modal-form" id="career-form" onSubmit={handleSubmitApplication}>
                                            {selectedJob && (
                                                <button
                                                    type="button"
                                                    className="btn-back-details"
                                                    onClick={() => setModalMode('details')}
                                                >
                                                    &larr; Back to Job Description
                                                </button>
                                            )}

                                            {errorMessage && (
                                                <div className="form-alert-error">
                                                    {errorMessage}
                                                </div>
                                            )}

                                            <input type="hidden" name="job_id" value={selectedJob?.id || 'general'} />
                                            <input
                                                type="hidden"
                                                name="job_title"
                                                value={selectedJob?.title || 'General Profile Submission'}
                                            />

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="applicant-name">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        id="applicant-name"
                                                        name="fullname"
                                                        required
                                                        placeholder="John Doe"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="applicant-email">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        id="applicant-email"
                                                        name="email"
                                                        required
                                                        placeholder="john.doe@example.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="applicant-phone">Phone Number *</label>
                                                    <input
                                                        type="tel"
                                                        id="applicant-phone"
                                                        name="phone"
                                                        required
                                                        placeholder="+91 98765 43210"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="applicant-dept">Preferred Department *</label>
                                                    <select
                                                        id="applicant-dept"
                                                        name="department"
                                                        required
                                                        value={department}
                                                        onChange={(e) => setDepartment(e.target.value)}
                                                    >
                                                        <option value="" disabled>Select Department</option>
                                                        <option value="Legal">Legal</option>
                                                        <option value="IT">IT</option>
                                                        <option value="Architecture & Design">Architecture & Design</option>
                                                        <option value="Projects & Design">Projects & Design</option>
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
                                                <div
                                                    className={`file-upload-zone ${isDragging ? 'dragover' : ''}`}
                                                    id="file-upload-zone"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    onDragEnter={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setIsDragging(true);
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setIsDragging(true);
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setIsDragging(false);
                                                    }}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setIsDragging(false);
                                                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                            handleFileChange(e.dataTransfer.files[0]);
                                                        }
                                                    }}
                                                >
                                                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                        <polyline points="17 8 12 3 7 8"></polyline>
                                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                                    </svg>
                                                    <p className="upload-prompt">
                                                        Drag & drop your resume here, or <span className="gold-text-underline">browse files</span>
                                                    </p>
                                                    <p className="upload-limits">Supports PDF, DOC, DOCX up to 10MB</p>
                                                    <input
                                                        type="file"
                                                        id="applicant-resume"
                                                        name="resume"
                                                        ref={fileInputRef}
                                                        accept=".pdf,.doc,.docx"
                                                        required={!selectedFile}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files.length > 0) {
                                                                handleFileChange(e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    {selectedFile && (
                                                        <div className="selected-file-display" style={{ display: 'inline-block' }}>
                                                            &#128196; Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                                            <button
                                                                type="button"
                                                                className="btn-remove-file"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFileChange(null);
                                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                                }}
                                                            >
                                                                ✕ Remove
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="applicant-msg">Why do you want to join Connplex? *</label>
                                                <textarea
                                                    id="applicant-msg"
                                                    name="message"
                                                    rows={4}
                                                    required
                                                    placeholder="Tell us about your background, skills, and interest in this role..."
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn-solid btn-submit-app"
                                                disabled={isSubmitting}
                                                style={{ opacity: isSubmitting ? 0.75 : 1 }}
                                            >
                                                {isSubmitting ? (
                                                    <>PROCESSING APPLICATION <span className="loader-dots">...</span></>
                                                ) : (
                                                    <>SUBMIT APPLICATION <span className="btn-arrow">&rarr;</span></>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CareerPage;
