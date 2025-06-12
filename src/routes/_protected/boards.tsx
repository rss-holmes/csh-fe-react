import { createFileRoute } from '@tanstack/react-router'
import { BoardsMain } from '@/components/boards'

export const Route = createFileRoute('/_protected/boards')({
  component: BoardsPage,
})

function BoardsPage() {
  return <BoardsMain />
}