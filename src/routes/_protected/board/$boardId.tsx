import { createFileRoute } from '@tanstack/react-router'
import { BoardDetails } from '@/components/boards'

export const Route = createFileRoute('/_protected/board/$boardId')({
  component: BoardDetailsPage,
})

function BoardDetailsPage() {
  return <BoardDetails />
}