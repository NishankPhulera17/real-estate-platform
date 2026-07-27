'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Building2, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { MOCK_BUILDERS } from '@/lib/data/mockData';

export default function BuildersDirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Institutional Partners</span>
        <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">Verified Real Estate Developers</h1>
        <p className="text-xs text-slate-600 mt-1">Leading Grade-A builders with verified track records across India</p>
      </div>

      {/* Builders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_BUILDERS.map((bldr) => (
          <div key={bldr.id} className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-5 glass-panel-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative bg-white border border-slate-300 shrink-0">
                  <Image src={bldr.logo} alt={bldr.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-display text-xl font-bold text-slate-900">{bldr.name}</h2>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-600">{bldr.headquarters} • {bldr.experienceYears} Years Track Record</p>
                  <div className="flex items-center space-x-1 mt-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{bldr.rating} / 5.0</span>
                    <span className="text-[10px] text-slate-500 font-normal">({bldr.reviewsCount} verified reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{bldr.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-600 block">Delivered Projects</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{bldr.completedProjectsCount}+</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block">Active Launches</span>
                  <span className="font-bold text-brand-400 mt-0.5 block">{bldr.ongoingProjectsCount}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/builders/${bldr.slug}`}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 hover:text-slate-900 text-center flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Explore Builder Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
            </Link>

          </div>
        ))}
      </div>

    </div>
  );
}
