import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron" 
});
const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains" 
});
const shareTech = Share_Tech_Mono({ 
  weight: "400",
  subsets: ["latin"], 
  variable: "--font-share-tech" 
});

export const metadata: Metadata = {
  title: "AI Startup Builder | Neural Network Hacked",
  description: "Dystopian AI agents building your next empire.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${jetbrains.variable} ${shareTech.variable} font-body antialiased bg-[#0a0a0f] text-[#e0e0e0] overflow-x-hidden`}
      >
        {/* Scanlines Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,136,0.3)_2px,rgba(0,255,136,0.3)_4px)]"></div>
        {children}
      </body>
    </html>
  );
}
