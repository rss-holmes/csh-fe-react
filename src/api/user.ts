import axiosInstance from '@/utils/axiosBase'

export interface User {
  id: number
  name: string
  email: string
  role?: string
  avatar?: string
}

/**
 * Get all users for the current workspace
 */
export const getWorkspaceUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get('/users')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get workspace users failed')
  }
}

/**
 * Get a specific user by ID
 */
export const getUser = async (id: number): Promise<User> => {
  try {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get user failed')
  }
}