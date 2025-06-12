import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

/**
 * Auth route layout for login/signup pages
 * Redirects authenticated users to dashboard
 */
export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState()
    
    if (isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}