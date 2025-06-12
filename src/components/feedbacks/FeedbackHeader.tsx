import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Bot, Filter } from 'lucide-react'

interface FeedbackHeaderProps {
  onOpenCreateSidebar: () => void
  onOpenAISidebar: () => void
}

export function FeedbackHeader({ onOpenCreateSidebar, onOpenAISidebar }: FeedbackHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feedbacks</h1>
          <p className="text-muted-foreground">Manage customer feedback and insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onOpenAISidebar}>
            <Bot className="h-4 w-4 mr-2" />
            AI Copilot
          </Button>
          
          <Button onClick={onOpenCreateSidebar}>
            <Plus className="h-4 w-4 mr-2" />
            New Feedback
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedbacks..."
            className="pl-10"
          />
        </div>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bug">Bug Report</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="improvement">Improvement</SelectItem>
            <SelectItem value="question">Question</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiment</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
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
          Status: New
          <button className="text-muted-foreground hover:text-foreground">×</button>
        </Badge>
        <Badge variant="secondary" className="gap-1">
          Type: Bug Report
          <button className="text-muted-foreground hover:text-foreground">×</button>
        </Badge>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          Clear all
        </Button>
      </div>
    </div>
  )
}