import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Escrow Hiring Marketplace",
  description: "Escrow-based hiring marketplace with workers, clients and admin.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
