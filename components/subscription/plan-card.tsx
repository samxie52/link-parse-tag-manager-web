"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown } from "lucide-react"
import type { SubscriptionPlan } from "@/lib/subscription"

interface PlanCardProps {
  plan: SubscriptionPlan
  onSelect: (planId: string) => void
  isLoading?: boolean
}

export function PlanCard({ plan, onSelect, isLoading }: PlanCardProps) {
  const isCurrentPlan = plan.current
  const isFree = plan.price === 0

  return (
    <Card className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Crown className="mr-1 h-3 w-3" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="heading text-xl">{plan.name}</CardTitle>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-foreground">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
        <CardDescription className="body-text">
          {isFree
            ? "Perfect for getting started"
            : plan.name === "Pro"
              ? "Best for growing teams"
              : "For large organizations"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="body-text text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSelect(plan.id)}
          disabled={isCurrentPlan || isLoading}
          className="w-full"
          variant={plan.popular ? "default" : "outline"}
        >
          {isCurrentPlan ? "Current Plan" : isFree ? "Get Started" : `Upgrade to ${plan.name}`}
        </Button>
      </CardContent>
    </Card>
  )
}
