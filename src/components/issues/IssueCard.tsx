import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Eye, 
  MoreVertical, 
  CheckCircle, 
  Play, 
  User, 
  Calendar,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as issueApi from '@/api/issue'
import type { Issue } from '@/api/issue'
import type { IssueStatus } from '@/utils/constants'
import { formatDateTime } from '@/utils/dateFormatter'

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const [isSelected, setIsSelected] = useState(false)
  const queryClient = useQueryClient()

  // Mutations for issue actions
  const deleteMutation = useMutation({
    mutationFn: () => issueApi.deleteIssue(issue.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all })
      toast.success('Issue deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete issue')
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: (status: IssueStatus) => issueApi.updateIssue(issue.id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all })
      toast.success('Issue status updated')
    },
    onError: () => {
      toast.error('Failed to update issue status')
    },
  })

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 4:
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      case 3:
        return <ArrowUp className="h-3 w-3 text-orange-500" />
      case 2:
        return <Minus className="h-3 w-3 text-yellow-500" />
      case 1:
      default:
        return <ArrowDown className="h-3 w-3 text-green-500" />
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return 'Critical'
      case 3: return 'High'
      case 2: return 'Medium'
      case 1:
      default: return 'Low'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'testing':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => setIsSelected(checked as boolean)}
          className="mt-1"
        />
        
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center gap-1">
              {getPriorityIcon(issue.priority)}
              <span className="text-xs font-medium text-muted-foreground">
                #{issue.id}
              </span>
            </div>
            <h3 className="font-medium text-sm">{issue.title}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(issue.createdAt)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {issue.description}
          </p>

          {/* Tags and Metadata */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(issue.status)}`}
            >
              {issue.status || 'Open'}
            </Badge>
            
            <Badge variant="outline" className="text-xs">
              {getPriorityIcon(issue.priority)}
              <span className="ml-1">{getPriorityLabel(issue.priority)}</span>
            </Badge>
            
            {issue.board && (
              <Badge variant="outline" className="text-xs text-blue-600 bg-blue-100 border-blue-300">
                {issue.board.name}
              </Badge>
            )}
            
            {issue.assignedTo && (
              <Badge variant="outline" className="text-xs text-purple-600 bg-purple-100 border-purple-300">
                <User className="h-3 w-3 mr-1" />
                {issue.assignedTo.name}
              </Badge>
            )}
            
            {issue.linkedFeedbacksCount && issue.linkedFeedbacksCount > 0 && (
              <Badge variant="outline" className="text-xs text-green-600 bg-green-100 border-green-300">
                <MessageSquare className="h-3 w-3 mr-1" />
                {issue.linkedFeedbacksCount} feedback{issue.linkedFeedbacksCount === 1 ? '' : 's'}
              </Badge>
            )}
            
            {issue.dueDate && (
              <Badge variant="outline" className="text-xs text-orange-600 bg-orange-100 border-orange-300">
                <Calendar className="h-3 w-3 mr-1" />
                Due {formatDateTime(issue.dueDate)}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            // TODO: Implement issue detail view
            console.log('View issue:', issue.id)
          }}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {issue.status !== 'WIP' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateStatusMutation.mutate('WIP')}
              disabled={updateStatusMutation.isPending}
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
          
          {issue.status !== 'Done' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateStatusMutation.mutate('Done')}
              disabled={updateStatusMutation.isPending}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateStatusMutation.mutate('Todo')}>
                Move to Todo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatusMutation.mutate('Backlog')}>
                Move to Backlog
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="text-red-600"
              >
                Delete Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}