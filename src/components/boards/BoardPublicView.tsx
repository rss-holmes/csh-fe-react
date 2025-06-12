import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { 
  Globe, 
  MessageSquare,
  Eye,
  Plus,
  ThumbsUp,
  Search,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { queryKeys } from '@/lib/queryKeys'
import * as publicBoardsApi from '@/api/publicBoards'
import { IssueListPublic } from './IssueListPublic'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/utils/dateFormatter'
import { z } from 'zod'

// Schema for public feedback submission
const publicFeedbackSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
})

type PublicFeedbackInput = z.infer<typeof publicFeedbackSchema>

export function BoardPublicView() {
  const { boardUrl } = useParams({ from: '/public/board/$boardUrl' })
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes')

  // Track view
  useEffect(() => {
    if (boardUrl) {
      publicBoardsApi.trackBoardView(boardUrl)
    }
  }, [boardUrl])

  const { data: board, isLoading: boardLoading, error: boardError } = useQuery({
    queryKey: queryKeys.publicBoards.board(boardUrl),
    queryFn: () => publicBoardsApi.getPublicBoard(boardUrl),
    retry: false,
  })

  const { data: publicIssues, isLoading: issuesLoading } = useQuery({
    queryKey: queryKeys.publicBoards.boardIssues(boardUrl),
    queryFn: () => publicBoardsApi.getPublicBoardIssues(boardUrl),
    enabled: !!board,
  })

  const form = useForm<PublicFeedbackInput>({
    resolver: zodResolver(publicFeedbackSchema),
    defaultValues: {
      title: '',
      description: '',
      name: '',
      email: '',
    },
  })

  const submitFeedbackMutation = useMutation({
    mutationFn: (data: PublicFeedbackInput) => 
      publicBoardsApi.submitPublicFeedback(boardUrl, data),
    onSuccess: () => {
      toast.success('Thank you for your feedback! We\'ll review it soon.')
      form.reset()
      setSubmitModalOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit feedback')
    },
  })

  const subscribeMutation = useMutation({
    mutationFn: (email: string) => 
      publicBoardsApi.subscribeToBoard(boardUrl, email),
    onSuccess: () => {
      toast.success('Successfully subscribed to board updates')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to subscribe')
    },
  })

  const onSubmitFeedback = (data: PublicFeedbackInput) => {
    submitFeedbackMutation.mutate(data)
  }

  // Filter and sort issues
  const filteredAndSortedIssues = publicIssues?.filter((issue) => {
    return issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           issue.description?.toLowerCase().includes(searchQuery.toLowerCase())
  }).sort((a, b) => {
    if (sortBy === 'votes') {
      return ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0))
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }) || []

  if (boardLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mb-2" />
            <Skeleton className="h-6 w-3/4 max-w-2xl" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (boardError || !board) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Globe className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Board Not Found</h1>
          <p className="text-muted-foreground">
            This board doesn't exist or is not publicly accessible.
          </p>
        </div>
      </div>
    )
  }

  // Calculate stats
  const totalVotes = publicIssues?.reduce((sum, issue) => 
    sum + (issue.upvotes || 0) + (issue.downvotes || 0), 0
  ) || 0
  
  const topRequested = publicIssues?.slice(0, 1)[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">{board.name}</h1>
              </div>
              {board.description && (
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {board.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                {board.category && (
                  <Badge variant="outline">
                    {board.category}
                  </Badge>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {formatDateTime(board.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {board.viewsCount || 0} views
                </span>
              </div>
            </div>
            
            <Button onClick={() => setSubmitModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publicIssues?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {board.subscribersCount || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Most Requested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium truncate">
                {topRequested ? topRequested.title : 'None yet'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscribe Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when new items are added or when there are updates to this board.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-64"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      subscribeMutation.mutate(e.currentTarget.value)
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input?.value) {
                      subscribeMutation.mutate(input.value)
                    }
                  }}
                  disabled={subscribeMutation.isPending}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="roadmap" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="changelog">Changelog</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button
                  variant={sortBy === 'votes' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('votes')}
                >
                  Most Voted
                </Button>
                <Button
                  variant={sortBy === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('recent')}
                >
                  Recent
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="roadmap">
            {issuesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <IssueListPublic 
                issues={filteredAndSortedIssues}
                boardUrl={boardUrl}
              />
            )}
          </TabsContent>

          <TabsContent value="changelog">
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Changelog Coming Soon</h3>
              <p className="text-muted-foreground">
                Track the progress and updates for this board.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Submit Feedback Modal */}
      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Share your ideas, feature requests, or report issues. Your feedback helps shape our roadmap.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitFeedback)} className="space-y-6">
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief summary of your feedback" 
                        {...field} 
                      />
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
                        placeholder="Provide detailed information about your feedback, use case, or the problem you're trying to solve..."
                        className="min-h-[150px]"
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
                  disabled={submitFeedbackMutation.isPending}
                  className="flex-1"
                >
                  {submitFeedbackMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSubmitModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}