import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Feedback Boards</h3>
          <p className="text-muted-foreground text-sm">
            Manage your feedback boards and collect user insights.
          </p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Issues</h3>
          <p className="text-muted-foreground text-sm">
            Track and manage issues from your users.
          </p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Analytics</h3>
          <p className="text-muted-foreground text-sm">
            View insights and analytics about user feedback.
          </p>
        </div>
      </div>
    </div>
  )
}