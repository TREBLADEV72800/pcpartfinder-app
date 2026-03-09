import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
