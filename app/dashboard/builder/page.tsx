'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Eye, Download, Users, TrendingUp, Sparkles, Plus, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { PropertyCreationModal } from '@/components/PropertyCreationModal';
import DestinationCreationModal from '@/components/DestinationCreationModal';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';
import { getLiveTelemetryFeedAction, TelemetryFeedItem } from '@/app/actions/telemetry';
import { VisitorTimelineModal } from '@/components/VisitorTimelineModal';
import Link from 'next/link';

export default function BuilderDashboardPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showDestinationSuccessBanner, setShowDestinationSuccessBanner] = useState(false);
  const [latestTitle, setLatestTitle] = useState('');
  const [latestDestination, setLatestDestination] = useState<any>(null);
  const [targetLocality, setTargetLocality] = useState('');

  const [telemetryFeed, setTelemetryFeed] = useState<TelemetryFeedItem[]>([]);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(true);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);

  useEffect(() => {
    // Check if redirected from a specific destination page with query parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const destParam = params.get('destination');
      if (destParam) {
        setTargetLocality(destParam);
        setIsModalOpen(true);
      }
    }

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

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const res = await getLiveTelemetryFeedAction({ limit: 15 });
        if (res.success && res.data) {
          setTelemetryFeed(res.data);
        }
      } catch (err) {
        console.error('Failed to load telemetry:', err);
      } finally {
        setIsTelemetryLoading(false);
      }
    }

    loadTelemetry();
    const interval = setInterval(loadTelemetry, 10000); // 10 seconds polling

    return () => clearInterval(interval);
  }, []);

  const handlePropertyCreated = (newProp: any) => {
    setProperties(prev => [newProp, ...prev]);
    setLatestTitle(newProp.title);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 6000);
  };

  const handleDestinationCreated = (newDest: any) => {
    setLatestDestination(newDest);
    setShowDestinationSuccessBanner(true);
    setTimeout(() => setShowDestinationSuccessBanner(false), 10000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-8">

      {/* SUCCESS NOTIFICATION FOR PROPERTY */}
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

      {/* SUCCESS NOTIFICATION FOR DESTINATION */}
      {showDestinationSuccessBanner && latestDestination && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
            <span className="text-sm font-semibold">
              🏔️ New Destination Hub <strong className="text-white">{latestDestination.name}</strong> has been published to PostgreSQL!
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/destinations/${latestDestination.slug}`}
              target="_blank"
              className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase hover:bg-emerald-400 transition-all shadow"
            >
              View Live Destination
            </Link>
            <button onClick={() => setShowDestinationSuccessBanner(false)} className="text-emerald-400 hover:text-white font-extrabold text-sm">✕</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            Developer Console • NorthNest
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">Builder Inventory & Lead Analytics</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsDestinationModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs tracking-wider uppercase hover:bg-slate-800 hover:border-emerald-400 shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95"
          >
            <MapPin className="w-4 h-4 stroke-[2.5]" />
            <span>Add Destination Hub</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-extrabold text-xs tracking-wider uppercase hover:from-amber-400 hover:to-amber-500 shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Launch New Project</span>
          </button>
        </div>
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

      {/* LIVE BUYER TELEMETRY FEED */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            High-Intent Buyer Telemetry Feed
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </h2>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center space-x-1">
            <span>🔥 AI Intent Scored Leads</span>
          </span>
        </div>

        {isTelemetryLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Connecting to live visitor feed...</p>
          </div>
        ) : telemetryFeed.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-300">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No active visitors right now.</p>
            <p className="text-xs text-slate-500 mt-1">Wait for traffic or drive campaigns to see live activity.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {telemetryFeed.map((lead) => (
              <div key={lead.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-indigo-400 transition-all">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-extrabold">{lead.status}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Viewing: <span className="font-semibold text-slate-800">{lead.propertyTitle}</span> • Contact: {lead.phone}</p>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="text-right">
                    <span className="block text-indigo-600 font-extrabold text-sm">Score: {lead.score}/100</span>
                    <span className="text-[10px] text-slate-500">{lead.views} listing views ({lead.timeSpent})</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVisitorId(lead.id);
                      setIsTimelineModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-sm"
                  >
                    View Timeline
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
        defaultLocality={targetLocality}
        modalTitle={targetLocality ? `Launch Project in ${targetLocality}` : "Launch Himalayan Project / Development"}
      />

      {/* DESTINATION CREATION MODAL */}
      <DestinationCreationModal
        isOpen={isDestinationModalOpen}
        onClose={() => setIsDestinationModalOpen(false)}
        onSuccess={handleDestinationCreated}
      />

      {/* VISITOR TIMELINE MODAL */}
      <VisitorTimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => {
          setIsTimelineModalOpen(false);
          setSelectedVisitorId(null);
        }}
        targetId={selectedVisitorId}
      />
    </div>
  );
}
