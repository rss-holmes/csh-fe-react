import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  User,
  Mail,
  Building2,
  Calendar,
  MapPin,
  Monitor,
  Smartphone,
  Globe,
  MessageSquare,
  AlertCircle,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as customerApi from '@/api/customer'
import type { Customer, CustomerIssue, CustomerFeedback } from '@/api/customer'
import { EditUserSidebar } from './EditUserSidebar'
import { formatDateTime } from '@/utils/dateFormatter'

// Helper type for timeline items that includes status for both issues and feedbacks
type TimelineItem = (CustomerIssue & { type: 'issue' }) | (CustomerFeedback & { type: 'feedback'; status?: string })

interface ViewUserProps {
  userId: number
  onBack?: () => void
}

export function ViewUser({ userId, onBack }: ViewUserProps) {
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'timeline' | 'issues' | 'feedbacks'>('timeline')
  const queryClient = useQueryClient()

  const { data: user, isLoading: userLoading, error: userError } = useQuery<Customer>({
    queryKey: queryKeys.customers.detail(userId.toString()),
    queryFn: () => customerApi.getCustomer(userId),
  })

  const { data: userIssues = [] } = useQuery({
    queryKey: queryKeys.customers.detail(userId.toString()),
    queryFn: () => customerApi.getCustomerIssues(userId),
    enabled: !!user,
  })

  const { data: userFeedbacks = [] } = useQuery({
    queryKey: queryKeys.customers.detail(userId.toString()),
    queryFn: () => customerApi.getCustomerFeedbacks(userId),
    enabled: !!user,
  })

  const deleteUserMutation = useMutation({
    mutationFn: () => customerApi.deleteCustomer(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      toast.success('User deleted successfully')
      onBack?.()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user')
    },
  })

  // Combine issues and feedbacks for timeline
  const timelineItems: TimelineItem[] = [
    ...userIssues.map(item => ({ ...item, type: 'issue' as const })),
    ...userFeedbacks.map(item => ({ ...item, type: 'feedback' as const, status: 'Open' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getStatusColor = (status: string, type: 'issue' | 'feedback') => {
    if (type === 'issue') {
      switch (status?.toLowerCase()) {
        case 'completed':
        case 'done':
          return 'bg-green-100 text-green-700 border-green-300'
        case 'in-progress':
        case 'wip':
          return 'bg-blue-100 text-blue-700 border-blue-300'
        case 'testing':
          return 'bg-purple-100 text-purple-700 border-purple-300'
        default:
          return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      }
    } else {
      switch (status?.toLowerCase()) {
        case 'resolved':
          return 'bg-green-100 text-green-700 border-green-300'
        case 'processing':
          return 'bg-blue-100 text-blue-700 border-blue-300'
        case 'spam':
          return 'bg-red-100 text-red-700 border-red-300'
        default:
          return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      }
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-100 border-green-300'
      case 'negative':
        return 'text-red-600 bg-red-100 border-red-300'
      case 'neutral':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300'
    }
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (userError || !user) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load user details</p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(userId.toString()) })}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditSidebarOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditSidebarOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {user.name}? This action cannot be undone
                      and will remove all associated feedback and issue data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteUserMutation.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete User
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span>{user.email}</span>
              </div>

              {user.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium">{user.company.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              )}

              {user.designation && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Designation:</span>
                  <span>{user.designation}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span>{formatDateTime(user.createdAt)}</span>
              </div>
            </div>

            {/* Location & Device Info */}
            <div className="space-y-4">
              {user.country && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Country:</span>
                  <span>{user.country}</span>
                </div>
              )}

              {user.browser && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Browser:</span>
                  <span>{user.browser}</span>
                </div>
              )}

              {user.os && (
                <div className="flex items-center gap-2 text-sm">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">OS:</span>
                  <span>{user.os}</span>
                </div>
              )}

              {user.device && (
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Device:</span>
                  <span>{user.device}</span>
                </div>
              )}
            </div>

            {/* Tags & Status */}
            <div className="space-y-4">
              {user.segments && (
                <div>
                  <span className="text-sm text-muted-foreground mb-2 block">Segments:</span>
                  <Badge variant="outline" className="text-xs">
                    {user.segments}
                  </Badge>
                </div>
              )}

              {user.tags && user.tags.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground mb-2 block">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {user.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Added via:</span>
                <Badge variant="outline" className="text-xs">
                  {user.addedVia || 'manual'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">
                Timeline ({timelineItems.length})
              </TabsTrigger>
              <TabsTrigger value="issues">
                Issues ({userIssues.length})
              </TabsTrigger>
              <TabsTrigger value="feedbacks">
                Feedbacks ({userFeedbacks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4 mt-6">
              {timelineItems.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No activity found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timelineItems.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex gap-4 p-4 border rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {item.type === 'issue' ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <MessageSquare className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(item.type === 'issue' ? item.status : (item.status || 'Open'), item.type)}`}
                          >
                            {item.type === 'issue' ? item.status : (item.status || 'Open')}
                          </Badge>
                          {'sentiment' in item && item.sentiment && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getSentimentColor(item.sentiment)}`}
                            >
                              {item.sentiment}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatDateTime(item.createdAt)}</span>
                          <span>{item.type === 'issue' ? 'Issue' : 'Feedback'}</span>
                          {item.board && (
                            <span>in {item.board.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="issues" className="space-y-4 mt-6">
              {userIssues.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No issues found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userIssues.map((issue) => (
                    <div key={issue.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{issue.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(issue.status, 'issue')}`}
                        >
                          {issue.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDateTime(issue.createdAt)}</span>
                        <span>Priority: {issue.priority}</span>
                        <span>Board: {issue.board.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="feedbacks" className="space-y-4 mt-6">
              {userFeedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No feedbacks found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{feedback.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor('Open', 'feedback')}`}
                        >
                          Open
                        </Badge>
                        {feedback.sentiment && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSentimentColor(feedback.sentiment)}`}
                          >
                            {feedback.sentiment}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {feedback.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDateTime(feedback.createdAt)}</span>
                        <span>Type: {feedback.type}</span>
                        <span>Source: {feedback.source}</span>
                        <span>Board: {feedback.board.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit User Sidebar */}
      <EditUserSidebar
        isOpen={editSidebarOpen}
        onClose={() => setEditSidebarOpen(false)}
        user={user}
      />
    </div>
  )
}