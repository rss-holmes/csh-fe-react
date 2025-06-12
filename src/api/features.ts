import axiosInstance from '@/utils/axiosBase'

// Features API response types
export interface SubscriptionFeature {
  id: number
  name: string
  description?: string
  isEnabled: boolean
  limit?: number
  featureType: string
}

export interface FeatureUsage {
  featureName: string
  currentUsage: number
  limit: number
  isLimitReached: boolean
}

/**
 * Get subscription features for the current workspace
 */
export const getFeatures = async (): Promise<SubscriptionFeature[]> => {
  try {
    const response = await axiosInstance.get('/subscription/features')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get features failed')
  }
}

/**
 * Get feature usage statistics for the current workspace
 */
export const getFeatureUsage = async (): Promise<FeatureUsage[]> => {
  try {
    const response = await axiosInstance.get('/subscription/usage')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get feature usage failed')
  }
}

/**
 * Check if a specific feature is enabled
 */
export const isFeatureEnabled = async (featureName: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/subscription/features/${featureName}/status`)
    return response.data.isEnabled
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Check feature status failed')
  }
}