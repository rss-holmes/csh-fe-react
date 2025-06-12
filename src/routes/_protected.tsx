import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { MainLayout } from '@/components/layout/MainLayout'

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
  component: MainLayout,
})