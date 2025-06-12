import axiosInstance from '@/utils/axiosBase'
import type {
  LoginInput,
  SignupInput,
  GoogleAuthInput,
  UpdatePasswordInput,
} from '@/formSchemas/authSchema'

// Auth API response types
export interface AuthResponse {
  token: string
  user: {
    email: string
    username: string
    name?: string
    workspaceId: number
    userId: number
  }
}

export interface AuthError {
  message: string
  errors?: Record<string, string[]>
}

/**
 * Login with email and password
 */
export const login = async (data: LoginInput): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/auth/login', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}

/**
 * Sign up with email, name, and password
 */
export const signup = async (data: SignupInput): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/auth/signup', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed')
  }
}

/**
 * Google OAuth authentication
 */
export const googleAuth = async (data: GoogleAuthInput): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/auth/google', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Google authentication failed')
  }
}

/**
 * Update user password
 */
export const updatePassword = async (data: UpdatePasswordInput): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/auth/update-password', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password update failed')
  }
}

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<AuthResponse['user']> => {
  try {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile')
  }
}

/**
 * Refresh authentication token
 */
export const refreshToken = async (): Promise<{ token: string }> => {
  try {
    const response = await axiosInstance.post('/auth/refresh')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Token refresh failed')
  }
}

/**
 * Logout user (if backend logout is needed)
 */
export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/auth/logout')
    return response.data
  } catch (error: any) {
    // Don't throw error for logout - always allow local logout
    console.warn('Server logout failed:', error.response?.data?.message)
    return { message: 'Logged out locally' }
  }
}