import { useState } from 'react'
import { FeedbackHeader } from './FeedbackHeader'
import { FeedbacksBody } from './FeedbacksBody'
import { CreateFeedbackSidebar } from './CreateFeedbackSidebar'
import { AICopilotSidebar } from './AICopilotSidebar'

export function FeedbacksMain() {
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false)
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false)

  return (
    <div className="space-y-6">
      <FeedbackHeader
        onOpenCreateSidebar={() => setIsCreateSidebarOpen(true)}
        onOpenAISidebar={() => setIsAISidebarOpen(true)}
      />
      
      <FeedbacksBody />

      <CreateFeedbackSidebar
        isOpen={isCreateSidebarOpen}
        onClose={() => setIsCreateSidebarOpen(false)}
      />
      
      <AICopilotSidebar
        isOpen={isAISidebarOpen}
        onClose={() => setIsAISidebarOpen(false)}
      />
    </div>
  )
}