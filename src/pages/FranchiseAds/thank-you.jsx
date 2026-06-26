import React from 'react';
import { useRouter } from 'next/router';
import './newfranchiasepage.css';

export default function ThankYouPage() {
    const router = useRouter();

    return (
        <div className="franchise-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
            <div className="fra-testimonial-card-inner" style={{ maxWidth: '500px', width: '100%', margin: '0 auto', border: '1px solid var(--fra-gold)' }}>
                <div style={{ fontSize: '4rem', color: '#c19b62', marginBottom: '20px' }}>✓</div>
                <h1 className="fra-gold-text" style={{ fontSize: '2rem', marginBottom: '15px', fontWeight: 'bold' }}>THANK YOU!</h1>
                <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '30px', lineHeight: '1.6' }}>
                    Your franchise enquiry has been successfully submitted. Our team will review your details and contact you shortly.
                </p>
                <button 
                    onClick={() => router.push('/franchiseads')} 
                    className="fra-btn-solid"
                    style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                    Back to Franchise Page
                </button>
            </div>
        </div>
    );
}
