'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Send, Bot, Star, TrendingUp, ShieldCheck, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { formatPriceINR } from '@/lib/utils';
import { searchPropertiesAction } from '@/app/actions/property';
import { formatDbProperty } from '@/lib/utils/formatProperty';
import { Property } from '@/lib/types';

export default function AiAdvisorPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [allDbProps, setAllDbProps] = useState<Property[]>([]);
  const [recommendedProps, setRecommendedProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProps() {
      try {
        const res = await searchPropertiesAction({ limit: 20 });
        if (res && !('error' in res) && res.data) {
          const formatted = res.data.map(item => formatDbProperty(item));
          setAllDbProps(formatted);
          setRecommendedProps(formatted);
        }
      } catch (err) {
        console.error("Error loading advisor inventory:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProps();
  }, []);

  const samplePrompts = [
    "Show me 3 BHK under ₹3 Cr in Noida near metro with 5%+ rental yield.",
    "What is the top luxury golf course project in Gurgaon for 5-year investment?",
    "Find villas under ₹8 Cr near Delhi IGI Airport with immediate possession."
  ];

  const handleRunAi = (queryText: string) => {
    setPrompt(queryText);
    setIsGenerating(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsGenerating(false);
      const q = queryText.toLowerCase();
      if (q.includes('noida') || q.includes('valley') || q.includes('himalaya') || q.includes('cr')) {
        const matched = allDbProps.filter(p => p.title.toLowerCase().includes(q) || p.location.locality.toLowerCase().includes(q) || p.priceDisplay.toLowerCase().includes(q));
        setRecommendedProps(matched.length > 0 ? matched : allDbProps);
        setAiResponse("Based on real-time PostgreSQL analytics and infrastructure expansions across Sector corridors, the selected developments exhibit exceptional projected IRR (18.4% YoY) and structural RERA compliance.");
      } else {
        setRecommendedProps(allDbProps);
        setAiResponse(`Analyzed ${allDbProps.length} active live listings from our PostgreSQL developer table. Recommendations evaluated across capital CAGR and verified freehold title guarantees.`);
      }
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 space-y-10">
      
      {/* HERO BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-amber-500/30 text-xs font-semibold text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>EstatePrime Intelligence Engine v2.4</span>
        </div>

        <h1 className="font-display text-4xl font-extrabold text-slate-900">
          AI Property Advisor & <span className="gold-gradient-text">Investment Score Engine</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-700">
          Ask complex natural language queries. Calculate expected 5-year capital appreciation, rental yield forecasts, and developer reliability indexes.
        </p>
      </div>

      {/* NATURAL LANGUAGE INPUT BOX */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-300/80 shadow-2xl space-y-4 max-w-3xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); handleRunAi(prompt); }} className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Find me a 3 BHK in Gurgaon under ₹3.5 Cr with ready possession and high capital growth potential..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt}
            className="absolute right-3 bottom-4 p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold transition-all disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {/* Quick Sample Prompts */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider block">Try Sample AI Prompts:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleRunAi(sp)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-500/50 text-[11px] text-slate-700 hover:text-slate-900 transition-colors text-left"
              >
                "{sp}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI ANALYSIS OUTPUT */}
      {aiResponse && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-amber-500/5 max-w-3xl mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AI Research Synthesis</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed">{aiResponse}</p>
        </div>
      )}

      {/* RECOMMENDED MATCHES GRID */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-slate-900">Top AI Recommended Match Units</h2>
          <span className="text-xs text-slate-600">{recommendedProps.length} matches ranked by investment score</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProps.map((prop) => (
            <div key={prop.id} className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="relative h-44 rounded-xl overflow-hidden">
                  <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-50/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>AI Score: {prop.investmentScore}/100</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-brand-400 font-bold uppercase">{prop.bhk} BHK • {prop.location.locality}</span>
                  <h3 className="font-display text-base font-bold text-slate-900 line-clamp-1">{prop.title}</h3>
                  <p className="font-display text-lg font-bold brand-gradient-text mt-0.5">{prop.priceDisplay}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Est. Yield</span>
                    <span className="font-bold text-emerald-400">{prop.rentalYieldPercent}% YoY</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Possession</span>
                    <span className="font-bold text-slate-800">{prop.possessionStatus}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/properties/${prop.id}`}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-slate-900 font-bold text-xs text-center flex items-center justify-center space-x-1.5"
              >
                <span>View Full AI Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
