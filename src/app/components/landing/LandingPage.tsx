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

      {/* HOW IT WORKS */}
      <section className="py-20 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black">Como Funciona</h2>
          <p className="text-text-dim">Três passos simples para começar sua jornada financeira</p>
        </div>

        {/* Linha conectando (desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent -translate-y-1/2" />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {[
            {
              step: '01',
              title: 'Crie sua Conta',
              description: 'Registre-se com seu e-mail e crie uma senha segura em segundos.'
            },
            {
              step: '02',
              title: 'Configure seus Dados',
              description: 'Adicione suas receitas, despesas e metas financeiras personalizadas.'
            },
            {
              step: '03',
              title: 'Acompanhe e Evolua',
              description: 'Monitore seu progresso e tome decisões melhores com seus dados.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="group text-center space-y-4 relative z-10 p-6 rounded-2xl border border-border bg-background transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(124,58,237,0.25)]"
            >
              {/* ponto na linha */}
              <div className="hidden md:flex absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent-purple shadow-[0_0_20px_rgba(124,58,237,0.8)]" />

              <div className="text-5xl font-black text-accent-purple/30 group-hover:text-accent-purple/60 transition-colors">
                {item.step}
              </div>
              <h4 className="text-xl font-bold">{item.title}</h4>
              <p className="text-text-dim">{item.description}</p>

              <div className="h-1 w-0 bg-accent-purple mx-auto group-hover:w-16 transition-all duration-500 rounded-full" />
            </div>
          ))}
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
            <button className="mt-6 w-full py-2 bg-accent-purple text-white rounded-lg" onClick={onGetStarted}>
              Começar
            </button>
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
            <button className="mt-6 w-full py-2 bg-accent-purple text-white rounded-lg" onClick={onGetStarted}>
              Assinar
            </button>
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
            <button className="mt-6 w-full py-2 bg-accent-purple text-white rounded-lg" onClick={onGetStarted}>
              Assinar
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
