import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Cpu className="h-5 w-5 text-primary" />
            <span>PCBuilderAI</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/builder" className="hover:text-foreground transition-colors">
              System Builder
            </Link>
            <Link to="/products/CPU" className="hover:text-foreground transition-colors">
              Components
            </Link>
            <Link to="/builds" className="hover:text-foreground transition-colors">
              Community Builds
            </Link>
            <Link to="/compare" className="hover:text-foreground transition-colors">
              Compare
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
 © {new Date().getFullYear()} PCBuilderAI
          </p>
        </div>
      </div>
    </footer>
  );
}
