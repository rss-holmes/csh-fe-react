import axiosInstance from '@/utils/axiosBase'
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
  ReadCustomerOutput,
} from '@/formSchemas/customerSchema'

// Customer API response types
export interface Customer extends ReadCustomerOutput {}

export interface CustomerIssue {
  id: number
  title: string
  description: string
  priority: number
  status: string
  createdAt: string
  board: {
    id: number
    name: string
  }
}

export interface CustomerFeedback {
  id: number
  title: string
  description: string
  type: string
  sentiment?: string
  source: string
  createdAt: string
  board: {
    id: number
    name: string
  }
}

/**
 * Create a new customer
 */
export const createCustomer = async (data: CreateCustomerInput): Promise<Customer> => {
  try {
    const response = await axiosInstance.post('/customers', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Create customer failed')
  }
}

/**
 * Get a specific customer by ID
 */
export const getCustomer = async (id: number): Promise<Customer> => {
  try {
    const response = await axiosInstance.get(`/customers/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get customer failed')
  }
}

/**
 * Update an existing customer
 */
export const updateCustomer = async (
  id: number,
  data: UpdateCustomerInput
): Promise<Customer> => {
  try {
    const response = await axiosInstance.put(`/customers/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Update customer failed')
  }
}

/**
 * Delete a customer
 */
export const deleteCustomer = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/customers/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Delete customer failed')
  }
}

/**
 * Get all customers in the workspace
 */
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await axiosInstance.get('/customers')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get customers failed')
  }
}

/**
 * Get issues associated with a customer
 */
export const getCustomerIssues = async (id: number): Promise<CustomerIssue[]> => {
  try {
    const response = await axiosInstance.get(`/customers/${id}/issues`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get customer issues failed')
  }
}

/**
 * Get feedbacks from a customer
 */
export const getCustomerFeedbacks = async (id: number): Promise<CustomerFeedback[]> => {
  try {
    const response = await axiosInstance.get(`/customers/${id}/feedbacks`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get customer feedbacks failed')
  }
}

/**
 * Bulk upload customers from a file
 */
export const bulkUploadCustomers = async (file: File): Promise<{ 
  success: boolean
  message: string
  total: number
  processed: number
  errors: Array<{ row: number; error: string }>
}> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axiosInstance.post('/customers/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Bulk upload customers failed')
  }
}