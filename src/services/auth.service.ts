import { supabase, handleSupabaseError } from './supabase.service'
import type { Profile } from '../types/user.types'

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) handleSupabaseError(error)
    return data
  },

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) handleSupabaseError(error)
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) handleSupabaseError(error)
  },

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.warn('[authService] Error getting session:', error.message)
        return null
      }
      return data.session
    } catch (err) {
      console.error('[authService] Exception getting session:', err)
      return null
    }
  },

  async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.warn('[authService] Error getting user:', error.message)
        return null
      }
      return data.user
    } catch (err) {
      console.error('[authService] Exception getting user:', err)
      return null
    }
  },

  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        console.warn('[authService] Error getting profile:', error.message)
        return null
      }
      return data as unknown as Profile
    } catch (err) {
      console.error('[authService] Exception getting profile:', err)
      return null
    }
  },

  async updateProfile(userId: string, updates: Partial<Omit<Profile, 'id'>>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() } as never)
      .eq('id', userId)
      .select()
      .single()
    if (error) handleSupabaseError(error)
    return data as unknown as Profile
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
