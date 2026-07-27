'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Calendar, Download, User, ArrowRight, CheckCircle2, PhoneCall, Loader2 } from 'lucide-react';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';
import { Property } from '@/lib/types';

export default function BuyerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'saved' | 'visits' | 'downloads'>('saved');
  const [savedProps, setSavedProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await searchPropertiesAction({ limit: 4 });
        if (res && !('error' in res) && res.data) {
          setSavedProps(res.data.map(item => formatDbProperty(item)));
        }
      } catch (err) {
        console.error("Error loading user favorites:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
          Buyer Account Console
        </span>
        <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">My Property Hub & Appointments</h1>
        <p className="text-xs text-slate-600 mt-1">Manage saved luxury listings, upcoming VIP site visits, and price sheets</p>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'saved' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favorites ({savedProps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'visits' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Scheduled Site Visits (1)</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'downloads' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Brochures & Floor Plans</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'saved' && (
        <div>
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm">Loading saved database properties...</p>
            </div>
          ) : savedProps.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-300">
              <Heart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No favorite properties in database yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedProps.map((prop) => (
                <div key={prop.id} className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-5 hover:border-brand-500/50 transition">
                  <div className="relative h-40 w-full sm:w-44 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <Image src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'} alt={prop.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-2 flex flex-col justify-between w-full">
                    <div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 uppercase tracking-wide inline-block mb-1">⚡ LIVE DB LISTING</span>
                      <h3 className="font-display text-base font-bold text-slate-900 line-clamp-1">{prop.title}</h3>
                      <p className="font-display text-lg font-bold brand-gradient-text mt-1">{prop.priceDisplay}</p>
                      <p className="text-xs text-slate-600">{prop.location?.locality}, {prop.location?.city}</p>
                    </div>
                    <Link
                      href={`/properties/${prop.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold text-center block transition shadow-md"
                    >
                      View Full Listing
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'visits' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                CONFIRMED VIP VISIT
              </span>
              <h4 className="font-display text-base font-bold text-slate-900">DLF The Camellias Penthouse</h4>
              <p className="text-xs text-slate-600">Scheduled for Saturday, 11:00 AM • Chauffeur Pickup Arranged</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              Contact Escort Advisor
            </button>
          </div>
        </div>
      )}

      {activeTab === 'downloads' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900">Godrej Tropical Isle Brochure PDF</h4>
              <p className="text-slate-600">Downloaded on 21 July 2026</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-amber-400 font-semibold flex items-center space-x-1">
              <Download className="w-3.5 h-3.5" />
              <span>Redownload</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
