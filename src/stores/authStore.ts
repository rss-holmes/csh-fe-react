import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { jwtDecode } from 'jwt-decode'
import * as authApi from '@/api/auth'
import * as workspaceApi from '@/api/workspace'
import type { LoginInput, SignupInput, GoogleAuthInput } from '@/formSchemas/authSchema'

// Types (these will be moved to types folder later)
export interface User {
  email: string
  username: string
  name?: string
  workspaceId: number
  userId: number
}

export interface JwtPayload {
  email: string
  username: string
  workspaceId: number
  userId: number
  exp: number
  iat: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthActions {
  setToken: (token: string) => void
  decodeToken: (token: string) => User | null
  login: (data: LoginInput) => Promise<boolean>
  signup: (data: SignupInput) => Promise<boolean>
  googleLogin: (data: GoogleAuthInput) => Promise<boolean>
  logout: () => void
  initializeAuth: () => void
  switchWorkspace: (newWorkspaceId: number) => Promise<void>
}

export type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setToken: (token: string) => {
        set((state) => {
          state.token = token
          state.user = get().decodeToken(token)
          state.isAuthenticated = !!token
        })
        localStorage.setItem('auth_token', token)
      },

      decodeToken: (token: string): User | null => {
        try {
          const decoded = jwtDecode<JwtPayload>(token)
          const { email, username, workspaceId, userId } = decoded
          return { email, username, workspaceId, userId }
        } catch (error) {
          console.error('Failed to decode token:', error)
          return null
        }
      },

      login: async (data: LoginInput) => {
        try {
          const response = await authApi.login(data)
          get().setToken(response.token)
          return true
        } catch (error) {
          console.error('Login failed:', error)
          return false
        }
      },

      signup: async (data: SignupInput) => {
        try {
          const response = await authApi.signup(data)
          get().setToken(response.token)
          return true
        } catch (error) {
          console.error('Signup failed:', error)
          return false
        }
      },

      googleLogin: async (data: GoogleAuthInput) => {
        try {
          const response = await authApi.googleAuth(data)
          get().setToken(response.token)
          return true
        } catch (error) {
          console.error('Google login failed:', error)
          return false
        }
      },

      logout: () => {
        set((state) => {
          state.user = null
          state.token = null
          state.isAuthenticated = false
        })
        localStorage.removeItem('auth_token')
        // Navigation will be handled by the component using this store
      },

      initializeAuth: () => {
        set((state) => {
          state.isLoading = true
        })
        
        const token = localStorage.getItem('auth_token')
        if (token) {
          get().setToken(token)
        }
        
        set((state) => {
          state.isLoading = false
        })
      },

      switchWorkspace: async (newWorkspaceId: number) => {
        try {
          const response = await workspaceApi.switchWorkspace(newWorkspaceId)
          get().setToken(response.token)
        } catch (error) {
          console.error('Failed to switch workspace:', error)
          throw error
        }
      },
    }))
  )
)

// Initialize auth on app start
useAuthStore.getState().initializeAuth()