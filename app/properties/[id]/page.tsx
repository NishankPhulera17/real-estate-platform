'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  Compass, 
  Car, 
  Maximize2, 
  Download, 
  PhoneCall, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  UserCheck,
  Send,
  ExternalLink,
  Loader2,
  Video as VideoIcon,
  Film
} from 'lucide-react';
import { formatPriceINR, formatNumberIN } from '@/lib/utils';
import { getPropertyByIdAction } from '@/app/actions/property';
import { captureLeadAction } from '@/app/actions/lead';
import { formatDbProperty } from '@/lib/utils/formatProperty';
import { Property } from '@/lib/types';

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [showVideoMode, setShowVideoMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'lifestyle' | 'floorplans' | 'trends' | 'amenities' | 'video'>('overview');

  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URLSearchParams(new URL(url).search).get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
      }
    } catch (e) {
      return url;
    }
    return url;
  };

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await getPropertyByIdAction(resolvedParams.id);
        if (res && 'success' in res && res.data) {
          const formatted = formatDbProperty(res.data);
          setProperty(formatted);
          if (formatted.images?.length > 0) {
            setActiveImage(formatted.images[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch property details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [resolvedParams.id]);
  
  // Lead form modal / drawer state
  const [leadType, setLeadType] = useState<'Site Visit' | 'Brochure' | 'Callback' | 'Loan'>('Site Visit');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);
    try {
      // 1. Send immediate telemetry tracking event
      const eventType = leadType === 'Brochure' ? 'BROCHURE_DOWNLOAD' : leadType === 'Site Visit' ? 'SITE_VISIT_REQUEST' : 'CTA_CLICK';
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          path: window.location.pathname,
          propertyId: property?.id,
          metadata: { leadType, name: leadName, phone: leadPhone, email: leadEmail }
        })
      }).catch(() => {});

      // 2. Persist high-intent lead in PostgreSQL with visitor stitching & intent boost
      if (property?.id) {
        await captureLeadAction({
          name: leadName,
          phone: leadPhone,
          email: leadEmail || undefined,
          propertyId: property.id,
          type: leadType,
          source: `Web Property Detail - ${leadType}`,
          notes: `High-intent buyer requested ${leadType} for listing: ${property.title}.`
        });
      }

      setLeadFormSubmitted(true);
      setTimeout(() => {
        setLeadFormSubmitted(false);
        setShowLeadModal(false);
        setLeadName('');
        setLeadPhone('');
        setLeadEmail('');
      }, 2800);
    } catch (err) {
      console.error('Failed to submit lead:', err);
    } finally {
      setSubmittingLead(false);
    }
  };

  const openLeadModal = (type: 'Site Visit' | 'Brochure' | 'Callback' | 'Loan') => {
    setLeadType(type);
    setShowLeadModal(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-36 pb-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-base font-semibold text-slate-700">Loading property details from database...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-36 pb-20 text-center text-slate-500 space-y-4">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-sm">We couldn&apos;t locate a database listing matching ID or slug: <span className="font-mono text-slate-700">{resolvedParams.id}</span>.</p>
        <Link href="/properties" className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 font-extrabold text-xs uppercase tracking-wider">
          Browse Marketplace Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 space-y-10">
      
      {/* PROPERTY BREADCRUMB & TITLE */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-slate-900">Properties</Link>
          <span>/</span>
          <span className="text-slate-800">{property.location.city}</span>
          <span>/</span>
          <span className="text-brand-400 font-semibold">{property.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
                {property.possessionStatus}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                RERA: {property.reraId}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {property.title}
            </h1>
            <p className="text-xs text-slate-700 flex items-center space-x-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>{property.location.address}, {property.location.locality}, {property.location.city}</span>
            </p>
          </div>

          <div className="text-left lg:text-right">
            <span className="text-xs text-slate-600 block">Listing Price</span>
            <span className="font-display text-3xl font-extrabold brand-gradient-text">{property.priceDisplay}</span>
            <span className="text-xs text-slate-600 block mt-0.5">₹{formatNumberIN(property.pricePerSqFt)} / sq.ft</span>
          </div>
        </div>
      </div>

      {/* MEDIA GALLERY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Display Image / Video Player */}
        <div className="lg:col-span-2 relative h-[420px] rounded-3xl overflow-hidden glass-panel border border-slate-200 bg-slate-950 flex items-center justify-center">
          {showVideoMode ? (
            <>
              {property.videoUrl?.toLowerCase().endsWith('.mp4') ? (
                <video src={property.videoUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={getEmbedVideoUrl(property.videoUrl)}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Property Video Walkthrough"
                />
              )}
              <button
                onClick={() => setShowVideoMode(false)}
                className="absolute top-4 right-4 bg-slate-900/90 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-extrabold border border-slate-700 shadow-lg backdrop-blur-md flex items-center space-x-2 z-20 transition"
              >
                <span>✕ Close Video Walkthrough</span>
              </button>
            </>
          ) : (
            <>
              <Image src={activeImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'} alt={property.title} fill className="object-cover" />
              <div className="absolute top-4 left-4 bg-slate-50/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-amber-400 flex items-center space-x-1 border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Investment Score: {property.investmentScore}/100</span>
              </div>

              {property.videoUrl && (
                <button
                  onClick={() => setShowVideoMode(true)}
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-2xl flex items-center space-x-2 transition-all transform hover:scale-105"
                >
                  <VideoIcon className="w-4 h-4 text-gray-950 fill-gray-950 animate-pulse" />
                  <span>▶ Watch 4K Video Tour</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Thumbnail Selector Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 overflow-y-auto max-h-[420px]">
          {property.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveImage(img); setShowVideoMode(false); }}
              className={`relative h-32 rounded-2xl overflow-hidden border-2 transition-all ${
                !showVideoMode && activeImage === img ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'} alt={`Gallery ${idx}`} fill className="object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400">Cover</span>
              )}
            </button>
          ))}
          {property.videoUrl && (
            <button
              onClick={() => setShowVideoMode(true)}
              className={`relative h-32 rounded-2xl overflow-hidden border-2 bg-slate-900 flex flex-col items-center justify-center text-white transition-all ${
                showVideoMode ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              <VideoIcon className="w-8 h-8 text-amber-400 mb-1 animate-pulse" />
              <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wide">Video Tour</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN TWO-COLUMN BODY LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Overview, Floor Plans, Price Trends */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Specifications Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase text-slate-600 block font-semibold">Configuration</span>
              <span className="font-display text-lg font-bold text-slate-900 mt-1 block">{property.bhk} BHK</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase text-slate-600 block font-semibold">Carpet Area</span>
              <span className="font-display text-lg font-bold text-slate-900 mt-1 block">{property.areaSqFt} sq.ft</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase text-slate-600 block font-semibold">Rental Yield</span>
              <span className="font-display text-lg font-bold text-emerald-400 mt-1 block">{property.rentalYieldPercent}% YoY</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase text-slate-600 block font-semibold">Facing</span>
              <span className="font-display text-lg font-bold text-amber-400 mt-1 block">{property.facing}</span>
            </div>
          </div>

          {/* Detailed Content Tabs */}
          <div className="glass-panel rounded-3xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200 bg-slate-50/60 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview & Description
              </button>
              <button
                onClick={() => setActiveTab('lifestyle')}
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'lifestyle' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Lifestyle Snapshot
              </button>
              <button
                onClick={() => setActiveTab('floorplans')}
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'floorplans' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Floor Plans ({property.floorPlans.length})
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'trends' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Price Trends & ROI
              </button>
              <button
                onClick={() => setActiveTab('amenities')}
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'amenities' ? 'border-brand-500 text-brand-400 bg-brand-500/5' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Amenities ({property.amenities.length})
              </button>
              <button
                onClick={() => { setActiveTab('video'); setShowVideoMode(true); }}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === 'video' ? 'border-amber-500 text-amber-400 bg-amber-500/5 font-extrabold' : 'border-transparent text-amber-400 hover:text-amber-300'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>🎬 Video Tour & Media</span>
              </button>
            </div>

            <div className="p-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Project Overview</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{property.description}</p>
                  </div>

                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-brand-400">Key Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {property.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Builder Profile Link */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-slate-100">
                        <Image src={property.builder.logo} alt={property.builder.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{property.builder.name}</h4>
                        <p className="text-[11px] text-slate-600">Official Partner Developer</p>
                      </div>
                    </div>
                    <Link
                      href={`/builders/${property.builder.id}`}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    >
                      View Builder Portfolio
                    </Link>
                  </div>

                </div>
              )}

              {/* TAB 1.5: LIFESTYLE */}
              {activeTab === 'lifestyle' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Lifestyle Snapshot</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Discover the environmental and community aspects of living in this location. 
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Air Quality</span>
                      <span className="font-display text-sm font-bold text-slate-900">Good (AQI 45)</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Water</span>
                      <span className="font-display text-sm font-bold text-slate-900">Reliable Spring</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Internet</span>
                      <span className="font-display text-sm font-bold text-slate-900">Fiber (200 Mbps)</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Climate</span>
                      <span className="font-display text-sm font-bold text-slate-900">Pleasant</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Walkability</span>
                      <span className="font-display text-sm font-bold text-slate-900">High</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Noise Level</span>
                      <span className="font-display text-sm font-bold text-emerald-500">Very Low</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Sustainability</span>
                      <span className="font-display text-sm font-bold text-slate-900">Solar Ready</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Remote Work</span>
                      <span className="font-display text-sm font-bold text-brand-500">9.5/10</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block">Community</span>
                      <span className="font-display text-sm font-bold text-slate-900">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FLOOR PLANS */}
              {activeTab === 'floorplans' && (
                <div className="space-y-6">
                  {property.floorPlans.map((fp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div className="relative h-40 rounded-xl overflow-hidden bg-slate-50">
                        <Image src={fp.image} alt={fp.name} fill className="object-cover" />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[10px] font-bold">{fp.bhk} Layout</span>
                        <h4 className="font-display text-base font-bold text-slate-900">{fp.name}</h4>
                        <p className="text-xs text-slate-600">{fp.sizeSqFt} sq.ft carpet area • {fp.price}</p>
                        <button
                          onClick={() => openLeadModal('Brochure')}
                          className="mt-2 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold flex items-center space-x-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Request Floor Plan PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: PRICE TRENDS */}
              {activeTab === 'trends' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-slate-900">Historical Sq.Ft Rate Appreciation</h3>
                    <span className="text-xs font-bold text-emerald-400">CAGR +14.2% YoY</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {property.priceTrends.map((trend, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
                        <span className="text-xs text-slate-600 block">{trend.year} Rate</span>
                        <span className="font-display text-lg font-bold text-brand-400 mt-1 block">
                          ₹{formatNumberIN(trend.avgPricePerSqFt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: AMENITIES */}
              {activeTab === 'amenities' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-2.5 text-xs text-slate-800">
                      <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: VIDEO TOUR & MEDIA */}
              {activeTab === 'video' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl text-white border border-slate-700">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400 block">Virtual Walkthrough & Aerial Showcase</span>
                      <h3 className="font-display text-xl font-bold mt-1">High-Definition Video Presentation</h3>
                      <p className="text-xs text-slate-400 mt-1">Experience scenic Himalayan vistas and luxury structural design directly from your browser.</p>
                    </div>
                    <button
                      onClick={() => { setShowVideoMode(true); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
                      className="px-5 py-3 rounded-xl bg-amber-500 text-gray-950 font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-lg shrink-0"
                    >
                      ▶ Expand Top Player
                    </button>
                  </div>

                  <div className="h-[400px] w-full rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-xl relative">
                    {property.videoUrl?.toLowerCase().endsWith('.mp4') ? (
                      <video src={property.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                    ) : (
                      <iframe
                        src={getEmbedVideoUrl(property.videoUrl)}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Tab Property Video Walkthrough"
                      />
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Lead Action Card & Advisor Desk */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-300/80 shadow-2xl space-y-6">
            
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">Migration & Property Desk</span>
              <h3 className="font-display text-xl font-bold text-slate-900 mt-1">Plan Your Move</h3>
              <p className="text-xs text-slate-600 mt-1">Free exploration visit logistics & full migration consultation.</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => openLeadModal('Site Visit')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-slate-900 font-bold text-xs shadow-lg shadow-brand-500/25 hover:brightness-110 flex items-center justify-center space-x-2 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Exploration Visit</span>
              </button>

              <button
                onClick={() => openLeadModal('Brochure')}
                className="w-full py-3 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Price & Brochure PDF</span>
              </button>

              <button
                onClick={() => openLeadModal('Loan')}
                className="w-full py-3 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Calculate Home Loan EMI</span>
              </button>
            </div>

            {/* Direct WhatsApp / Call row */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-semibold">
              <a
                href="https://wa.me/911244567890"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-center flex items-center justify-center space-x-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => openLeadModal('Callback')}
                className="py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-center flex items-center justify-center space-x-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Migration Advisor</span>
              </button>
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-500 border-t border-slate-200">
              ⚡ Instant Lead sync to North Nest CRM Desk. Zero broker spam guarantee.
            </div>

          </div>

        </div>

      </div>

      {/* LEAD MODAL POPUP */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-white border border-slate-300 w-full max-w-md p-6 rounded-3xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {leadType === 'Site Visit' ? 'Book Exploration Visit' : leadType === 'Brochure' ? 'Download Brochure' : 'Request Advisory Call'}
                </h3>
              </div>
              <button onClick={() => setShowLeadModal(false)} className="text-slate-600 hover:text-slate-900">✕</button>
            </div>

            {leadFormSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display text-xl font-bold text-slate-900">Lead Generated Successfully</h4>
                <p className="text-xs text-slate-700">Your inquiry for <strong className="text-slate-900">{property.title}</strong> has been logged in the CRM.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-slate-900 font-semibold text-xs shadow-lg shadow-brand-500/20 hover:brightness-110 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
                  >
                    {submittingLead ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Logging Telemetry & Saving...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm & Submit Lead</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
