import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useFormWithSchema } from '@/hooks/useFormWithSchema'
import { loginSchema, type LoginInput } from '@/formSchemas/authSchema'
import { useAuthStore } from '@/stores/authStore'

interface LoginFormProps {
  className?: string
}

export function LoginForm({ className }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormWithSchema<LoginInput>(loginSchema)

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const success = await login(data)
      if (success) {
        // Redirect to dashboard or intended destination
        router.navigate({ to: '/dashboard' })
      } else {
        setError('Invalid email or password')
      }
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Sign in to InsightYeti</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

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
            placeholder="Enter your password"
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
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <Button variant="outline" className="w-full" type="button">
            Sign in with Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}