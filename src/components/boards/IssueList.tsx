import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { IssueCard } from '../issues/IssueCard'
import { AddIssueModal } from './AddIssueModal'
import { 
  Plus, 
  Search, 
  Filter,
  ArrowUp,
  ArrowDown,
  Calendar,
  User
} from 'lucide-react'
import { queryKeys } from '@/lib/queryKeys'
import * as issueApi from '@/api/issue'
import type { Issue } from '@/api/issue'

interface IssueListProps {
  boardId: number
  showAddButton?: boolean
}

export function IssueList({ boardId, showAddButton = true }: IssueListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [addIssueModalOpen, setAddIssueModalOpen] = useState(false)

  const { data: issues, isLoading, error } = useQuery({
    queryKey: queryKeys.issues.boardIssues(boardId.toString()),
    queryFn: () => issueApi.getBoardIssues(boardId),
    enabled: !!boardId,
  })

  // Filter and sort issues
  const filteredAndSortedIssues = issues?.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
    
    const matchesPriority = priorityFilter === 'all' || 
                           issue.priority.toString() === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  }).sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'priority':
        comparison = a.priority - b.priority
        break
      case 'status':
        comparison = (a.status || '').localeCompare(b.status || '')
        break
      case 'dueDate':
        const aDate = a.dueDate ? new Date(a.dueDate) : new Date(0)
        const bDate = b.dueDate ? new Date(b.dueDate) : new Date(0)
        comparison = aDate.getTime() - bDate.getTime()
        break
      case 'created':
      default:
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  }) || []

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const getStatusCounts = () => {
    if (!issues) return {}
    
    return issues.reduce((counts, issue) => {
      const status = issue.status || 'open'
      counts[status] = (counts[status] || 0) + 1
      return counts
    }, {} as Record<string, number>)
  }

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Filters Skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Issues Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-4 w-4 mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-7 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load issues. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Issues</h2>
          <p className="text-muted-foreground">
            Track and manage issues related to this board
          </p>
        </div>
        {showAddButton && (
          <Button onClick={() => setAddIssueModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Issue
          </Button>
        )}
      </div>

      {/* Status Overview */}
      {Object.keys(statusCounts).length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            Total: {issues?.length || 0}
          </Badge>
          {Object.entries(statusCounts).map(([status, count]) => (
            <Badge key={status} variant="outline" className="text-xs">
              {status}: {count}
            </Badge>
          ))}
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="1">Low</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="3">High</SelectItem>
            <SelectItem value="4">Critical</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="px-2"
          >
            {sortOrder === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredAndSortedIssues.length} of {issues?.length || 0} issues
        </span>
        {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setPriorityFilter('all')
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Issues List */}
      {filteredAndSortedIssues.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🐛</span>
          </div>
          {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ? (
            <>
              <h3 className="text-lg font-medium mb-2">No issues found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find issues.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setPriorityFilter('all')
                }}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No issues yet</h3>
              <p className="text-muted-foreground mb-4">
                Add issues to track bugs, feature requests, and improvements for this board.
              </p>
              {showAddButton && (
                <Button onClick={() => setAddIssueModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Issue
                </Button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {/* Add Issue Modal */}
      <AddIssueModal
        isOpen={addIssueModalOpen}
        onClose={() => setAddIssueModalOpen(false)}
        boardId={boardId}
      />
    </div>
  )
}