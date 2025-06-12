import axiosInstance from '@/utils/axiosBase'

// GitHub API response types
export interface GithubCallbackResponse {
  success: boolean
  message?: string
  redirectUrl?: string
}

export interface GithubRepo {
  id: number
  name: string
  fullName: string
  description?: string
  private: boolean
  url: string
  owner: {
    login: string
    avatar_url: string
  }
  language?: string
  stargazers_count: number
  forks_count: number
  updated_at: string
}

export interface GithubIntegrationStatus {
  isConnected: boolean
  username?: string
  avatarUrl?: string
  connectedAt?: string
  repositories?: GithubRepo[]
}

/**
 * Handle GitHub OAuth callback
 */
export const githubOAuthCallback = async (code: string): Promise<GithubCallbackResponse> => {
  try {
    const response = await axiosInstance.post('/github/oauth/callback', {
      code,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'GitHub OAuth callback failed')
  }
}

/**
 * Get GitHub integration status for the workspace
 */
export const getGithubIntegrationStatus = async (): Promise<GithubIntegrationStatus> => {
  try {
    const response = await axiosInstance.get('/github/status')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get GitHub status failed')
  }
}

/**
 * Get connected GitHub repositories
 */
export const getGithubRepositories = async (): Promise<GithubRepo[]> => {
  try {
    const response = await axiosInstance.get('/github/repos')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get GitHub repositories failed')
  }
}

/**
 * Connect a GitHub repository to the workspace
 */
export const connectGithubRepository = async (repoName: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/github/repo', {
      githubRepoName: repoName,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Connect GitHub repository failed')
  }
}

/**
 * Disconnect GitHub integration
 */
export const disconnectGithub = async (): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete('/github/disconnect')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Disconnect GitHub failed')
  }
}

/**
 * Sync GitHub issues with workspace
 */
export const syncGithubIssues = async (): Promise<{ message: string; syncedCount: number }> => {
  try {
    const response = await axiosInstance.post('/github/sync-issues')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sync GitHub issues failed')
  }
}