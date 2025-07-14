import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/layout/Navbar'
import NextTopLoader from 'nextjs-toploader';
import { AuthProvider } from "../context/AuthContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoDocs",
  description: "Capture your ideas, anytime, anywhere.",
  keywords: ["CoDocs", "note-taking app", "online notes", "cloud notes", "secure notes", "productivity"],
  authors: [{ name: "Vinod Kumar", url: "https://www.vinodjangid.site" }],
  creator: "Vinod Kumar",
  openGraph: {
    title: "CoDocs - Capture Your Ideas, Anytime, Anywhere",
    description: "A cloud-based note-taking app that helps you organize and access your notes securely from anywhere.",
    url: "https://CoDocs-site.netlify.app/",
    siteName: "CoDocs",
    images: [
      {
        url: "https://CoDocs-site.netlify.app/images/ogimage.png",
        width: 1200,
        height: 630,
        alt: "CoDocs - Capture Your Ideas, Anytime, Anywhere",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoDocs - Cloud-Based Note-Taking App",
    description: "Capture your ideas effortlessly with CoDocs. Secure, fast, and accessible anytime, anywhere.",
    images: ["https://CoDocs-site.netlify.app/images/ogimage.png"],
    creator: "@Vinod_Jangid07",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> 
        <NextTopLoader  color="#5da9f0ff" showSpinner={false}/>
        <Navbar/>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
