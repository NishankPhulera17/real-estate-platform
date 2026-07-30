import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, ArrowLeft, Building2, Wifi, Droplets, Wind, Thermometer, ShieldCheck, ExternalLink } from 'lucide-react';
import { getDestinationBySlugAction } from '@/app/actions/destination';
import PropertyCard from '@/components/PropertyCard';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await getDestinationBySlugAction(slug);

  if (!res || 'error' in res || !res.data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Destination Not Available</h2>
        <p className="text-sm text-slate-600 max-w-md">
          The destination &quot;{slug}&quot; has been cleared or deleted from the live portal database.
        </p>
        <Link 
          href="/destinations" 
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide uppercase transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Destinations</span>
        </Link>
      </div>
    );
  }

  const destination: any = res.data;
  const properties: any[] = destination.properties || [];

  return (
    <div className="pb-24">
      {/* HERO SECTION */}
      <div className="relative h-[55vh] w-full min-h-[400px] overflow-hidden bg-slate-950">
        <Image 
          src={destination.heroImage || (destination as any).image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80'} 
          alt={destination.name} 
          fill 
          priority 
          className="object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full space-y-4">
            <Link href="/destinations" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition space-x-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 w-fit">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Destinations Ecosystem</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-slate-300 text-sm font-semibold">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{destination.state || 'India'}</span>
                </div>
                <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight">{destination.name}</h1>
              </div>
              <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/40 px-5 py-3 rounded-2xl text-amber-200">
                <span className="text-[11px] uppercase tracking-wider font-extrabold block">Live Development Count</span>
                <span className="text-2xl font-black text-white">{properties.length} Active Listings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* LIFESTYLE METRICS BAR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Air Quality</span>
              <span className="font-display text-sm sm:text-base font-extrabold text-slate-900">{destination.airQuality || 'AQI < 35 (Excellent)'}</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center flex-shrink-0">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Climate & Temp</span>
              <span className="font-display text-sm sm:text-base font-extrabold text-slate-900">{destination.climate || 'Sub-tropical / Alpine'}</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Broadband Backbone</span>
              <span className="font-display text-sm sm:text-base font-extrabold text-slate-900">{destination.internetAvailability || 'High-Speed Fiber (300 Mbps)'}</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Water Supply</span>
              <span className="font-display text-sm sm:text-base font-extrabold text-slate-900">{destination.waterQuality || 'Natural Spring Springs'}</span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION NARRATIVE */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 space-y-4">
          <h2 className="font-display text-2xl font-bold text-slate-900">About {destination.name}</h2>
          <p className="text-slate-700 leading-relaxed text-base">
            {destination.description || `Experience the tranquil serenity and modern remote work potential of ${destination.name}. Featuring untouched natural habitats, pure air quality, and curated architectural developments designed by leading real estate pioneers.`}
          </p>
        </div>

        {/* ASSOCIATED PROPERTY LISTINGS MARKETPLACE */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-extrabold text-brand-500 uppercase tracking-wide block">Real Estate Development Hubs</span>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-1">Available Properties in {destination.name} ({properties.length})</h2>
            </div>
            <Link href="/properties" className="text-xs font-bold text-slate-700 hover:text-brand-600 flex items-center space-x-1 transition">
              <span>View Nationwide Inventory</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-dashed border-slate-300 text-center max-w-xl mx-auto space-y-3">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-display text-lg font-bold text-slate-900">No Listings Available</h3>
              <p className="text-sm text-slate-600">
                There are currently no active property developments listed in {destination.name}. All previous demo listings have been cleared.
              </p>
              <Link href={`/dashboard/builder?destination=${encodeURIComponent(destination.name)}`} className="inline-block mt-2 px-5 py-2 rounded-xl bg-amber-500 text-gray-950 font-bold text-xs uppercase transition shadow">
                Launch Project in {destination.name}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop: any) => {
                const formattedProp = {
                  id: prop.id || prop.slug,
                  title: prop.title,
                  price: prop.priceDisplay || `₹${((prop.priceVal || prop.price || 35000000) / 10000000).toFixed(2)} Cr`,
                  location: prop.location?.address || prop.location?.locality || destination.name,
                  beds: prop.bedrooms || prop.beds || prop.bhk || 3,
                  baths: prop.bathrooms || prop.baths || 3,
                  sqft: prop.areaSqFt || prop.sqft || 2400,
                  imageUrl: (prop.images && prop.images[0] && (typeof prop.images[0] === 'string' ? prop.images[0] : prop.images[0].url)) || prop.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                  type: prop.propertyType || prop.type || 'Villa'
                };
                return <PropertyCard key={formattedProp.id} property={formattedProp} />;
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
