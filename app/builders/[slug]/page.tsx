'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck, Building2, Phone, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { MOCK_BUILDERS } from '@/lib/data/mockData';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';
import { Property } from '@/lib/types';

export default function BuilderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const builder = MOCK_BUILDERS.find(b => b.slug === resolvedParams.slug) || MOCK_BUILDERS[0];
  const [builderProjects, setBuilderProjects] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await searchPropertiesAction({ limit: 20 });
        if (res && !('error' in res) && res.data) {
          const formatted = res.data.map(item => formatDbProperty(item));
          const filtered = formatted.filter(
            p => p.builder.id === builder.id || p.builder.name.toLowerCase().includes(builder.name.toLowerCase().split(' ')[0]) || formatted.length <= 6
          );
          setBuilderProjects(filtered);
        }
      } catch (err) {
        console.error("Error loading builder profile projects:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [builder.id, builder.name]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 space-y-10">
      
      {/* HEADER BANNER */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden relative bg-white border border-slate-300 shrink-0">
              <Image src={builder.logo} alt={builder.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{builder.name}</h1>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{builder.headquarters} • Established {2026 - builder.experienceYears}</p>
              <div className="flex items-center space-x-2 mt-1.5 text-xs text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{builder.rating} Rating</span>
                <span className="text-slate-500 font-normal">({builder.reviewsCount} Buyer Reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 text-xs font-semibold">
            <a href={`tel:${builder.contactPhone}`} className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:text-slate-900 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>Call Desk</span>
            </a>
            <a href={`mailto:${builder.contactEmail}`} className="px-4 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 hover:bg-brand-500/20 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Sales</span>
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">{builder.description}</p>
      </div>

      {/* PROJECTS BY THIS BUILDER */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-slate-900">Active Projects by {builder.name}</h2>
        
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <p className="text-xs">Loading developer properties from database...</p>
          </div>
        ) : builderProjects.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl text-xs text-slate-600">
            No active public listings currently for this developer in PostgreSQL database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {builderProjects.map((prop) => (
              <Link key={prop.id} href={`/properties/${prop.id}`} className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-5 group hover:border-brand-500/50 transition-all">
                <div className="relative h-44 w-full sm:w-48 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <Image src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="space-y-2 flex flex-col justify-between w-full">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-gray-950 uppercase tracking-wide inline-block mb-1">⚡ LIVE IN POSTGRESQL</span>
                    <span className="text-[10px] font-bold text-brand-400 uppercase block">{prop.bhk} BHK • {prop.propertyType}</span>
                    <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-brand-300 transition-colors line-clamp-1">{prop.title}</h3>
                    <p className="font-display text-lg font-bold brand-gradient-text mt-1">{prop.priceDisplay}</p>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center space-x-1">
                    <span>View Property Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
