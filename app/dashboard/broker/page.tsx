'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, Phone, Star, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { PropertyCreationModal } from '@/components/PropertyCreationModal';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';

export default function BrokerDashboardPage() {
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
        console.error('Failed to load broker resale inventory:', err);
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
        <div className="p-4 rounded-2xl bg-blue-500/15 border border-blue-500/40 text-blue-200 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-sm font-semibold">
              🎉 Resale listing <strong className="text-white">{latestTitle}</strong> uploaded! Published to PostgreSQL and live on Marketplace.
            </span>
          </div>
          <button onClick={() => setShowSuccessBanner(false)} className="text-blue-400 hover:text-white font-extrabold text-sm">✕</button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            Broker Network Console
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">Resale Inventory & Client Desk</h1>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-blue-500 text-slate-900 font-extrabold text-xs uppercase tracking-wider hover:bg-blue-400 shadow-lg flex items-center justify-center space-x-1.5 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload Resale Listing</span>
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-600 font-semibold uppercase block">Active Resale Listings</span>
          <span className="font-display text-2xl font-bold text-slate-900 mt-0.5 block">{properties.length + 12} Verified</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-600 font-semibold uppercase block">Inquiries Received</span>
          <span className="font-display text-2xl font-bold text-blue-400 mt-0.5 block">58 Inquiries</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-600 font-semibold uppercase block">Commission Pipeline</span>
          <span className="font-display text-2xl font-bold text-emerald-400 mt-0.5 block">₹12.4 Lakh</span>
        </div>
      </div>

      {/* RESALE LISTINGS LIST */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Active Resale Properties ({properties.length})</h2>
          <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">⚡ PostgreSQL Live Sync</span>
        </div>
        
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Fetching active resale listings...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-300">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No resale listings found in database.</p>
            <p className="text-xs text-slate-500 mt-1">Click &quot;Upload Resale Listing&quot; above to add your agency properties!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((prop: any) => (
              <div key={prop.id} className="p-4 rounded-2xl bg-white border border-blue-400 shadow-sm bg-blue-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">
                      Verified Resale Listing
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-sm flex items-center space-x-1">
                      <span>🌟 LIVE IN POSTGRESQL</span>
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-slate-900 mt-1">{prop.title}</h4>
                  <p className="text-xs text-slate-600">{prop.priceDisplay || `₹${((prop.priceVal || prop.price || 35000000) / 10000000).toFixed(2)} Cr`} • {prop.location?.locality || 'Valley Region'}</p>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    Active Pipeline
                  </span>
                  <button className="px-3.5 py-1.5 rounded-xl bg-blue-500 text-slate-900 font-extrabold hover:bg-blue-400 transition shadow-sm">
                    Edit Listing
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
        defaultPropertyType="Villa"
        modalTitle="Upload Verified Resale Property"
      />

    </div>
  );
}
