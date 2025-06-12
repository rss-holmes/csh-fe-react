import axiosInstance from '@/utils/axiosBase'
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from '@/formSchemas/workspaceSchema'

// Workspace API response types
export interface Workspace {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  lastUpdatedAt: string
  createdBy?: {
    id: number
    name: string
    email: string
  }
  memberCount?: number
  boardCount?: number
  feedbackCount?: number
}

export interface GithubRepo {
  id: number
  name: string
  fullName: string
  description?: string
  private: boolean
  url: string
}

export interface WorkspaceStats {
  totalFeedbacks: number
  totalIssues: number
  totalBoards: number
  totalUsers: number
}

/**
 * Create a new workspace
 */
export const createWorkspace = async (data: CreateWorkspaceInput): Promise<Workspace> => {
  try {
    const response = await axiosInstance.post('/workspaces', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Create workspace failed')
  }
}

/**
 * Get a specific workspace by ID
 */
export const getWorkspace = async (id: number): Promise<Workspace> => {
  try {
    const response = await axiosInstance.get(`/workspaces/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get workspace failed')
  }
}

/**
 * Get all workspaces for the current user
 */
export const getWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const response = await axiosInstance.get('/workspaces')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get workspaces failed')
  }
}

/**
 * Update an existing workspace
 */
export const updateWorkspace = async (
  id: number,
  data: UpdateWorkspaceInput
): Promise<Workspace> => {
  try {
    const response = await axiosInstance.put(`/workspaces/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Update workspace failed')
  }
}

/**
 * Delete a workspace
 */
export const deleteWorkspace = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/workspaces/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Delete workspace failed')
  }
}

/**
 * Switch to a different workspace
 */
export const switchWorkspace = async (newWorkspaceId: number): Promise<{ token: string }> => {
  try {
    const response = await axiosInstance.post('/auth/shift-workspace', {
      newWorkspaceId,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Switch workspace failed')
  }
}

/**
 * Get GitHub repositories for the workspace
 */
export const getGithubRepos = async (): Promise<GithubRepo[]> => {
  try {
    const response = await axiosInstance.get('/github/repos')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get GitHub repos failed')
  }
}

/**
 * Update workspace GitHub repository configuration
 */
export const updateWorkspaceGithubRepo = async (repoName: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/github/repo', {
      githubRepoName: repoName,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Update GitHub repo failed')
  }
}

/**
 * Get workspace statistics
 */
export const getWorkspaceStats = async (workspaceId: number): Promise<WorkspaceStats> => {
  try {
    const response = await axiosInstance.get(`/workspaces/${workspaceId}/stats`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get workspace stats failed')
  }
}