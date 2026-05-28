import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { authService } from '../services/auth.service'
import { categoryService } from '../services/category.service'

// Timeout de 10 segundos para inicialização de auth
const AUTH_INIT_TIMEOUT = 10000

export function useAuth() {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    // Flag para controlar se o timeout já foi acionado
    let timeoutId: NodeJS.Timeout | null = null
    let isMounted = true

    const initializeAuth = async () => {
      try {
        // Timeout de inicialização
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.warn('[useAuth] Auth initialization timeout after 10s')
            dispatch({ type: 'AUTH_INITIALIZED' })
          }
        }, AUTH_INIT_TIMEOUT)

        // Initial session check
        const session = await authService.getSession()
        
        if (isMounted) {
          dispatch({ 
            type: 'SET_AUTH', 
            payload: { user: session?.user ?? null, session } 
          })

          if (session?.user) {
            try {
              const profile = await authService.getProfile(session.user.id)
              if (isMounted) {
                dispatch({ type: 'SET_PROFILE', payload: profile })
              }
              
              await categoryService.seedDefaults(session.user.id)
            } catch (profileError) {
              console.error('[useAuth] Error loading profile/categories:', profileError)
              // Continuar mesmo se profile/categories falharem
            }
          }

          // Limpar timeout se chegou aqui antes de expirar
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          
          dispatch({ type: 'AUTH_INITIALIZED' })
        }
      } catch (error) {
        console.error('[useAuth] Error during auth initialization:', error)
        
        if (isMounted) {
          // Mesmo com erro, marcar como inicializado
          // Isso permite que o app continue funcionando
          dispatch({ 
            type: 'SET_AUTH', 
            payload: { user: null, session: null } 
          })
          
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          
          dispatch({ type: 'AUTH_INITIALIZED' })
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    let subscription: any = null
    try {
      const { data } = authService.onAuthStateChange(async (event, session) => {
        if (!isMounted) return

        dispatch({ type: 'SET_AUTH', payload: { user: session?.user ?? null, session } })
        
        if (session?.user) {
          try {
            const profile = await authService.getProfile(session.user.id)
            if (isMounted) {
              dispatch({ type: 'SET_PROFILE', payload: profile })
            }
            
            if (event === 'SIGNED_IN') {
              await categoryService.seedDefaults(session.user.id)
            }
          } catch (profileError) {
            console.error('[useAuth] Error in auth state change handler:', profileError)
          }
        } else {
          dispatch({ type: 'SET_PROFILE', payload: null })
        }
      })
      subscription = data?.subscription
    } catch (error) {
      console.error('[useAuth] Error setting up auth state listener:', error)
    }

    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [dispatch])

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
