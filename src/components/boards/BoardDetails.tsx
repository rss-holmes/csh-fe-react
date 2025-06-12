import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  MoreVertical, 
  Settings, 
  Share2, 
  Eye, 
  Globe, 
  Lock,
  MessageSquare,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as boardApi from '@/api/board'
import * as feedbackApi from '@/api/feedback'
import { EditBoardSidebar } from './EditBoardSidebar'
import { FeedbackCard } from '../feedbacks/FeedbackCard'
import { CreateFeedbackSidebar } from '../feedbacks/CreateFeedbackSidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/utils/dateFormatter'

export function BoardDetails() {
  const { boardId } = useParams({ from: '/board/$boardId' })
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [createFeedbackOpen, setCreateFeedbackOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: board, isLoading: boardLoading, error: boardError } = useQuery({
    queryKey: queryKeys.boards.board(boardId),
    queryFn: () => boardApi.getBoard(parseInt(boardId)),
  })

  const { data: boardFeedbacks, isLoading: feedbacksLoading } = useQuery({
    queryKey: queryKeys.feedbacks.boardFeedbacks(boardId),
    queryFn: () => feedbackApi.getBoardFeedbacks(parseInt(boardId)),
    enabled: !!boardId,
  })

  const { data: boardStats } = useQuery({
    queryKey: queryKeys.boards.boardStats(boardId),
    queryFn: () => boardApi.getBoardStats(parseInt(boardId)),
    enabled: !!boardId,
  })

  const subscribeMutation = useMutation({
    mutationFn: () => boardApi.subscribeToBoard(parseInt(boardId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.board(boardId) })
      toast.success('Subscribed to board updates')
    },
    onError: () => {
      toast.error('Failed to subscribe to board')
    },
  })

  const copyPublicLink = () => {
    if (board?.isPublic) {
      const url = `${window.location.origin}/public/board/${board.publicUrl || board.id}`
      navigator.clipboard.writeText(url)
      toast.success('Public link copied to clipboard')
    }
  }

  if (boardLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-64" />
        </div>
        
        {/* Board Info Skeleton */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-96" />
              <Skeleton className="h-4 w-full max-w-2xl" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
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
      </div>
    )
  }

  if (boardError || !board) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">😕</span>
        </div>
        <h3 className="text-lg font-medium mb-2">Board not found</h3>
        <p className="text-muted-foreground mb-4">
          This board doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild variant="outline">
          <Link to="/boards">Back to Boards</Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/boards">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Boards
          </Link>
        </Button>
      </div>

      {/* Board Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{board.name}</h1>
              {board.isPublic && (
                <Button variant="outline" size="sm" onClick={copyPublicLink}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
            
            {board.description && (
              <p className="text-muted-foreground text-lg mb-3 max-w-2xl">
                {board.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className={`${getStatusColor(board.status)}`}
              >
                {board.status || 'Active'}
              </Badge>
              
              <Badge variant="outline">
                {board.isPublic ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
              
              {board.category && (
                <Badge variant="outline" className="text-purple-600 bg-purple-100 border-purple-300">
                  {board.category}
                </Badge>
              )}
              
              <Badge variant="outline" className="text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Created {formatDateTime(board.createdAt)}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => subscribeMutation.mutate()}
              disabled={subscribeMutation.isPending}
              variant="outline"
            >
              Subscribe to Updates
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditSidebarOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Board
                </DropdownMenuItem>
                {board.isPublic && (
                  <DropdownMenuItem asChild>
                    <Link to={`/public/board/${board.publicUrl || board.id}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      View Public Page
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Total Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{board.feedbacksCount || 0}</div>
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
            <div className="text-2xl font-bold text-blue-600">{board.subscribersCount || 0}</div>
          </CardContent>
        </Card>

        {board.isPublic && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Public Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{board.viewsCount || 0}</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Activity Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {boardStats?.activityScore || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="feedback" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <Button onClick={() => setCreateFeedbackOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feedback
          </Button>
        </div>

        <TabsContent value="feedback" className="space-y-4">
          {feedbacksLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : boardFeedbacks && boardFeedbacks.length > 0 ? (
            <div className="space-y-4">
              {boardFeedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No feedback yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to add feedback to this board.
              </p>
              <Button onClick={() => setCreateFeedbackOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Feedback
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
            <p className="text-muted-foreground">
              Detailed analytics and insights for this board will be available soon.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Board Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => setEditSidebarOpen(true)} variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Board Settings
                </Button>
                
                {board.isPublic && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Public Access</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      This board is publicly accessible at:
                    </p>
                    <code className="block p-2 bg-blue-100 rounded text-sm break-all">
                      {window.location.origin}/public/board/{board.publicUrl || board.id}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3"
                      onClick={copyPublicLink}
                    >
                      Copy Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sidebars */}
      <EditBoardSidebar
        isOpen={editSidebarOpen}
        onClose={() => setEditSidebarOpen(false)}
        board={board}
      />

      <CreateFeedbackSidebar
        isOpen={createFeedbackOpen}
        onClose={() => setCreateFeedbackOpen(false)}
        defaultBoardId={board.id}
      />
    </div>
  )
}