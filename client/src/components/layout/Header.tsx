import { Link } from "react-router-dom";
import { Cpu, Menu, Search, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Cpu className="h-6 w-6 text-primary" />
          <span>PCBuilderAI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/builder" className="text-sm font-medium hover:text-primary transition-colors">
            System Builder
          </Link>
          <Link to="/products/CPU" className="text-sm font-medium hover:text-primary transition-colors">
            Components
          </Link>
          <Link to="/builds" className="text-sm font-medium hover:text-primary transition-colors">
            Builds
          </Link>
          <Link to="/compare" className="text-sm font-medium hover:text-primary transition-colors">
            Compare
          </Link>
          <Link to="/price-drops" className="text-sm font-medium hover:text-primary transition-colors">
            Price Drops
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent rounded-md transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors">
            <User className="h-4 w-4" />
            <span>Accedi</span>
          </Link>
          <button
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container flex flex-col py-4 gap-2">
            <Link
              to="/builder"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              System Builder
            </Link>
            <Link
              to="/products/CPU"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Components
            </Link>
            <Link
              to="/builds"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Builds
            </Link>
            <Link
              to="/compare"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare
            </Link>
            <Link
              to="/price-drops"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Price Drops
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accedi
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
