import React, { use } from 'react';
import Link from 'next/link';

export default function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <Link href="/guides" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
        &larr; Back to Guides
      </Link>
      
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Guide</span>
        <h1 className="font-display text-4xl font-bold text-slate-900 capitalize">
          {resolvedParams.slug.replace(/-/g, ' ')}
        </h1>
        <p className="text-sm text-slate-500">Published • 10 min read</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-700 leading-relaxed">
          This is a placeholder for the comprehensive guide content. Real content will be fetched from the CMS and rendered here using rich text formatting, helping users make informed decisions about migrating to a healthier lifestyle.
        </p>
        
        <div className="p-6 bg-brand-50 border border-brand-200 rounded-2xl mt-8">
          <h3 className="font-bold text-slate-900 mb-2">Need Expert Advice?</h3>
          <p className="text-sm text-slate-700 mb-4">
            Connect with our migration advisors to discuss your specific situation and get personalized guidance on finding your ideal destination.
          </p>
          <button className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors">
            Talk to Migration Advisor
          </button>
        </div>
      </div>
    </div>
  );
}
