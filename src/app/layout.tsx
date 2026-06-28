import type { Metadata } from "next";
import { Outfit, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Connplex Cinemas | Premium Cinema Chain in India",
  description: "Welcome to Connplex Cinemas, India's fastest-growing premium next-gen cinema chain. Explore premium smart cinema screens and B2B cinema screen partnerships, redefining entertainment.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${montserrat.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (var registration of registrations) {
                  registration.unregister();
                }
              });
            }
          `
        }} />
      </head>
      <body>
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
        {children}
      </body>
    </html>
  );
}
