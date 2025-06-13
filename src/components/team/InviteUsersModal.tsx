import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Mail, UserPlus } from 'lucide-react'
import { inviteUsers } from '@/api/user'
import { queryKeys } from '@/utils/queryKeys'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const inviteSchema = z.object({
  inviteEmails: z
    .string()
    .min(1, 'At least one email is required')
    .refine((value) => {
      const emails = value.split(',').map(email => email.trim()).filter(Boolean)
      return emails.every(email => z.string().email().safeParse(email).success)
    }, 'Please enter valid email addresses separated by commas'),
  selectedRole: z.enum(['viewer', 'editor', 'admin']).optional(),
})

type InviteFormData = z.infer<typeof inviteSchema>

interface InviteUsersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function InviteUsersModal({ open, onOpenChange }: InviteUsersModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      inviteEmails: '',
      selectedRole: 'viewer',
    },
  })

  const inviteUsersMutation = useMutation({
    mutationFn: (emails: string[]) => inviteUsers(emails),
    onSuccess: (_, emails) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.invitations })
      toast.success(`Invitations sent to ${emails.length} ${emails.length === 1 ? 'email' : 'emails'}`)
      onOpenChange(false)
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send invitations')
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = (formData: InviteFormData) => {
    setIsSubmitting(true)
    const emails = formData.inviteEmails
      .split(',')
      .map(email => email.trim())
      .filter(Boolean)
    
    inviteUsersMutation.mutate(emails)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Team Members
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Send invitations to new team members. They will receive an email with instructions to join your workspace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="inviteEmails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Addresses</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter email addresses separated by commas&#10;e.g., john@example.com, jane@example.com"
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can invite multiple people by separating email addresses with commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selectedRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="viewer">
                        <div className="flex flex-col items-start">
                          <span>Viewer</span>
                          <span className="text-xs text-muted-foreground">Can view content</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex flex-col items-start">
                          <span>Editor</span>
                          <span className="text-xs text-muted-foreground">Can edit content</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex flex-col items-start">
                          <span>Admin</span>
                          <span className="text-xs text-muted-foreground">Full administrative access</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the access level for invited members. This can be changed later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Invitations'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}