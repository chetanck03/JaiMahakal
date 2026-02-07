'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export default function PricingPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for solo founders getting started',
      icon: Sparkles,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      features: [
        '1 workspace',
        'Up to 50 tasks',
        'Basic analytics',
        '5 team members',
        'Email support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For growing startups with ambitious goals',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      features: [
        'Unlimited workspaces',
        'Unlimited tasks',
        'Advanced analytics',
        'Unlimited team members',
        'AI-powered insights',
        'Pitch generator',
        'Priority support',
        'Real-time collaboration',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For accelerators and large teams',
      icon: Crown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated account manager',
        'Custom training',
        'SLA guarantee',
        'Advanced security',
        'API access',
        'White-label options',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your startup journey. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? 'ring-2 ring-purple-600 shadow-xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 ${plan.bgColor} rounded-lg mb-4`}>
                    <Icon className={`w-8 h-8 ${plan.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant={plan.popular ? 'primary' : 'outline'}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.cta}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 14-day free trial. No credit card required.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens after the trial?
              </h3>
              <p className="text-gray-600">
                After your trial ends, you'll be prompted to enter payment information. You can also downgrade to the free plan.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Modal (Dummy) */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title={`Subscribe to ${selectedPlan}`}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Demo Mode:</strong> This is a dummy payment integration. In production, this would connect to Stripe, PayPal, or your preferred payment processor.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  placeholder="123"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button fullWidth disabled>
              Complete Payment (Demo)
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            This is a demonstration. No actual payment will be processed.
          </p>
        </div>
      </Modal>
    </div>
  );
}
