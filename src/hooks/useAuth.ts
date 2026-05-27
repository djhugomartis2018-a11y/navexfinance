import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { authService } from '../services/auth.service'
import { categoryService } from '../services/category.service'

export function useAuth() {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    // Initial session check
    authService.getSession().then(async (session) => {
      dispatch({ type: 'SET_AUTH', payload: { user: session?.user ?? null, session } })
      if (session?.user) {
        const profile = await authService.getProfile(session.user.id)
        dispatch({ type: 'SET_PROFILE', payload: profile })
        await categoryService.seedDefaults(session.user.id)
      }
      dispatch({ type: 'AUTH_INITIALIZED' })
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      dispatch({ type: 'SET_AUTH', payload: { user: session?.user ?? null, session } })
      if (session?.user) {
        const profile = await authService.getProfile(session.user.id)
        dispatch({ type: 'SET_PROFILE', payload: profile })
        if (event === 'SIGNED_IN') {
          await categoryService.seedDefaults(session.user.id)
        }
      } else {
        dispatch({ type: 'SET_PROFILE', payload: null })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email: string, password: string) =>
    authService.signIn(email, password)

  const signUp = (email: string, password: string, fullName: string) =>
    authService.signUp(email, password, fullName)

  const signOut = () => authService.signOut()

  const updateProfile = (updates: Parameters<typeof authService.updateProfile>[1]) => {
    if (!state.auth.user) throw new Error('Not authenticated')
    return authService.updateProfile(state.auth.user.id, updates).then((profile) => {
      dispatch({ type: 'SET_PROFILE', payload: profile })
      return profile
    })
  }

  return {
    user: state.auth.user,
    session: state.auth.session,
    profile: state.auth.profile,
    loading: state.auth.loading,
    initialized: state.auth.initialized,
    isAuthenticated: !!state.auth.user,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}
