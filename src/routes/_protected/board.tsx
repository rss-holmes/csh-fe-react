import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/board')({
  component: () => <div>Board layout</div>,
})