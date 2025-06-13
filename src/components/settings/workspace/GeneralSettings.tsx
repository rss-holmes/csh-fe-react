import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building, Save, Trash2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { queryKeys } from '@/utils/queryKeys'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const workspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required'),
  description: z.string().optional(),
})

type WorkspaceFormData = z.infer<typeof workspaceSchema>

interface Workspace {
  id: number
  name: string
  description?: string
}

export default function GeneralSettings() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const queryClient = useQueryClient()

  // Mock current workspace - in real app this would come from auth store or API
  const { data: workspace, isLoading } = useQuery({
    queryKey: queryKeys.workspace.current,
    queryFn: async (): Promise<Workspace> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        id: 1,
        name: 'InsightYeti Workspace',
        description: 'Customer feedback management workspace for our team',
      }
    },
  })

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    values: {
      name: workspace?.name || '',
      description: workspace?.description || '',
    },
  })

  const updateWorkspaceMutation = useMutation({
    mutationFn: async (data: WorkspaceFormData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { ...workspace, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspace.current })
      toast.success('Workspace updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update workspace')
      console.error('Workspace update error:', error)
    },
  })

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Workspace deleted successfully')
      // In real app, redirect to workspace selection or home
    },
    onError: (error) => {
      toast.error('Failed to delete workspace')
      console.error('Workspace delete error:', error)
    },
  })

  const onSubmit = (data: WorkspaceFormData) => {
    updateWorkspaceMutation.mutate(data)
  }

  const handleDeleteWorkspace = () => {
    if (deleteConfirmation === workspace?.name) {
      deleteWorkspaceMutation.mutate()
    } else {
      toast.error('Workspace name does not match')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Building className="h-6 w-6" />
          General Settings
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your workspace settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Information</CardTitle>
          <CardDescription>
            Update your workspace name and description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter workspace name"
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed across your workspace
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe what this workspace is for..."
                        className="min-h-20 resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Help your team understand the purpose of this workspace
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateWorkspaceMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateWorkspaceMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Workspace Icon Section (Commented out as in Vue) */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Workspace Icon</CardTitle>
          <CardDescription>
            Upload an icon to represent your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <div>
              <Button variant="outline">Upload Icon</Button>
              <p className="text-sm text-muted-foreground mt-1">
                Recommended: Square image, at least 200x200 pixels
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Advanced Settings */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto">
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            Advanced Settings
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 mt-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that will permanently affect your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Delete Workspace</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete this workspace, there is no going back. All data will be permanently removed.
                  </p>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Workspace
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">
                          Delete Workspace
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the workspace
                          "{workspace?.name}" and all associated data including:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>All boards and issues</li>
                            <li>User feedback and comments</li>
                            <li>Team member access</li>
                            <li>Integration settings</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Type the workspace name "{workspace?.name}" to confirm:
                          </label>
                          <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder={workspace?.name}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteWorkspace}
                          disabled={deleteConfirmation !== workspace?.name || deleteWorkspaceMutation.isPending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteWorkspaceMutation.isPending ? 'Deleting...' : 'Delete Workspace'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}