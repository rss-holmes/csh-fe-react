import axiosInstance from '@/utils/axiosBase'

// Public Boards API response types
export interface PublicBoardDetails {
  id: number
  name: string
  description: string
  publicUrl: string
  isActive: boolean
  workspace: {
    id: number
    name: string
  }
  branding?: {
    logoUrl?: string
    primaryColor?: string
    customCSS?: string
  }
}

export interface PublicBoardIssue {
  id: number
  title: string
  description: string
  priority: number
  upvotes: number
  comments: number
  status: string
  createdAt: string
  tags?: string[]
  category?: string
}

export interface PublicIssueComment {
  id: number
  content: string
  createdAt: string
  createdBy: {
    id: number
    name: string
    email?: string
    avatar?: string
  }
  isAuthor: boolean
  isWorkspaceMember: boolean
}

export interface PublicIssueVote {
  hasVoted: boolean
  totalVotes: number
}

/**
 * Get public board details by public URL
 */
export const getPublicBoardDetails = async (publicUrl: string): Promise<PublicBoardDetails> => {
  try {
    const response = await axiosInstance.get(`/public/${publicUrl}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get public board details failed')
  }
}

/**
 * Get issues for a public board
 */
export const getPublicBoardIssues = async (publicUrl: string): Promise<PublicBoardIssue[]> => {
  try {
    const response = await axiosInstance.get(`/public/${publicUrl}/issues`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get public board issues failed')
  }
}

/**
 * Get discussions/comments for a public board issue
 */
export const getPublicBoardIssueDiscussions = async (
  publicUrl: string,
  issueId: number
): Promise<PublicIssueComment[]> => {
  try {
    const response = await axiosInstance.get(`/public/${publicUrl}/issues/${issueId}/discussions`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get issue discussions failed')
  }
}

/**
 * Upvote a public board issue
 */
export const upvotePublicBoardIssue = async (
  publicUrl: string,
  issueId: number
): Promise<PublicIssueVote> => {
  try {
    const response = await axiosInstance.post(`/public/${publicUrl}/issues/${issueId}/upvote`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Upvote issue failed')
  }
}

/**
 * Remove upvote from a public board issue
 */
export const removeUpvotePublicBoardIssue = async (
  publicUrl: string,
  issueId: number
): Promise<PublicIssueVote> => {
  try {
    const response = await axiosInstance.delete(`/public/${publicUrl}/issues/${issueId}/upvote`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Remove upvote failed')
  }
}

/**
 * Add a discussion/comment to a public board issue
 */
export const addDiscussionToPublicBoardIssue = async (
  publicUrl: string,
  issueId: number,
  content: string
): Promise<PublicIssueComment> => {
  try {
    const response = await axiosInstance.post(`/public/${publicUrl}/issues/${issueId}/discussions`, {
      content,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Add discussion failed')
  }
}

/**
 * Submit a new issue to a public board
 */
export const submitPublicBoardIssue = async (
  publicUrl: string,
  data: {
    title: string
    description: string
    category?: string
    priority?: number
    userEmail?: string
    userName?: string
  }
): Promise<PublicBoardIssue> => {
  try {
    const response = await axiosInstance.post(`/public/${publicUrl}/issues`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Submit issue failed')
  }
}

/**
 * Get vote status for a specific issue
 */
export const getPublicIssueVoteStatus = async (
  publicUrl: string,
  issueId: number
): Promise<PublicIssueVote> => {
  try {
    const response = await axiosInstance.get(`/public/${publicUrl}/issues/${issueId}/vote-status`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get vote status failed')
  }
}