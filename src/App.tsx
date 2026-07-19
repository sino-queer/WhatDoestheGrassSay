import { useState, useEffect, useMemo } from 'react';
import { PRINTMAKING_ARTWORKS } from './data';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ImageOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import sinoqueerLogo from './assets/sinoqueer-logo.png';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-set index if search query matches a catalog number (01 to 48)
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) return;

    // Direct match for catalog number e.g. "01" or "1"
    const matchIndex = PRINTMAKING_ARTWORKS.findIndex(
      (p) => p.number === query || p.number.replace(/^0+/, '') === query
    );

    if (matchIndex !== -1) {
      setCurrentIndex(matchIndex);
    } else {
      // Fuzzy search by title keyword or author
      const keywordIndex = PRINTMAKING_ARTWORKS.findIndex(
        (p) =>
          p.titleZh.includes(query) ||
          p.titleEn.toLowerCase().includes(query.toLowerCase()) ||
          p.author.toLowerCase().includes(query.toLowerCase()) ||
          p.themeZh.includes(query) ||
          p.themeEn.toLowerCase().includes(query.toLowerCase())
      );
      if (keywordIndex !== -1) {
        setCurrentIndex(keywordIndex);
      }
    }
  }, [searchQuery]);

  // Active artwork
  const activeArtwork = useMemo(() => {
    return PRINTMAKING_ARTWORKS[currentIndex] || PRINTMAKING_ARTWORKS[0];
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PRINTMAKING_ARTWORKS.length - 1 : prev - 1));
    setSearchQuery(''); // clear search input upon manual flipping
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === PRINTMAKING_ARTWORKS.length - 1 ? 0 : prev + 1));
    setSearchQuery(''); // clear search input upon manual flipping
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#1a1a1a] font-sans flex flex-col justify-between selection:bg-[#FFB208] selection:text-[#4D26B2]">
      
      {/* 1. MINIMALIST TOP NAV */}
      <header className="border-b border-[#D39306]/30 bg-[#FFB208] backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
              <img src={sinoqueerLogo} alt="Sinoqueer" className="h-8 w-auto object-contain" />
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#4D26B2] uppercase tracking-wider bg-white rounded-full px-3 py-1.5 shadow-sm">
            {activeArtwork.number} / {PRINTMAKING_ARTWORKS.length}
          </div>
        </div>
      </header>

      {/* 2. MAIN FOCUSED INTERACTION STAGE */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center gap-12">

        {/* ONE FOCUSED SEARCH BAR */}
        <div className="w-full max-w-sm text-center">
          {/* Small Title above the search bar */}
          <div className="text-center space-y-0.5 mb-6">
            <p className="text-sm font-sans font-black text-[#4D26B2] tracking-tight">
              野草说 WHAT DOES THE GRASS SAY
            </p>
            <p className="text-[10px] font-sans text-[#4D26B2]/70 uppercase tracking-widest">
              SINOQUEER PRINTMAKING WORKSHOP
            </p>
          </div>

          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`输入 01 - ${PRINTMAKING_ARTWORKS.length} 定位作品序号 / Enter Catalog No...`}
              className="w-full bg-white border border-stone-200 group-hover:border-[#4D26B2]/40 focus:border-[#4D26B2] rounded-full pl-11 pr-10 py-3 text-xs font-semibold outline-none text-center shadow-sm transition-all duration-300 placeholder:text-stone-300 focus:shadow-md focus:shadow-[#4D26B2]/5 font-mono"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-[#4D26B2] transition-colors" />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-full"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {/* COMPACT INTERACTIVE ARTWORK CAROUSEL */}
        <div className="w-full flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-[#FFB208] text-[#4D26B2] flex items-center justify-center transition-all hover:brightness-95 hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer"
            aria-label="Previous masterpiece"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Framed Image Display (Simple, clean, and elegant) */}
          <div className="flex-1 max-w-lg relative py-2">

            {/* Centered Image Container */}
            <div className="h-64 sm:h-80 w-full relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeArtwork.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="max-h-full max-w-full w-full h-full border-2 border-white shadow-lg relative overflow-hidden bg-white flex items-center justify-center rounded"
                >
                  {/* Theme Tag pinned to the top of the image area */}
                  <div
                    className="absolute top-0 left-0 right-0 px-3 py-1.5 text-center font-bold text-[10px] tracking-wide z-10"
                    style={{ backgroundColor: activeArtwork.themeColor, color: activeArtwork.themeTextColor }}
                  >
                    {activeArtwork.themeZh} / {activeArtwork.themeEn}
                  </div>

                  {activeArtwork.imageSrc ? (
                    <img
                      src={activeArtwork.imageSrc}
                      alt={activeArtwork.titleZh}
                      className="max-h-[220px] sm:max-h-[280px] object-contain mt-6"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-stone-300 mt-6">
                      <ImageOff className="w-8 h-8" />
                      <span className="text-[10px] uppercase tracking-widest font-mono">Image coming soon</span>
                    </div>
                  )}

                  {/* Absolute Position Tag */}
                  <div className="absolute bottom-2 left-2 bg-[#4D26B2] text-[#FFB208] px-2 py-0.5 rounded font-mono text-[9px] font-bold border border-[#FFB208]/20">
                    #{activeArtwork.number}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-[#4D26B2] text-[#FFB208] flex items-center justify-center transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer"
            aria-label="Next masterpiece"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* 3. BILINGUAL SPEC SHEET & INTERPRETATIONS (No background frames, absolute purity) */}
        <div className="w-full space-y-10 pt-4">
          
          {/* Main Title Metadata Block */}
          <div className="text-center space-y-2">
            {(activeArtwork.titleZh || activeArtwork.titleEn) && (
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#4D26B2] tracking-tight leading-tight">
                {activeArtwork.titleZh && `《${activeArtwork.titleZh}》`}
                {activeArtwork.titleEn && (
                  <span className="block text-lg sm:text-xl font-light not-italic text-stone-500 mt-1 font-serif">
                    {activeArtwork.titleEn}
                  </span>
                )}
              </h2>
            )}

            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-stone-400 font-medium">
              {activeArtwork.author && (
                <>
                  <span className="text-[#4D26B2] font-semibold">{activeArtwork.author}</span>
                  <span>•</span>
                </>
              )}
              <span
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ backgroundColor: `${activeArtwork.themeColor}1A`, color: activeArtwork.themeColor }}
              >
                {activeArtwork.themeZh}
              </span>
            </div>

            {/* Elegant tiny split line */}
            <div className="h-[1px] w-12 bg-[#FFB208] mx-auto rounded-full mt-4" />
          </div>

          {/* Side-by-Side Dual Language Interpretations with NO borders or background boxes */}
          {(activeArtwork.descriptionZh || activeArtwork.descriptionEn) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-stone-100">

              {/* Chinese column */}
              {activeArtwork.descriptionZh && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#4D26B2]/5 text-[#4D26B2] font-bold px-2 py-0.5 rounded font-mono">ZH</span>
                    <span className="text-[10px] font-bold text-[#4D26B2] uppercase tracking-widest">作品阐释</span>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-[#4D26B2]/95 border-l-2 border-[#FFB208] pl-4 whitespace-pre-line">
                    {activeArtwork.descriptionZh}
                  </p>
                </div>
              )}

              {/* English column */}
              {activeArtwork.descriptionEn && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-stone-100 text-stone-500 font-bold px-2 py-0.5 rounded font-mono">EN</span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Artwork Insights</span>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-stone-700 border-l-2 border-stone-200 pl-4 whitespace-pre-line">
                    {activeArtwork.descriptionEn}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </main>

      {/* 3. MINIMAL FOOTER */}
      <footer className="border-t border-stone-100 py-6 mt-12 bg-white/50">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-1.5">
          <p className="text-[9px] text-[#FFB208]">
            All works are created by participants of the Sinoqueer printmaking workshops and shared here for community celebration and archival.
          </p>
          <a
            href="https://www.instagram.com/sinoqueer_se/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[10px] text-[#FFB208] font-bold tracking-wider hover:underline pt-1"
          >
            关注我们 Follow Us on Instagram @sinoqueer_se
          </a>
        </div>
      </footer>

    </div>
  );
}
