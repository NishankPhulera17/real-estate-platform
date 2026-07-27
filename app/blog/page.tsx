'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, ArrowRight, Tag, Clock } from 'lucide-react';
import { MOCK_BLOGS } from '@/lib/data/mockData';

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Investment', 'Market News', 'Buying Guide', 'Loans & Finance'];

  const filteredBlogs = MOCK_BLOGS.filter(b => selectedCategory === 'All' || b.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 pt-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Market Intelligence Desk</span>
        <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">Real Estate Insights & Investment Guides</h1>
        <p className="text-xs text-slate-600 mt-1">In-depth research on price growth corridors, tax laws, and developer reviews</p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredBlogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`} className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 group glass-panel-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative h-56 rounded-2xl overflow-hidden">
                <Image src={blog.coverImage} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-brand-500/90 text-gray-950 text-[10px] font-extrabold uppercase">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 group-hover:text-brand-300 transition-colors">{blog.title}</h2>
                <p className="text-xs text-slate-700 leading-relaxed mt-2 line-clamp-3">{blog.snippet}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full overflow-hidden relative bg-slate-100">
                  <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
                </div>
                <span>{blog.author.name}</span>
              </div>

              <div className="flex items-center space-x-1 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{blog.readTimeMinutes} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
