import { createFileRoute } from '@tanstack/react-router'
import SettingsMain from '@/components/settings/SettingsMain'

type SettingsSearch = {
  section?: 'profile' | 'security' | 'notifications' | 'general' | 'team' | 'integrations' | 'plans'
}

export const Route = createFileRoute('/_protected/settings')({
  component: SettingsPage,
  validateSearch: (search: Record<string, unknown>): SettingsSearch => {
    return {
      section: typeof search.section === 'string' ? search.section as SettingsSearch['section'] : undefined,
    }
  },
})

function SettingsPage() {
  return <SettingsMain />
}