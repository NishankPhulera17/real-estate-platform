import React from 'react';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { Target, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export default function AgentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">For Real Estate Professionals</span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900">
          Grow Your Business with <span className="brand-gradient-text">North Nest Leads</span>
        </h1>
        <p className="text-lg text-slate-600">
          We connect top-tier real estate agents with highly qualified, high-intent buyers looking for premium homes and retreats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Value Proposition */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-slate-900">Why Partner With Us?</h2>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">High Intent Buyers</h3>
                <p className="text-sm text-slate-600 mt-1">Our users are actively searching for premium real estate. We pre-qualify leads so you don't waste time.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Higher Conversion Rates</h3>
                <p className="text-sm text-slate-600 mt-1">Detailed user profiles and property interests are captured upfront, allowing you to tailor your pitch.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Exclusive Territory</h3>
                <p className="text-sm text-slate-600 mt-1">We limit the number of agent partners in each market to ensure you get a consistent volume of high-quality leads.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Zero Fake Leads</h3>
                <p className="text-sm text-slate-600 mt-1">Every lead undergoes phone number verification and spam-check before being routed to you.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Lead Capture Form for Agents */}
        <div className="sticky top-24">
          <LeadCaptureForm source="agent_page" />
        </div>

      </div>

    </div>
  );
}
