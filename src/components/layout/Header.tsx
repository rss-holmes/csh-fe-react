import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export function Header() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - could add search or breadcrumbs */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Welcome back!</h2>
        </div>

        {/* Right side - user menu */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right">
                <p className="text-sm font-medium">{user.name || user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}