import { useState } from 'react'
import { Bell, Mail, MessageSquare, CheckCircle, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface NotificationSetting {
  id: string
  title: string
  description: string
  icon: React.ElementType
  enabled: boolean
  category: 'email' | 'general'
}

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'weekly_digest',
      title: 'Weekly Digest Email',
      description: 'Get a weekly summary of workspace activity and insights',
      icon: Mail,
      enabled: true,
      category: 'email',
    },
    {
      id: 'issue_done',
      title: 'Issue Marked as Done',
      description: 'Receive notifications when issues you\'re involved with are completed',
      icon: CheckCircle,
      enabled: true,
      category: 'general',
    },
    {
      id: 'release_publish',
      title: 'Release Publish Notification',
      description: 'Get notified when new releases are published in your workspace',
      icon: Rocket,
      enabled: false,
      category: 'general',
    },
    {
      id: 'new_comment',
      title: 'New Comment Notification',
      description: 'Receive notifications when someone comments on your issues or feedback',
      icon: MessageSquare,
      enabled: true,
      category: 'general',
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    )
  }

  const saveNotificationSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Notification settings saved successfully')
    } catch (error) {
      toast.error('Failed to save notification settings')
    } finally {
      setIsLoading(false)
    }
  }

  const emailNotifications = notifications.filter(n => n.category === 'email')
  const generalNotifications = notifications.filter(n => n.category === 'general')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notification Settings
        </h2>
        <p className="text-muted-foreground mt-1">
          Configure how and when you receive notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Control which email notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {emailNotifications.map((notification) => {
            const Icon = notification.icon
            return (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label 
                      htmlFor={notification.id}
                      className="text-base font-medium cursor-pointer"
                    >
                      {notification.title}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={notification.id}
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            General Notifications
          </CardTitle>
          <CardDescription>
            Manage notifications for workspace activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {generalNotifications.map((notification) => {
            const Icon = notification.icon
            return (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label 
                      htmlFor={notification.id}
                      className="text-base font-medium cursor-pointer"
                    >
                      {notification.title}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={notification.id}
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Delivery</CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between opacity-50">
              <div>
                <Label className="text-base font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Browser push notifications (Coming soon)
                </p>
              </div>
              <Switch disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={saveNotificationSettings}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Notification Settings'}
        </Button>
      </div>
    </div>
  )
}