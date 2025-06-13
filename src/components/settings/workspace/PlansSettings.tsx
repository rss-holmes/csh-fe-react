import { useState } from 'react'
import { CreditCard, Check, Crown, Zap, Shield, Users, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface PlanFeature {
  name: string
  icon: React.ElementType
  included: boolean
  description?: string
}

interface Plan {
  id: string
  name: string
  price: {
    monthly: number
    annual: number
  }
  description: string
  badge?: string
  badgeColor?: string
  features: PlanFeature[]
  cta: string
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for getting started with feedback collection',
    features: [
      { name: 'Up to 100 feedback items', icon: BarChart3, included: true },
      { name: '1 workspace', icon: Users, included: true },
      { name: 'Basic roadmaps', icon: BarChart3, included: true },
      { name: 'Community support', icon: Shield, included: true },
      { name: 'Advanced analytics', icon: BarChart3, included: false },
      { name: 'AI copilot', icon: Zap, included: false },
      { name: 'Priority support', icon: Shield, included: false },
    ],
    cta: 'Current Plan',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 19, annual: 15 },
    description: 'Great for small teams and growing products',
    badge: 'Popular',
    badgeColor: 'bg-blue-100 text-blue-800',
    popular: true,
    features: [
      { name: 'Up to 1,000 feedback items', icon: BarChart3, included: true },
      { name: '3 workspaces', icon: Users, included: true },
      { name: 'Advanced roadmaps', icon: BarChart3, included: true },
      { name: 'Email support', icon: Shield, included: true },
      { name: 'Basic analytics', icon: BarChart3, included: true },
      { name: 'AI copilot', icon: Zap, included: false },
      { name: 'Priority support', icon: Shield, included: false },
    ],
    cta: 'Upgrade to Starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: { monthly: 39, annual: 31 },
    description: 'Perfect for growing teams with advanced needs',
    features: [
      { name: 'Up to 10,000 feedback items', icon: BarChart3, included: true },
      { name: 'Unlimited workspaces', icon: Users, included: true },
      { name: 'Advanced roadmaps', icon: BarChart3, included: true },
      { name: 'Priority support', icon: Shield, included: true },
      { name: 'Advanced analytics', icon: BarChart3, included: true },
      { name: 'AI copilot (Basic)', icon: Zap, included: true },
      { name: 'Custom integrations', icon: Zap, included: false },
    ],
    cta: 'Upgrade to Growth',
  },
  {
    id: 'business',
    name: 'Business',
    price: { monthly: 79, annual: 63 },
    description: 'Enterprise-grade features for large organizations',
    badge: 'Enterprise',
    badgeColor: 'bg-purple-100 text-purple-800',
    features: [
      { name: 'Unlimited feedback items', icon: BarChart3, included: true },
      { name: 'Unlimited workspaces', icon: Users, included: true },
      { name: 'Enterprise roadmaps', icon: BarChart3, included: true },
      { name: 'Dedicated support', icon: Shield, included: true },
      { name: 'Advanced analytics', icon: BarChart3, included: true },
      { name: 'AI copilot (Advanced)', icon: Zap, included: true },
      { name: 'Custom integrations', icon: Zap, included: true },
    ],
    cta: 'Upgrade to Business',
  },
]

export default function PlansSettings() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [currentPlan] = useState('free')

  const handleUpgrade = (planId: string) => {
    // In a real app, this would integrate with Paddle or another payment processor
    toast.info(`Upgrade to ${plans.find(p => p.id === planId)?.name} plan integration would happen here`)
  }

  const getPrice = (plan: Plan) => {
    const price = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly
    return price === 0 ? 'Free' : `$${price}`
  }

  const getSavings = (plan: Plan) => {
    if (plan.price.monthly === 0) return null
    const monthlyTotal = plan.price.monthly * 12
    const annualTotal = plan.price.annual * 12
    const savings = monthlyTotal - annualTotal
    return savings > 0 ? `Save $${savings}/year` : null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Plans & Billing
        </h2>
        <p className="text-muted-foreground mt-1">
          Choose the plan that works best for your team
        </p>
      </div>

      {/* Current Plan Overview */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-600" />
                Current Plan: Free
              </CardTitle>
              <CardDescription>
                You're currently on the Free plan with basic features
              </CardDescription>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">42</p>
              <p className="text-sm text-muted-foreground">Feedback Items</p>
              <p className="text-xs text-muted-foreground">of 100 limit</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-sm text-muted-foreground">Workspace</p>
              <p className="text-xs text-muted-foreground">of 1 limit</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-xs text-muted-foreground">unlimited</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Cycle</CardTitle>
          <CardDescription>
            Save up to 20% with annual billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'font-medium' : ''}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
            />
            <Label htmlFor="billing-toggle" className={billingCycle === 'annual' ? 'font-medium' : ''}>
              Annual
              <Badge variant="secondary" className="ml-2 text-xs">
                20% off
              </Badge>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative ${plan.popular ? 'border-blue-200 shadow-md' : ''} ${
              currentPlan === plan.id ? 'border-green-200 bg-green-50/50' : ''
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className={plan.badgeColor}>
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold">{getPrice(plan)}</span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground ml-1">
                      /{billingCycle === 'annual' ? 'mo' : 'month'}
                    </span>
                  )}
                </div>
                {billingCycle === 'annual' && getSavings(plan) && (
                  <p className="text-sm text-green-600">{getSavings(plan)}</p>
                )}
              </div>
              <CardDescription className="text-center">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {plan.features.map((feature, index) => {
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        feature.included ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 border border-muted-foreground/30 rounded-sm flex-shrink-0" />
                      )}
                      <span className={!feature.included ? 'line-through' : ''}>
                        {feature.name}
                      </span>
                    </div>
                  )
                })}
              </div>

              <Separator />

              <Button 
                className="w-full"
                variant={currentPlan === plan.id ? 'secondary' : 'default'}
                disabled={currentPlan === plan.id}
                onClick={() => handleUpgrade(plan.id)}
              >
                {currentPlan === plan.id ? 'Current Plan' : plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enterprise Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Need Something Custom?</CardTitle>
          <CardDescription>
            Contact us for enterprise solutions with custom pricing and features
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Enterprise Plan</p>
            <p className="text-sm text-muted-foreground">
              Custom features, dedicated support, and flexible pricing
            </p>
          </div>
          <Button variant="outline">
            Contact Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}