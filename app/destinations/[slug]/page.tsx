import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Wind, Droplets, Wifi, Sun, Stethoscope, GraduationCap, ArrowRight } from 'lucide-react';

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  
  // Placeholder data mapping
  const destName = resolvedParams.slug === 'mukteshwar' ? 'Mukteshwar' : 
                   resolvedParams.slug === 'coorg' ? 'Coorg' : 'South Goa Countryside';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Section */}
      <div className="relative h-[500px] w-full rounded-3xl overflow-hidden glass-panel border border-slate-200">
        <Image 
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80" 
          alt={destName} 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-300 mb-2">Destination Overview</span>
          <h1 className="font-display text-5xl font-bold text-white mb-4">{destName}</h1>
          <p className="text-lg text-slate-200 max-w-2xl">
            A serene retreat offering pristine air, a tight-knit community, and a sustainable lifestyle away from the urban chaos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-slate-900">Lifestyle Snapshot</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center space-y-2">
                <Wind className="w-6 h-6 text-emerald-500" />
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Air Quality</span>
                <span className="font-bold text-slate-900">Excellent (AQI 30)</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center space-y-2">
                <Sun className="w-6 h-6 text-amber-500" />
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Climate</span>
                <span className="font-bold text-slate-900">Sub-tropical</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center space-y-2">
                <Wifi className="w-6 h-6 text-blue-500" />
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Internet</span>
                <span className="font-bold text-slate-900">High-Speed Fiber</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center space-y-2">
                <Droplets className="w-6 h-6 text-cyan-500" />
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Water Quality</span>
                <span className="font-bold text-slate-900">Natural Springs</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-slate-900">Infrastructure & Amenities</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-4">
                <Stethoscope className="w-6 h-6 text-rose-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900">Healthcare</h4>
                  <p className="text-sm text-slate-600 mt-1">Primary health center within 5km. Multi-specialty hospital located 45 mins away in the nearest major city.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-4">
                <GraduationCap className="w-6 h-6 text-indigo-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900">Education</h4>
                  <p className="text-sm text-slate-600 mt-1">Excellent alternative and international boarding schools in the vicinity. Great for families seeking holistic education.</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="font-display text-xl font-bold text-slate-900">Migration Consultation</h3>
            <p className="text-sm text-slate-600">
              Considering a move to {destName}? Speak with our local migration experts to understand legalities, land buying rules, and lifestyle realities.
            </p>
            <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all">
              Talk to Migration Advisor
            </button>
            <Link href="/guides" className="block text-center text-xs font-semibold text-brand-600 hover:text-brand-700">
              Read Migration Guides &rarr;
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">Local Community</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                <span>Weekly Organic Farmers Market</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                <span>Co-working Spaces Available</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                <span>Active Expat & Migrant Groups</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
