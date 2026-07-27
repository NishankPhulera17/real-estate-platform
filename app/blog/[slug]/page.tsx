'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, ArrowLeft, Share2, Sparkles, Send } from 'lucide-react';
import { MOCK_BLOGS } from '@/lib/data/mockData';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const blog = MOCK_BLOGS.find(b => b.slug === resolvedParams.slug) || MOCK_BLOGS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link href="/blog" className="inline-flex items-center space-x-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Market Intelligence</span>
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
          {blog.category}
        </span>
        
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between border-y border-slate-200 py-3 text-xs text-slate-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden relative bg-slate-100">
              <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{blog.author.name}</p>
              <p className="text-[10px] text-slate-500">{blog.author.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span>Published {blog.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5" /> <span>{blog.readTimeMinutes} min read</span></span>
          </div>
        </div>
      </div>

      <div className="relative h-[400px] rounded-3xl overflow-hidden glass-panel border border-slate-200">
        <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" />
      </div>

      <div className="prose prose-invert max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
        <p className="font-semibold text-slate-900 text-base leading-normal">{blog.snippet}</p>
        <p>{blog.content}</p>
        <p>Market momentum across tier-1 developer projects has demonstrated that investors prioritizing RERA compliance, transit proximity, and quality of life amenities receive upwards of 15% CAGR capital appreciation over 3-year holding periods.</p>
      </div>

      {/* Advisory Callout CTA */}
      <div className="glass-panel p-8 rounded-3xl border border-brand-500/30 bg-brand-500/5 space-y-4">
        <div className="flex items-center space-x-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Real Estate Advisory Consultation</span>
        </div>
        <h3 className="font-display text-xl font-bold text-slate-900">Interested in investing in this corridor?</h3>
        <p className="text-xs text-slate-700">Request an exclusive price list and ROI spreadsheet directly from our senior intelligence desk.</p>
        <Link
          href="/properties"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-500 text-gray-950 font-bold text-xs hover:bg-brand-400 transition-colors"
        >
          <span>Explore Verified Listings</span>
          <Send className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
