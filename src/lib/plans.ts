export type Plan = 'basic' | 'essential' | 'pro';

export interface PlanConfig {
  maxMonths: number;
  categoriesCustom: boolean;
  monthlyComparison: boolean;
  advancedComparison: boolean;
  categoryBudget: boolean;
  financialGoals: boolean;
  monthlyTemplates: boolean;
  annualView: boolean;
}

export type GatedFeature = keyof Omit<PlanConfig, 'maxMonths'>;

export const PLANS: Record<Plan, PlanConfig> = {
  basic: {
    maxMonths: 2,
    categoriesCustom: false,
    monthlyComparison: false,
    advancedComparison: false,
    categoryBudget: false,
    financialGoals: false,
    monthlyTemplates: false,
    annualView: false,
  },
  essential: {
    maxMonths: Infinity,
    categoriesCustom: true,
    monthlyComparison: true,
    advancedComparison: false,
    categoryBudget: false,
    financialGoals: false,
    monthlyTemplates: false,
    annualView: false,
  },
  pro: {
    maxMonths: Infinity,
    categoriesCustom: true,
    monthlyComparison: true,
    advancedComparison: true,
    categoryBudget: true,
    financialGoals: true,
    monthlyTemplates: true,
    annualView: true,
  },
};

export const PLAN_NAMES: Record<Plan, string> = {
  basic: 'Básico',
  essential: 'Essencial',
  pro: 'Pro',
};

// Maps each feature to the minimum plan that unlocks it
export const FEATURE_REQUIRES: Record<GatedFeature, Plan> = {
  categoriesCustom: 'essential',
  monthlyComparison: 'essential',
  advancedComparison: 'pro',
  categoryBudget: 'pro',
  financialGoals: 'pro',
  monthlyTemplates: 'pro',
  annualView: 'pro',
};

export function hasFeature(plan: Plan, feature: GatedFeature): boolean {
  return PLANS[plan][feature];
}

export function canAddMonth(plan: Plan, currentCount: number): boolean {
  return currentCount < PLANS[plan].maxMonths;
}
