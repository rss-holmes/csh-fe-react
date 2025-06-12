import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

/**
 * RouteGuard component that handles authentication-based route protection
 */
export function RouteGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: RouteGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    // If auth is required but user is not authenticated, redirect
    if (requireAuth && !isLoading && !isAuthenticated) {
      router.navigate({ to: redirectTo })
    }
    
    // If auth is not required but user is authenticated, could redirect to dashboard
    if (!requireAuth && !isLoading && isAuthenticated && redirectTo !== '/login') {
      // Optional: redirect authenticated users away from login/signup pages
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If auth is required and user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // If auth is not required and we want to redirect authenticated users
  if (!requireAuth && isAuthenticated && redirectTo !== '/login') {
    return null
  }

  return <>{children}</>
}