import { Plan } from './plans';

// Swap this for a real Supabase query when billing is live:
//
//   const { data } = await supabase
//     .from('subscriptions')
//     .select('plan')
//     .eq('user_id', userId)
//     .single();
//   return data?.plan ?? 'basic';

const MOCK_PLAN: Plan = 'basic';

export function useSubscription(): { plan: Plan; isLoading: boolean } {
  return { plan: MOCK_PLAN, isLoading: false };
}
