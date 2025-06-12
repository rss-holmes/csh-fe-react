import { useQuery } from '@tanstack/react-query'
import { IssueCard } from './IssueCard'
import { queryKeys } from '@/lib/queryKeys'
import * as issueApi from '@/api/issue'
import { useAuthStore } from '@/stores/authStore'
import { Skeleton } from '@/components/ui/skeleton'

export function IssuesBody() {
  const { user } = useAuthStore()

  const { data: issues, isLoading, error } = useQuery({
    queryKey: queryKeys.issues.workspaceIssues(user?.workspaceId?.toString() || ''),
    queryFn: issueApi.getWorkspaceIssues,
    enabled: !!user?.workspaceId,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-4 w-4 mt-1" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-7 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load issues. Please try again.</p>
      </div>
    )
  }

  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🐛</span>
        </div>
        <h3 className="text-lg font-medium mb-2">No issues yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first issue to start tracking bugs and feature requests.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  )
}