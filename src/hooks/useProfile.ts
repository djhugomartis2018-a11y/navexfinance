import { useAuth } from './useAuth'

export function useProfile() {
  const { user, profile, loading, updateProfile } = useAuth()
  return { user, profile, loading, updateProfile }
}
