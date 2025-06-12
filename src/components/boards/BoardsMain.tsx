import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BoardCard } from './BoardCard'
import { CreateBoardSidebar } from './CreateBoardSidebar'
import { EditBoardSidebar } from './EditBoardSidebar'
import { queryKeys } from '@/lib/queryKeys'
import * as boardApi from '@/api/board'
import type { Board } from '@/api/board'
import { useAuthStore } from '@/stores/authStore'

export function BoardsMain() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [createSidebarOpen, setCreateSidebarOpen] = useState(false)
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)

  const { user } = useAuthStore()

  const { data: boards = [], isLoading, error } = useQuery({
    queryKey: queryKeys.boards.workspaceBoards(user?.workspaceId?.toString() || ''),
    queryFn: () => boardApi.getWorkspaceBoards(),
    enabled: !!user?.workspaceId,
  })

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board)
    setEditSidebarOpen(true)
  }

  const handleCloseEditSidebar = () => {
    setEditSidebarOpen(false)
    setEditingBoard(null)
  }

  // Filter boards based on search and filters
  const filteredBoards = boards.filter((board) => {
    const matchesSearch = board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         board.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || board.status === statusFilter
    
    const matchesVisibility = visibilityFilter === 'all' || 
                             (visibilityFilter === 'public' && board.isPublic) ||
                             (visibilityFilter === 'private' && !board.isPublic)
    
    return matchesSearch && matchesStatus && matchesVisibility
  })

  const activeBoards = boards.filter(board => board.status === 'active').length
  const publicBoards = boards.filter(board => board.isPublic).length
  const totalFeedbacks = boards.reduce((sum, board) => sum + (board.feedbacksCount || 0), 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load boards. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Boards</h1>
          <p className="text-muted-foreground">
            Organize feedback and feature requests into focused boards
          </p>
        </div>
        <Button onClick={() => setCreateSidebarOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Boards</div>
          <div className="text-2xl font-bold">{boards?.length || 0}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground">Active Boards</div>
          <div className="text-2xl font-bold text-green-600">{activeBoards}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground">Public Boards</div>
          <div className="text-2xl font-bold text-blue-600">{publicBoards}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Feedback</div>
          <div className="text-2xl font-bold text-purple-600">{totalFeedbacks}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Badge variant="secondary" className="mr-2">
              {filteredBoards.length} boards
            </Badge>
          </div>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredBoards.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📋</span>
          </div>
          {searchQuery || statusFilter !== 'all' || visibilityFilter !== 'all' ? (
            <>
              <h3 className="text-lg font-medium mb-2">No boards found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find boards.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setVisibilityFilter('all')
                }}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No boards yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first board to start organizing feedback and feature requests.
              </p>
              <Button onClick={() => setCreateSidebarOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Board
              </Button>
            </>
          )}
        </div>
      )}

      {/* Boards Grid/List */}
      {filteredBoards.length > 0 && (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredBoards.map((board) => (
            <BoardCard 
              key={board.id} 
              board={board} 
              onEdit={handleEditBoard}
            />
          ))}
        </div>
      )}

      {/* Sidebars */}
      <CreateBoardSidebar
        isOpen={createSidebarOpen}
        onClose={() => setCreateSidebarOpen(false)}
      />

      {editingBoard && (
        <EditBoardSidebar
          isOpen={editSidebarOpen}
          onClose={handleCloseEditSidebar}
          board={editingBoard}
        />
      )}
    </div>
  )
}