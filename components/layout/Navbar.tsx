'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Heart, Building2, UserCheck, Briefcase, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomepage = pathname === '/';

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-700 ${
        isHomepage && !isScrolled 
          ? 'opacity-0 pointer-events-none -translate-y-full' 
          : 'opacity-100 translate-y-0 bg-white/90 backdrop-blur-md border-b border-slate-100'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24">
            
            {/* Brand Logo - Minimalist */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="font-display text-2xl font-semibold tracking-tighter text-slate-900 group-hover:text-slate-500 transition-colors">NORTHNEST</span>
            </Link>

            {/* Core Nav Links - Editorial */}
            <nav className="hidden lg:flex items-center space-x-12">
              <Link href="/destinations" className={`text-xs font-semibold uppercase tracking-widest transition-colors ${pathname.includes('/destinations') ? 'text-slate-900 border-b border-slate-900 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>
                Destinations
              </Link>
              <Link href="/properties" className={`text-xs font-semibold uppercase tracking-widest transition-colors ${pathname.includes('/properties') ? 'text-slate-900 border-b border-slate-900 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>
                Homes & Land
              </Link>
              <Link href="/blog" className={`text-xs font-semibold uppercase tracking-widest transition-colors ${pathname.includes('/blog') ? 'text-slate-900 border-b border-slate-900 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>
                Journal
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-6">
              <Link href="/properties" className="hidden sm:block text-slate-500 hover:text-slate-900 transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setMobileOpen(true)}
                className="flex items-center space-x-2 text-slate-900 hover:text-slate-500 transition-colors"
              >
                <span className="text-xs font-semibold uppercase tracking-widest hidden sm:block">Menu</span>
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <div className={`fixed inset-0 z-[100] bg-white transition-all duration-700 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex flex-col">
          {/* Menu Header */}
          <div className="flex items-center justify-between h-24">
            <Link href="/" onClick={() => setMobileOpen(false)} className="font-display text-2xl font-semibold tracking-tighter text-slate-900">
              NORTHNEST
            </Link>
            <button onClick={() => setMobileOpen(false)} className="flex items-center space-x-2 text-slate-900 hover:text-slate-500 transition-colors">
              <span className="text-xs font-semibold uppercase tracking-widest hidden sm:block">Close</span>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 flex flex-col md:flex-row pt-12 md:pt-24 pb-12 overflow-y-auto">
            {/* Primary Links */}
            <nav className="flex-1 space-y-6 md:space-y-8">
              {[
                { name: 'Destinations', href: '/destinations' },
                { name: 'Homes & Land', href: '/properties' },
                { name: 'Journal', href: '/blog' },
                { name: 'Communities', href: '/communities' },
                { name: 'Lifestyle & Guides', href: '/guides' },
                { name: 'Intelligence', href: '/intelligence' },
              ].map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-4xl md:text-6xl font-medium text-slate-900 hover:text-slate-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Secondary/Utility Links */}
            <div className="w-full md:w-80 mt-16 md:mt-0 space-y-12">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2">Your Account</p>
                <div className="flex flex-col space-y-4">
                  <Link href="/dashboard/user?tab=saved" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 text-sm font-medium text-slate-700 hover:text-slate-900">
                    <Heart className="w-4 h-4" /> <span>Saved Properties</span>
                  </Link>
                  <Link href="/dashboard/user" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 text-sm font-medium text-slate-700 hover:text-slate-900">
                    <UserCheck className="w-4 h-4" /> <span>Buyer Portal</span>
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2">Partners</p>
                <div className="flex flex-col space-y-4">
                  <Link href="/dashboard/builder" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 text-sm font-medium text-slate-700 hover:text-slate-900">
                    <Building2 className="w-4 h-4" /> <span>Builder Portal</span>
                  </Link>
                  <Link href="/dashboard/broker" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 text-sm font-medium text-slate-700 hover:text-slate-900">
                    <Briefcase className="w-4 h-4" /> <span>Broker Portal</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
