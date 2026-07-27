import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const GUIDES = [
  { slug: 'moving-to-mountains', title: 'Moving from the City to the Mountains: A Reality Check', category: 'Migration' },
  { slug: 'buying-land-legally', title: 'The Complete Legal Guide to Buying Agricultural Land', category: 'Legal' },
  { slug: 'building-eco-homes', title: 'Building Eco Homes: Solar, Water, and Materials', category: 'Sustainable Living' },
  { slug: 'remote-work-setup', title: 'Setting Up a Reliable Remote Work Office in Rural Areas', category: 'Lifestyle' },
];

export default function GuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-bold text-slate-900">Migration & Lifestyle Guides</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Everything you need to know about escaping the city, buying land safely, and building a sustainable life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map(guide => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="glass-panel p-6 rounded-2xl border border-slate-200 flex items-start space-x-4 hover:border-brand-300 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-slate-500 group-hover:text-brand-500 transition-colors" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500 mb-1 block">{guide.category}</span>
              <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{guide.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
