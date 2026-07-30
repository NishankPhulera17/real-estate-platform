'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, MapPin, Eye, Download, MousePointerClick, TrendingUp, Clock, FileText } from 'lucide-react';
import { getVisitorTimelineAction, TimelineEventItem } from '@/app/actions/telemetry';

interface VisitorTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string | null;
}

export function VisitorTimelineModal({ isOpen, onClose, targetId }: VisitorTimelineModalProps) {
  const [timeline, setTimeline] = useState<TimelineEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('Visitor Timeline');
  const [subtitle, setSubtitle] = useState('Chronological session events');

  useEffect(() => {
    if (isOpen && targetId) {
      setLoading(true);
      setError(null);
      getVisitorTimelineAction(targetId)
        .then((res) => {
          if (res.success && res.data) {
            setTimeline(res.data);
            if (res.title) setTitle(res.title);
            if (res.subtitle) setSubtitle(res.subtitle);
          } else {
            setError(res.error || 'Failed to load timeline');
          }
        })
        .catch((err) => {
          setError(err.message || 'An error occurred');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, targetId]);

  if (!isOpen) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'SITE_ENTER':
        return <MapPin className="w-5 h-5 text-blue-500" />;
      case 'PROPERTY_VIEW':
        return <Eye className="w-5 h-5 text-purple-500" />;
      case 'BROCHURE_DOWNLOAD':
        return <Download className="w-5 h-5 text-amber-500" />;
      case 'TIME_SPENT':
        return <Clock className="w-5 h-5 text-indigo-500" />;
      case 'CTA_CLICK':
      case 'SITE_VISIT_REQUEST':
        return <MousePointerClick className="w-5 h-5 text-emerald-500" />;
      case 'LEAD_CAPTURED':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-medium">Reconstructing visitor journey...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 bg-red-50/50 rounded-2xl border border-dashed border-red-200">
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : timeline.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-sm font-semibold text-slate-700">No events recorded.</p>
              <p className="text-xs text-slate-500 mt-1">This visitor hasn't generated any tracked events yet.</p>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {timeline.map((event, index) => (
                <div key={event.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon Marker */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {getEventIcon(event.type)}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">{event.title}</span>
                      {event.scoreImpact && (
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {event.scoreImpact}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">{event.description}</p>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 font-medium">
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                      {event.propertyName && (
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 truncate max-w-[120px]">
                          {event.propertyName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
