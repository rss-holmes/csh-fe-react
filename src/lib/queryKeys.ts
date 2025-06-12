/**
 * Query Key Factory Pattern for TanStack Query
 * Provides centralized management of query keys to ensure consistency and ease maintenance
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // Workspace queries
  workspaces: {
    all: ['workspaces'] as const,
    lists: () => [...queryKeys.workspaces.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.workspaces.lists(), filters] as const,
    details: () => [...queryKeys.workspaces.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.workspaces.details(), id] as const,
  },

  // Board queries
  boards: {
    all: ['boards'] as const,
    lists: () => [...queryKeys.boards.all, 'list'] as const,
    list: (workspaceId: string, filters?: string) => 
      [...queryKeys.boards.lists(), workspaceId, filters] as const,
    details: () => [...queryKeys.boards.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.boards.details(), id] as const,
    board: (id: string) => [...queryKeys.boards.all, 'board', id] as const,
    workspaceBoards: (workspaceId: string) => 
      [...queryKeys.boards.all, 'workspace', workspaceId] as const,
    boardStats: (boardId: string) => 
      [...queryKeys.boards.all, 'stats', boardId] as const,
    public: (publicUrl: string) => [...queryKeys.boards.all, 'public', publicUrl] as const,
  },

  // Issue queries
  issues: {
    all: ['issues'] as const,
    lists: () => [...queryKeys.issues.all, 'list'] as const,
    list: (boardId: string, filters?: Record<string, any>) => 
      [...queryKeys.issues.lists(), boardId, filters] as const,
    details: () => [...queryKeys.issues.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.issues.details(), id] as const,
    issue: (id: string) => [...queryKeys.issues.all, 'issue', id] as const,
    workspaceIssues: (workspaceId: string) => 
      [...queryKeys.issues.all, 'workspace', workspaceId] as const,
    boardIssues: (boardId: string) => 
      [...queryKeys.issues.all, 'board', boardId] as const,
    issueComments: (issueId: string) => 
      [...queryKeys.issues.all, 'comments', issueId] as const,
  },

  // Feedback queries
  feedbacks: {
    all: ['feedbacks'] as const,
    lists: () => [...queryKeys.feedbacks.all, 'list'] as const,
    list: (workspaceId: string, filters?: Record<string, any>) => 
      [...queryKeys.feedbacks.lists(), workspaceId, filters] as const,
    details: () => [...queryKeys.feedbacks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.feedbacks.details(), id] as const,
    boardFeedbacks: (boardId: string) => 
      [...queryKeys.feedbacks.all, 'board', boardId] as const,
    workspaceFeedbacks: (workspaceId: string) => 
      [...queryKeys.feedbacks.all, 'workspace', workspaceId] as const,
  },

  // User/Customer queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (workspaceId: string, filters?: string) => 
      [...queryKeys.users.lists(), workspaceId, filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    workspaceUsers: (workspaceId: string) => 
      [...queryKeys.users.all, 'workspace', workspaceId] as const,
  },

  // Customer queries
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (workspaceId: string, filters?: string) => 
      [...queryKeys.customers.lists(), workspaceId, filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },

  // Company queries
  companies: {
    all: ['companies'] as const,
    lists: () => [...queryKeys.companies.all, 'list'] as const,
    list: (workspaceId: string, filters?: string) => 
      [...queryKeys.companies.lists(), workspaceId, filters] as const,
    details: () => [...queryKeys.companies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.companies.details(), id] as const,
  },

  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    metrics: (workspaceId: string, dateRange?: string) => 
      [...queryKeys.dashboard.all, 'metrics', workspaceId, dateRange] as const,
    analytics: (workspaceId: string, type: string) => 
      [...queryKeys.dashboard.all, 'analytics', workspaceId, type] as const,
  },

  // GitHub integration queries
  github: {
    all: ['github'] as const,
    repositories: () => [...queryKeys.github.all, 'repositories'] as const,
    issues: (repoId: string) => [...queryKeys.github.all, 'issues', repoId] as const,
  },

  // S3 upload queries
  s3: {
    all: ['s3'] as const,
    uploadUrl: (fileName: string, fileType: string) => 
      [...queryKeys.s3.all, 'uploadUrl', fileName, fileType] as const,
  },

  // Public boards queries
  publicBoards: {
    all: ['publicBoards'] as const,
    board: (boardUrl: string) => [...queryKeys.publicBoards.all, 'board', boardUrl] as const,
    boardIssues: (boardUrl: string) => 
      [...queryKeys.publicBoards.all, 'issues', boardUrl] as const,
    issue: (boardUrl: string, issueId: string) => 
      [...queryKeys.publicBoards.all, 'issue', boardUrl, issueId] as const,
    issueComments: (boardUrl: string, issueId: string) => 
      [...queryKeys.publicBoards.all, 'comments', boardUrl, issueId] as const,
  },
} as const

/**
 * Utility functions for query invalidation patterns
 */
export const invalidationHelpers = {
  // Invalidate all queries for a specific workspace
  invalidateWorkspace: (workspaceId: string) => ({
    predicate: (query: any) => 
      query.queryKey.some((key: any) => key === workspaceId)
  }),

  // Invalidate all list queries (useful after mutations)
  invalidateAllLists: () => ({
    predicate: (query: any) => 
      query.queryKey.some((key: any) => key === 'list')
  }),

  // Invalidate specific entity type
  invalidateEntityType: (entityType: keyof typeof queryKeys) => ({
    queryKey: queryKeys[entityType].all
  }),
} as const