import { QueryClient } from '@tanstack/react-query'

/**
 * Centralized QueryClient configuration for TanStack Query
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests once
      retry: 1,
      
      // Don't refetch on window focus (can be overridden per query)
      refetchOnWindowFocus: false,
      
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Refetch on network reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      
      // Network mode for mutations
      networkMode: 'online',
    },
  },
})

/**
 * Common error handling for queries
 */
export const defaultQueryOptions = {
  onError: (error: any) => {
    console.error('Query error:', error)
    
    // Handle common error cases
    if (error?.response?.status === 401) {
      // Handle unauthorized - could trigger logout
      console.warn('Unauthorized access detected')
    }
    
    if (error?.response?.status >= 500) {
      // Handle server errors
      console.error('Server error:', error.response.status)
    }
  },
}

/**
 * Common mutation options
 */
export const defaultMutationOptions = {
  onError: (error: any) => {
    console.error('Mutation error:', error)
    
    // Handle common mutation errors
    if (error?.response?.status === 401) {
      console.warn('Unauthorized mutation attempt')
    }
    
    if (error?.response?.status === 422) {
      console.warn('Validation error:', error.response.data)
    }
  },
}