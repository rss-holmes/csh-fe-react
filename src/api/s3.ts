import axiosInstance from '@/utils/axiosBase'
import axios from 'axios'

// S3 API response types
export interface PresignedUrlResponse {
  url: string
  fileName: string
  fields: Record<string, string>
}

export interface S3UploadResult {
  fileName: string
  url: string
  size: number
  mimeType: string
}

/**
 * Get presigned URL for S3 upload
 */
const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  uploadType: string
): Promise<PresignedUrlResponse> => {
  try {
    const response = await axiosInstance.post('/s3/presigned-url', {
      fileName,
      fileType,
      uploadType,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get presigned URL failed')
  }
}

/**
 * Upload file to S3 using presigned URL
 */
export const uploadFileToS3 = async (
  file: File,
  uploadType: string = 'general'
): Promise<string> => {
  try {
    const presignedData = await getPresignedUrl(file.name, file.type, uploadType)

    await axios.put(presignedData.url, file, {
      headers: {
        'Content-Type': file.type,
      },
    })

    return presignedData.fileName
  } catch (error: any) {
    console.error('Error uploading file to S3:', error)
    throw new Error('File upload failed')
  }
}

/**
 * Upload multiple files to S3
 */
export const uploadMultipleFilesToS3 = async (
  files: File[],
  uploadType: string = 'general'
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) => uploadFileToS3(file, uploadType))
    return await Promise.all(uploadPromises)
  } catch (error: any) {
    console.error('Error uploading multiple files to S3:', error)
    throw new Error('Multiple file upload failed')
  }
}

/**
 * Upload file with progress tracking
 */
export const uploadFileToS3WithProgress = async (
  file: File,
  uploadType: string = 'general',
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const presignedData = await getPresignedUrl(file.name, file.type, uploadType)

    await axios.put(presignedData.url, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return presignedData.fileName
  } catch (error: any) {
    console.error('Error uploading file to S3 with progress:', error)
    throw new Error('File upload failed')
  }
}

/**
 * Get download URL for a file in S3
 */
export const getS3DownloadUrl = async (fileName: string): Promise<string> => {
  try {
    const response = await axiosInstance.get(`/s3/download-url`, {
      params: { fileName },
    })
    return response.data.url
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Get download URL failed')
  }
}

/**
 * Delete file from S3
 */
export const deleteS3File = async (fileName: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/s3/files/${fileName}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Delete file failed')
  }
}