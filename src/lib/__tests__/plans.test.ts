import { describe, it, expect } from 'vitest';
import { hasFeature, canAddMonth, PLANS } from '../plans';

// ─── Plano BÁSICO ───────────────────────────────────────────────────────────

describe('Plano Básico', () => {
  it('✅ pode criar até 2 meses', () => {
    expect(canAddMonth('basic', 0)).toBe(true);
    expect(canAddMonth('basic', 1)).toBe(true);
  });

  it('❌ não pode criar terceiro mês', () => {
    expect(canAddMonth('basic', 2)).toBe(false);
    expect(canAddMonth('basic', 5)).toBe(false);
  });

  it('❌ não pode acessar comparação entre meses', () => {
    expect(hasFeature('basic', 'monthlyComparison')).toBe(false);
  });

  it('❌ não pode acessar metas financeiras', () => {
    expect(hasFeature('basic', 'financialGoals')).toBe(false);
  });

  it('❌ não pode acessar orçamento por categoria', () => {
    expect(hasFeature('basic', 'categoryBudget')).toBe(false);
  });

  it('❌ não pode acessar comparação avançada', () => {
    expect(hasFeature('basic', 'advancedComparison')).toBe(false);
  });

  it('❌ não pode acessar categorias personalizadas', () => {
    expect(hasFeature('basic', 'categoriesCustom')).toBe(false);
  });

  it('❌ não pode acessar templates mensais', () => {
    expect(hasFeature('basic', 'monthlyTemplates')).toBe(false);
  });

  it('❌ não pode acessar visão anual', () => {
    expect(hasFeature('basic', 'annualView')).toBe(false);
  });
});

// ─── Plano ESSENCIAL ────────────────────────────────────────────────────────

describe('Plano Essencial', () => {
  it('✅ pode criar meses ilimitados', () => {
    expect(canAddMonth('essential', 0)).toBe(true);
    expect(canAddMonth('essential', 100)).toBe(true);
    expect(canAddMonth('essential', 999)).toBe(true);
  });

  it('✅ pode acessar comparação entre meses', () => {
    expect(hasFeature('essential', 'monthlyComparison')).toBe(true);
  });

  it('✅ pode acessar categorias personalizadas', () => {
    expect(hasFeature('essential', 'categoriesCustom')).toBe(true);
  });

  it('❌ não pode acessar metas financeiras', () => {
    expect(hasFeature('essential', 'financialGoals')).toBe(false);
  });

  it('❌ não pode acessar templates mensais', () => {
    expect(hasFeature('essential', 'monthlyTemplates')).toBe(false);
  });

  it('❌ não pode acessar visão anual', () => {
    expect(hasFeature('essential', 'annualView')).toBe(false);
  });

  it('❌ não pode acessar comparação avançada', () => {
    expect(hasFeature('essential', 'advancedComparison')).toBe(false);
  });

  it('❌ não pode acessar orçamento por categoria', () => {
    expect(hasFeature('essential', 'categoryBudget')).toBe(false);
  });
});

// ─── Plano PRO ──────────────────────────────────────────────────────────────

describe('Plano Pro', () => {
  it('✅ pode criar meses ilimitados', () => {
    expect(canAddMonth('pro', 999)).toBe(true);
  });

  it('✅ tem acesso a todas as features', () => {
    const features = Object.keys(PLANS.pro).filter(k => k !== 'maxMonths') as Array<keyof typeof PLANS.pro>;
    features.forEach(feature => {
      expect(hasFeature('pro', feature as any)).toBe(true);
    });
  });

  it('✅ pode acessar comparação avançada', () => {
    expect(hasFeature('pro', 'advancedComparison')).toBe(true);
  });

  it('✅ pode acessar metas financeiras', () => {
    expect(hasFeature('pro', 'financialGoals')).toBe(true);
  });

  it('✅ pode acessar orçamento por categoria', () => {
    expect(hasFeature('pro', 'categoryBudget')).toBe(true);
  });

  it('✅ pode acessar templates mensais', () => {
    expect(hasFeature('pro', 'monthlyTemplates')).toBe(true);
  });

  it('✅ pode acessar visão anual', () => {
    expect(hasFeature('pro', 'annualView')).toBe(true);
  });
});

// ─── Limites quantitativos ──────────────────────────────────────────────────

describe('maxMonths', () => {
  it('basic: limite é exatamente 2', () => {
    expect(PLANS.basic.maxMonths).toBe(2);
  });

  it('essential: sem limite (Infinity)', () => {
    expect(PLANS.essential.maxMonths).toBe(Infinity);
  });

  it('pro: sem limite (Infinity)', () => {
    expect(PLANS.pro.maxMonths).toBe(Infinity);
  });
});
