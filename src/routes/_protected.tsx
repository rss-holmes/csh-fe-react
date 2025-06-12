import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

/**
 * Protected route layout that requires authentication
 */
export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState()
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          // Preserve the original destination for redirect after login
          redirect: location.pathname,
        },
      })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* This will be replaced with actual layout components later */}
      <div className="flex">
        {/* Sidebar will go here */}
        <div className="flex-1">
          {/* Header will go here */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}