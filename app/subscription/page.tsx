"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { PlanCard } from "@/components/subscription/plan-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { subscriptionService, type SubscriptionPlan, type UserSubscription } from "@/lib/subscription"
import { CreditCard, Calendar, AlertCircle } from "lucide-react"

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [upgradeLoading, setUpgradeLoading] = useState(false)

  useEffect(() => {
    Promise.all([subscriptionService.getPlans(), subscriptionService.getCurrentSubscription()])
      .then(([plansData, subscriptionData]) => {
        // Mark current plan
        const plansWithCurrent = plansData.map((plan) => ({
          ...plan,
          current: subscriptionData?.planId === plan.id,
        }))
        setPlans(plansWithCurrent)
        setCurrentSubscription(subscriptionData)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handlePlanSelect = async (planId: string) => {
    setUpgradeLoading(true)
    try {
      await subscriptionService.upgradePlan(planId)
      // Refresh data
      const [plansData, subscriptionData] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getCurrentSubscription(),
      ])
      const plansWithCurrent = plansData.map((plan) => ({
        ...plan,
        current: subscriptionData?.planId === plan.id,
      }))
      setPlans(plansWithCurrent)
      setCurrentSubscription(subscriptionData)
    } catch (error) {
      console.error("[v0] Failed to upgrade plan:", error)
    } finally {
      setUpgradeLoading(false)
    }
  }

  const currentPlan = plans.find((plan) => plan.current)

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading subscription...</p>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="heading text-3xl text-foreground mb-2">Subscription & Billing</h1>
            <p className="body-text text-muted-foreground">Choose the plan that works best for you and your team</p>
          </div>

          {/* Current Subscription Status */}
          {currentSubscription && (
            <Card>
              <CardHeader>
                <CardTitle className="heading flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{currentPlan?.name} Plan</span>
                      <Badge variant={currentSubscription.status === "active" ? "default" : "secondary"}>
                        {currentSubscription.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Renews {currentSubscription.currentPeriodEnd.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${currentPlan?.price || 0}</div>
                    <div className="text-sm text-muted-foreground">per {currentPlan?.interval}</div>
                  </div>
                </div>

                {currentSubscription.cancelAtPeriodEnd && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800">Subscription Ending</p>
                      <p className="text-amber-700">
                        Your subscription will end on {currentSubscription.currentPeriodEnd.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pricing Plans */}
          <div>
            <h2 className="heading text-2xl text-center mb-6">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onSelect={handlePlanSelect} isLoading={upgradeLoading} />
              ))}
            </div>
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="heading">Billing History</CardTitle>
              <CardDescription className="body-text">View your past invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Billing History</h3>
                <p className="text-muted-foreground">
                  Your billing history will appear here once you make your first payment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
