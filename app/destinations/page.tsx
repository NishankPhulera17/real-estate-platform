import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

const DESTINATIONS = [
  { slug: 'mukteshwar', name: 'Mukteshwar', state: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', description: 'Serene Himalayan views, apple orchards, and a perfect climate for remote work.' },
  { slug: 'coorg', name: 'Coorg', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80', description: 'Coffee plantations, misty mornings, and lush green valleys.' },
  { slug: 'south-goa', name: 'South Goa Countryside', state: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', description: 'Quiet village life, sustainable communities, and pristine nature away from the crowds.' },
];

export default function DestinationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Discover Places</span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900">
          Find Your Ideal <span className="brand-gradient-text">Destination</span>
        </h1>
        <p className="text-lg text-slate-600">
          Compare towns, valleys, and regions based on climate, air quality, lifestyle, and internet reliability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DESTINATIONS.map((dest) => (
          <Link key={dest.slug} href={`/destinations/${dest.slug}`} className="group glass-panel rounded-2xl overflow-hidden border border-slate-200 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="relative h-60 w-full overflow-hidden">
              <Image src={dest.image} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center space-x-1.5 text-xs text-brand-500 font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{dest.state}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">{dest.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{dest.description}</p>
              <div className="pt-4 flex items-center space-x-1 text-xs font-bold text-slate-900 group-hover:text-brand-500 transition-colors">
                <span>Explore Destination</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
