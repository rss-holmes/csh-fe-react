import { Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  MoreVertical, 
  Users, 
  MessageSquare, 
  Eye, 
  Globe, 
  Lock,
  Trash2,
  Edit
} from 'lucide-react'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import * as boardApi from '@/api/board'
import type { Board } from '@/api/board'
import { formatDateTime } from '@/utils/dateFormatter'

interface BoardCardProps {
  board: Board
  onEdit?: (board: Board) => void
}

export function BoardCard({ board, onEdit }: BoardCardProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => boardApi.deleteBoard(board.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.all })
      toast.success('Board deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete board')
    },
  })

  const toggleVisibilityMutation = useMutation({
    mutationFn: () => boardApi.updateBoard(board.id, { 
      isPublic: !board.isPublic 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.all })
      toast.success(`Board is now ${board.isPublic ? 'private' : 'public'}`)
    },
    onError: () => {
      toast.error('Failed to update board visibility')
    },
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300'
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              <Link 
                to="/board/$boardId" 
                params={{ boardId: board.id.toString() }}
                className="block"
              >
                {board.name}
              </Link>
            </CardTitle>
            {board.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {board.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(board)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Board
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => toggleVisibilityMutation.mutate()}
                disabled={toggleVisibilityMutation.isPending}
              >
                {board.isPublic ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Make Private
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Make Public
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{board.feedbacksCount || 0} feedback</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{board.subscribersCount || 0} subscribers</span>
          </div>
          {board.isPublic && (
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{board.viewsCount || 0} views</span>
            </div>
          )}
        </div>

        {/* Tags and Status */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusColor(board.status || 'active')}`}
          >
            {board.status || 'Active'}
          </Badge>
          
          <Badge variant="outline" className="text-xs">
            {board.isPublic ? (
              <>
                <Globe className="h-3 w-3 mr-1" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Private
              </>
            )}
          </Badge>
          
          {board.category && (
            <Badge variant="outline" className="text-xs text-purple-600 bg-purple-100 border-purple-300">
              {board.category}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created {formatDateTime(board.createdAt)}</span>
          {board.updatedAt !== board.createdAt && (
            <span>Updated {formatDateTime(board.updatedAt)}</span>
          )}
        </div>

        {/* Quick Action */}
        <div className="mt-4 pt-3 border-t">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/board/$boardId" params={{ boardId: board.id.toString() }}>
              <Eye className="h-4 w-4 mr-2" />
              View Board
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}