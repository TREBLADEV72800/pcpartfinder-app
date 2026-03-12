import { Link, useLocation } from "react-router-dom";
import { Cpu, Menu, Search, User, X, Zap, Activity } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinks = [
    { path: "/builder", label: "System Builder", icon: Cpu },
    { path: "/products/CPU", label: "Components", icon: Activity },
    { path: "/builds", label: "Builds", icon: Zap },
    { path: "/compare", label: "Compare", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-xl">
      {/* Tech line decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:blur-2xl transition-all duration-300" />
            <Cpu className="relative h-7 w-7 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-foreground">PC</span>
            <span className="gradient-text">Builder</span>
            <span className="text-muted-foreground">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm
                transition-all duration-200 group
                ${isActivePath(link.path)
                  ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }
              `}
            >
              <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{link.label}</span>
              {isActivePath(link.path) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="group relative p-2.5 rounded-sm hover:bg-accent/50 transition-colors">
            <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-200" />
          </button>

          {/* User */}
          <Link
            to="/login"
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm
                     hover:bg-accent/50 transition-all duration-200 group"
          >
            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-muted-foreground group-hover:text-foreground">Accedi</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden relative p-2.5 rounded-sm hover:bg-accent/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-card/95 backdrop-blur-xl animate-[fadeInDown_0.2s_ease-out]">
          <nav className="container flex flex-col py-4 gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm
                  transition-all duration-200
                  ${isActivePath(link.path)
                    ? "text-primary bg-primary/10 border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
                {isActivePath(link.path) && (
                  <span className="absolute right-4 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                )}
              </Link>
            ))}
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground rounded-sm hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Accedi</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
