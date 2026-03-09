import { Link } from "react-router-dom";
import { Cpu, HardDrive, Monitor, Zap, Users, TrendingDown } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="border-b border-border bg-card py-20">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Build Your Dream PC
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Configura il tuo PC perfetto con verifica compatibilità in tempo reale,
            confronto prezzi e assistenza AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/builder"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Inizia a Costruire
            </Link>
            <Link
              to="/builds"
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Esplora Build
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tutto ciò che ti serve per assemblare il tuo PC
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Cpu className="h-8 w-8" />}
              title="System Builder"
              description="Configura il tuo PC componente per componente con verifica compatibilità automatica."
              link="/builder"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Verifica Compatibilità"
              description="Controlla automaticamente socket, form factor, wattaggio e molto altro."
            />
            <FeatureCard
              icon={<HardDrive className="h-8 w-8" />}
              title="Database Completo"
              description="Migliaia di componenti con prezzi aggiornati da più rivenditori."
            />
            <FeatureCard
              icon={<TrendingDown className="h-8 w-8" />}
              title="Storico Prezzi"
              description="Tieni traccia dei prezzi e ricevi avvisi quando scendono."
              link="/price-drops"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Community Builds"
              description="Condividi le tue build e scopri quelle della community."
              link="/builds"
            />
            <FeatureCard
              icon={<Monitor className="h-8 w-8" />}
              title="Confronto Prodotti"
              description="Confronta specifiche e prezzi di diversi componenti affiancati."
              link="/compare"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card py-16">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto a iniziare?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Inizia subito a configurare il tuo PC. La verifica compatibilità ti guiderà
            verso scelte corrette.
          </p>
          <Link
            to="/builder"
            className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Vai al System Builder
          </Link>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  const content = (
    <>
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </>
  );

  if (link) {
    return (
      <Link
        to={link}
        className="p-6 border border-border rounded-lg hover:bg-accent transition-colors"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="p-6 border border-border rounded-lg">
      {content}
    </div>
  );
}
