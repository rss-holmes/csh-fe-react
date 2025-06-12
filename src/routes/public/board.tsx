import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/public/board')({
  component: () => <div>Public board layout</div>,
})