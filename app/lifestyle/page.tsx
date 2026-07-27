import React from 'react';
import Link from 'next/link';
import { Mountain, Trees, Waves, Sun, Coffee, Leaf, Home, ShieldCheck } from 'lucide-react';

const LIFESTYLES = [
  { id: 'mountain', name: 'Mountain Living', icon: Mountain, desc: 'High altitude, fresh air, and panoramic peaks.' },
  { id: 'forest', name: 'Forest Retreats', icon: Trees, desc: 'Dense woods, wildlife, and absolute privacy.' },
  { id: 'coastal', name: 'Coastal Living', icon: Waves, desc: 'Ocean breezes, beaches, and slow tropical life.' },
  { id: 'eco', name: 'Eco Communities', icon: Leaf, desc: 'Sustainable living, permaculture, and off-grid.' },
  { id: 'remote', name: 'Remote Work Hubs', icon: Coffee, desc: 'High-speed internet combined with nature.' },
  { id: 'retirement', name: 'Retirement Havens', icon: Sun, desc: 'Peaceful, accessible, with good healthcare.' },
];

export default function LifestylePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="font-display text-4xl font-bold text-slate-900">Discover Your Ideal Lifestyle</h1>
        <p className="text-lg text-slate-600">
          Filter properties and destinations by the type of life you want to lead. 
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LIFESTYLES.map(style => (
          <Link key={style.id} href={`/properties?lifestyle=${style.id}`} className="group glass-panel p-6 rounded-2xl border border-slate-200 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-500 transition-colors">
              <style.icon className="w-6 h-6 text-brand-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{style.name}</h3>
            <p className="text-sm text-slate-600">{style.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
