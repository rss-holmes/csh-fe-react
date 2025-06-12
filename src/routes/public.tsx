import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}