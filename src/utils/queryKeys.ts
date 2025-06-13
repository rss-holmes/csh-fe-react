// Query key factory for consistent query key generation
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    workspaces: ['auth', 'workspaces'] as const,
  },

  // Boards
  boards: {
    all: ['boards'] as const,
    detail: (id: number) => ['boards', id] as const,
    feedbacks: (id: number) => ['boards', id, 'feedbacks'] as const,
    issues: (id: number) => ['boards', id, 'issues'] as const,
    stats: (id: number) => ['boards', id, 'stats'] as const,
  },

  // Public boards
  publicBoards: {
    detail: (url: string) => ['publicBoards', url] as const,
    issues: (url: string) => ['publicBoards', url, 'issues'] as const,
    issue: (url: string, issueId: number) => ['publicBoards', url, 'issues', issueId] as const,
    comments: (url: string, issueId: number) => ['publicBoards', url, 'issues', issueId, 'comments'] as const,
  },

  // Issues
  issues: {
    all: ['issues'] as const,
    detail: (id: number) => ['issues', id] as const,
    comments: (id: number) => ['issues', id, 'comments'] as const,
  },

  // Feedbacks
  feedbacks: {
    all: ['feedbacks'] as const,
    detail: (id: number) => ['feedbacks', id] as const,
  },

  // Customers
  customers: {
    all: ['customers'] as const,
    detail: (id: number) => ['customers', id] as const,
    issues: (id: number) => ['customers', id, 'issues'] as const,
    feedbacks: (id: number) => ['customers', id, 'feedbacks'] as const,
  },

  // Companies
  companies: {
    all: ['companies'] as const,
    detail: (id: number) => ['companies', id] as const,
    users: (id: number) => ['companies', id, 'users'] as const,
    feedbacks: (id: number) => ['companies', id, 'feedbacks'] as const,
    issues: (id: number) => ['companies', id, 'issues'] as const,
  },

  // GitHub
  github: {
    repos: ['github', 'repos'] as const,
    issues: (repo: string) => ['github', 'repos', repo, 'issues'] as const,
  },

  // Features
  features: {
    all: ['features'] as const,
  },

  // Team
  team: {
    members: ['team', 'members'] as const,
    invitations: ['team', 'invitations'] as const,
  },

  // Users (for team management)
  users: {
    all: ['users'] as const,
    detail: (id: number) => ['users', id] as const,
    invitations: ['users', 'invitations'] as const,
  },

  // Workspace
  workspace: {
    current: ['workspace', 'current'] as const,
    members: ['workspace', 'members'] as const,
  },
} as const