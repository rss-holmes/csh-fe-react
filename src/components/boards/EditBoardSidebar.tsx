import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
  FormDescription,
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
import { toast } from 'sonner'
import { Trash2, AlertTriangle } from 'lucide-react'
import { queryKeys } from '@/lib/queryKeys'
import * as boardApi from '@/api/board'
import type { Board } from '@/api/board'
import { updateBoardSchema, type UpdateBoardInput } from '@/formSchemas/boardSchema'

interface EditBoardSidebarProps {
  isOpen: boolean
  onClose: () => void
  board: Board
}

export function EditBoardSidebar({ isOpen, onClose, board }: EditBoardSidebarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<UpdateBoardInput>({
    resolver: zodResolver(updateBoardSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      isPublic: false,
      status: 'active',
    },
  })

  // Update form when board changes
  useEffect(() => {
    if (board) {
      form.reset({
        name: board.name || '',
        description: board.description || '',
        category: board.category || '',
        isPublic: board.isPublic || false,
        status: board.status || 'active',
      })
    }
  }, [board, form])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateBoardInput) => boardApi.updateBoard(board.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.workspaceBoards._def })
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.board(board.id.toString()) })
      toast.success('Board updated successfully')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update board')
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => boardApi.deleteBoard(board.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.workspaceBoards._def })
      toast.success('Board deleted successfully')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete board')
    },
    onSettled: () => {
      setIsDeleting(false)
    },
  })

  const onSubmit = (data: UpdateBoardInput) => {
    setIsSubmitting(true)
    updateMutation.mutate(data)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    deleteMutation.mutate()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const categories = [
    'Feature Requests',
    'Bug Reports',
    'Improvements',
    'General Feedback',
    'Product Ideas',
    'User Experience',
    'Performance',
    'Documentation',
  ]

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Board</SheetTitle>
          <SheetDescription>
            Update board settings and configuration.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mobile App Features" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this board is for..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Help users understand what kind of feedback to submit here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Board</FormLabel>
                    <FormDescription>
                      Allow anyone with the link to view and submit feedback.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('isPublic') && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Public Board Settings
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Public URL: <code className="bg-blue-100 px-1 rounded">/public/board/{board.publicUrl || board.id}</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Board Stats */}
            <div className="rounded-lg bg-gray-50 border p-4">
              <h4 className="text-sm font-medium mb-3">Board Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Feedback:</span>
                  <span className="ml-2 font-medium">{board.feedbacksCount || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Subscribers:</span>
                  <span className="ml-2 font-medium">{board.subscribersCount || 0}</span>
                </div>
                {board.isPublic && (
                  <div>
                    <span className="text-muted-foreground">Views:</span>
                    <span className="ml-2 font-medium">{board.viewsCount || 0}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2 font-medium">
                    {new Date(board.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Updating...' : 'Update Board'}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>

        {/* Danger Zone */}
        <div className="mt-8 pt-6 border-t">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting a board will permanently remove all associated feedback and cannot be undone.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Board'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Delete Board
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{board.name}</strong>? This action cannot be undone and will:
                    <br />
                    <br />
                    • Delete all {board.feedbacksCount || 0} feedback items
                    <br />
                    • Remove all subscriber data
                    <br />
                    • Break any public links to this board
                    <br />
                    <br />
                    Type the board name to confirm: <strong>{board.name}</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Board
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}