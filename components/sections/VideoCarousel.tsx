'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const videos = [
  { id: '1', youtubeId: 'LXb3EKWsInQ', title: 'Luxury Himalayan Villa Tour' },
  { id: '2', youtubeId: 'd7XW2m92Dvw', title: 'Serene Nature Plots for Sale' },
  { id: '3', youtubeId: 'Y18B6M9zIqk', title: 'Modern Pahadi Homes Architecture' },
  { id: '4', youtubeId: 'tO01J-M3g0U', title: 'Riverfront Properties Overview' },
  { id: '5', youtubeId: '3G1PFLlsEKk', title: 'Off-grid Living Spaces Experience' },
];

export function VideoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-forest-900 mb-4">
            Experience the Life
          </h2>
          <p className="text-wood-600 text-lg max-w-2xl">
            Take a virtual tour of our exclusive properties, land parcels, and luxury villas nestled in the mountains.
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          <button 
            onClick={() => scroll('left')}
            className="p-3 rounded-full border border-forest-200 hover:bg-forest-50 transition-colors text-forest-800"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 rounded-full border border-forest-200 hover:bg-forest-50 transition-colors text-forest-800"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto pb-8 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="snap-center shrink-0 w-[85vw] md:w-[600px] lg:w-[700px] aspect-video rounded-2xl overflow-hidden bg-forest-100 shadow-lg relative"
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        ))}
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="md:hidden flex justify-center mt-4 gap-2 text-wood-400 text-sm items-center">
        <ChevronLeft className="w-4 h-4" />
        <span>Swipe to explore</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </section>
  );
}
