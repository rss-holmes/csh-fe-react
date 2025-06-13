import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import {
  Building2,
  Globe,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  MessageSquare,
  AlertCircle,
  User,
  Filter,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  getCompany,
  getCompanyUsers,
  getCompanyFeedbacks,
  getCompanyIssues,
  deleteCompany,
  type CompanyFeedback,
  type CompanyIssue,
} from '@/api/company'
import { queryKeys } from '@/utils/queryKeys'
import { Button } from '@/components/ui/button'
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
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import EditCompanySidebar from './EditCompanySidebar'

type TimelineItem = (CompanyIssue & { type: 'issue' }) | (CompanyFeedback & { type: 'feedback' })

export default function ViewCompany() {
  const { companyId } = useParams({ from: '/_protected/companies/$companyId' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('timeline')
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'feedbacks' | 'issues'>('all')

  const companyIdNum = parseInt(companyId)

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: queryKeys.companies.detail(companyIdNum),
    queryFn: () => getCompany(companyIdNum),
  })

  const { data: companyUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: queryKeys.companies.users(companyIdNum),
    queryFn: () => getCompanyUsers(companyIdNum),
    enabled: activeTab === 'users',
  })

  const { data: companyFeedbacks = [], isLoading: isLoadingFeedbacks } = useQuery({
    queryKey: queryKeys.companies.feedbacks(companyIdNum),
    queryFn: () => getCompanyFeedbacks(companyIdNum),
    enabled: activeTab === 'timeline',
  })

  const { data: companyIssues = [], isLoading: isLoadingIssues } = useQuery({
    queryKey: queryKeys.companies.issues(companyIdNum),
    queryFn: () => getCompanyIssues(companyIdNum),
    enabled: activeTab === 'timeline',
  })

  const deleteCompanyMutation = useMutation({
    mutationFn: () => deleteCompany(companyIdNum),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all })
      toast.success('Company deleted successfully')
      navigate({ to: '/companies' })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete company')
    },
  })

  const handleDelete = () => {
    deleteCompanyMutation.mutate()
  }

  // Combine and sort timeline items
  const timelineItems: TimelineItem[] = [
    ...companyIssues.map(item => ({ ...item, type: 'issue' as const })),
    ...companyFeedbacks.map(item => ({ ...item, type: 'feedback' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filteredTimelineItems = timelineItems.filter(item => {
    if (timelineFilter === 'all') return true
    if (timelineFilter === 'issues') return item.type === 'issue'
    if (timelineFilter === 'feedbacks') return item.type === 'feedback'
    return true
  })

  if (isLoadingCompany) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Company not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/companies" className="hover:text-foreground">
          Companies
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{company.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{company.name}</h1>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {new URL(company.website).hostname}
                  <Globe className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Last activity {format(new Date(company.lastUpdatedAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {format(new Date(company.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditSidebarOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
          <TabsTrigger value="users">
            Users {company.customersCount ? `(${company.customersCount})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {/* Filter */}
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {timelineFilter === 'all' ? 'All Activity' : 
                   timelineFilter === 'feedbacks' ? 'Feedbacks' : 'Issues'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTimelineFilter('all')}>
                  All Activity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimelineFilter('feedbacks')}>
                  Feedbacks Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimelineFilter('issues')}>
                  Issues Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Timeline */}
          {isLoadingFeedbacks || isLoadingIssues ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredTimelineItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activity found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTimelineItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.type === 'feedback' ? (
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                      <Badge variant={item.type === 'feedback' ? 'default' : 'secondary'}>
                        {item.type === 'feedback' ? 'Feedback' : 'Issue'}
                      </Badge>
                      {item.type === 'issue' && (
                        <Badge variant="outline">{item.status}</Badge>
                      )}
                      {item.type === 'feedback' && item.sentiment && (
                        <Badge variant="outline">{item.sentiment}</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{item.createdBy.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {isLoadingUsers ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : companyUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found for this company</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {companyUsers.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.designation && (
                          <p className="text-sm text-muted-foreground">{user.designation}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Added via {user.addedVia}</p>
                      <p>{format(new Date(user.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Sidebar */}
      {company && (
        <EditCompanySidebar
          open={editSidebarOpen}
          onOpenChange={setEditSidebarOpen}
          company={company}
        />
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company
              "{company.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}