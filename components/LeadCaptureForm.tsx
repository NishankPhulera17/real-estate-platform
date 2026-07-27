'use client';

import React, { useState } from 'react';
import Button from './ui/Button';
import { Send, User, Mail, Phone, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadCaptureFormProps {
  propertyId?: string;
  source: 'property_detail' | 'agent_page' | 'homepage';
}

export default function LeadCaptureForm({ propertyId, source }: LeadCaptureFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-2xl border border-forest-500/30 text-center"
      >
        <div className="w-16 h-16 bg-forest-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-forest-400" />
        </div>
        <h3 className="text-xl font-display font-semibold text-slate-900 mb-2">Request Sent Successfully!</h3>
        <p className="text-slate-600 text-sm">
          A local real estate expert will contact you shortly to discuss your dream home.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-slate-900 mb-1">
          {source === 'agent_page' ? 'Partner with North Nest' : 'Talk to Migration Advisor'}
        </h3>
        <p className="text-sm text-slate-600">
          {source === 'agent_page' 
            ? 'Start receiving premium leads for top properties.' 
            : 'Fill out the form below to get more details or schedule a viewing.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            required
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
            placeholder="Full Name"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="email"
            required
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
            placeholder="Email Address"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="tel"
            required
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
            placeholder="Phone Number"
          />
        </div>

        {source !== 'agent_page' && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
              <Home className="h-5 w-5 text-slate-500" />
            </div>
            <textarea
              rows={3}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all resize-none"
              placeholder={propertyId ? "I'm interested in this property..." : "What kind of home are you looking for?"}
            ></textarea>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending...' : 'Submit Request'}
        </Button>

        <p className="text-xs text-slate-500 text-center mt-4">
          By submitting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
}
