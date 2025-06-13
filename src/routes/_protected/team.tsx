import { createFileRoute } from '@tanstack/react-router'
import TeamManagement from '@/components/team/TeamManagement'

export const Route = createFileRoute('/_protected/team')({
  component: TeamPage,
})

function TeamPage() {
  return (
    <div className="container mx-auto py-6">
      <TeamManagement />
    </div>
  )
}