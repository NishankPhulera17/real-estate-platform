'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export interface PropertyProps {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  type: string;
}

export default function PropertyCard({ property }: { property: PropertyProps }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="glass-card rounded-2xl overflow-hidden group border border-slate-200"
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        {/* Fallback to a styled div if no actual image URL is provided, but we assume it is */}
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-forest-600/90 backdrop-blur-md text-slate-900 text-xs font-semibold rounded-full">
            {property.type}
          </span>
        </div>
        
        <button className="absolute top-4 right-4 p-2 rounded-full bg-slate-50/50 backdrop-blur-md text-slate-900 hover:bg-forest-500 hover:text-slate-900 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-forest-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </div>
        
        <div className="flex items-center text-slate-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-forest-500 shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center justify-between text-slate-700 text-sm py-4 border-y border-slate-200">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-forest-400" />
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-forest-400" />
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4 text-forest-400" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">{property.price}</span>
          <Link 
            href={`/properties/${property.id}`}
            className="text-sm font-medium text-forest-400 hover:text-forest-300 transition-colors flex items-center gap-1"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
