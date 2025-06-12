import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
  Calendar,
  User,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as publicBoardsApi from '@/api/publicBoards'
import type { PublicBoardIssue } from '@/api/publicBoards'
import { IssueDetailsModalPublic } from './IssueDetailsModalPublic'
import { formatDateTime } from '@/utils/dateFormatter'
interface IssueListPublicProps {
  issues: PublicBoardIssue[]
  boardUrl: string
}

export function IssueListPublic({ issues, boardUrl }: IssueListPublicProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const voteMutation = useMutation({
    mutationFn: ({ issueId, voteType }: { issueId: number; voteType: 'up' | 'down' }) =>
      publicBoardsApi.voteOnPublicIssue(boardUrl, issueId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publicBoards.boardIssues(boardUrl) })
      toast.success('Vote recorded')
    },
    onError: () => {
      toast.error('Failed to record vote')
    },
  })

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 4:
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 3:
        return <ArrowUp className="h-4 w-4 text-orange-500" />
      case 2:
        return <Minus className="h-4 w-4 text-yellow-500" />
      case 1:
      default:
        return <ArrowDown className="h-4 w-4 text-green-500" />
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

  const getVoteScore = (issue: PublicBoardIssue) => {
    return (issue.upvotes || 0) - (issue.downvotes || 0)
  }

  const handleVote = (issueId: number, voteType: 'up' | 'down') => {
    voteMutation.mutate({ issueId, voteType })
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No items yet</h3>
        <p className="text-muted-foreground">
          Be the first to submit feedback to this board!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {issues.map((issue) => (
          <Card 
            key={issue.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedIssueId(issue.id)}
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <Button
                    variant={issue.userVoteType === 'up' ? 'default' : 'outline'}
                    size="sm"
                    className="p-2 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVote(issue.id, 'up')
                    }}
                    disabled={voteMutation.isPending}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  
                  <span className="text-sm font-semibold px-2 py-1 rounded bg-muted min-w-[32px] text-center">
                    {getVoteScore(issue)}
                  </span>
                  
                  <Button
                    variant={issue.userVoteType === 'down' ? 'default' : 'outline'}
                    size="sm"
                    className="p-2 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVote(issue.id, 'down')
                    }}
                    disabled={voteMutation.isPending}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {issue.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2">
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
                        
                        {issue.comments && issue.comments > 0 && (
                          <Badge variant="outline" className="text-xs text-blue-600 bg-blue-100 border-blue-300">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {issue.comments}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedIssueId(issue.id)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Description */}
                  {issue.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {issue.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(issue.createdAt)}
                      </span>
                      
                      {issue.createdBy && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {issue.createdBy.name}
                        </span>
                      )}
                      
                      {issue.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {formatDateTime(issue.dueDate)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span>{issue.upvotes || 0} upvotes</span>
                      {issue.downvotes && issue.downvotes > 0 && (
                        <span>{issue.downvotes} downvotes</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Issue Details Modal */}
      {selectedIssueId && (
        <IssueDetailsModalPublic
          isOpen={!!selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
          issueId={selectedIssueId}
          boardUrl={boardUrl}
        />
      )}
    </>
  )
}