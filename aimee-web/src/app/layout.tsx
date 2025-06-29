import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aimee - Your AI Best Friend",
  description: "Meet Aimee, your AI best friend who remembers everything, cares about your day, and becomes the friend you've always wanted. Available 24/7 via SMS.",
  keywords: ["AI friend", "AI companion", "SMS AI", "emotional support", "artificial intelligence"],
  openGraph: {
    title: "Aimee - Your AI Best Friend",
    description: "Finally, someone who's always there for you. Aimee remembers everything, cares about your day, and becomes the friend you've always wanted.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
