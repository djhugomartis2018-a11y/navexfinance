import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { AuthState, Profile } from '../types/user.types'
import type { Category, Transaction } from '../types/finance.types'
import type { User, Session } from '@supabase/supabase-js'

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  auth: AuthState
  categories: Category[]
  categoriesLoaded: boolean
}

const initialState: AppState = {
  auth: {
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false,
  },
  categories: [],
  categoriesLoaded: false,
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_AUTH'; payload: { user: User | null; session: Session | null } }
  | { type: 'SET_PROFILE'; payload: Profile | null }
  | { type: 'SET_AUTH_LOADING'; payload: boolean }
  | { type: 'AUTH_INITIALIZED' }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'REMOVE_CATEGORY'; payload: string }

// ─── Reducer ──────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload.user,
          session: action.payload.session,
          loading: false,
        },
      }
    case 'SET_PROFILE':
      return { ...state, auth: { ...state.auth, profile: action.payload } }
    case 'SET_AUTH_LOADING':
      return { ...state, auth: { ...state.auth, loading: action.payload } }
    case 'AUTH_INITIALIZED':
      return { ...state, auth: { ...state.auth, initialized: true, loading: false } }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, categoriesLoaded: true }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      }
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
