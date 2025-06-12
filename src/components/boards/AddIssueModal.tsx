import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useFormWithSchema } from '@/hooks/useFormWithSchema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Search, CheckCircle2 } from 'lucide-react'
import { queryKeys } from '@/lib/queryKeys'
import * as issueApi from '@/api/issue'
import * as userApi from '@/api/user'
import { createIssueSchema, type CreateIssueInput } from '@/formSchemas/issueSchema'

interface AddIssueModalProps {
  isOpen: boolean
  onClose: () => void
  boardId: number
}

export function AddIssueModal({ isOpen, onClose, boardId }: AddIssueModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedExistingIssues, setSelectedExistingIssues] = useState<number[]>([])
  const [existingIssueSearch, setExistingIssueSearch] = useState('')
  const queryClient = useQueryClient()

  const form = useFormWithSchema<CreateIssueInput>(createIssueSchema, {
    defaultValues: {
      title: '',
      description: '',
      priority: 2,
      status: 'No Status' as const,
      boardId: boardId,
    },
  })

  // Fetch users for assignment
  const { data: users = [] } = useQuery({
    queryKey: queryKeys.users.workspaceUsers(''),
    queryFn: userApi.getWorkspaceUsers,
  })

  // Fetch existing issues from other boards
  const { data: existingIssues = [] } = useQuery({
    queryKey: queryKeys.issues.workspaceIssues(''),
    queryFn: issueApi.getWorkspaceIssues,
  })

  const createMutation = useMutation({
    mutationFn: issueApi.createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.boardIssues(boardId.toString()) })
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.workspaceIssues('') })
      toast.success('Issue created successfully')
      form.reset()
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create issue')
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const linkExistingMutation = useMutation({
    mutationFn: async (issueIds: number[]) => {
      // Link existing issues to this board
      await Promise.all(issueIds.map(issueId => 
        issueApi.updateIssue(issueId, { boardId })
      ))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.boardIssues(boardId.toString()) })
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.workspaceIssues('') })
      toast.success(`${selectedExistingIssues.length} issue(s) linked to board`)
      setSelectedExistingIssues([])
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to link issues')
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: CreateIssueInput) => {
    setIsSubmitting(true)
    createMutation.mutate(data)
  }

  const handleLinkExisting = () => {
    if (selectedExistingIssues.length === 0) {
      toast.error('Please select at least one issue to link')
      return
    }
    setIsSubmitting(true)
    linkExistingMutation.mutate(selectedExistingIssues)
  }

  const handleClose = () => {
    form.reset()
    setSelectedExistingIssues([])
    setExistingIssueSearch('')
    onClose()
  }

  // Filter existing issues (exclude those already on this board)
  const filteredExistingIssues = existingIssues.filter(issue => 
    issue.boardId !== boardId &&
    (issue.title.toLowerCase().includes(existingIssueSearch.toLowerCase()) ||
     issue.description?.toLowerCase().includes(existingIssueSearch.toLowerCase()))
  )

  const toggleIssueSelection = (issueId: number) => {
    setSelectedExistingIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    )
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Issue to Board</DialogTitle>
          <DialogDescription>
            Create a new issue or link existing issues from other boards.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New Issue</TabsTrigger>
            <TabsTrigger value="existing">Link Existing Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the issue" {...field} />
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
                          placeholder="Detailed description of the issue..."
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
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
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
                      <FormLabel>Assign To (Optional)</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
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
                      <FormLabel>Due Date (Optional)</FormLabel>
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

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Creating...' : 'Create Issue'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="existing" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search existing issues..."
                  value={existingIssueSearch}
                  onChange={(e) => setExistingIssueSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {selectedExistingIssues.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedExistingIssues.length} issue(s) selected
                  </span>
                  <Button 
                    size="sm" 
                    onClick={handleLinkExisting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Linking...' : 'Link to Board'}
                  </Button>
                </div>
              )}

              <div className="max-h-96 overflow-y-auto space-y-3">
                {filteredExistingIssues.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No existing issues found. Create a new issue instead.
                    </p>
                  </div>
                ) : (
                  filteredExistingIssues.map((issue) => (
                    <div 
                      key={issue.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedExistingIssues.includes(issue.id) 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleIssueSelection(issue.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedExistingIssues.includes(issue.id)}
                          onChange={() => toggleIssueSelection(issue.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{issue.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              #{issue.id}
                            </Badge>
                          </div>
                          
                          {issue.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {issue.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(issue.status)}`}
                            >
                              {issue.status || 'Open'}
                            </Badge>
                            
                            <Badge variant="outline" className="text-xs">
                              {getPriorityLabel(issue.priority)}
                            </Badge>
                            
                            {issue.board && (
                              <Badge variant="outline" className="text-xs text-blue-600 bg-blue-100 border-blue-300">
                                {issue.board.name}
                              </Badge>
                            )}
                            
                            {issue.assignedTo && (
                              <Badge variant="outline" className="text-xs text-purple-600 bg-purple-100 border-purple-300">
                                {issue.assignedTo.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {selectedExistingIssues.includes(issue.id) && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleLinkExisting}
                  disabled={selectedExistingIssues.length === 0 || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Linking...' : `Link ${selectedExistingIssues.length} Issue(s)`}
                </Button>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}