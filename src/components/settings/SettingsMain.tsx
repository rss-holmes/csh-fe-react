import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  User,
  Shield,
  Bell,
  Building,
  Users,
  Plug,
  CreditCard,
  Settings as SettingsIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ProfileSettings from './account/ProfileSettings'
import SecuritySettings from './account/SecuritySettings'
import NotificationSettings from './account/NotificationSettings'
import GeneralSettings from './workspace/GeneralSettings'
import TeamSettings from './workspace/TeamSettings'
import IntegrationSettings from './workspace/IntegrationSettings'
import PlansSettings from './workspace/PlansSettings'

type SettingSection = 
  | 'profile' 
  | 'security' 
  | 'notifications' 
  | 'general' 
  | 'team' 
  | 'integrations' 
  | 'plans'

interface SettingsNavItem {
  id: SettingSection
  label: string
  icon: React.ElementType
  category: 'account' | 'workspace'
}

const settingsNavigation: SettingsNavItem[] = [
  // Workspace Settings
  { id: 'general', label: 'General', icon: Building, category: 'workspace' },
  { id: 'team', label: 'Team', icon: Users, category: 'workspace' },
  { id: 'integrations', label: 'Integrations', icon: Plug, category: 'workspace' },
  { id: 'plans', label: 'Plans', icon: CreditCard, category: 'workspace' },
  
  // Account Settings
  { id: 'profile', label: 'Profile', icon: User, category: 'account' },
  { id: 'security', label: 'Security', icon: Shield, category: 'account' },
  { id: 'notifications', label: 'Notifications', icon: Bell, category: 'account' },
]

export default function SettingsMain() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_protected/settings' }) as { section?: SettingSection }
  const [activeSection, setActiveSection] = useState<SettingSection>('general')

  useEffect(() => {
    if (search.section && settingsNavigation.find(item => item.id === search.section)) {
      setActiveSection(search.section)
    }
  }, [search.section])

  const handleSectionChange = (section: SettingSection) => {
    setActiveSection(section)
    navigate({
      to: '/settings',
      search: { section },
    })
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />
      case 'security':
        return <SecuritySettings />
      case 'notifications':
        return <NotificationSettings />
      case 'general':
        return <GeneralSettings />
      case 'team':
        return <TeamSettings />
      case 'integrations':
        return <IntegrationSettings />
      case 'plans':
        return <PlansSettings />
      default:
        return <GeneralSettings />
    }
  }

  const workspaceItems = settingsNavigation.filter(item => item.category === 'workspace')
  const accountItems = settingsNavigation.filter(item => item.category === 'account')

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-6">
                {/* Workspace Settings */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Workspace
                  </h3>
                  <div className="space-y-1">
                    {workspaceItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Button
                          key={item.id}
                          variant={activeSection === item.id ? 'default' : 'ghost'}
                          className={cn(
                            'w-full justify-start gap-3',
                            activeSection === item.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          )}
                          onClick={() => handleSectionChange(item.id)}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Account Settings */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Account
                  </h3>
                  <div className="space-y-1">
                    {accountItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Button
                          key={item.id}
                          variant={activeSection === item.id ? 'default' : 'ghost'}
                          className={cn(
                            'w-full justify-start gap-3',
                            activeSection === item.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          )}
                          onClick={() => handleSectionChange(item.id)}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-6">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}