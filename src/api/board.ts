import axiosInstance from '@/utils/axiosBase'
import type { CreateBoardInput, UpdateBoardInput } from '@/formSchemas/boardSchema'

// Board API response types
export interface Board {
  id: number
  name: string
  description?: string
  isPublic: boolean
  publicUrl?: string
  workspaceId: number
  createdAt: string
  updatedAt: string
  issueCount?: number
  feedbackCount?: number
  // Additional properties used in components
  feedbacksCount?: number
  subscribersCount?: number
  viewsCount?: number
  status?: string
  category?: string
  activeIssuesCount?: number
}

export interface BoardIssue {
  id: number
  title: string
  description?: string
  status: string
  priority?: string
  upvotes: number
  createdAt: string
  updatedAt: string
}

export interface IssueDiscussion {
  id: number
  content: string
  authorName: string
  createdAt: string
}

/**
 * Get all boards for the current workspace
 */
export const getBoards = async (): Promise<Board[]> => {
  try {
    const response = await axiosInstance.get('/boards')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch boards')
  }
}

/**
 * Get all boards for a specific workspace
 */
export const getWorkspaceBoards = async (): Promise<Board[]> => {
  try {
    const response = await axiosInstance.get('/boards')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workspace boards')
  }
}

/**
 * Get a specific board by ID
 */
export const getBoard = async (id: number): Promise<Board> => {
  try {
    const response = await axiosInstance.get(`/boards/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch board')
  }
}

/**
 * Create a new board
 */
export const createBoard = async (data: CreateBoardInput): Promise<Board> => {
  try {
    const response = await axiosInstance.post('/boards', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create board')
  }
}

/**
 * Update an existing board
 */
export const updateBoard = async (id: number, data: UpdateBoardInput): Promise<Board> => {
  try {
    const response = await axiosInstance.put(`/boards/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update board')
  }
}

/**
 * Delete a board
 */
export const deleteBoard = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/boards/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete board')
  }
}

/**
 * Add an issue to a board
 */
export const addIssueToBoard = async (boardId: number, issueId: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post(`/boards/${boardId}/issues`, {
      issueId,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add issue to board')
  }
}

/**
 * Get all issues for a specific board
 */
export const getBoardIssues = async (boardId: number): Promise<BoardIssue[]> => {
  try {
    const response = await axiosInstance.get(`/boards/${boardId}/issues`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch board issues')
  }
}

/**
 * Get discussions for a specific issue on a board
 */
export const getIssueDiscussions = async (boardId: number, issueId: number): Promise<IssueDiscussion[]> => {
  try {
    const response = await axiosInstance.get(
      `/boards/${boardId}/issues/${issueId}/discussions`,
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch issue discussions')
  }
}

/**
 * Add a discussion to an issue
 */
export const addIssueDiscussion = async (
  boardId: number,
  issueId: number,
  content: string,
): Promise<IssueDiscussion> => {
  try {
    const response = await axiosInstance.post(
      `/boards/${boardId}/issues/${issueId}/discussions`,
      { content },
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add discussion')
  }
}

/**
 * Upvote an issue on a board
 */
export const upvoteIssue = async (boardId: number, issueId: number): Promise<{ message: string; upvotes: number }> => {
  try {
    const response = await axiosInstance.post(
      `/boards/${boardId}/issues/${issueId}/upvote`,
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upvote issue')
  }
}

/**
 * Make a board public
 */
export const makeBoardPublic = async (id: number): Promise<Board> => {
  try {
    const response = await axiosInstance.post(`/boards/${id}/make-public`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to make board public')
  }
}

/**
 * Make a board private
 */
export const makeBoardPrivate = async (id: number): Promise<Board> => {
  try {
    const response = await axiosInstance.post(`/boards/${id}/make-private`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to make board private')
  }
}

/**
 * Get board statistics
 */
export const getBoardStats = async (boardId: number): Promise<{
  issuesCount: number
  feedbacksCount: number
  subscribersCount: number
  viewsCount: number
  activityScore: number
}> => {
  try {
    const response = await axiosInstance.get(`/boards/${boardId}/stats`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get board stats')
  }
}

/**
 * Subscribe to a board
 */
export const subscribeToBoard = async (boardId: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post(`/boards/${boardId}/subscribe`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to subscribe to board')
  }
}

/**
 * Unsubscribe from a board
 */
export const unsubscribeFromBoard = async (boardId: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/boards/${boardId}/subscribe`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to unsubscribe from board')
  }
}