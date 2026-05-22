'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { LayoutGrid, TrendingUp, Target, User, Menu, X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoginPage } from './components/auth/LoginPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { Toaster } from 'sonner';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarInput,
} from './components/ui/sidebar';
import { useIsMobile } from './components/ui/use-mobile';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/ui/table';
import { ScrollArea } from './components/ui/scroll-area';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

// Configure Chart.js defaults
ChartJS.defaults.color = '#999999';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1a1a1a';
ChartJS.defaults.plugins.tooltip.titleColor = '#fff';
ChartJS.defaults.plugins.tooltip.bodyColor = '#b4f51d';
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;

// Types
interface Receita {
  desc: string;
  val: number;
}

interface Fixa {
  desc: string;
  dia: string | number;
  val: number;
  pago: boolean;
}

interface Variavel {
  desc: string;
  val: number;
}

interface MesData {
  receitas: Receita[];
  fixas: Fixa[];
  variaveis: Variavel[];
}

interface Meta {
  desc: string;
  total: number;
  guardei: number;
}

interface AppData {
  months: string[];
  mesData: Record<string, MesData>;
  metas: Meta[];
}

const defaultMesData = (): MesData => ({
  receitas: [
    { desc: 'Salário principal', val: 0 },
    { desc: 'Renda extra', val: 0 }
  ],
  fixas: [
    { desc: 'Aluguel / Financiamento', dia: 5, val: 0, pago: false },
    { desc: 'Energia elétrica', dia: 10, val: 0, pago: false },
    { desc: 'Água', dia: 15, val: 0, pago: false },
    { desc: 'Internet', dia: 10, val: 0, pago: false },
    { desc: 'Mercado', dia: '', val: 0, pago: false }
  ],
  variaveis: []
});

const defaultMetas = (): Meta[] => [
  { desc: 'Reserva de Emergência', total: 0, guardei: 0 },
  { desc: 'Viagem dos Sonhos', total: 0, guardei: 0 }
];

const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem('gestao_salario_v2');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {
    months: ['Jan/2024', 'Fev/2024'],
    mesData: {
      'Jan/2024': {
        receitas: [{ desc: 'Salário', val: 5000 }],
        fixas: [
          { desc: 'Aluguel', dia: 5, val: 1200, pago: true },
          { desc: 'Internet', dia: 10, val: 100, pago: true }
        ],
        variaveis: [{ desc: 'Lazer', val: 800 }]
      },
      'Fev/2024': {
        receitas: [{ desc: 'Salário', val: 5200 }],
        fixas: [
          { desc: 'Aluguel', dia: 5, val: 1200, pago: false },
          { desc: 'Internet', dia: 10, val: 100, pago: false }
        ],
        variaveis: [{ desc: 'Restaurante', val: 400 }]
      }
    },
    metas: defaultMetas()
  };
};

const fmt = (v: number) =>
  'R$ ' +
  parseFloat(v || 0 + '').toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
const n = (v: any) => parseFloat(v) || 0;

const calcMonth = (data: AppData, key: string) => {
  const m = data.mesData[key];
  if (!m) return { rec: 0, fixas: 0, variaveis: 0, pagar: 0, saldo: 0 };
  const rec = m.receitas.reduce((s, r) => s + n(r.val), 0);
  const fixas = m.fixas.reduce((s, r) => s + n(r.val), 0);
  const variaveis = m.variaveis.reduce((s, r) => s + n(r.val), 0);
  const pagar = fixas + variaveis;
  return { rec, fixas, variaveis, pagar, saldo: rec - pagar };
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState<AppData>(loadData());
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [currentMonth, setCurrentMonth] = useState<string | null>(
    data.months.length ? data.months[data.months.length - 1] : null
  );
  const [currentTab, setCurrentTab] = useState<string>('resumo');
  const [newMonthInput, setNewMonthInput] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('gestao_salario_v2', JSON.stringify(data));
  }, [data]);

  const showPage = (name: string) => {
    setCurrentPage(name);
  };

  const openMonth = (key: string) => {
    setCurrentMonth(key);
    setCurrentPage('mes');
    setCurrentTab('resumo');
  };

  const addMonth = () => {
    const val = newMonthInput.trim();
    if (!val) return;
    if (data.months.includes(val)) {
      alert('Mês já existe!');
      return;
    }
    const newData = {
      ...data,
      months: [...data.months, val],
      mesData: { ...data.mesData, [val]: defaultMesData() }
    };
    setData(newData);
    setNewMonthInput('');
    setCurrentMonth(val);
    setCurrentPage('mes');
  };

  const deleteMonth = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (!confirm(`Excluir ${key}?`)) return;
    const newMonths = data.months.filter((m) => m !== key);
    const newMesData = { ...data.mesData };
    delete newMesData[key];
    setData({ ...data, months: newMonths, mesData: newMesData });
    if (currentMonth === key) {
      setCurrentMonth(newMonths[newMonths.length - 1] || null);
      setCurrentPage('overview');
    }
  };

  const updateData = (updater: (d: AppData) => AppData) => {
    setData(updater(data));
  };

  // Tela de carregamento enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Carregando...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <LoginPage onLoginSuccess={async () => {
          const { data: { session: newSession } } = await supabase.auth.getSession();
          setSession(newSession);
        }} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <SidebarProvider>
      <Toaster richColors position="top-right" />
      <div className="flex w-full min-h-screen" style={{ fontFamily: 'var(--font-main), -apple-system, Inter, Segoe UI, system-ui, sans-serif' }}>
        {/* SIDEBAR */}
        <Sidebar className="border-r border-border" collapsible="offcanvas">
          <SidebarHeader className="border-b border-border px-4 py-6">
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                💰 SALÁRIO PRO
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-dark)' }}>
                Gestão Financeira Premium
              </p>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            {/* Dashboard Section */}
            <SidebarGroup>
              <SidebarGroupLabel>DASHBOARD</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentPage === 'overview'}
                      onClick={() => showPage('overview')}
                      tooltip="Visão Geral"
                    >
                      <LayoutGrid size={18} />
                      <span>Visão Geral</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentPage === 'historico'}
                      onClick={() => showPage('historico')}
                      tooltip="Histórico"
                    >
                      <TrendingUp size={18} />
                      <span>Histórico</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentPage === 'metas'}
                      onClick={() => showPage('metas')}
                      tooltip="Metas"
                    >
                      <Target size={18} />
                      <span>Metas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Account Section */}
            <SidebarGroup>
              <SidebarGroupLabel>CONTA</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentPage === 'perfil'}
                      onClick={() => showPage('perfil')}
                      tooltip="Meu Perfil"
                    >
                      <User size={18} />
                      <span>Meu Perfil</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Months Section */}
            <SidebarGroup>
              <SidebarGroupLabel>MESES</SidebarGroupLabel>
              <SidebarGroupContent>
                <ScrollArea className="h-[200px] pr-4">
                  <SidebarMenu>
                    {data.months.map((m: string) => (
                      <SidebarMenuItem key={m}>
                        <SidebarMenuButton
                          isActive={m === currentMonth && currentPage === 'mes'}
                          onClick={() => openMonth(m)}
                          className="group/month"
                        >
                          <span className="flex-1">{m}</span>
                          <button
                            onClick={(e) => deleteMonth(e, m)}
                            className="opacity-0 group-hover/month:opacity-100 transition-opacity"
                            style={{
                              fontSize: '18px',
                              color: 'var(--red)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0 4px'
                            }}
                          >
                            ×
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </ScrollArea>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Add Month Form */}
          <SidebarFooter className="border-t border-border px-4 py-4">
            <div className="space-y-2">
              <SidebarInput
                type="text"
                value={newMonthInput}
                onChange={(e) => setNewMonthInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMonth()}
                placeholder="Ex: Jul/2025"
                maxLength={10}
              />
              <Button
                onClick={addMonth}
                className="w-full bg-accent-lime text-black hover:bg-accent-lime/90 font-bold"
              >
                <Plus size={16} className="mr-2" />
                Adicionar Mês
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN CONTENT */}
        <SidebarInset>
          <div className="flex items-center justify-between border-b border-border px-4 py-4 md:px-8 md:py-6">
            <SidebarTrigger className="-ml-1" />
            <h1 style={{ fontSize: '20px', fontWeight: 700 }}>SALÁRIO PRO</h1>
            <div className="w-10" />
          </div>

          <main className="flex-1 overflow-auto p-4 md:p-8">
            {currentPage === 'overview' && <OverviewPage data={data} openMonth={openMonth} />}
            {currentPage === 'mes' && currentMonth && (
              <MesPage
                data={data}
                currentMonth={currentMonth}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                updateData={updateData}
              />
            )}
            {currentPage === 'historico' && <HistoricoPage data={data} openMonth={openMonth} />}
            {currentPage === 'metas' && <MetasPage data={data} updateData={updateData} />}
            {currentPage === 'perfil' && <ProfilePage />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// OVERVIEW PAGE
function OverviewPage({ data, openMonth }: { data: AppData; openMonth: (m: string) => void }) {
  const allCalc = data.months.map((m) => ({ mes: m, ...calcMonth(data, m) }));
  const totalRec = allCalc.reduce((s, m) => s + m.rec, 0);
  const totalPag = allCalc.reduce((s, m) => s + m.pagar, 0);
  const totalSaldo = totalRec - totalPag;
  const avgEcon = totalRec ? ((totalSaldo / totalRec) * 100) : 0;

  const chartData = {
    labels: allCalc.map((m) => m.mes),
    datasets: [
      {
        label: 'Entradas',
        data: allCalc.map((m) => m.rec),
        borderColor: '#3d91ff',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Saídas',
        data: allCalc.map((m) => m.pagar),
        borderColor: '#ff4d4d',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Saldo',
        data: allCalc.map((m) => m.saldo),
        borderColor: '#b4f51d',
        backgroundColor: 'rgba(180, 245, 29, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Painel Geral
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px' }}>
          Consolidado de todas as suas finanças
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <Card label="Receita Total" value={fmt(totalRec)} color="blue" />
        <Card label="Saída Total" value={fmt(totalPag)} color="red" />
        <Card label="Patrimônio Líquido" value={fmt(totalSaldo)} color="accent" />
        <Card label="Taxa de Poupança" value={`${avgEcon.toFixed(1)}%`} color="dim" />
      </div>

      {data.months.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '32px',
            overflowX: 'auto'
          }}
        >
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-dim)',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}
          >
            Evolução de Fluxo
          </h3>
          <div style={{ height: '300px', minWidth: '400px' }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// MES PAGE
function MesPage({ data, currentMonth, currentTab, setCurrentTab, updateData }: any) {
  const calc = calcMonth(data, currentMonth);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>
          {currentMonth}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px' }}>
          Gerenciamento detalhado do mês
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <ResumoTab data={data} currentMonth={currentMonth} calc={calc} updateData={updateData} />
        </TabsContent>
        <TabsContent value="receitas">
          <ReceitasTab data={data} currentMonth={currentMonth} calc={calc} updateData={updateData} />
        </TabsContent>
        <TabsContent value="despesas">
          <DespesasTab data={data} currentMonth={currentMonth} calc={calc} updateData={updateData} />
        </TabsContent>
        <TabsContent value="graficos">
          <GraficosTab data={data} currentMonth={currentMonth} calc={calc} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({ label, value, color }: { label: string; value: string; color: string }) {
  const [hover, setHover] = useState(false);
  const colorMap: Record<string, string> = {
    accent: 'var(--accent-lime)',
    red: 'var(--red)',
    blue: 'var(--blue)',
    dim: 'var(--text-dim)'
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${hover ? 'var(--border-bright)' : 'var(--border)'}`,
        padding: '24px',
        transition: 'transform 0.2s, border-color 0.2s',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--text-dark)',
          letterSpacing: '0.05em',
          marginBottom: '12px'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: colorMap[color] || 'var(--text)',
          wordBreak: 'break-word'
        }}
      >
        {value}
      </div>
    </div>
  );
}

// RESUMO TAB
function ResumoTab({ data, currentMonth, calc, updateData }: any) {
  const porDia = calc.saldo / 30;
  const econ = calc.rec ? ((calc.saldo / calc.rec) * 100) : 0;

  const togglePago = (idx: number, val: boolean) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].fixas[idx].pago = val;
      return newData;
    });
  };

  let pillBg = 'var(--accent-lime)';
  let pillColor = '#000';
  if (econ < 10) {
    pillBg = 'var(--red)';
    pillColor = '#fff';
  } else if (econ < 20) {
    pillBg = 'var(--blue)';
    pillColor = '#fff';
  }

  return (
    <div className="animate-fadeIn space-y-8">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <Card label="Recebido" value={fmt(calc.rec)} color="blue" />
        <Card label="A Pagar" value={fmt(calc.pagar)} color="red" />
        <Card label="Saldo" value={fmt(calc.saldo)} color="accent" />
        <Card label="Diário" value={fmt(porDia)} color="dim" />
      </div>

      {/* Saldo Box */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            content: '',
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(180, 245, 29, 0.05) 0%, transparent 70%)'
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Disponível agora
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              margin: '8px 0',
              letterSpacing: '-0.04em',
              color: calc.saldo >= 0 ? 'var(--accent-lime)' : 'var(--red)'
            }}
          >
            {fmt(calc.saldo)}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
            ≈ {fmt(porDia)} / dia · {econ.toFixed(1)}% de economia
          </div>
        </div>
        <div
          style={{
            background: pillBg,
            borderRadius: '16px',
            padding: '20px 32px',
            textAlign: 'center',
            color: pillColor,
            boxShadow: '0 10px 20px rgba(180, 245, 29, 0.2)',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', opacity: 0.7 }}>
            Economia
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900 }}>{econ.toFixed(1)}%</div>
        </div>
      </div>

      {/* Pendências */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Pendências do Mês</h3>
        </div>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Descrição</TableHead>
              <TableHead style={{ textAlign: 'right' }}>Valor</TableHead>
              <TableHead style={{ textAlign: 'right' }}>Dia</TableHead>
              <TableHead style={{ textAlign: 'center' }}>Status</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {data.mesData[currentMonth].fixas
              .filter((f: Fixa) => n(f.val) > 0)
              .map((f: Fixa, i: number) => {
                const actualIdx = data.mesData[currentMonth].fixas.indexOf(f);
                return (
                  <TableRow
                    key={i}
                    style={{
                      opacity: f.pago ? 0.4 : 1,
                      textDecoration: f.pago ? 'line-through' : 'none'
                    }}
                  >
                    <TableCell>{f.desc}</TableCell>
                    <TableCell style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(f.val)}</TableCell>
                    <TableCell style={{ textAlign: 'right', color: 'var(--text-dark)' }}>
                      {f.dia ? `dia ${f.dia}` : '—'}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={f.pago}
                        onChange={(e) => togglePago(actualIdx, e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-lime)' }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// RECEITAS TAB
function ReceitasTab({ data, currentMonth, calc, updateData }: any) {
  const addReceita = () => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].receitas.push({ desc: 'Nova receita', val: 0 });
      return newData;
    });
  };

  const updateReceita = (idx: number, field: 'desc' | 'val', value: any) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      if (field === 'val') {
        newData.mesData[currentMonth].receitas[idx].val = parseFloat(value) || 0;
      } else {
        newData.mesData[currentMonth].receitas[idx].desc = value;
      }
      return newData;
    });
  };

  const deleteReceita = (idx: number) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].receitas.splice(idx, 1);
      return newData;
    });
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>Receitas</div>
          <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>Total: {fmt(calc.rec)}</div>
        </div>
        <Button onClick={addReceita} className="bg-accent-lime text-black hover:bg-accent-lime/90">
          <Plus size={16} className="mr-2" />
          Adicionar
        </Button>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Descrição</TableHead>
              <TableHead style={{ textAlign: 'right' }}>Valor</TableHead>
              <TableHead style={{ textAlign: 'center' }}>Ação</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {data.mesData[currentMonth].receitas.map((r: Receita, i: number) => (
              <TableRow key={i}>
                <TableCell>
                  <input
                    type="text"
                    value={r.desc}
                    onChange={(e) => updateReceita(i, 'desc', e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text)',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <input
                    type="number"
                    value={r.val || ''}
                    onChange={(e) => updateReceita(i, 'val', e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text)',
                      outline: 'none',
                      textAlign: 'right',
                      width: '100%'
                    }}
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => deleteReceita(i)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--red)',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    ×
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// DESPESAS TAB
function DespesasTab({ data, currentMonth, calc, updateData }: any) {
  const addFixa = () => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].fixas.push({ desc: 'Nova despesa fixa', dia: '', val: 0, pago: false });
      return newData;
    });
  };

  const addVariavel = () => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].variaveis.push({ desc: 'Nova despesa variável', val: 0 });
      return newData;
    });
  };

  const updateFixa = (idx: number, field: 'desc' | 'dia' | 'val', value: any) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      if (field === 'val') {
        newData.mesData[currentMonth].fixas[idx].val = parseFloat(value) || 0;
      } else if (field === 'dia') {
        newData.mesData[currentMonth].fixas[idx].dia = value;
      } else {
        newData.mesData[currentMonth].fixas[idx].desc = value;
      }
      return newData;
    });
  };

  const updateVariavel = (idx: number, field: 'desc' | 'val', value: any) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      if (field === 'val') {
        newData.mesData[currentMonth].variaveis[idx].val = parseFloat(value) || 0;
      } else {
        newData.mesData[currentMonth].variaveis[idx].desc = value;
      }
      return newData;
    });
  };

  const deleteFixa = (idx: number) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].fixas.splice(idx, 1);
      return newData;
    });
  };

  const deleteVariavel = (idx: number) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.mesData[currentMonth].variaveis.splice(idx, 1);
      return newData;
    });
  };

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Custos Fixos */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>Custos Fixos</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>Total: {fmt(calc.fixas)}</div>
          </div>
          <Button onClick={addFixa} className="bg-accent-lime text-black hover:bg-accent-lime/90">
            <Plus size={16} className="mr-2" />
            Adicionar
          </Button>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Descrição</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Dia</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Valor</TableHead>
                <TableHead style={{ textAlign: 'center' }}>Ação</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {data.mesData[currentMonth].fixas.map((f: Fixa, i: number) => (
                <TableRow key={i}>
                  <TableCell>
                    <input
                      type="text"
                      value={f.desc}
                      onChange={(e) => updateFixa(i, 'desc', e.target.value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <input
                      type="text"
                      value={f.dia || ''}
                      onChange={(e) => updateFixa(i, 'dia', e.target.value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        outline: 'none',
                        textAlign: 'right',
                        width: '100%'
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      value={f.val || ''}
                      onChange={(e) => updateFixa(i, 'val', e.target.value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        outline: 'none',
                        textAlign: 'right',
                        width: '100%'
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => deleteFixa(i)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--red)',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      ×
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Custos Variáveis */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>Custos Variáveis</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>Total: {fmt(calc.variaveis)}</div>
          </div>
          <Button onClick={addVariavel} className="bg-accent-lime text-black hover:bg-accent-lime/90">
            <Plus size={16} className="mr-2" />
            Adicionar
          </Button>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Descrição</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Valor</TableHead>
                <TableHead style={{ textAlign: 'center' }}>Ação</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {data.mesData[currentMonth].variaveis.map((v: Variavel, i: number) => (
                <TableRow key={i}>
                  <TableCell>
                    <input
                      type="text"
                      value={v.desc}
                      onChange={(e) => updateVariavel(i, 'desc', e.target.value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      value={v.val || ''}
                      onChange={(e) => updateVariavel(i, 'val', e.target.value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        outline: 'none',
                        textAlign: 'right',
                        width: '100%'
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => deleteVariavel(i)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--red)',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      ×
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// GRAFICOS TAB
function GraficosTab({ data, currentMonth, calc }: any) {
  const colors = ['#b4f51d', '#3d91ff', '#ff4d4d', '#BA7517', '#7F77DD'];
  const cats = [
    { label: 'Fixas', val: calc.fixas },
    { label: 'Variáveis', val: calc.variaveis }
  ];

  const pieData = {
    labels: cats.map((c) => c.label),
    datasets: [
      {
        data: cats.map((c) => c.val),
        backgroundColor: colors.slice(0, cats.length),
        borderColor: 'var(--bg)',
        borderWidth: 2
      }
    ]
  };

  const barData = {
    labels: ['Entradas', 'Saídas', 'Saldo'],
    datasets: [
      {
        data: [calc.rec, calc.pagar, calc.rec - calc.pagar],
        backgroundColor: ['#3d91ff', '#ff4d4d', '#b4f51d'],
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '20px', textTransform: 'uppercase' }}>
          Distribuição por Categoria
        </h3>
        <div style={{ height: '280px' }}>
          <Doughnut data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '75%' }} />
        </div>
        <div style={{ marginTop: '24px', fontSize: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {cats.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i % colors.length] }} />
              <span style={{ color: 'var(--text-dim)' }}>{c.label}:</span>
              <span style={{ fontWeight: 700 }}>{fmt(c.val)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '20px', textTransform: 'uppercase' }}>
          Fluxo de Caixa
        </h3>
        <div style={{ height: '280px' }}>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }} />
        </div>
      </div>
    </div>
  );
}

// HISTORICO PAGE
function HistoricoPage({ data, openMonth }: { data: AppData; openMonth: (m: string) => void }) {
  const allCalc = data.months.map((m) => ({ mes: m, ...calcMonth(data, m) }));

  const chartData = {
    labels: allCalc.map((m) => m.mes),
    datasets: [
      {
        label: 'Saldo Mensal',
        data: allCalc.map((m) => m.saldo),
        backgroundColor: allCalc.map((m) => (m.saldo >= 0 ? '#b4f51d' : '#ff4d4d')),
        borderRadius: 6
      }
    ]
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>Histórico Financeiro</div>
        <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px' }}>Sua jornada econômica mês a mês</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '32px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '20px', textTransform: 'uppercase' }}>
          Comparativo de Evolução
        </h3>
        <div style={{ height: '320px', minWidth: '400px' }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Mês</TableHead>
              <TableHead style={{ textAlign: 'right' }}>Recebido</TableHead>
              <TableHead style={{ textAlign: 'right' }}>Saídas</TableHead>
              <TableHead style={{ textAlign: 'right' }}>Saldo</TableHead>
              <TableHead style={{ textAlign: 'right' }}>Economia</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {allCalc.map((m, i) => (
              <TableRow
                key={i}
                onClick={() => openMonth(m.mes)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell style={{ fontWeight: 700, color: 'var(--accent-lime)' }}>{m.mes}</TableCell>
                <TableCell style={{ textAlign: 'right' }}>{fmt(m.rec)}</TableCell>
                <TableCell style={{ textAlign: 'right' }}>{fmt(m.pagar)}</TableCell>
                <TableCell style={{ textAlign: 'right', fontWeight: 700, color: m.saldo >= 0 ? 'var(--text)' : 'var(--red)' }}>{fmt(m.saldo)}</TableCell>
                <TableCell style={{ textAlign: 'right' }}>{m.rec ? ((m.saldo / m.rec) * 100).toFixed(1) + '%' : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// METAS PAGE
function MetasPage({ data, updateData }: { data: AppData; updateData: any }) {
  const totalSaldo = data.months.reduce((s, m) => s + calcMonth(data, m).saldo, 0);

  const addMeta = () => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.metas.push({ desc: 'Novo Objetivo', total: 0, guardei: 0 });
      return newData;
    });
  };

  const updateMeta = (idx: number, field: keyof Meta, value: any) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      if (field === 'total' || field === 'guardei') {
        newData.metas[idx][field] = parseFloat(value) || 0;
      } else {
        newData.metas[idx][field] = value;
      }
      return newData;
    });
  };

  const deleteMeta = (idx: number) => {
    updateData((d: AppData) => {
      const newData = { ...d };
      newData.metas.splice(idx, 1);
      return newData;
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>Objetivos & Sonhos</div>
          <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px' }}>Transforme sobras em conquistas</div>
        </div>
        <Button onClick={addMeta} className="bg-accent-lime text-black hover:bg-accent-lime/90">
          <Plus size={16} className="mr-2" />
          Criar Nova Meta
        </Button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {data.metas.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)' }}>Nenhuma meta definida</div>
        ) : (
          data.metas.map((m, i) => {
            const pct = m.total > 0 ? Math.min(100, (n(m.guardei) / n(m.total)) * 100) : 0;
            return (
              <div key={i} style={{ padding: '24px', borderBottom: i < data.metas.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={m.desc}
                    onChange={(e) => updateMeta(i, 'desc', e.target.value)}
                    style={{ fontSize: '16px', fontWeight: 700, background: 'none', border: 'none', color: 'var(--text)', outline: 'none', width: '100%' }}
                  />
                  <button
                    onClick={() => deleteMeta(i)}
                    style={{ marginTop: '0', fontSize: '18px', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>Objetivo</label>
                    <input
                      type="number"
                      value={m.total || ''}
                      onChange={(e) => updateMeta(i, 'total', e.target.value)}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text)', textAlign: 'right' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>Guardado</label>
                    <input
                      type="number"
                      value={m.guardei || ''}
                      onChange={(e) => updateMeta(i, 'guardei', e.target.value)}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text)', textAlign: 'right' }}
                    />
                  </div>
                </div>
                <div style={{ height: '10px', background: 'var(--bg)', borderRadius: '20px', overflow: 'hidden', margin: '12px 0' }}>
                  <div style={{ height: '100%', background: 'var(--accent-lime)', borderRadius: '20px', width: `${pct}%`, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 0 10px var(--accent-bg)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-dim)' }}>Falta: {fmt(Math.max(0, n(m.total) - n(m.guardei)))}</span>
                  <span style={{ color: 'var(--accent-lime)' }}>{pct.toFixed(0)}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-dark)', textAlign: 'center', padding: '20px' }}>
        Dica: Você tem {fmt(totalSaldo)} acumulado. Que tal destinar 10% ({fmt(totalSaldo * 0.1)}) para uma meta?
      </div>
    </div>
  );
}
// Build version: 1779493220
// Force rebuild 1779493772622462695
