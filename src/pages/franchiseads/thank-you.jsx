import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import './newfranchiasepage.css';

export default function ThankYouPage() {
    const router = useRouter();

    return (
        <div className="franchise-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
            <Head>
                <title>Thank You | Connplex Cinemas</title>
                <meta name="description" content="Thank you for your interest in partnering with Connplex Cinemas." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-GRV1S9CVTT"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-GRV1S9CVTT');
                `}
            </Script>
            <Script id="meta-pixel" strategy="afterInteractive">
                {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '882439511025451');
                    fbq('init', '1029275259464766');
                    fbq('track', 'PageView');
                    fbq('track', 'Lead');
                `}
            </Script>
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=882439511025451&ev=PageView&noscript=1"
                    alt=""
                />
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=1029275259464766&ev=PageView&noscript=1"
                    alt=""
                />
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=882439511025451&ev=Lead&noscript=1"
                    alt=""
                />
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=1029275259464766&ev=Lead&noscript=1"
                    alt=""
                />
            </noscript>
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
