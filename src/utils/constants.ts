export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const ISSUE_STATUS = [
  'No Status',
  'Backlog',
  'Todo',
  'WIP',
  'Done',
] as const

export const FEEDBACK_STATUS = [
  'Open',
  'In Issue',
  'Resolved',
  'Later',
  'Spam',
] as const

export const FEEDBACK_SENTIMENT = [
  '',
  'Positive',
  'Neutral',
  'Negative',
] as const

export const FEEDBACK_TYPE = ['', 'Bug Report', 'Feature Request'] as const

export const FEEDBACK_SOURCE = [
  '',
  'slack',
  'hubspot',
  'manual',
  'email',
] as const

export type IssueStatus = typeof ISSUE_STATUS[number]
export type FeedbackStatus = typeof FEEDBACK_STATUS[number]
export type FeedbackSentiment = typeof FEEDBACK_SENTIMENT[number]
export type FeedbackType = typeof FEEDBACK_TYPE[number]
export type FeedbackSource = typeof FEEDBACK_SOURCE[number]