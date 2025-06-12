import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Bot, Send, Sparkles, TrendingUp, MessageSquare, AlertCircle } from 'lucide-react'

interface AICopilotSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AICopilotSidebar({ isOpen, onClose }: AICopilotSidebarProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<string[]>([])

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    setIsLoading(true)
    // TODO: Implement AI API call
    setTimeout(() => {
      setInsights(prev => [...prev, `Analysis: ${message}`])
      setMessage('')
      setIsLoading(false)
    }, 1000)
  }

  const quickPrompts = [
    {
      title: 'Sentiment Analysis',
      description: 'Analyze customer sentiment trends',
      icon: TrendingUp,
      prompt: 'Analyze the sentiment of recent feedbacks and provide insights on customer satisfaction trends.'
    },
    {
      title: 'Feature Requests',
      description: 'Summarize feature requests',
      icon: MessageSquare,
      prompt: 'Summarize the most requested features from customer feedback and prioritize them.'
    },
    {
      title: 'Bug Reports',
      description: 'Identify common issues',
      icon: AlertCircle,
      prompt: 'Identify the most common bugs and issues reported by customers.'
    },
    {
      title: 'Customer Insights',
      description: 'Extract key insights',
      icon: Sparkles,
      prompt: 'Extract key insights from customer feedback to improve our product and customer experience.'
    }
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Copilot
          </SheetTitle>
          <SheetDescription>
            Get AI-powered insights and analysis of your customer feedback data.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Prompts */}
          <div>
            <h3 className="font-medium mb-3">Quick Insights</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickPrompts.map((prompt) => (
                <Card 
                  key={prompt.title}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setMessage(prompt.prompt)}
                >
                  <div className="flex items-start gap-2">
                    <prompt.icon className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{prompt.title}</p>
                      <p className="text-xs text-muted-foreground">{prompt.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Chat Interface */}
          <div>
            <h3 className="font-medium mb-3">Ask AI Copilot</h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Ask me anything about your feedback data..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || isLoading}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Analyzing...' : 'Send Message'}
              </Button>
            </div>
          </div>

          {/* Insights Display */}
          {insights.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">AI Insights</h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{insight}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            AI Generated
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {new Date().toLocaleTimeString()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* AI Features */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Available AI Features
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sentiment analysis and trends</li>
              <li>• Feature request prioritization</li>
              <li>• Bug pattern identification</li>
              <li>• Customer satisfaction insights</li>
              <li>• Automated response suggestions</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}