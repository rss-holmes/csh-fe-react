import { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Edit2,
  Save,
  X,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Hash,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as issueApi from '@/api/issue'
import * as userApi from '@/api/user'
import { updateIssueSchema, type UpdateIssueInput } from '@/formSchemas/issueSchema'
import { formatDateTime } from '@/utils/dateFormatter'

interface IssueDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  issueId: number
  canEdit?: boolean
}

interface Comment {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
}

export function IssueDetailsModal({ isOpen, onClose, issueId, canEdit = true }: IssueDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()
  // const { user } = useAuthStore()

  const { data: issue, isLoading: issueLoading } = useQuery({
    queryKey: queryKeys.issues.issue(issueId.toString()),
    queryFn: () => issueApi.getIssue(issueId),
    enabled: isOpen && !!issueId,
  })

  const { data: users } = useQuery({
    queryKey: queryKeys.users.workspaceUsers(''),
    queryFn: userApi.getWorkspaceUsers,
    enabled: isOpen && canEdit,
  })

  const form = useForm<UpdateIssueInput>({
    resolver: zodResolver(updateIssueSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 2,
      status: 'No Status',
    },
  })

  // Update form when issue data is loaded
  useEffect(() => {
    if (issue) {
      form.reset({
        title: issue.title || '',
        description: issue.description || '',
        priority: issue.priority || 2,
        status: issue.status || 'No Status',
        assignedToId: issue.assignedToId,
        dueDate: issue.dueDate ? new Date(issue.dueDate) : undefined,
      })
    }
  }, [issue, form])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateIssueInput) => issueApi.updateIssue(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.issue(issueId.toString()) })
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.all })
      toast.success('Issue updated successfully')
      setIsEditing(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update issue')
    },
  })

  const voteMutation = useMutation({
    mutationFn: (voteType: 'up' | 'down') => issueApi.voteOnIssue(issueId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.issue(issueId.toString()) })
      toast.success('Vote recorded')
    },
    onError: () => {
      toast.error('Failed to record vote')
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => issueApi.addIssueComment(issueId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.issueComments(issueId.toString()) })
      toast.success('Comment added')
      setNewComment('')
    },
    onError: () => {
      toast.error('Failed to add comment')
    },
  })

  const onSubmit = (data: UpdateIssueInput) => {
    updateMutation.mutate(data)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment.trim())
    }
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

  if (!issue && !issueLoading) {
    return null
  }

  // Mock comments for demo - in real app, fetch from API
  const comments: Comment[] = []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">
                Issue Details
              </DialogTitle>
              {issue && (
                <Badge variant="outline" className="text-sm">
                  <Hash className="h-3 w-3 mr-1" />
                  {issue.id}
                </Badge>
              )}
            </div>
            {canEdit && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {isEditing && canEdit ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Low</SelectItem>
                              <SelectItem value="2">Medium</SelectItem>
                              <SelectItem value="3">High</SelectItem>
                              <SelectItem value="4">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="testing">Testing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="assignedToId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                          value={field.value?.toString() || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Unassigned</SelectItem>
                            {users?.map((user) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field}
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button type="submit" disabled={updateMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : issue ? (
              <>
                {/* Issue Details View */}
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
                    
                    {issue.board && (
                      <Badge variant="outline" className="text-blue-600 bg-blue-100 border-blue-300">
                        {issue.board.name}
                      </Badge>
                    )}
                    
                    {issue.assignedTo && (
                      <Badge variant="outline" className="text-purple-600 bg-purple-100 border-purple-300">
                        <User className="h-3 w-3 mr-1" />
                        {issue.assignedTo.name}
                      </Badge>
                    )}
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
                      <span className="text-muted-foreground">Created by:</span>
                      <span>{issue.createdBy.name}</span>
                    </div>
                  )}
                </div>

                {/* Voting Section */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => voteMutation.mutate('up')}
                    disabled={voteMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{issue.upvotes || 0}</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => voteMutation.mutate('down')}
                    disabled={voteMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{issue.downvotes || 0}</span>
                  </Button>
                  
                  <div className="flex-1" />
                  
                  {issue.linkedFeedbacksCount && issue.linkedFeedbacksCount > 0 && (
                    <Badge variant="outline" className="text-green-600 bg-green-100 border-green-300">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {issue.linkedFeedbacksCount} linked feedback
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments
                  </h3>

                  {/* Add Comment */}
                  {canEdit && (
                    <div className="mb-4">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] mb-2"
                      />
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || addCommentMutation.isPending}
                      >
                        {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                      </Button>
                    </div>
                  )}

                  {/* Comments List */}
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
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