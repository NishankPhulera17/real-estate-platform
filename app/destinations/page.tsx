import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { getDestinationsAction } from '@/app/actions/destination';

export const dynamic = 'force-dynamic';

export default async function DestinationsPage() {
  const res = await getDestinationsAction();
  const destinations: any[] = (res && !('error' in res) && res.data) ? res.data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Discover Places</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400 inline mr-1" />
            <span>LIVE DB DESTINATIONS</span>
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900">
          Find Your Ideal <span className="brand-gradient-text">Destination</span>
        </h1>
        <p className="text-lg text-slate-600">
          Compare towns, valleys, and regions based on climate, air quality, lifestyle, and internet reliability directly from our live backend ecosystem.
        </p>
      </div>

      {destinations.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-200 text-center max-w-2xl mx-auto space-y-4">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-display text-xl font-bold text-slate-900">No Destinations Found</h3>
          <p className="text-sm text-slate-600">
            All previous destinations and associated listings have been deleted from the live portal. New location hubs will appear here once added to the database.
          </p>
          <Link href="/dashboard/builder" className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-md">
            Go to Developer Console
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link key={dest.slug} href={`/destinations/${dest.slug}`} className="group glass-panel rounded-2xl overflow-hidden border border-slate-200 flex flex-col hover:-translate-y-1 transition-transform shadow-sm hover:shadow-lg">
              <div className="relative h-60 w-full overflow-hidden">
                <Image src={dest.image || dest.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                {dest.propertyCount > 0 && (
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-brand-300 px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/10 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-brand-400" />
                    <span>{dest.propertyCount} Properties</span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-1.5 text-brand-500">
                      <MapPin className="w-4 h-4" />
                      <span>{dest.state || 'India'}</span>
                    </div>
                    {dest.airQuality && (
                      <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {dest.airQuality.split(' ')[0]} Air
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{dest.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{dest.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-brand-500 transition-colors">
                  <span>Explore Destination & Listings</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
