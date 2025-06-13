import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { User, Building2, Mail, Tag, Briefcase, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as customerApi from '@/api/customer'
import * as companyApi from '@/api/company'
import type { Customer } from '@/api/customer'
import { updateCustomerSchema, type UpdateCustomerInput } from '@/formSchemas/customerSchema'

interface EditUserSidebarProps {
  isOpen: boolean
  onClose: () => void
  user: Customer
}

export function EditUserSidebar({ isOpen, onClose, user }: EditUserSidebarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const { data: companies = [] } = useQuery({
    queryKey: queryKeys.companies.all,
    queryFn: companyApi.getCompanies,
    enabled: isOpen,
  })

  const form = useForm<UpdateCustomerInput>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      companyId: undefined,
      segments: '',
      designation: '',
      tags: [],
    },
  })

  // Update form when user prop changes
  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        companyId: user.companyId || undefined,
        segments: user.segments || '',
        designation: user.designation || '',
        tags: user.tags || [],
      })
    }
  }, [user, isOpen, form])

  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateCustomerInput) => customerApi.updateCustomer(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(user.id.toString()) })
      toast.success('User updated successfully')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user')
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: () => customerApi.deleteCustomer(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      toast.success('User deleted successfully')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user')
    },
    onSettled: () => {
      setIsDeleting(false)
    },
  })

  const onSubmit = async (data: UpdateCustomerInput) => {
    setIsSubmitting(true)
    updateUserMutation.mutate(data)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    deleteUserMutation.mutate()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <SheetTitle>Edit User</SheetTitle>
              <SheetDescription>
                Update user information and company details.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Basic Information
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Company Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4" />
                Company Information
              </div>

              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                      value={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No company</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title / Designation</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Product Manager"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Additional Information
              </div>

              <FormField
                control={form.control}
                name="segments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Segments</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enterprise, Power User, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Updating...' : 'Update User'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>

              {/* Delete User */}
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone. This will permanently delete the user and all associated data.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? 'Deleting...' : 'Delete User'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {user.name}? This action cannot be undone
                        and will remove all associated feedback and issue data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}