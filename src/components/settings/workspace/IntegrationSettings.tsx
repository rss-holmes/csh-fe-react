import { useState } from 'react'
import { Plug, Github, MessageSquare, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ElementType
  connected: boolean
  status: 'connected' | 'disconnected' | 'error'
  features: string[]
}

export default function IntegrationSettings() {
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Connect your GitHub repositories to sync issues and track development progress',
      icon: Github,
      connected: false,
      status: 'disconnected',
      features: ['Issue Export', 'Repository Selection', 'Development Tracking'],
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Automatically import feedback from Slack channels and get notifications',
      icon: MessageSquare,
      connected: false,
      status: 'disconnected',
      features: ['Feedback Import', 'Notifications', 'Team Collaboration'],
    },
  ])

  const handleGitHubConnect = () => {
    // Simulate OAuth flow
    const clientId = process.env.VITE_GITHUB_CLIENT_ID || 'your-github-client-id'
    const redirectUri = encodeURIComponent(`${window.location.origin}/settings?section=integrations`)
    const scope = 'repo,user:email'
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
    
    // In a real app, this would redirect to GitHub OAuth
    toast.info('GitHub OAuth integration would open here')
    console.log('GitHub OAuth URL:', authUrl)
  }

  const handleSlackConnect = () => {
    // Simulate Slack OAuth flow
    const clientId = '1234567890.1234567890'
    const scope = 'channels:read,chat:write'
    const redirectUri = encodeURIComponent(`${window.location.origin}/settings?section=integrations`)
    
    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`
    
    // In a real app, this would redirect to Slack OAuth
    toast.info('Slack OAuth integration would open here')
    console.log('Slack OAuth URL:', authUrl)
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, connected: false, status: 'disconnected' as const }
          : integration
      )
    )
    toast.success(`${integrationId} disconnected successfully`)
  }

  const handleRepoSelection = (repo: string) => {
    setSelectedRepo(repo)
    toast.success(`Repository updated to ${repo}`)
  }

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Connected
          </Badge>
        )
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            Not Connected
          </Badge>
        )
    }
  }

  // Mock repository list
  const mockRepos = [
    'insightyeti/frontend',
    'insightyeti/backend',
    'insightyeti/mobile-app',
    'insightyeti/docs',
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Plug className="h-6 w-6" />
          Integration Settings
        </h2>
        <p className="text-muted-foreground mt-1">
          Connect your workspace with external tools and services
        </p>
      </div>

      <div className="grid gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon
          const isGitHub = integration.id === 'github'
          
          return (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {integration.name}
                        {getStatusBadge(integration.status)}
                      </CardTitle>
                      <CardDescription>
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.connected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={isGitHub ? handleGitHubConnect : handleSlackConnect}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {integration.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* GitHub Repository Selection */}
                  {isGitHub && integration.connected && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Repository Selection</h4>
                      <Select value={selectedRepo} onValueChange={handleRepoSelection}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a repository" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockRepos.map((repo) => (
                            <SelectItem key={repo} value={repo}>
                              {repo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Issues will be exported to the selected repository
                      </p>
                    </div>
                  )}

                  {/* Slack Channel Configuration */}
                  {integration.id === 'slack' && integration.connected && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Configuration</h4>
                      <p className="text-sm text-muted-foreground">
                        Feedback will be automatically imported from connected Slack channels.
                        Notifications will be sent to your default channel.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Integration Help */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Learn more about setting up integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <p>
                <strong>GitHub:</strong> Connect to sync issues and track development progress. 
                You'll need admin access to the repository.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <p>
                <strong>Slack:</strong> Import feedback from channels automatically. 
                Install the InsightYeti app in your Slack workspace.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <p>
                Having trouble? Check our documentation or contact support for assistance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}