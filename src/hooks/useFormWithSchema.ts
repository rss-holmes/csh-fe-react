import { useForm, type UseFormProps, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

/**
 * Custom hook that combines react-hook-form with Zod validation
 * Provides a consistent way to handle forms across the application
 */
export function useFormWithSchema<T extends FieldValues>(
  schema: any, // Using any to avoid TypeScript resolver version conflicts
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Validate on blur for better UX
    ...options,
  })
}