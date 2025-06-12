import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useFormWithSchema } from '@/hooks/useFormWithSchema'
import { signupSchema, type SignupInput } from '@/formSchemas/authSchema'
import { useAuthStore } from '@/stores/authStore'

interface SignupFormProps {
  className?: string
}

export function SignupForm({ className }: SignupFormProps) {
  const router = useRouter()
  const { signup } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormWithSchema<SignupInput>(signupSchema)

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const success = await signup(data)
      if (success) {
        // Redirect to dashboard after successful signup
        router.navigate({ to: '/dashboard' })
      } else {
        setError('Signup failed. Please try again.')
      }
    } catch (error: any) {
      setError(error.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground mt-2">
          Get started with InsightYeti today.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password?.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className="text-center">
          <Button variant="outline" className="w-full" type="button">
            Sign up with Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}