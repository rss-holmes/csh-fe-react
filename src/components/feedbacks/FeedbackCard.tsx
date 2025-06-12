import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Eye, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  User, 
  Cloud, 
  Bookmark, 
  Frown,
  Lightbulb,
  Hash
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as feedbackApi from '@/api/feedback'
import type { Feedback } from '@/api/feedback'
import { formatDateTime } from '@/utils/dateFormatter'

interface FeedbackCardProps {
  feedback: Feedback
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const [isSelected, setIsSelected] = useState(false)
  const queryClient = useQueryClient()

  // Mutations for feedback actions
  const deleteMutation = useMutation({
    mutationFn: () => feedbackApi.deleteFeedback(feedback.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.workspaceFeedbacks._def })
      toast.success('Feedback deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete feedback')
    },
  })

  const resolveMutation = useMutation({
    mutationFn: () => feedbackApi.resolveFeedback(feedback.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.workspaceFeedbacks._def })
      toast.success('Feedback resolved successfully')
    },
    onError: () => {
      toast.error('Failed to resolve feedback')
    },
  })

  const markLaterMutation = useMutation({
    mutationFn: () => feedbackApi.markLater(feedback.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.workspaceFeedbacks._def })
      toast.success('Feedback marked for later')
    },
    onError: () => {
      toast.error('Failed to mark feedback for later')
    },
  })

  const markSpamMutation = useMutation({
    mutationFn: () => feedbackApi.markAsSpam(feedback.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks.workspaceFeedbacks._def })
      toast.success('Feedback marked as spam')
    },
    onError: () => {
      toast.error('Failed to mark feedback as spam')
    },
  })

  const getBadgeVariant = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'positive':
        return 'default'
      case 'negative':
        return 'destructive'
      case 'neutral':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-100 border-green-300'
      case 'negative':
        return 'text-red-600 bg-red-100 border-red-300'
      case 'neutral':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300'
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => setIsSelected(checked as boolean)}
          className="mt-1"
        />
        
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500">
              <Hash className="h-3 w-3 text-white" />
            </div>
            <h3 className="font-medium text-sm">{feedback.title}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(feedback.createdAt)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {feedback.description}
          </p>

          {/* Tags and Metadata */}
          <div className="flex flex-wrap gap-2">
            {feedback.status && (
              <Badge variant="secondary" className="text-xs">
                <Lightbulb className="h-3 w-3 mr-1" />
                {feedback.status}
              </Badge>
            )}
            
            {feedback.sentiment && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getSentimentColor(feedback.sentiment)}`}
              >
                <Frown className="h-3 w-3 mr-1" />
                {feedback.sentiment}
              </Badge>
            )}
            
            {feedback.type && (
              <Badge variant="outline" className="text-xs text-yellow-600 bg-yellow-100 border-yellow-300">
                <Bookmark className="h-3 w-3 mr-1" />
                {feedback.type}
              </Badge>
            )}
            
            {feedback.customer && (
              <Badge variant="outline" className="text-xs text-blue-600 bg-blue-100 border-blue-300">
                <User className="h-3 w-3 mr-1" />
                {feedback.customer.name}
              </Badge>
            )}
            
            {feedback.source && (
              <Badge variant="outline" className="text-xs text-purple-600 bg-purple-100 border-purple-300">
                <Cloud className="h-3 w-3 mr-1" />
                {feedback.source}
              </Badge>
            )}
            
            {feedback.issueCount && feedback.issueCount > 0 && (
              <Badge variant="outline" className="text-xs text-orange-600 bg-orange-100 border-orange-300">
                Linked to {feedback.issueCount} issues
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/feedback/$feedbackId" params={{ feedbackId: feedback.id.toString() }}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => markLaterMutation.mutate()}
            disabled={markLaterMutation.isPending}
          >
            <Clock className="h-4 w-4 mr-1" />
            Later
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => resolveMutation.mutate()}
            disabled={resolveMutation.isPending}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Resolve
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => markSpamMutation.mutate()}
                disabled={markSpamMutation.isPending}
              >
                Mark as Spam
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="text-red-600"
              >
                Delete Feedback
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}