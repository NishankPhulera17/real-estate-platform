import React from 'react';

export default function CommunitiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
      <span className="text-sm font-bold uppercase tracking-wider text-brand-500">Coming Soon</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900">Local Communities</h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        We are building a directory of local events, cafes, coworking spaces, organic markets, and volunteer opportunities across all our premium destinations to help you integrate seamlessly into your new life.
      </p>
      <div className="pt-8">
        <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all">
          Join the Waitlist
        </button>
      </div>
    </div>
  );
}
