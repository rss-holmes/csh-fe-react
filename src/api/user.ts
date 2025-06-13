import axiosInstance from '@/utils/axiosBase'

export interface User {
  id: number
  name: string
  email: string
  role?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  lastUpdatedAt: string
}

export interface Invitation {
  id: string
  email: string
  role: string
  status: string
  createdAt: string
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

/**
 * Delete a user from the workspace
 */
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Delete user failed')
  }
}

/**
 * Invite users to the workspace
 */
export const inviteUsers = async (emails: string[]): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/users/invite-users', { emails })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Invite users failed')
  }
}

/**
 * Get all pending invitations for the workspace
 */
export const getJoinInvitations = async (): Promise<Invitation[]> => {
  try {
    const response = await axiosInstance.get('/users/join-invitations')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get invitations failed')
  }
}