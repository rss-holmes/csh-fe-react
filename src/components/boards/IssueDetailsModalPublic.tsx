import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { 
  Calendar,
  Clock,
  User,
  MessageSquare,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Hash,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as publicBoardsApi from '@/api/publicBoards'
import type { PublicBoardIssue } from '@/api/publicBoards'
import { formatDateTime } from '@/utils/dateFormatter'
import { z } from 'zod'

// Schema for public comments
const publicCommentSchema = z.object({
  content: z.string().min(5, 'Comment must be at least 5 characters'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
})

type PublicCommentInput = z.infer<typeof publicCommentSchema>

interface IssueDetailsModalPublicProps {
  isOpen: boolean
  onClose: () => void
  issueId: number
  boardUrl: string
}

export function IssueDetailsModalPublic({ isOpen, onClose, issueId, boardUrl }: IssueDetailsModalPublicProps) {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: issue, isLoading: issueLoading } = useQuery({
    queryKey: queryKeys.publicBoards.issue(boardUrl, issueId.toString()),
    queryFn: () => publicBoardsApi.getPublicIssue(boardUrl, issueId),
    enabled: isOpen && !!issueId,
  })

  const { data: comments = [] } = useQuery({
    queryKey: queryKeys.publicBoards.issueComments(boardUrl, issueId.toString()),
    queryFn: () => publicBoardsApi.getPublicIssueComments(boardUrl, issueId),
    enabled: isOpen && !!issueId,
  })

  const form = useForm<PublicCommentInput>({
    resolver: zodResolver(publicCommentSchema),
    defaultValues: {
      content: '',
      name: '',
      email: '',
    },
  })

  const voteMutation = useMutation({
    mutationFn: (voteType: 'up' | 'down') => 
      publicBoardsApi.voteOnPublicIssue(boardUrl, issueId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publicBoards.issue(boardUrl, issueId.toString()) })
      queryClient.invalidateQueries({ queryKey: queryKeys.publicBoards.boardIssues(boardUrl) })
      toast.success('Vote recorded')
    },
    onError: () => {
      toast.error('Failed to record vote')
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: (data: PublicCommentInput) => 
      publicBoardsApi.addPublicComment(boardUrl, issueId, data.content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publicBoards.issueComments(boardUrl, issueId.toString()) })
      toast.success('Comment added successfully')
      form.reset()
      setShowCommentForm(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment')
    },
  })

  const reportMutation = useMutation({
    mutationFn: () => publicBoardsApi.reportPublicIssue(boardUrl, issueId, 'Inappropriate content'),
    onSuccess: () => {
      toast.success('Issue reported. We\'ll review it shortly.')
    },
    onError: () => {
      toast.error('Failed to report issue')
    },
  })

  const onSubmitComment = (data: PublicCommentInput) => {
    addCommentMutation.mutate(data)
  }

  const handleVote = (voteType: 'up' | 'down') => {
    voteMutation.mutate(voteType)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/public/board/${boardUrl}/issue/${issueId}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard')
  }

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

  if (!issue && !issueLoading) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">
                Feature Request
              </DialogTitle>
              {issue && (
                <Badge variant="outline" className="text-sm">
                  <Hash className="h-3 w-3 mr-1" />
                  {issue.id}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => reportMutation.mutate()}
                disabled={reportMutation.isPending}
              >
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {issue ? (
              <>
                {/* Issue Details */}
                <div>
                  <h2 className="text-2xl font-semibold mb-3">{issue.title}</h2>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(issue.status)}`}
                    >
                      {issue.status || 'Open'}
                    </Badge>
                    
                    <Badge variant="outline">
                      {getPriorityIcon(issue.priority)}
                      <span className="ml-1">{getPriorityLabel(issue.priority)}</span>
                    </Badge>
                  </div>

                  {issue.description && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap">{issue.description}</p>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDateTime(issue.createdAt)}</span>
                  </div>
                  
                  {issue.updatedAt !== issue.createdAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Updated:</span>
                      <span>{formatDateTime(issue.updatedAt)}</span>
                    </div>
                  )}
                  
                  {issue.dueDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due Date:</span>
                      <span>{formatDateTime(issue.dueDate)}</span>
                    </div>
                  )}
                  
                  {issue.createdBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Requested by:</span>
                      <span>{issue.createdBy.name}</span>
                    </div>
                  )}
                </div>

                {/* Voting Section */}
                <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{getVoteScore(issue)}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={issue.userVoteType === 'up' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleVote('up')}
                      disabled={voteMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{issue.upvotes || 0}</span>
                    </Button>
                    
                    <Button
                      variant={issue.userVoteType === 'down' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleVote('down')}
                      disabled={voteMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>{issue.downvotes || 0}</span>
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-1">{comments.length}</div>
                    <div className="text-sm text-muted-foreground">Comments</div>
                  </div>
                </div>

                <Separator />

                {/* Comments Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Discussion ({comments.length})
                    </h3>
                    
                    {!showCommentForm && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowCommentForm(true)}
                      >
                        Add Comment
                      </Button>
                    )}
                  </div>

                  {/* Add Comment Form */}
                  {showCommentForm && (
                    <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="john@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Share your thoughts on this request..."
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-3">
                            <Button 
                              type="submit" 
                              disabled={addCommentMutation.isPending}
                              size="sm"
                            >
                              {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowCommentForm(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}

                  {/* Comments List */}
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-4 border rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">
                                {comment.createdBy.name}
                              </span>
                              {comment.isWorkspaceMember && (
                                <Badge variant="secondary" className="text-xs">
                                  Team Member
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}