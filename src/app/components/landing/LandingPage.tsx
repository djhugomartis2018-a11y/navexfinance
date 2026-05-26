import { useState } from 'react';
import { ChevronRight, TrendingUp, Target, Wallet, BarChart3, Lock, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Visualize toda sua situação financeira em um único lugar com gráficos interativos.'
    },
    {
      icon: TrendingUp,
      title: 'Análise Detalhada',
      description: 'Acompanhe a evolução de suas finanças com histórico visual.'
    },
    {
      icon: Target,
      title: 'Metas Financeiras',
      description: 'Defina objetivos de poupança e acompanhe seu progresso.'
    },
    {
      icon: Wallet,
      title: 'Gestão por Mês',
      description: 'Controle receitas e despesas de forma simples.'
    },
    {
      icon: Lock,
      title: 'Segurança',
      description: 'Seus dados protegidos com autenticação segura.'
    },
    {
      icon: Zap,
      title: 'Sincronização',
      description: 'Acesse seus dados de qualquer dispositivo.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* Hero */}
      <section className="pt-32 pb-20 text-center">
        <h1 className="text-6xl font-black">Controle Seu Dinheiro</h1>
        <p className="text-text-dim mt-4">Organize seus gastos e tenha clareza financeira.</p>
        <Button onClick={onGetStarted} className="mt-6">
          Começar
        </Button>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-6 border rounded-xl">
                <Icon />
                <h4 className="font-bold mt-2">{f.title}</h4>
                <p className="text-sm text-text-dim">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black">Planos e preços</h2>
          <p className="text-text-dim">Escolha o plano ideal para você</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* FREE */}
          <div className="border rounded-2xl p-6">
            <h3 className="font-bold text-lg">Básico</h3>
            <p className="text-3xl font-black">Grátis</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Até 2 contas</li>
              <li>50 lançamentos/mês</li>
              <li>Visão mensal</li>
            </ul>
            <Button className="mt-6 w-full" onClick={onGetStarted}>
              Começar
            </Button>
          </div>

          {/* ESSENCIAL */}
          <div className="border-2 border-accent-purple rounded-2xl p-6">
            <h3 className="font-bold text-lg">Essencial</h3>
            <p className="text-3xl font-black">R$ 19/mês</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Lançamentos ilimitados</li>
              <li>Categorias personalizadas</li>
              <li>Relatórios simples</li>
              <li>Exportação</li>
            </ul>
            <Button className="mt-6 w-full" onClick={onGetStarted}>
              Assinar
            </Button>
          </div>

          {/* PRO */}
          <div className="border rounded-2xl p-6">
            <h3 className="font-bold text-lg">Pro</h3>
            <p className="text-3xl font-black">R$ 39/mês</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Metas financeiras</li>
              <li>Planejamento mensal</li>
              <li>Comparação de meses</li>
              <li>Dashboard avançado</li>
            </ul>
            <Button className="mt-6 w-full" onClick={onGetStarted}>
              Assinar
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
}
