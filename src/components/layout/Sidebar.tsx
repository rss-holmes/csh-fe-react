import { Link, useLocation } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Feedbacks', href: '/feedbacks', icon: '💬' },
  { name: 'Issues', href: '/issues', icon: '🐛' },
  { name: 'Boards', href: '/boards', icon: '📋' },
  { name: 'Users', href: '/users', icon: '👥' },
  { name: 'Companies', href: '/companies', icon: '🏢' },
  { name: 'Team', href: '/team', icon: '👨‍👩‍👧‍👦' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
]

export function Sidebar() {
  const location = useLocation()
  const { user } = useAuthStore()

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary">InsightYeti</h1>
        {user && (
          <p className="text-sm text-muted-foreground mt-1">
            {user.username}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Workspace info */}
      <div className="p-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          <p>Workspace</p>
          <p className="font-medium text-foreground">
            {user?.workspaceId ? `Workspace ${user.workspaceId}` : 'No workspace'}
          </p>
        </div>
      </div>
    </div>
  )
}