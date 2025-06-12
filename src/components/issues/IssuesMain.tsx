import { useState } from 'react'
import { IssueHeader } from './IssueHeader'
import { IssuesBody } from './IssuesBody'
import { CreateIssueSidebar } from './CreateIssueSidebar'

export function IssuesMain() {
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false)

  return (
    <div className="space-y-6">
      <IssueHeader onOpenCreateSidebar={() => setIsCreateSidebarOpen(true)} />
      
      <IssuesBody />

      <CreateIssueSidebar
        isOpen={isCreateSidebarOpen}
        onClose={() => setIsCreateSidebarOpen(false)}
      />
    </div>
  )
}