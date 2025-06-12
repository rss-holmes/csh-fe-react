import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Filter, GitBranch } from 'lucide-react'

interface IssueHeaderProps {
  onOpenCreateSidebar: () => void
}

export function IssueHeader({ onOpenCreateSidebar }: IssueHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Issues</h1>
          <p className="text-muted-foreground">Track and manage feature requests and bugs</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <GitBranch className="h-4 w-4 mr-2" />
            GitHub Sync
          </Button>
          
          <Button onClick={onOpenCreateSidebar}>
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-10"
          />
        </div>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="1">Low</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="3">High</SelectItem>
            <SelectItem value="4">Critical</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Board" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Boards</SelectItem>
            <SelectItem value="1">Bug Reports</SelectItem>
            <SelectItem value="2">Feature Requests</SelectItem>
            <SelectItem value="3">Improvements</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Active Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Active filters:</span>
        <Badge variant="secondary" className="gap-1">
          Status: Open
          <button className="text-muted-foreground hover:text-foreground">×</button>
        </Badge>
        <Badge variant="secondary" className="gap-1">
          Priority: High
          <button className="text-muted-foreground hover:text-foreground">×</button>
        </Badge>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          Clear all
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span>142 Open</span>
        <span>28 In Progress</span>
        <span>89 Completed</span>
        <span>15 Closed</span>
      </div>
    </div>
  )
}