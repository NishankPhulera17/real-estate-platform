'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Eye, Download, Users, TrendingUp, Sparkles, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { PropertyCreationModal } from '@/components/PropertyCreationModal';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';

export default function BuilderDashboardPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [latestTitle, setLatestTitle] = useState('');

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await searchPropertiesAction({ limit: 50 });
        if (res && !('error' in res) && res.data) {
          setProperties(res.data.map((item: any) => formatDbProperty(item)));
        }
      } catch (err) {
        console.error('Failed to load builder inventory:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const handlePropertyCreated = (newProp: any) => {
    setProperties(prev => [newProp, ...prev]);
    setLatestTitle(newProp.title);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-8">
      
      {/* SUCCESS NOTIFICATION */}
      {showSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-sm font-semibold">
              🎉 Successfully launched <strong className="text-white">{latestTitle}</strong>! It is now published directly to PostgreSQL and live on the Marketplace site.
            </span>
          </div>
          <button onClick={() => setShowSuccessBanner(false)} className="text-emerald-400 hover:text-white font-extrabold text-sm">✕</button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            Developer Console • DLF Limited & NorthNest
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">Builder Inventory & Lead Analytics</h1>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-extrabold text-xs tracking-wider uppercase hover:from-amber-400 hover:to-amber-500 shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Launch New Project</span>
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-600 font-semibold uppercase block">Listing Views</span>
          <span className="font-display text-2xl font-bold text-slate-900 mt-0.5 block">24,500</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">↑ 18% vs last month</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-600 font-semibold uppercase block">Brochure Downloads</span>
          <span className="font-display text-2xl font-bold text-amber-400 mt-0.5 block">1,280</span>
          <span className="text-[10px] text-amber-400 mt-1 block">High Intent Prospecting</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-600 font-semibold uppercase block">Total Buyer Leads</span>
          <span className="font-display text-2xl font-bold text-emerald-400 mt-0.5 block">342</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Site visits conversion: 14%</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-600 font-semibold uppercase block">Campaign ROI</span>
          <span className="font-display text-2xl font-bold text-brand-400 mt-0.5 block">4.2x</span>
          <span className="text-[10px] text-brand-400 mt-1 block">Featured Listing Tier</span>
        </div>
      </div>

      {/* ACTIVE PROJECTS LIST */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Managed Developments ({properties.length})</h2>
          <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">⚡ Live PostgreSQL Feed</span>
        </div>
        
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium">Fetching live inventory from database...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-300">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No properties in database yet.</p>
            <p className="text-xs text-slate-500 mt-1">Click &quot;Launch New Project&quot; above to add your first real development!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((prop: any) => (
              <div key={prop.id} className="p-4 rounded-2xl bg-white border border-amber-400 shadow-sm bg-amber-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">{prop.possessionStatus}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-gray-950 font-extrabold text-[9px] uppercase tracking-wider shadow-sm flex items-center space-x-1">
                      <span>⚡ LIVE IN POSTGRESQL</span>
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-slate-900 mt-1">{prop.title}</h4>
                  <p className="text-xs text-slate-600">{prop.priceDisplay || `₹${((prop.priceVal || prop.price || 35000000) / 10000000).toFixed(2)} Cr`} • {prop.areaSqFt} sq.ft</p>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    Active Listing
                  </span>
                  <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-gray-950 font-extrabold hover:bg-amber-400 transition shadow-sm">
                    Manage Units
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROPERTY CREATION MODAL */}
      <PropertyCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePropertyCreated}
        defaultPropertyType="Mountain Home"
        modalTitle="Launch Himalayan Project / Development"
      />

    </div>
  );
}
