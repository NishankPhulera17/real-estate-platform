'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  X, 
  Check, 
  Home, 
  Shield, 
  Trees, 
  Loader2, 
  AlertCircle,
  Layers,
  Ruler,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Zap,
  Upload,
  Cloud
} from 'lucide-react';
import { createPropertyAction } from '@/app/actions/property';

interface PropertyCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProperty: any) => void;
  defaultPropertyType?: string;
  defaultLocality?: string;
  modalTitle?: string;
}

const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Mountain Home',
  'Land / Plot',
  'Penthouse',
  'Commercial Office',
  'Retail Shop'
];

const POSSESSION_STATUSES = [
  'Ready to Move',
  'Under Construction',
  'New Launch'
];

const FURNISHED_STATUSES = [
  'Unfurnished',
  'Semi-Furnished',
  'Fully Furnished'
];

const AMENITY_OPTIONS = [
  { label: 'Mountain View', category: 'Eco / Himalayan', icon: Trees },
  { label: 'Solar Ready', category: 'Eco / Himalayan', icon: Sparkles },
  { label: 'Rainwater Harvesting', category: 'Eco / Himalayan', icon: Layers },
  { label: 'High-speed Fiber Internet', category: 'Modern Work', icon: Sparkles },
  { label: 'Swimming Pool', category: 'Residential', icon: Home },
  { label: 'Gymnasium & Clubhouse', category: 'Residential', icon: Building2 },
  { label: '24/7 Security & CCTV', category: 'Security', icon: Shield },
];

export function PropertyCreationModal({
  isOpen,
  onClose,
  onSuccess,
  defaultPropertyType = 'Apartment',
  defaultLocality = '',
  modalTitle = 'Launch New Project & Listing'
}: PropertyCreationModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState(defaultPropertyType);
  const [possessionStatus, setPossessionStatus] = useState('New Launch');
  const [areaSqFt, setAreaSqFt] = useState('');
  const [bhk, setBhk] = useState('3');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [parking, setParking] = useState('2');
  const [furnished, setFurnished] = useState('Semi-Furnished');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState(defaultLocality);

  React.useEffect(() => {
    if (defaultLocality) setLocality(defaultLocality);
  }, [defaultLocality]);

  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Mountain View', 'High-speed Fiber Internet', '24/7 Security & CCTV']);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const removeUploadedImage = (idx: number) => setImageUrls(prev => prev.filter((_, i) => i !== idx));

  const [uploadingCloudinary, setUploadingCloudinary] = useState(false);
  const [cloudinaryNotice, setCloudinaryNotice] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCloudinary(true);
    setCloudinaryNotice(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          newUrls.push(data.url);
          if (data.isSimulated) {
            setCloudinaryNotice("⚠️ Simulated Cloudinary demo link added. To store real photos in your bucket, paste your credentials into .env.");
          } else {
            setCloudinaryNotice("✅ Successfully uploaded to Cloudinary 'real_estate' storage and linked below!");
          }
        } else {
          setErrorMsg(data.error || "Failed to upload image to Cloudinary.");
        }
      }

      if (newUrls.length > 0) {
        setImageUrls(prev => {
          const filtered = prev.filter(u => u.trim() !== "");
          return [...filtered, ...newUrls];
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg("Failed to connect to Cloudinary upload endpoint.");
    } finally {
      setUploadingCloudinary(false);
      e.target.value = "";
    }
  };

  if (!isOpen) return null;

  const toggleAmenity = (label: string) => {
    setSelectedAmenities(prev =>
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const priceVal = parseFloat(price);
    const areaVal = parseFloat(areaSqFt);

    if (isNaN(priceVal) || priceVal <= 0) {
      setErrorMsg('Please enter a valid positive price in INR.');
      setLoading(false);
      return;
    }
    if (isNaN(areaVal) || areaVal <= 0) {
      setErrorMsg('Please enter a valid area in Square Feet.');
      setLoading(false);
      return;
    }

    const validImages = imageUrls.map(u => u.trim()).filter(Boolean);
    const validVideos = videoUrlInput.trim() ? [videoUrlInput.trim()] : [];

    if (validImages.length === 0) {
      setErrorMsg('Please upload at least one property image.');
      setLoading(false);
      return;
    }

    try {
      const result = await createPropertyAction({
        title,
        price: priceVal,
        propertyType,
        possessionStatus,
        areaSqFt: areaVal,
        bhk: parseInt(bhk, 10) || undefined,
        bedrooms: parseInt(bedrooms, 10) || undefined,
        bathrooms: parseInt(bathrooms, 10) || undefined,
        parking: parseInt(parking, 10) || undefined,
        furnished,
        address,
        locality,
        description: `${description ? description + '\n\n' : ''}Featured Amenities & Highlights: ${selectedAmenities.join(', ')}`,
        images: validImages,
        videos: validVideos,
      });

      if (result.error) {
        setErrorMsg(result.error === 'Unauthorized'
          ? 'Authentication required: You must be logged in as a Builder, Broker, or Admin to publish listings.'
          : result.error);
      } else if (result.success && result.data) {
        const createdWithDisplay = {
          ...result.data,
          id: result.data.id || `live-${Date.now()}`,
          priceDisplay: `₹${(priceVal / 10000000).toFixed(2)} Cr`,
          priceVal: priceVal,
          areaSqFt: areaVal,
          bhk: parseInt(bhk, 10) || 3,
          propertyType: propertyType,
          possessionStatus: possessionStatus,
          location: {
            address,
            locality,
            city: 'NorthNest Featured',
            lat: 29.3804,
            lng: 79.4636
          },
          builder: {
            name: 'NorthNest Developer Console',
            id: 'live-db-developer',
            logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80'
          },
          images: validImages,
          videos: validVideos,
          videoUrl: validVideos[0] || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          isLiveDb: true,
          tags: selectedAmenities.slice(0, 3)
        };
        onSuccess(createdWithDisplay);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred while publishing listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8 text-slate-100">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400 block">
                Live Inventory Portal
              </span>
              <h2 className="font-display text-xl font-bold text-white">{modalTitle}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Home className="w-4 h-4 text-amber-400" />
              <span>Basic Listing Specifications</span>
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Title *</label>
              <input
                type="text"
                required
                minLength={5}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. The Camellias Himalayan Ridge Residence"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Type</label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Possession Status</label>
                <select
                  value={possessionStatus}
                  onChange={e => setPossessionStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                >
                  {POSSESSION_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Furnishing</label>
                <select
                  value={furnished}
                  onChange={e => setFurnished(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                >
                  {FURNISHED_STATUSES.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Dimensions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Pricing & Dimensions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Price (in INR) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={10000}
                    step="any"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 35000000 (for 3.5 Cr)"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-emerald-400 outline-none"
                  />
                </div>
                {price && !isNaN(parseFloat(price)) && (
                  <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                    Display formatting: ₹{(parseFloat(price) / 10000000).toFixed(2)} Cr
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Super Built-up Area (Sq. Ft) *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={100}
                    value={areaSqFt}
                    onChange={e => setAreaSqFt(e.target.value)}
                    placeholder="e.g. 2450"
                    className="w-full pl-4 pr-16 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-emerald-400 outline-none"
                  />
                  <span className="absolute right-3.5 top-3 text-slate-400 text-xs font-medium">Sq. Ft</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">BHK</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={bhk}
                  onChange={e => setBhk(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={bedrooms}
                  onChange={e => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={bathrooms}
                  onChange={e => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Parking Bays</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={parking}
                  onChange={e => setParking(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Location & Geography</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Locality / Sector / Valley *</label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  placeholder="e.g. Mukteshwar Valley, Kumaon"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Street Address or Landmark *</label>
                <input
                  type="text"
                  required
                  minLength={5}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. Ridge View Road, Near Solar Orchard"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Eco Features & Amenities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>Featured Amenities & NorthNest Tags</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.label);
                const IconComponent = amenity.icon;
                return (
                  <button
                    type="button"
                    key={amenity.label}
                    onClick={() => toggleAmenity(amenity.label)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-semibold shadow-sm'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="truncate">{amenity.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Media Gallery (Photos & Video Tour) */}
          <div className="space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Media Gallery (Photos & Video Tour)</span>
              </h3>
            </div>

            {/* Cloudinary Direct Uploader */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wide flex items-center space-x-1.5">
                  <Cloud className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  <span>Cloudinary Direct Image Upload</span>
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  Supports JPG, PNG, WEBP
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload architectural imagery directly from your computer. Photos are transferred to your secure Cloudinary storage bucket (<code className="text-amber-300 font-mono">real_estate</code> folder) and automatically inserted below.
              </p>
              
              <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-all cursor-pointer group">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  disabled={uploadingCloudinary || loading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                <div className="flex flex-col items-center text-center space-y-2 pointer-events-none">
                  {uploadingCloudinary ? (
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                      <span>Uploading photos to Cloudinary storage...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                        Click to Browse or Drag & Drop Photos Here
                      </span>
                      <span className="text-[10px] text-slate-500">Multiple files supported • Automatic optimization</span>
                    </>
                  )}
                </div>
              </label>

              {cloudinaryNotice && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span>{cloudinaryNotice}</span>
                </div>
              )}
            </div>

            {/* Uploaded Images Preview Gallery */}
            {imageUrls.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Uploaded Images ({imageUrls.length})</span>
                  <span className="text-[10px] font-normal text-slate-500">First image will be used as cover</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-700 bg-slate-800">
                      <img src={url} alt={`Upload preview ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="w-8 h-8 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white flex items-center justify-center transition"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500/90 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Video className="w-3.5 h-3.5 text-brand-400" />
                <span>Video Tour / YouTube Walkthrough URL (Optional)</span>
              </label>
              <input
                type="url"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or direct MP4 URL"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-amber-400 outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">YouTube links will be automatically formatted into interactive embedded video players on the listing page.</p>
            </div>
          </div>

          {/* Section 6: Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Narrative & Highlights</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the peaceful surroundings, architect quality, air quality, or rental yield potential..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none resize-y"
            />
          </div>

          {/* FOOTER SUBMISSION */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-extrabold text-xs tracking-wider uppercase shadow-lg flex items-center space-x-2 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gray-950" />
                  <span>Publishing to Database...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-gray-950" />
                  <span>Publish Listing to Site</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
