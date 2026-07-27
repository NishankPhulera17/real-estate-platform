'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, TrendingUp, Building2, CheckCircle2, ArrowRight, HelpCircle, Loader2 } from 'lucide-react';
import { MOCK_LOCALITIES } from '@/lib/data/mockData';
import { formatNumberIN } from '@/lib/utils';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';
import { Property } from '@/lib/types';

export default function LocalityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slugKey = resolvedParams.slug.toLowerCase();
  const locality = MOCK_LOCALITIES[slugKey] || MOCK_LOCALITIES['gurgaon'];

  const [areaProperties, setAreaProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAreaProps() {
      try {
        const res = await searchPropertiesAction({ limit: 20 });
        if (res && !('error' in res) && res.data) {
          const allFormatted = res.data.map(item => formatDbProperty(item));
          const filtered = allFormatted.filter(
            p => p.location.city.toLowerCase().includes(locality.city.toLowerCase()) || 
                 p.location.locality.toLowerCase().includes(locality.slug) ||
                 allFormatted.length <= 4 // fallback if few properties exist in DB
          );
          setAreaProperties(filtered);
        }
      } catch (err) {
        console.error("Error loading locality properties:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAreaProps();
  }, [locality.city, locality.slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 space-y-12">
      
      {/* LOCALITY HERO BANNER */}
      <div className="relative h-80 rounded-3xl overflow-hidden glass-panel border border-slate-200 flex items-end p-8 sm:p-12">
        <Image src={locality.heroImage} alt={locality.name} fill className="object-cover opacity-30" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
            Micro-Market Guide • {locality.city}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900">
            {locality.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{locality.description}</p>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-600 block font-semibold uppercase">Avg Sq.Ft Price</span>
          <span className="font-display text-2xl font-bold brand-gradient-text mt-1 block">
            ₹{formatNumberIN(locality.avgPricePerSqFt)}
          </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-600 block font-semibold uppercase">YoY Value Appreciation</span>
          <span className="font-display text-2xl font-bold text-emerald-400 mt-1 block">
            +{locality.growthYoyPercent}% YoY
          </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-600 block font-semibold uppercase">Active RERA Projects</span>
          <span className="font-display text-2xl font-bold text-amber-400 mt-1 block">
            {areaProperties.length > 0 ? `${areaProperties.length * 2}+ Developments` : 'Active Feed'}
          </span>
        </div>
      </div>

      {/* NEARBY INFRASTRUCTURE */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 space-y-6">
        <h2 className="font-display text-xl font-bold text-slate-900">Key Infrastructure & Transit Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locality.nearbyInfra.map((infra, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 text-[10px] font-bold">{infra.category}</span>
              <h4 className="text-xs font-bold text-slate-900">{infra.name}</h4>
              <p className="text-[11px] text-slate-600">{infra.distanceKm} km away</p>
            </div>
          ))}
        </div>
      </div>

      {/* TOP PROJECTS IN LOCALITY */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-slate-900">Popular Developments in {locality.name}</h2>
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <p className="text-xs">Loading live locality developments from database...</p>
          </div>
        ) : areaProperties.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-xs">No active database developments in this micro-market currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areaProperties.map((prop) => (
              <Link key={prop.id} href={`/properties/${prop.id}`} className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-5 group hover:border-brand-500/50 transition-all">
                <div className="relative h-40 w-full sm:w-48 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <Image src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="space-y-2 flex flex-col justify-between w-full">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 uppercase tracking-wide inline-block mb-1">⚡ LIVE DB</span>
                    <span className="text-[10px] font-bold text-brand-400 uppercase block">{prop.bhk} BHK • {prop.propertyType}</span>
                    <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-brand-300 transition-colors line-clamp-1">{prop.title}</h3>
                    <p className="font-display text-lg font-bold brand-gradient-text mt-1">{prop.priceDisplay}</p>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center space-x-1">
                    <span>View Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 space-y-6">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h2 className="font-display text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {locality.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900">{faq.question}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
