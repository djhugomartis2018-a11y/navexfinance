import { useState } from 'react';
import { TrendingUp, Target, BarChart3, ArrowRight, Sparkles, Smartphone, LayoutGrid, User, ArrowUpCircle, ArrowDownCircle, Calendar, Wallet, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { PricingSection } from '../ui/pricing';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: BarChart3,
      title: 'Visualização de Dados',
      description: 'Visualize e organize conjuntos de dados complexos sem esforço para insights mais claros e decisões rápidas.',
      highlight: 'Insights Reais'
    },
    {
      icon: Smartphone,
      title: 'Acesso Mobile',
      description: 'Acesse seu dashboard financeiro de qualquer lugar com nosso app responsivo.',
      highlight: 'Mobile First'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden selection:bg-accent-purple/30">

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-accent-purple/20 rounded-full blur-[80px] md:blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent-lime/5 rounded-full blur-[80px] md:blur-[100px] opacity-30" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3 md:p-6">
        <div className="flex items-center gap-3 md:gap-8 px-3 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-full max-w-xl md:max-w-none md:w-auto">
          <img src="/logoverde.svg" alt="NAVEX Finance" className="w-10 h-10 md:w-16 md:h-16 shrink-0" />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          </div>
          <button
            onClick={onGetStarted}
            className="ml-auto md:ml-0 px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-all shrink-0"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-44 pb-12 md:pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-lime animate-pulse shrink-0" />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/70">Otimize seu Fluxo Financeiro</span>
          </div>

          {/* Title */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Eleve suas Finanças com{' '}
              <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent italic">Automação com IA</span>
            </h1>
            <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto font-medium">
              Uma plataforma inovadora que simplifica seu controle, aumenta sua eficiência e ajuda suas finanças a crescerem de forma organizada.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 md:pt-4">
            <Button
              onClick={onGetStarted}
              className="w-full sm:w-auto h-12 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-[#daeb44] hover:text-black hover:border-[#daeb44] hover:shadow-[0_0_30px_rgba(218,235,68,0.5)] text-sm font-bold backdrop-blur-sm transition-all duration-300 group"
            >
              Começar Agora <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Dashboard Mockup — hidden on mobile, visible on md+ */}
          <div className="relative mt-10 md:mt-20 max-w-6xl mx-auto hidden md:block">
            <div className="absolute inset-0 bg-accent-purple/10 blur-[120px] -z-10 rounded-full" />
            <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] overflow-hidden shadow-2xl flex h-[550px]">
              {/* Sidebar Mockup */}
              <div className="w-56 border-r border-white/5 bg-[#141414] p-5 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3">
                  <img src="/logobranca.svg" alt="Logo" className="w-20 h-20" />
                  <div className="h-px w-full bg-white/5" />
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-black text-white/30 tracking-widest uppercase">Menu Principal</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 text-accent-purple">
                      <LayoutGrid size={16} /><span className="text-xs font-bold">Painel Geral</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg text-white/40">
                      <TrendingUp size={16} /><span className="text-xs font-bold">Análises</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg text-white/40">
                      <Target size={16} /><span className="text-xs font-bold">Minhas Metas</span>
                    </div>
                  </div>
                </div>
                <div className="mt-auto space-y-3">
                  <div className="h-9 bg-white/5 border border-white/5 rounded-xl flex items-center px-3 text-[10px] text-white/20 font-medium">
                    Novo mês (Ex: Jul/25)
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
                      <User size={13} className="text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-2 w-14 bg-white/20 rounded-full mb-1" />
                      <div className="h-1.5 w-20 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Mockup */}
              <div className="flex-1 bg-[#0d0d0d] p-6 overflow-hidden">
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Total Recebido', val: 'R$ 12.450', color: 'text-blue-400', icon: ArrowUpCircle },
                    { label: 'Total Pago', val: 'R$ 5.820', color: 'text-red-400', icon: ArrowDownCircle },
                    { label: 'Saldo Acumulado', val: 'R$ 6.630', color: 'text-accent-purple', icon: Wallet },
                    { label: 'Último Mês', val: 'R$ 1.200', color: 'text-white/40', icon: Calendar }
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#1a1a1a] border border-white/5 p-3 rounded-2xl">
                      <div className="p-1.5 rounded-lg bg-white/5 w-fit mb-2">
                        <stat.icon size={14} className={stat.color} />
                      </div>
                      <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className={`text-xs font-black ${stat.color}`}>{stat.val}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs font-bold">Evolução Financeira</div>
                      <div className="flex gap-3 text-[8px] font-bold">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-accent-purple inline-block" /> ENTRADAS</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> SAÍDAS</span>
                      </div>
                    </div>
                    <div className="h-36 flex items-end gap-1.5 px-1">
                      {[30,45,35,60,40,75,50,85,65,90,70,95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                          <div style={{ height: `${h}%` }} className={`w-full rounded-t-sm ${i % 2 === 0 ? 'bg-accent-purple/40' : 'bg-red-500/20'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
                    <div className="text-xs font-bold mb-4">Meses Recentes</div>
                    <div className="space-y-2">
                      {['Maio/2024', 'Abril/2024', 'Março/2024'].map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#0d0d0d] border border-white/5">
                          <div className="text-[10px] font-bold">{m}</div>
                          <ChevronRight size={10} className="text-white/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Stats Preview — shown only on mobile */}
          <div className="mt-8 md:hidden grid grid-cols-2 gap-3">
            {[
              { label: 'Saldo Acumulado', val: 'R$ 6.630', color: 'text-accent-purple', icon: Wallet },
              { label: 'Último Mês', val: 'R$ 1.200', color: 'text-white/60', icon: Calendar },
              { label: 'Total Recebido', val: 'R$ 12.450', color: 'text-blue-400', icon: ArrowUpCircle },
              { label: 'Total Pago', val: 'R$ 5.820', color: 'text-red-400', icon: ArrowDownCircle },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
                <s.icon size={18} className={`mb-2 ${s.color}`} />
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-base font-black ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" className="py-16 md:py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-20 space-y-4">
            <div className="inline-block h-px w-12 bg-accent-purple mb-2 md:mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Acelere seu controle usando{' '}
              <span className="text-white/60 italic">processos inteligentes.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm font-medium">
              Todas as ferramentas que você precisa para otimizar seus gastos, aumentar sua economia e crescer com confiança.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-accent-purple/20 flex items-center justify-center mb-5 md:mb-8 group-hover:scale-110 transition-transform">
                    <Icon size={20} className="text-accent-purple" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4 md:mb-6">{feature.description}</p>
                  <div className="inline-flex items-center gap-2 text-accent-lime text-[10px] font-black uppercase tracking-widest">
                    <div className="w-1 h-1 rounded-full bg-accent-lime" />
                    {feature.highlight}
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={16} className="text-accent-purple/40" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="relative py-16 md:py-32 px-4 bg-white/[0.01] border-y border-white/5">
        <PricingSection
          onSelectPlan={(plan, cycle) => {
            if (plan !== 'basic') {
              localStorage.setItem('navex_pending_plan', JSON.stringify({ plan, cycle }));
            }
            onGetStarted();
          }}
        />
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-16 md:py-32 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Como Funciona</h2>
            <p className="text-white/40 max-w-xl mx-auto font-medium text-sm md:text-base">Três passos simples para você assumir o controle total da sua vida financeira.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

            {[
              { step: '01', title: 'Criar Conta', desc: 'Cadastre-se em segundos com seu e-mail para começar sua jornada.', icon: User },
              { step: '02', title: 'Escolher Plano', desc: 'Selecione o plano que melhor se adapta às suas necessidades atuais.', icon: Target },
              { step: '03', title: 'Começar Organização', desc: 'Inicie seu controle financeiro com nossas ferramentas inteligentes.', icon: TrendingUp }
            ].map((item, i) => (
              <div key={i} className="relative z-10 bg-[#1a1a1a] border border-white/5 p-6 md:p-8 rounded-3xl hover:border-accent-purple/30 transition-all group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                  <item.icon size={24} className="text-accent-purple" />
                </div>
                <div className="text-accent-purple text-xs font-black mb-2 tracking-widest uppercase">Passo {item.step}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-40 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[300px] md:h-[400px] bg-accent-purple/20 blur-[100px] md:blur-[150px] -z-10" />
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-10">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-white/50 text-base md:text-lg font-medium">
            Use a NAVEX para automatizar seu controle e economizar como nunca.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onGetStarted}
              className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-accent-lime text-black hover:bg-accent-lime/90 font-black shadow-[0_0_30px_rgba(218,235,68,0.2)]"
            >
              Começar Agora <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-6">
            <img src="/logobranca.svg" alt="NAVEX Finance" className="w-16 h-16 md:w-24 md:h-24" />
            <p className="text-white/40 text-sm leading-relaxed">
              Tornando a gestão financeira mais simples, inteligente e acessível para todos.
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-accent-purple">Produto</h4>
            <ul className="space-y-3 text-sm text-white/40">
              <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#precos" className="hover:text-white transition-colors">Preços</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
            </ul>
          </div>
          <div className="space-y-4 md:space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-accent-purple">Empresa</h4>
            <ul className="space-y-3 text-sm text-white/40">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-accent-purple">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm flex-1 min-w-0 focus:outline-none focus:border-accent-purple"
              />
              <button className="w-10 h-10 shrink-0 rounded-full bg-accent-purple flex items-center justify-center hover:bg-accent-purple/80 transition-all">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 md:mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs font-medium">
          <p>© 2026 NAVEX Finance. Todos os direitos reservados — Code Less.</p>
        </div>
      </footer>
    </div>
  );
}
