'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Star, 
  Building2, 
  MapPin, 
  Check, 
  Scale, 
  Heart, 
  Sparkles,
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { formatPriceINR } from '@/lib/utils';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';

export default function MarketplacePage() {
  const [liveProperties, setLiveProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveProperties() {
      try {
        const res = await searchPropertiesAction({ limit: 50 });
        if (res && !('error' in res) && res.data) {
          const dbProps = res.data.map((dbProp: any) => formatDbProperty(dbProp));
          setLiveProperties(dbProps);
        }
      } catch (err) {
        console.error('Failed to load DB properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveProperties();
  }, []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [bhkFilter, setBhkFilter] = useState('All');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [possessionFilter, setPossessionFilter] = useState('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(400000000);
  const [sortBy, setSortBy] = useState<'score' | 'priceLow' | 'priceHigh' | 'sqft'>('score');
  
  // Layout mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Favorites & Compare state
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setComparedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    const allProperties = [...liveProperties];
    return allProperties.filter(prop => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesLoc = prop.location.locality.toLowerCase().includes(q);
        const matchesBuilder = prop.builder.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesBuilder) return false;
      }

      // City filter
      if (cityFilter !== 'All' && prop.location.city.toLowerCase() !== cityFilter.toLowerCase()) {
        return false;
      }

      // BHK filter
      if (bhkFilter !== 'All' && prop.bhk !== parseInt(bhkFilter)) {
        return false;
      }

      // Property type filter
      if (propertyTypeFilter !== 'All' && prop.propertyType !== propertyTypeFilter) {
        return false;
      }

      // Possession filter
      if (possessionFilter !== 'All' && prop.possessionStatus !== possessionFilter) {
        return false;
      }

      // Max price
      if (prop.priceVal > maxPriceFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'score') return b.investmentScore - a.investmentScore;
      if (sortBy === 'priceLow') return a.priceVal - b.priceVal;
      if (sortBy === 'priceHigh') return b.priceVal - a.priceVal;
      if (sortBy === 'sqft') return b.areaSqFt - a.areaSqFt;
      return 0;
    });
  }, [liveProperties, searchQuery, cityFilter, bhkFilter, propertyTypeFilter, possessionFilter, maxPriceFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">North Nest Marketplace</span>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">Property Discovery & Listings</h1>
          <p className="text-xs text-slate-600 mt-1">Showing {filteredProperties.length} verified luxury developments and residential units</p>
        </div>

        {/* View Mode & Sorting Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg flex items-center space-x-1 transition-colors ${
                viewMode === 'grid' ? 'bg-brand-500/20 text-brand-300 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg flex items-center space-x-1 transition-colors ${
                viewMode === 'list' ? 'bg-brand-500/20 text-brand-300 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="score">Sort by AI Investment Score</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="sqft">Area: Largest Sq Ft</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-3" />
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Listings Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS SIDEBAR */}
        <div className="space-y-6 glass-panel p-5 rounded-2xl border border-slate-200 h-fit">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2 font-display text-sm font-bold text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-brand-400" />
              <span>Refine Search</span>
            </div>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCityFilter('All');
                setBhkFilter('All');
                setPropertyTypeFilter('All');
                setPossessionFilter('All');
                setMaxPriceFilter(400000000);
              }}
              className="text-[11px] text-slate-600 hover:text-brand-400"
            >
              Reset All
            </button>
          </div>

          {/* Search Keywords */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project / Location Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. Golf Course, Godrej, DLF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Noida">Noida</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>

          {/* BHK Config */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">BHK Bedrooms</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['All', '3', '4', '5'].map((bhk) => (
                <button
                  key={bhk}
                  onClick={() => setBhkFilter(bhk)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    bhkFilter === bhk 
                      ? 'bg-brand-500/20 border-brand-500 text-brand-300' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {bhk === 'All' ? 'Any' : `${bhk} BHK`}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Property Type</label>
            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none"
            >
              <option value="All">All Property Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>

          {/* Possession Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Possession Status</label>
            <select
              value={possessionFilter}
              onChange={(e) => setPossessionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none"
            >
              <option value="All">Any Status</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Max Budget Cap</span>
              <span className="text-brand-400 font-bold">{formatPriceINR(maxPriceFilter)}</span>
            </div>
            <input
              type="range"
              min={20000000}
              max={350000000}
              step={10000000}
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

        </div>

        {/* LISTINGS RESULTS */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Compare Toolbar Alert */}
          {comparedIds.length > 0 && (
            <div className="glass-panel p-3 px-5 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-amber-300">
                <Scale className="w-4 h-4" />
                <span>{comparedIds.length} properties selected for side-by-side comparison</span>
              </div>
              <Link 
                href={`/compare?ids=${comparedIds.join(',')}`}
                className="px-3 py-1 rounded-lg bg-amber-500 text-gray-950 font-bold hover:bg-amber-400"
              >
                Compare Now
              </Link>
            </div>
          )}

          {loading ? (
            <div className="glass-panel p-16 text-center rounded-2xl border border-slate-200 space-y-3 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-sm font-semibold text-slate-700">Loading live property listings from database...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-200 space-y-3">
              <Search className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="font-display text-lg font-bold text-slate-900">No Matching Properties Found in Database</h3>
              <p className="text-xs text-slate-600">Try broadening your search budget or city filters, or publish a listing in the Builder console.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
              {filteredProperties.map((property) => {
                const isFav = favorites.includes(property.id);
                const isCompared = comparedIds.includes(property.id);

                return (
                  <div
                    key={property.id}
                    className={`glass-panel rounded-2xl overflow-hidden glass-panel-hover border border-slate-200 flex ${
                      viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'
                    }`}
                  >
                    {/* Image Area */}
                    <div className={`relative ${viewMode === 'list' ? 'w-full sm:w-64 h-56' : 'w-full h-56'} shrink-0`}>
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 flex space-x-1.5 z-10">
                        <button
                          onClick={() => toggleFavorite(property.id)}
                          className={`p-2 rounded-full backdrop-blur-md border ${
                            isFav 
                              ? 'bg-rose-500 text-slate-900 border-rose-400' 
                              : 'bg-white/80 text-slate-700 border-slate-300 hover:text-rose-400'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {(property as any).isLiveDb && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-extrabold text-[10px] uppercase tracking-wider shadow-lg flex items-center space-x-1 border border-white/20 animate-pulse">
                            <span>⚡ NEW LAUNCH • LIVE DB</span>
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-brand-500/90 text-gray-950 text-[10px] font-extrabold">
                          {property.possessionStatus}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-600">{property.location.locality}, {property.location.city}</span>
                          <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>AI Score: {property.investmentScore}</span>
                          </span>
                        </div>

                        <h3 className="font-display text-base font-bold text-slate-900 hover:text-brand-300 line-clamp-1">
                          <Link href={`/properties/${property.id}`}>{property.title}</Link>
                        </h3>

                        <p className="font-display text-xl font-bold brand-gradient-text">{property.priceDisplay}</p>

                        <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                          <div><span className="text-slate-500 block">Config:</span> {property.bhk} BHK</div>
                          <div><span className="text-slate-500 block">Size:</span> {property.areaSqFt} sq.ft</div>
                          <div><span className="text-slate-500 block">Yield:</span> {property.rentalYieldPercent}%</div>
                        </div>
                      </div>

                      {/* Card Action Controls */}
                      <div className="pt-3 border-t border-slate-200/80 flex items-center space-x-2 text-xs">
                        <button
                          onClick={() => toggleCompare(property.id)}
                          className={`px-3 py-2 rounded-xl border flex items-center space-x-1 text-[11px] font-semibold transition-colors ${
                            isCompared 
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                              : 'bg-white border-slate-300 text-slate-700 hover:border-gray-600'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{isCompared ? 'Added' : 'Compare'}</span>
                        </button>

                        <Link
                          href={`/properties/${property.id}`}
                          className="flex-1 text-center py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-slate-900 font-semibold text-xs shadow-md hover:brightness-110"
                        >
                          View Details
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
