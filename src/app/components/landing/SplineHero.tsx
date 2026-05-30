import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { SplineScene } from '../ui/SplineScene';
import { Spotlight } from '../ui/Spotlight';

// ──────────────────────────────────────────────────────────────────────────────
// REPLACE THIS URL with your Spline scene after publishing it in spline.design:
// 1. Open spline.design and build/import your robot scene
// 2. Add the /logobranca.svg to the robot's chest in the Spline editor
// 3. Publish → copy the public URL → paste below
// ──────────────────────────────────────────────────────────────────────────────
const SPLINE_SCENE_URL = 'https://prod.spline.design/COLOQUE-SUA-URL-AQUI/scene.splinecode';

interface SplineHeroProps {
  onGetStarted: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

// Floating financial card widget
function FloatingCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
      className={`absolute z-20 bg-[#111214]/90 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md shadow-2xl ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}

export function SplineHero({ onGetStarted }: SplineHeroProps) {
  return (
    <section className="relative min-h-screen bg-[#0d0d0d] flex items-center overflow-hidden">
      <Spotlight className="absolute inset-0 z-0" />

      {/* Background grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-accent-purple/8 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">

          {/* ── LEFT: Text content ──────────────────────────────────────── */}
          <div className="flex flex-col justify-center space-y-8 order-1">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                Você registra. O sistema organiza.
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-white"
            >
              Organize suas<br />
              <span className="bg-gradient-to-br from-white via-white/90 to-accent-purple bg-clip-text text-transparent">
                finanças com
              </span>
              <br />
              <span className="italic text-white/70">clareza</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="text-lg text-white/50 leading-relaxed max-w-md font-medium"
            >
              Controle receitas, despesas e metas financeiras com método.
              Sem IA invasiva. Sem automações que você não pediu.
              <span className="text-white/70 font-semibold"> Só clareza.</span>
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={onGetStarted}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                Começar grátis
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onGetStarted}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <Play size={14} className="text-accent-purple" />
                Ver demonstração
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="flex items-center gap-6 pt-2"
            >
              {[
                { label: 'Grátis para começar', icon: '✓' },
                { label: 'Sem cartão de crédito', icon: '✓' },
                { label: 'Cancele quando quiser', icon: '✓' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-[11px] text-white/40 font-medium">
                  <span className="text-accent-purple font-bold">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Spline Robot ─────────────────────────────────────── */}
          <div className="relative order-2 h-[500px] lg:h-[700px] flex items-center justify-center">

            {/* Robot container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="relative w-full h-full"
            >
              {/* Glow beneath robot */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-accent-purple/20 rounded-full blur-3xl" />

              <SplineScene
                scene={SPLINE_SCENE_URL}
                className="w-full h-full"
              />
            </motion.div>

            {/* Floating widgets */}
            <FloatingCard className="top-12 -left-4 md:left-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-sm">↑</span>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Receitas</p>
                  <p className="text-sm font-bold text-white">R$ 8.400</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="bottom-20 -left-4 md:left-4">
              <div className="space-y-2">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Score Financeiro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-accent-purple">847</span>
                  <span className="text-[10px] text-white/40">/1000</span>
                </div>
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-purple rounded-full" style={{ width: '84.7%' }} />
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="top-24 -right-4 md:right-0">
              <div className="space-y-2">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Economia</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">32%</span>
                  <span className="text-[10px] text-green-400 font-bold">↑ 4%</span>
                </div>
                {/* Mini bars */}
                <div className="flex items-end gap-1 h-6">
                  {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 rounded-sm bg-accent-purple/50"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </FloatingCard>

          </div>
        </div>
      </div>
    </section>
  );
}
