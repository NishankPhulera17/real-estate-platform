'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Sparkles, 
  X, 
  Check, 
  Trees, 
  Loader2, 
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Globe,
  Wind,
  Droplet,
  Wifi,
  DollarSign,
  Compass,
  Heart,
  Briefcase
} from 'lucide-react';
import { createDestinationAction } from '@/app/actions/destination';

interface DestinationCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDestination: any) => void;
}

export default function DestinationCreationModal({
  isOpen,
  onClose,
  onSuccess,
}: DestinationCreationModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'metrics' | 'media'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [elevation, setElevation] = useState('2,100m / 6,900 ft');
  const [climate, setClimate] = useState('Alpine / Pleasant Summers & Snowdrifts');
  const [airQuality, setAirQuality] = useState('AQI 15 (Pristine Himalayan Air)');
  const [waterQuality, setWaterQuality] = useState('99.4% Glacial Spring Purity');
  const [internetAvailability, setInternetAvailability] = useState('Fiber (150 Mbps) & Starlink Ready');
  const [costOfLiving, setCostOfLiving] = useState('₹45,000 - ₹75,000 / mo');
  const [sustainabilityScore, setSustainabilityScore] = useState('9.5');
  const [remoteWorkScore, setRemoteWorkScore] = useState('9.8');
  const [retirementScore, setRetirementScore] = useState('9.2');
  const [familyFriendliness, setFamilyFriendliness] = useState('9.4');
  const [thingsToDo, setThingsToDo] = useState('Himalayan Ridge Trekking, Apple Orchard Tours, Artisanal Cafes, Alpine Stargazing');
  const [heroImage, setHeroImage] = useState('');
  const [galleries, setGalleries] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload image to Cloudinary');
      const data = await res.json();
      const uploadedUrl = data.url || data.secure_url;

      if (isHero && !heroImage) {
        setHeroImage(uploadedUrl);
      } else {
        setGalleries((prev) => [...prev, uploadedUrl]);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (!heroImage) {
      setHeroImage(imageUrlInput.trim());
    } else {
      setGalleries((prev) => [...prev, imageUrlInput.trim()]);
    }
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (index === -1) {
      const nextHero = galleries[0] || '';
      setHeroImage(nextHero);
      if (nextHero) setGalleries((prev) => prev.slice(1));
    } else {
      setGalleries((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a valid Destination Hub Name.');
      return;
    }
    if (!heroImage) {
      setError('Please attach at least one scenic Hero photo for this destination.');
      setActiveTab('media');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createDestinationAction({
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        heroImage,
        elevation,
        climate,
        airQuality,
        waterQuality,
        internetAvailability,
        costOfLiving,
        sustainabilityScore,
        remoteWorkScore,
        retirementScore,
        familyFriendliness,
        thingsToDo,
        galleries,
      });

      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to publish destination.');
      }

      onSuccess(result.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving destination hub.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                Launch New Destination Hub
                <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500 text-slate-950">
                  Live DB
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Establish high-intent regions & lifestyle hubs in PostgreSQL for marketplace discovery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'general' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Geography & Climate</span>
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'metrics' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trees className="w-4 h-4" />
            <span>2. Living Scores & Environment</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'media' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3. Cloudinary Scenic Media {heroImage && '✓'}</span>
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* CONTENT FORM */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mukteshwar Ridge, Uttarakhand"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    Custom URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Auto-generated from name if empty"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Elevation / Altitude
                  </label>
                  <input
                    type="text"
                    value={elevation}
                    onChange={(e) => setElevation(e.target.value)}
                    placeholder="e.g. 2,150m / 7,000 ft"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Climate & Weather Type
                  </label>
                  <input
                    type="text"
                    value={climate}
                    onChange={(e) => setClimate(e.target.value)}
                    placeholder="e.g. Alpine / Pleasant Summers & Snowdrifts"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Destination Highlights & Narrative Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the tranquil ambiance, panoramic Himalayan views, organic orchards, and investment potential..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Key Activities & Things To Do (Comma Separated)
                </label>
                <input
                  type="text"
                  value={thingsToDo}
                  onChange={(e) => setThingsToDo(e.target.value)}
                  placeholder="Himalayan Ridge Trekking, Apple Orchard Tours, Artisanal Cafes, Alpine Stargazing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-sky-400" />
                    Air Quality (AQI) Index
                  </label>
                  <input
                    type="text"
                    value={airQuality}
                    onChange={(e) => setAirQuality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-400" />
                    Water Source & Purity
                  </label>
                  <input
                    type="text"
                    value={waterQuality}
                    onChange={(e) => setWaterQuality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    Internet Availability & Speeds
                  </label>
                  <input
                    type="text"
                    value={internetAvailability}
                    onChange={(e) => setInternetAvailability(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    Estimated Cost of Living
                  </label>
                  <input
                    type="text"
                    value={costOfLiving}
                    onChange={(e) => setCostOfLiving(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Lifestyle Ratings & Buyer Fit (Scale: 1.0 - 10.0)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <Trees className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">Sustainability</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={sustainabilityScore}
                      onChange={(e) => setSustainabilityScore(e.target.value)}
                      className="w-full bg-slate-900 text-center text-emerald-400 font-extrabold text-lg border border-slate-800 rounded-lg py-1"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <Briefcase className="w-5 h-5 text-sky-400 mx-auto mb-2" />
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">Remote Work</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={remoteWorkScore}
                      onChange={(e) => setRemoteWorkScore(e.target.value)}
                      className="w-full bg-slate-900 text-center text-sky-400 font-extrabold text-lg border border-slate-800 rounded-lg py-1"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2" />
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">Retirement</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={retirementScore}
                      onChange={(e) => setRetirementScore(e.target.value)}
                      className="w-full bg-slate-900 text-center text-rose-400 font-extrabold text-lg border border-slate-800 rounded-lg py-1"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">Family Friendly</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={familyFriendliness}
                      onChange={(e) => setFamilyFriendliness(e.target.value)}
                      className="w-full bg-slate-900 text-center text-amber-400 font-extrabold text-lg border border-slate-800 rounded-lg py-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in">
              {/* CLOUDINARY DROPZONE */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 transition-colors bg-slate-950/40 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  id="destination-image-upload"
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="destination-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  {isUploading ? (
                    <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {isUploading ? 'Streaming to Cloudinary CDN...' : 'Direct Cloudinary High-Res Upload'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Select scenic DSLR photos of valleys, orchards, and local communities
                    </p>
                  </div>
                </label>
              </div>

              {/* DIRECT URL INPUT */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste Direct Image URL (Unsplash / Cloudinary / Google Content)..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold rounded-xl uppercase tracking-wider"
                >
                  Add Media
                </button>
              </div>

              {/* ATTACHED MEDIA LIST */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-300">
                  Attached Destination Media ({heroImage ? 1 + galleries.length : galleries.length})
                </h4>
                {heroImage ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <div className="relative group rounded-xl overflow-hidden border border-emerald-500 aspect-video bg-slate-950">
                      <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[9px] uppercase shadow">
                        Hero Cover
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(-1)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {galleries.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
                        <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    No images uploaded yet. The first photo uploaded will automatically serve as the Hero scenic backdrop!
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex gap-2">
            {activeTab !== 'general' && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'media' ? 'metrics' : 'general')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-extrabold uppercase tracking-wider hover:bg-slate-700 transition-colors"
              >
                Back
              </button>
            )}
            {activeTab !== 'media' ? (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'general' ? 'metrics' : 'media')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider transition-colors"
              >
                Next Step
              </button>
            ) : null}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold uppercase transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !name.trim() || !heroImage}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-xl hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:pointer-events-none flex items-center space-x-2 transition-all transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[3]" />
                  <span>Publishing to Hub...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Launch Destination Hub</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
