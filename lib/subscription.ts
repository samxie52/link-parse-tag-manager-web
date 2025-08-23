export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  popular?: boolean
  current?: boolean
}

export interface UserSubscription {
  id: string
  planId: string
  status: "active" | "canceled" | "past_due" | "trialing"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    interval: "month",
    features: ["Up to 50 links per month", "Basic link parsing", "Personal workspace", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    interval: "month",
    features: [
      "Unlimited links",
      "AI-enhanced content",
      "Team collaboration",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49,
    interval: "month",
    features: [
      "Everything in Pro",
      "Advanced team management",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
]

export const subscriptionService = {
  getPlans: (): Promise<SubscriptionPlan[]> => {
    return Promise.resolve(subscriptionPlans)
  },

  getCurrentSubscription: (): Promise<UserSubscription | null> => {
    // Mock current subscription
    return Promise.resolve({
      id: "sub_1",
      planId: "basic",
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    })
  },

  upgradePlan: (planId: string): Promise<void> => {
    console.log(`[v0] Upgrading to plan: ${planId}`)
    return Promise.resolve()
  },

  cancelSubscription: (): Promise<void> => {
    console.log("[v0] Canceling subscription")
    return Promise.resolve()
  },
}
