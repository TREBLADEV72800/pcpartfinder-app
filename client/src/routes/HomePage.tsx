import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  HardDrive,
  Monitor,
  Fan,
  Box,
  Zap,
  Server,
  Disc,
  Wind,
  Droplet,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  MonitorPlay,
  MemoryStick,
  ChevronRight,
  Star,
  Check,
  MousePointerClick,
  Bot,
  BarChart3,
  Layers,
  Activity,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, type CategoryMetadata } from "@shared";

/* ─── Icon map ─────────────────────────────────────────────── */
const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  CPU: <Cpu className="h-6 w-6" />,
  CPU_COOLER: <Fan className="h-6 w-6" />,
  MOTHERBOARD: <Server className="h-6 w-6" />,
  MEMORY: <MemoryStick className="h-6 w-6" />,
  STORAGE: <HardDrive className="h-6 w-6" />,
  VIDEO_CARD: <Monitor className="h-6 w-6" />,
  CASE: <Box className="h-6 w-6" />,
  POWER_SUPPLY: <Zap className="h-6 w-6" />,
  MONITOR: <MonitorPlay className="h-6 w-6" />,
  OS: <Disc className="h-6 w-6" />,
  CASE_FAN: <Wind className="h-6 w-6" />,
  THERMAL_PASTE: <Droplet className="h-6 w-6" />,
};

/* ─── Features data ────────────────────────────────────────── */
type Feature = {
  icon: React.ReactElement;
  title: string;
  description: string;
  link?: string;
  gradient: string;
};

const FEATURES: Feature[] = [
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "System Builder",
    description:
      "Configura il tuo PC componente per componente con interfaccia drag & drop intuitiva.",
    link: "/builder",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Verifica Compatibilità",
    description:
      "8 regole di validazione in tempo reale: socket, DDR, form factor, wattaggio e altro.",
    gradient: "from-emerald-500 to-green-400",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Database Completo",
    description:
      "Oltre 10.000 componenti in 12 categorie con specifiche tecniche dettagliate.",
    link: "/products/cpu",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Storico Prezzi",
    description:
      "Grafici interattivi con andamento prezzi e alert personalizzati.",
    link: "/price-drops",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Builds",
    description:
      "Esplora, vota e clona le configurazioni della community.",
    link: "/builds",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "Assistente AI",
    description:
      "Chat intelligente che conosce il tuo budget e ti suggerisce la build perfetta.",
    gradient: "from-indigo-500 to-blue-400",
  },
];

/* ─── Stats data ───────────────────────────────────────────── */
const STATS = [
  { value: 12, suffix: "", label: "Categorie", icon: <Layers className="h-5 w-5" /> },
  { value: 10, suffix: "k+", label: "Componenti", icon: <Cpu className="h-5 w-5" /> },
  { value: 8, suffix: "", label: "Regole Compat.", icon: <Shield className="h-5 w-5" /> },
  { value: 100, suffix: "%", label: "Gratuito", icon: <Star className="h-5 w-5" /> },
];

/* ─── Animated counter hook ────────────────────────────────── */
function useCountUp(target: number, duration = 2000, trigger = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}

/* ─── Intersection observer hook ───────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CategoriesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}

/* ─── 1. HERO ──────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden cyber-grid">
      {/* ── Radial glow effects ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 50%)",
        }}
      />

      {/* ── Animated tech lines ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[data-stream_3s_linear_infinite]" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-[data-stream_4s_linear_infinite_reverse]" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[data-stream_5s_linear_infinite]" />
      </div>

      {/* ── Floating orbs with cyber effect ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 left-[15%] h-72 w-72 rounded-full bg-blue-500/10 blur-[100px] animate-[float_8s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-20 right-[10%] h-96 w-96 rounded-full bg-violet-500/10 blur-[120px] animate-[float_10s_ease-in-out_infinite_reverse]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[25%] h-48 w-48 rounded-full bg-cyan-500/8 blur-[80px] animate-[float_6s_ease-in-out_infinite_2s]"
      />

      {/* ── Gradient border bottom ── */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      {/* ── Content ── */}
      <div className="container relative z-10 px-4 py-20 text-center">
        {/* Top badge */}
        <div className="flex justify-center mb-8 animate-[fadeInDown_0.6s_ease-out]">
          <Badge
            variant="cyber"
            className="gap-2 px-4 py-2 text-sm font-medium cursor-default"
          >
            <Terminal className="h-3.5 w-3.5" />
            v2.0 - Cyber-Industrial Design
          </Badge>
        </div>

        {/* Main heading */}
        <h1 className="animate-[fadeInUp_0.8s_ease-out] text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block text-foreground">Build Your</span>
          <span
            className="block mt-2 gradient-text-cyber"
          >
            Dream PC
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          Configura il tuo PC perfetto con verifica compatibilità in tempo reale,
          confronto prezzi da più rivenditori e assistenza AI personalizzata.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
          <Button
            asChild
            size="lg"
            variant="cyber"
            className="min-w-[220px] h-13 text-base font-semibold"
          >
            <Link to="/builder">
              <span className="relative z-10 flex items-center gap-2">
                Inizia a Costruire
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="neon"
            className="min-w-[220px] h-13 text-base font-semibold"
          >
            <Link to="/builds">
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Esplora Build
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Button>
        </div>

        {/* Scroll hint */}
        <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground/60 animate-[fadeIn_1s_ease-out_1s_both]">
          <MousePointerClick className="h-5 w-5 animate-bounce" />
          <span className="text-xs tracking-widest uppercase">Scorri per scoprire</span>
        </div>
      </div>
    </section>
  );
}

/* ─── 2. STATS ─────────────────────────────────────────────── */
function StatsSection() {
  const { ref, inView } = useInView(0.3);

  return (
    <section ref={ref} className="relative border-b border-border/40 bg-muted/20">
      <div className="container px-4 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} inView={inView} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  inView,
  delay,
}: {
  stat: (typeof STATS)[number];
  inView: boolean;
  delay: number;
}) {
  const count = useCountUp(stat.value, 1500, inView);

  return (
    <div
      className="group flex flex-col items-center text-center transition-all duration-700"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-110">
        {stat.icon}
      </div>
      <p className="text-4xl font-extrabold tracking-tight text-foreground">
        {count}
        <span className="gradient-text">{stat.suffix}</span>
      </p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        {stat.label}
      </p>
    </div>
  );
}

/* ─── 3. FEATURES ──────────────────────────────────────────── */
function FeaturesSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="py-24">
      <div className="container px-4">
        {/* Header */}
        <div
          className="mx-auto max-w-2xl text-center transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <Badge variant="cyber-accent" className="mb-4">
            Funzionalità
          </Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Tutto ciò che ti serve,{" "}
            <span className="gradient-text">niente di meno</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Strumenti professionali per configurare il PC perfetto. Gratis, per sempre.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: Feature;
  index: number;
  inView: boolean;
}) {
  const inner = (
    <Card
      variant="cyber"
      className="group relative h-full transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Top gradient line */}
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
      />

      <CardContent className="flex h-full flex-col p-6">
        {/* Icon */}
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-gradient-to-br ${feature.gradient} text-white shadow-lg shadow-primary/10 transition-transform group-hover:scale-110`}
        >
          {feature.icon}
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold">{feature.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>

        {/* Link indicator */}
        {feature.link && (
          <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
          Scopri di più
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
        )}
      </CardContent>
    </Card>
  );

  if (feature.link) {
    return (
      <Link to={feature.link} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
        {inner}
      </Link>
    );
  }

  return inner;
}

/* ─── 4. CATEGORIES ────────────────────────────────────────── */
function CategoriesSection() {
  const { ref, inView } = useInView(0.1);
  const categories = Object.values(CATEGORIES);

  return (
    <section ref={ref} className="relative py-24 bg-muted/10 cyber-scan">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]"
      />

      <div className="container relative z-10 px-4">
        {/* Header */}
        <div
          className="mx-auto max-w-2xl text-center transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <Badge variant="neon-accent" className="mb-4">
            Catalogo
          </Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Esplora per{" "}
            <span className="gradient-text">Categoria</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            12 categorie, migliaia di componenti. Trova esattamente ciò che cerchi.
          </p>
        </div>

        {/* Category grid */}
        <div className="mt-14 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  index,
  inView,
}: {
  cat: CategoryMetadata;
  index: number;
  inView: boolean;
}) {
  return (
    <Link
      to={`/products/${cat.slug}`}
      className="group relative flex items-center gap-4 rounded-sm border border-border/60 bg-card/80 backdrop-blur-sm p-4 transition-all duration-500 hover:border-primary/40 hover:bg-accent/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0)"
          : "translateY(30px)",
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20 group-hover:scale-105">
        {CATEGORY_ICONS[cat.slug] || <Cpu className="h-6 w-6" />}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
          {cat.name}
        </h3>
        {cat.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {cat.description}
          </p>
        )}
      </div>

      {/* Arrow */}
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 group-hover:opacity-100" />
    </Link>
  );
}

/* ─── 5. HOW IT WORKS ──────────────────────────────────────── */
const STEPS = [
  {
    step: "01",
    title: "Scegli i Componenti",
    description: "Seleziona CPU, GPU, RAM e tutti gli altri componenti dal nostro catalogo.",
    icon: <MousePointerClick className="h-6 w-6" />,
  },
  {
    step: "02",
    title: "Verifica Automatica",
    description: "Il sistema controlla compatibilità, wattaggio e form factor in tempo reale.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    step: "03",
    title: "Confronta Prezzi",
    description: "Trova il prezzo migliore tra decine di rivenditori con storico integrato.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    step: "04",
    title: "Salva e Condividi",
    description: "Esporta la tua build, condividila con la community o chiedi consiglio all'AI.",
    icon: <Sparkles className="h-6 w-6" />,
  },
];

function HowItWorksSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="py-24 border-t border-border/40">
      <div className="container px-4">
        {/* Header */}
        <div
          className="mx-auto max-w-2xl text-center transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <Badge variant="holographic" className="mb-4">
            Come funziona
          </Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Da zero a PC perfetto in{" "}
            <span className="gradient-text">4 step</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="group relative text-center transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              {/* Connector line (hidden on last + mobile) */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-8 left-[60%] right-[-40%] hidden h-px border-t-2 border-dashed border-border/60 lg:block"
                />
              )}

              {/* Step number + icon */}
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                {/* Background circle */}
                <div className="absolute inset-0 rounded-sm bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-110" />
                {/* Icon */}
                <div className="relative z-10 text-primary transition-colors group-hover:text-primary-foreground">
                  {step.icon}
                </div>
                {/* Step badge */}
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-sm bg-foreground text-background text-xs font-bold">
                  {step.step}
                </span>
              </div>

              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. FINAL CTA ─────────────────────────────────────────── */
function CTASection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/40 cyber-scan">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div
        className="container relative z-10 px-4 py-28 text-center transition-all duration-700"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(30px)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Pronto a costruire il{" "}
            <span className="gradient-text-cyber">
              tuo prossimo PC
            </span>
            ?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Unisciti a migliaia di utenti che hanno già configurato il loro PC
            perfetto. È gratuito, veloce e intelligente.
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-success" />
              100% Gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-success" />
              Nessuna registrazione richiesta
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-success" />
              AI integrata
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="cyber"
              className="min-w-[240px] h-14 text-base font-semibold"
            >
              <Link to="/builder">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Inizia ora — è gratis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="min-w-[200px] h-14 text-base font-semibold"
            >
              <Link to="/builds">
                <span className="flex items-center gap-2">
                  Vedi le build
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
