'use client';

import { useState } from 'react';

export function LandingPageClean({ onGetStarted }) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-20 text-center">
        <h1 className="text-5xl font-bold">Controle seu dinheiro</h1>
        <p className="text-gray-400 mt-4">Organize seus gastos de forma simples</p>
        <button onClick={onGetStarted} className="mt-6 px-6 py-3 bg-purple-600 rounded-lg">Começar</button>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold">Planos</h2>

        <div className="flex justify-center mt-6 gap-2">
          <button onClick={() => setIsAnnual(false)} className="px-4 py-2 bg-gray-800 rounded">Mensal</button>
          <button onClick={() => setIsAnnual(true)} className="px-4 py-2 bg-gray-800 rounded">Anual</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
          <div className="border border-gray-800 p-6 rounded-lg">
            <h3>Básico</h3>
            <p className="text-2xl mt-2">Grátis</p>
          </div>

          <div className="border border-purple-600 p-6 rounded-lg">
            <h3>Essencial</h3>
            <p className="text-2xl mt-2">{isAnnual ? 'R$15' : 'R$19'}</p>
          </div>

          <div className="border border-gray-800 p-6 rounded-lg">
            <h3>Pro</h3>
            <p className="text-2xl mt-2">{isAnnual ? 'R$31' : 'R$39'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// =========================
// PRO VERSION (ANIMAÇÃO)
// =========================

export function LandingPagePro({ onGetStarted }) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-20 text-center">
        <h1 className="text-6xl font-black">Controle Total</h1>
        <p className="text-gray-400 mt-4">Tenha domínio das suas finanças</p>
        <button onClick={onGetStarted} className="mt-6 px-8 py-4 bg-purple-600 rounded-xl hover:scale-105 transition">Começar</button>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-4xl font-black">Planos</h2>

        <div className="flex justify-center mt-8">
          <div className="flex bg-gray-900 p-1 rounded-full">
            <button onClick={() => setIsAnnual(false)} className={`px-5 py-2 rounded-full transition ${!isAnnual && 'bg-purple-600'}`}>
              Mensal
            </button>
            <button onClick={() => setIsAnnual(true)} className={`px-5 py-2 rounded-full transition ${isAnnual && 'bg-purple-600'}`}>
              Anual
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">

          <div className="p-6 border border-gray-800 rounded-2xl hover:scale-105 transition">
            <h3>Básico</h3>
            <p className="text-3xl mt-2">Grátis</p>
          </div>

          <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-110 transition">
            <div className="bg-black p-6 rounded-2xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-purple-600 px-3 py-1 rounded-full">POPULAR</span>
              <h3>Essencial</h3>
              <p className="text-3xl mt-2">{isAnnual ? 'R$15' : 'R$19'}</p>
            </div>
          </div>

          <div className="p-6 border border-gray-800 rounded-2xl hover:scale-105 transition">
            <h3>Pro</h3>
            <p className="text-3xl mt-2">{isAnnual ? 'R$31' : 'R$39'}</p>
          </div>

        </div>
      </section>
    </div>
  );
}
