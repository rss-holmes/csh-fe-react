import axiosInstance from '@/utils/axiosBase'

// Public Boards API response types
export interface PublicBoardDetails {
  id: number
  name: string
  description: string
  publicUrl: string
  isActive: boolean
  category?: string
  createdAt: string
  viewsCount: number
  subscribersCount: number
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
  downvotes: number
  comments: number
  status: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  tags?: string[]
  category?: string
  userVoteType?: 'up' | 'down' | null
  createdBy?: {
    id: number
    name: string
    email?: string
    avatar?: string
  }
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

/**
 * Track a board view for analytics
 */
export const trackBoardView = async (publicUrl: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post(`/public/${publicUrl}/track-view`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Track board view failed')
  }
}

/**
 * Get public board details
 */
export const getPublicBoard = async (publicUrl: string): Promise<PublicBoardDetails> => {
  try {
    const response = await axiosInstance.get(`/public/${publicUrl}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get public board failed')
  }
}

/**
 * Submit feedback to a public board
 */
export const submitPublicFeedback = async (
  publicUrl: string,
  data: {
    title: string
    description: string
    category?: string
    userEmail?: string
    userName?: string
  }
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post(`/public/${publicUrl}/feedback`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Submit feedback failed')
  }
}

/**
 * Subscribe to a public board
 */
export const subscribeToBoard = async (
  publicUrl: string,
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post(`/public/${publicUrl}/subscribe`, { email })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Subscribe to board failed')
  }
}

/**
 * Get a specific issue from a public board
 */
export const getPublicIssue = async (
  publicUrl: string,
  issueId: number
): Promise<PublicBoardIssue> => {
  try {
    const response = await axiosInstance.get(`/public/${publicUrl}/issues/${issueId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get public issue failed')
  }
}

/**
 * Get comments for a public issue
 */
export const getPublicIssueComments = async (
  publicUrl: string,
  issueId: number
): Promise<PublicIssueComment[]> => {
  return getPublicBoardIssueDiscussions(publicUrl, issueId)
}

/**
 * Vote on a public issue
 */
export const voteOnPublicIssue = async (
  publicUrl: string,
  issueId: number,
  voteType: 'up' | 'down'
): Promise<PublicIssueVote> => {
  if (voteType === 'up') {
    return upvotePublicBoardIssue(publicUrl, issueId)
  } else {
    // For downvote, we'd need a separate API endpoint or handle differently
    throw new Error('Downvoting not implemented in public API')
  }
}

/**
 * Add a comment to a public issue
 */
export const addPublicComment = async (
  publicUrl: string,
  issueId: number,
  content: string
): Promise<PublicIssueComment> => {
  return addDiscussionToPublicBoardIssue(publicUrl, issueId, content)
}

/**
 * Report a public issue
 */
export const reportPublicIssue = async (
  publicUrl: string,
  issueId: number,
  reason: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post(`/public/${publicUrl}/issues/${issueId}/report`, {
      reason,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Report issue failed')
  }
}