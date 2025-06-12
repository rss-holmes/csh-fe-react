import { createFileRoute } from '@tanstack/react-router'
import { BoardPublicView } from '@/components/boards'

export const Route = createFileRoute('/public/board/$boardUrl')({
  component: PublicBoardPage,
})

function PublicBoardPage() {
  return <BoardPublicView />
}