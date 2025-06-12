import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { useAuthStore } from '@/stores/authStore'
import { queryKeys } from '@/lib/queryKeys'
import * as dashboardApi from '@/api/dashboard'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuthStore()

  // Query for dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: queryKeys.dashboard.metrics(user?.workspaceId?.toString() || ''),
    queryFn: dashboardApi.getDashboardMetrics,
    enabled: !!user?.workspaceId,
  })

  // Query for feedback trends
  const { data: feedbackByType } = useQuery({
    queryKey: queryKeys.dashboard.analytics(user?.workspaceId?.toString() || '', 'feedbackByType'),
    queryFn: dashboardApi.getFeedbackByType,
    enabled: !!user?.workspaceId,
  })

  const { data: feedbackBySentiment } = useQuery({
    queryKey: queryKeys.dashboard.analytics(user?.workspaceId?.toString() || '', 'feedbackBySentiment'),
    queryFn: dashboardApi.getFeedbackBySentiment,
    enabled: !!user?.workspaceId,
  })

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading your workspace data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ''}! Here's your workspace overview.
        </p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Feedbacks"
          value={metrics?.totalFeedbacks || 0}
          icon="💬"
          description="All feedbacks received"
          trend={metrics?.feedbackGrowth ? {
            value: metrics.feedbackGrowth,
            isPositive: metrics.feedbackGrowth > 0
          } : undefined}
        />
        
        <MetricCard
          title="Active Issues"
          value={metrics?.totalIssues || 0}
          icon="🐛"
          description="Issues being tracked"
        />
        
        <MetricCard
          title="Feedback Boards"
          value={metrics?.totalBoards || 0}
          icon="📋"
          description="Active feedback boards"
        />
        
        <MetricCard
          title="Total Customers"
          value={metrics?.totalCustomers || 0}
          icon="👥"
          description="Unique customers"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback by Type */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Feedback by Type</h3>
          {feedbackByType && feedbackByType.length > 0 ? (
            <div className="space-y-3">
              {feedbackByType.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.type || 'Unknown'}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No feedback data available yet
            </p>
          )}
        </div>

        {/* Feedback by Sentiment */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Feedback by Sentiment</h3>
          {feedbackBySentiment && feedbackBySentiment.length > 0 ? (
            <div className="space-y-3">
              {feedbackBySentiment.map((item) => (
                <div key={item.sentiment} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.sentiment || 'Unknown'}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.sentiment === 'Positive' ? 'bg-green-500' :
                          item.sentiment === 'Negative' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No sentiment data available yet
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold mb-2">Create Feedback Board</h3>
          <p className="text-muted-foreground text-sm">
            Set up a new board to collect user feedback
          </p>
        </div>
        
        <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold mb-2">Add New Issue</h3>
          <p className="text-muted-foreground text-sm">
            Track a new issue or feature request
          </p>
        </div>
        
        <div className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold mb-2">View All Feedbacks</h3>
          <p className="text-muted-foreground text-sm">
            Browse and manage all feedback submissions
          </p>
        </div>
      </div>
    </div>
  )
}