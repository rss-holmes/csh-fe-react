import { createFileRoute } from '@tanstack/react-router'
import { FeedbacksMain } from '@/components/feedbacks/FeedbacksMain'

export const Route = createFileRoute('/_protected/feedbacks')({
  component: FeedbacksPage,
})

function FeedbacksPage() {
  return <FeedbacksMain />
}