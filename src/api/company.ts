import axiosInstance from '@/utils/axiosBase'
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  ReadCompanyOutput,
} from '@/formSchemas/companySchema'

// Company API response types
export interface Company extends ReadCompanyOutput {}

export interface CompanyUser {
  id: number
  name: string
  email: string
  designation?: string
  addedVia: string
  createdAt: string
}

export interface CompanyFeedback {
  id: number
  title: string
  description: string
  type: string
  sentiment?: string
  createdAt: string
  createdBy: {
    id: number
    name: string
    email: string
  }
}

export interface CompanyIssue {
  id: number
  title: string
  description: string
  priority: number
  status: string
  createdAt: string
  createdBy: {
    id: number
    name: string
    email: string
  }
}

/**
 * Create a new company
 */
export const createCompany = async (data: CreateCompanyInput): Promise<Company> => {
  try {
    const response = await axiosInstance.post('/companies', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Create company failed')
  }
}

/**
 * Get a specific company by ID
 */
export const getCompany = async (id: number): Promise<Company> => {
  try {
    const response = await axiosInstance.get(`/companies/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get company failed')
  }
}

/**
 * Update an existing company
 */
export const updateCompany = async (
  id: number,
  data: UpdateCompanyInput
): Promise<Company> => {
  try {
    const response = await axiosInstance.put(`/companies/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Update company failed')
  }
}

/**
 * Delete a company
 */
export const deleteCompany = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/companies/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Delete company failed')
  }
}

/**
 * Get all companies in the workspace
 */
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axiosInstance.get('/companies')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get companies failed')
  }
}

/**
 * Get users associated with a company
 */
export const getCompanyUsers = async (id: number): Promise<CompanyUser[]> => {
  try {
    const response = await axiosInstance.get(`/companies/${id}/users`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get company users failed')
  }
}

/**
 * Get feedbacks from a company
 */
export const getCompanyFeedbacks = async (id: number): Promise<CompanyFeedback[]> => {
  try {
    const response = await axiosInstance.get(`/companies/${id}/feedbacks`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get company feedbacks failed')
  }
}

/**
 * Get issues related to a company
 */
export const getCompanyIssues = async (id: number): Promise<CompanyIssue[]> => {
  try {
    const response = await axiosInstance.get(`/companies/${id}/issues`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get company issues failed')
  }
}