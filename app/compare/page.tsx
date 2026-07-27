'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Scale, Star, Check, X, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { formatPriceINR, formatNumberIN } from '@/lib/utils';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';
import { Property } from '@/lib/types';

export default function ComparePage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await searchPropertiesAction({ limit: 20 });
        if (res && !('error' in res) && res.data) {
          const formatted = res.data.map(item => formatDbProperty(item));
          setAllProperties(formatted);
          if (formatted.length >= 2) {
            setSelectedIds([formatted[0].id, formatted[1].id]);
          } else if (formatted.length === 1) {
            setSelectedIds([formatted[0].id]);
          }
        }
      } catch (err) {
        console.error("Failed to load compare inventory:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const selectedProperties = allProperties.filter(p => selectedIds.includes(p.id));

  const removeProperty = (id: string) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const addProperty = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Side-by-Side Analysis</span>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">Property Comparison Tool</h1>
          <p className="text-xs text-slate-600 mt-1">Compare price per sq.ft, rental yields, and AI investment scores across up to 3 listings</p>
        </div>

        {/* Quick Add Selector */}
        {selectedIds.length < 3 && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-600">Add Property:</span>
            <select
              onChange={(e) => addProperty(e.target.value)}
              defaultValue=""
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="" disabled>Select to add...</option>
              {allProperties.filter(p => !selectedIds.includes(p.id)).map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.priceDisplay})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="glass-panel p-16 text-center rounded-2xl border border-slate-200 space-y-3 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm font-semibold text-slate-700">Loading comparison listings from PostgreSQL...</p>
        </div>
      ) : selectedProperties.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Scale className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-display text-lg font-bold text-slate-900">No Properties Selected</h3>
          <p className="text-xs text-slate-600">Select properties from the marketplace or dropdown above to start comparing.</p>
        </div>
      ) : (
        /* Comparison Table Grid */
        <div className="overflow-x-auto">
          <div className="min-w-[700px] glass-panel rounded-3xl border border-slate-200 divide-y divide-gray-800">
            
            {/* PROPERTY CARDS ROW */}
            <div className="grid grid-cols-4 p-6 gap-4 items-stretch bg-slate-50/60">
              <div className="flex items-center font-display text-sm font-bold text-slate-900">
                <span>Selected Listings</span>
              </div>
              
              {selectedProperties.map(prop => (
                <div key={prop.id} className="space-y-3 relative flex flex-col justify-between">
                  <button
                    onClick={() => removeProperty(prop.id)}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-100 hover:bg-rose-500 text-slate-600 hover:text-slate-900 transition-colors z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative h-32 rounded-xl overflow-hidden">
                    <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                  </div>

                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-900 line-clamp-1">{prop.title}</h4>
                    <p className="font-display text-lg font-bold brand-gradient-text mt-0.5">{prop.priceDisplay}</p>
                    <p className="text-[11px] text-slate-600">{prop.location.locality}, {prop.location.city}</p>
                  </div>

                  <Link
                    href={`/properties/${prop.id}`}
                    className="w-full py-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 text-[11px] font-semibold text-center block hover:bg-brand-500/20"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {/* COMPARISON SPEC ROWS */}
            <div className="grid grid-cols-4 p-4 px-6 text-xs gap-4 items-center">
              <span className="font-semibold text-slate-600">AI Investment Score</span>
              {selectedProperties.map(prop => (
                <div key={prop.id} className="font-bold text-amber-400 flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{prop.investmentScore} / 100</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 p-4 px-6 text-xs gap-4 items-center bg-white/40">
              <span className="font-semibold text-slate-600">Price per Sq.Ft</span>
              {selectedProperties.map(prop => (
                <span key={prop.id} className="font-bold text-slate-900">₹{formatNumberIN(prop.pricePerSqFt)}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 p-4 px-6 text-xs gap-4 items-center">
              <span className="font-semibold text-slate-600">Carpet Area</span>
              {selectedProperties.map(prop => (
                <span key={prop.id} className="text-slate-800">{prop.areaSqFt} sq.ft</span>
              ))}
            </div>

            <div className="grid grid-cols-4 p-4 px-6 text-xs gap-4 items-center bg-white/40">
              <span className="font-semibold text-slate-600">Configuration</span>
              {selectedProperties.map(prop => (
                <span key={prop.id} className="text-slate-800">{prop.bhk} BHK Suite</span>
              ))}
            </div>

            <div className="grid grid-cols-4 p-4 px-6 text-xs gap-4 items-center">
              <span className="font-semibold text-slate-600">Possession Status</span>
              {selectedProperties.map(prop => (
                <span key={prop.id} className="font-semibold text-brand-400">{prop.possessionStatus}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 p-4 px-6 text-xs gap-4 items-center bg-white/40">
              <span className="font-semibold text-slate-600">Estimated Rental Yield</span>
              {selectedProperties.map(prop => (
                <span key={prop.id} className="font-bold text-emerald-400">{prop.rentalYieldPercent}% YoY</span>
              ))}
            </div>

            <div className="grid grid-cols-4 p-4 px-6 text-xs gap-4 items-center">
              <span className="font-semibold text-slate-600">RERA Registration</span>
              {selectedProperties.map(prop => (
                <span key={prop.id} className="text-slate-600 font-mono text-[10px]">{prop.reraId}</span>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
