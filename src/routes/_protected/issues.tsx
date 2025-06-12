import { createFileRoute } from '@tanstack/react-router'
import { IssuesMain } from '@/components/issues/IssuesMain'

export const Route = createFileRoute('/_protected/issues')({
  component: IssuesPage,
})

function IssuesPage() {
  return <IssuesMain />
}