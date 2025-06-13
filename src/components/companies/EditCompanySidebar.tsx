import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { updateCompany, type Company } from '@/api/company'
import { updateCompanySchema, type UpdateCompanyInput } from '@/formSchemas/companySchema'
import { queryKeys } from '@/utils/queryKeys'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'

interface EditCompanySidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company
}

export default function EditCompanySidebar({ open, onOpenChange, company }: EditCompanySidebarProps) {
  const queryClient = useQueryClient()

  const form = useForm<UpdateCompanyInput>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: company.name,
      website: company.website,
    },
  })

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        website: company.website,
      })
    }
  }, [company, form])

  const updateCompanyMutation = useMutation({
    mutationFn: (data: UpdateCompanyInput) => updateCompany(company.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(company.id) })
      toast.success('Company updated successfully')
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update company')
    },
  })

  const onSubmit = (data: UpdateCompanyInput) => {
    updateCompanyMutation.mutate(data)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Edit Company</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription>
            Update the company information. Changes will be reflected immediately.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateCompanyMutation.isPending}
              >
                {updateCompanyMutation.isPending ? 'Updating...' : 'Update Company'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}