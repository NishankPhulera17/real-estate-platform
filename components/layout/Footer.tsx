import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        <div className="space-y-4">
          <h3 className="font-display text-2xl font-bold text-slate-900">
            Find Home.<br/>Find North.
          </h3>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
            Mountain Living Platform
          </p>
        </div>

        <div className="flex flex-col space-y-3 items-center md:items-start text-sm font-semibold text-slate-700">
          <Link href="/properties" className="hover:text-brand-600 transition-colors">Homes & Land</Link>
          <Link href="/destinations" className="hover:text-brand-600 transition-colors">Migration</Link>
          <Link href="/intelligence" className="hover:text-brand-600 transition-colors">Investment</Link>
          <Link href="/dashboard/builder" className="hover:text-brand-600 transition-colors">Builders</Link>
          <Link href="/blog" className="hover:text-brand-600 transition-colors">Journal</Link>
        </div>

        <div className="space-y-4 flex flex-col items-center md:items-end text-sm text-slate-500">
          <p>© {new Date().getFullYear()} NorthNest.</p>
          <p>All rights reserved.</p>
        </div>
        
      </div>
    </footer>
  );
}
