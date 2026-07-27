import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, MapPin } from 'lucide-react';
import TheShift from '@/components/sections/TheShift';

export default function HomePage() {
  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-900 selection:bg-brand-900 selection:text-white">

      {/* =========================================================================
          PART 1: INSPIRATION (50%)
          Goal: Ignite the emotional spark for city-dwellers.
          ========================================================================= */}

      {/* 1. HERO - Cinematic Full Screen */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Top Center Branding */}
        <div className="absolute top-[20px] left-1/2 -translate-x-1/2 z-20 text-white uppercase tracking-[0.2em] text-sm font-bold drop-shadow-sm">
          NorthNest.club
        </div>

        <div className="absolute inset-0 z-0">
          <video
            src="/nainital.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-forest-900/40 via-forest-900/30 to-forest-900/70"></div> */}
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-10 -mt-20">
          <style>{`
            @keyframes fadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes slowContinuousZoom {
              0% { transform: scale(1); }
              100% { transform: scale(1.45); }
            }
            .animate-fade-zoom {
              animation: 
                fadeIn 2s ease-out forwards, 
                slowContinuousZoom 20s ease-in-out infinite alternate;
            }
          `}</style>
          <h1 className="animate-fade-zoom font-display text-5xl md:text-7xl lg:text-[80px] font-semibold text-white tracking-tight drop-shadow-2xl leading-[1.1]">
            Your Best Years <br /> Don't Belong in Traffic.
          </h1>
          <p className="pt-8 text-lg md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md font-light tracking-wide leading-relaxed">
            NorthNest helps you discover carefully curated land and mountain homes in the Kumaon and Garhwal Himalayas—where life is slower, air is cleaner, and moments are real.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link href="/destinations" className="w-full sm:w-auto px-10 py-4 rounded-none bg-[#16A34A] text-white font-semibold tracking-[0.15em] uppercase text-sm hover:bg-[#15803d] transition-all duration-300">
              EXPLORE PROPERTIES
            </Link>
            <button className="w-full sm:w-auto px-10 py-4 rounded-none border border-white/40 text-white font-semibold tracking-[0.15em] uppercase text-sm hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3">
              <Play className="w-4 h-4 fill-white text-white" />
              <span>DISCOVER THE NORTHNEST STORY</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE SHIFT - Premium Editorial Typography */}
      <TheShift />

      {/* 3. WHY PEOPLE MOVE - Minimal Quote Blocks */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12 max-w-[1200px] mx-auto border-t border-forest-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-8">
            <div className="relative aspect-[4/3] w-full shadow-xl">
              <Image src="https://images.unsplash.com/photo-1601058269720-3b4e39ec2fba?auto=format&fit=crop&w=1000&q=80" alt="Vibrant Himalayan Culture" fill className="object-cover transition-all duration-1000" unoptimized />
            </div>
            <div>
              <p className="text-xl font-display font-medium text-forest-900 leading-relaxed mb-4">
                "The Aipan art on our doorstep and the scent of rhododendrons. This isn't just a house, it's an inheritance."
              </p>
              <span className="text-xs font-semibold uppercase tracking-widest text-wood-600 block">— The Culture Seeker</span>
            </div>
          </div>
          <div className="space-y-8">
            <div className="relative aspect-[4/3] w-full shadow-xl">
              <Image src="https://images.unsplash.com/photo-1596781297576-96b4dbac7fbb?auto=format&fit=crop&w=1000&q=80" alt="Pahadi Lifestyle" fill className="object-cover transition-all duration-1000" unoptimized />
            </div>
            <div>
              <p className="text-xl font-display font-medium text-forest-900 leading-relaxed mb-4">
                "We wanted our children to know the soil, the ancient pines, and the warmth of a Pahadi community."
              </p>
              <span className="text-xs font-semibold uppercase tracking-widest text-wood-600 block">— The Family</span>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          PART 2: EDUCATION (30%)
          Goal: Intellectually justify the move through data, places, and stories.
          ========================================================================= */}



      {/* 5. DISCOVER PLACES - Minimalist Grid */}
      <section className="py-16 lg:py-20 bg-forest-50 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="font-display text-5xl font-medium text-forest-900">Where will your roots grow?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Mukteshwar', desc: "Orchards & Himalayan views", img: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&w=1000&q=80' },
              { name: 'Rishikesh', desc: "Yoga, rivers & spirituality", img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1000&q=80' },
              { name: 'Nainital', desc: "Lakeside colonial heritage", img: 'https://images.unsplash.com/photo-1593693397690-362cb9666cb3?auto=format&fit=crop&w=1000&q=80' },
            ].map((place, idx) => (
              <Link href={`/destinations/${place.name.toLowerCase()}`} key={idx} className="group flex flex-col space-y-6">
                <div className="relative h-[600px] w-full overflow-hidden shadow-lg">
                  <Image src={place.img} alt={place.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="flex items-center justify-between border-b border-forest-200 pb-4">
                  <div>
                    <h3 className="font-display text-2xl font-medium text-forest-900">{place.name}</h3>
                    <p className="text-sm text-forest-600 font-light mt-1">{place.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-wood-500 group-hover:text-forest-700 transform group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/destinations" className="inline-block text-sm font-semibold uppercase tracking-widest text-forest-700 hover:text-forest-900 transition-colors border-b-2 border-wood-400 pb-1">
              Explore All Regions
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CURATED OPPORTUNITIES - Pahadi Heritage Homes */}
      <section className="py-20 lg:py-24 bg-forest-900 text-forest-50 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto space-y-24">
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-forest-700 pb-8">
            <div className="space-y-4">
              <h2 className="font-display text-4xl lg:text-5xl font-medium max-w-2xl leading-tight text-white">Built with reverence for the mountains.</h2>
              <p className="text-lg text-forest-200 font-light">A curated collection of homes reflecting true Pahadi craftsmanship and pristine land.</p>
            </div>
            <Link href="/properties" className="text-sm font-semibold uppercase tracking-widest text-wood-400 hover:text-white transition-colors border-b border-wood-600 pb-1 mt-8 md:mt-0">
              View Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              { name: "The Glasshouse", loc: "Mukteshwar", type: "Villa", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", slug: 'prop-0' },
              { name: "Pinecrest Retreat", loc: "Nainital", type: "Estate", img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80", slug: 'prop-1' },
              { name: "Sunset Ridge Plots", loc: "Mukteshwar", type: "Land", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", slug: 'sunset-ridge-plots-mukteshwar' }
            ].map((item, idx) => (
              <Link href={`/properties/${item.slug}`} key={idx} className="group block">
                <div className="relative h-[600px] w-full mb-8 overflow-hidden border border-forest-700 shadow-2xl">
                  <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" unoptimized />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-forest-900/80 backdrop-blur-md text-[10px] font-semibold uppercase tracking-widest text-wood-400 border border-wood-800">
                    {item.type}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display text-2xl font-medium text-white mb-2">{item.name}</h3>
                    <p className="text-sm font-light text-forest-300 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-wood-500" /> {item.loc}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-forest-600 flex items-center justify-center group-hover:bg-wood-500 group-hover:text-forest-900 group-hover:border-wood-500 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MOUNTAIN LIVING JOURNAL - Editorial Covers */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16">
          <h2 className="font-display text-5xl font-medium text-forest-900">Journal</h2>
          <Link href="/blog" className="text-sm font-semibold uppercase tracking-widest text-forest-700 hover:text-forest-900 transition-colors mt-6 md:mt-0 border-b border-wood-400 pb-1">
            Read All Volumes
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {[
            { title: "The Art of Kumaoni Woodwork", tag: "Vol I — Heritage", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" },
            { title: "Building a Sustainable Mountain Home", tag: "Vol II — Architecture", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" },
          ].map((article, idx) => (
            <Link href={`/blog/${article.title.toLowerCase().replace(/ /g, '-')}`} key={idx} className="group block">
              <div className="relative h-[700px] mb-8 overflow-hidden shadow-lg">
                <Image src={article.img} alt={article.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" unoptimized />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-wood-600 block mb-3">{article.tag}</span>
              <h3 className="font-display text-4xl font-medium text-forest-900 group-hover:text-forest-600 transition-colors">{article.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          PART 3: PROPERTIES (20%)
          Goal: Ground the inspiration into tangible reality. 
          ========================================================================= */}



      {/* =========================================================================
          FINAL CTA
          ========================================================================= */}

      {/* 8. FINAL CTA - Editorial Typography */}
      <section className="min-h-[80vh] w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-12 py-[120px]" style={{ backgroundColor: '#FDFBF8' }}>
        <div className="max-w-[1200px] mx-auto space-y-16">
          <h2
            className="font-sans uppercase leading-[0.85] tracking-tight"
            style={{
              color: '#0F5A36',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              fontSize: 'clamp(50px, 8vw, 130px)',
              fontStretch: 'condensed',
              fontFamily: '"Impact", "Arial Narrow", "Anton", sans-serif'
            }}
          >
            The next generation<br />won't ask which<br />city to move to.
          </h2>

          <p className="text-2xl md:text-4xl font-medium italic" style={{ color: '#C96A2C' }}>
            They'll ask where to build their legacy.
          </p>

          <div className="max-w-2xl mx-auto pt-8 space-y-12">
            <p className="text-xl font-light leading-relaxed" style={{ color: '#5E6470' }}>
              NorthNest is not a catalog of properties. It is a carefully curated collection of the finest land and heritage homes in Devbhoomi. We exist to help you transition from the noise of the city to the profound silence of the mountains.
            </p>
            <div className="pt-8">
              <Link href="/destinations" className="inline-block border-b-2 pb-2 uppercase tracking-widest text-sm font-semibold transition-colors hover:opacity-70" style={{ color: '#0F5A36', borderColor: '#0F5A36' }}>
                Discover Devbhoomi
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
