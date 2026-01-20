
import React, { useState, useEffect, useCallback } from 'react';
import { Artwork } from '../types';

interface ImmersiveGalleryProps {
  artworks: Artwork[];
  initialIndex: number;
  onClose: () => void;
}

const ImmersiveGallery: React.FC<ImmersiveGalleryProps> = ({ artworks, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isHovered, setIsHovered] = useState(false);
  
  const currentArtwork = artworks[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  }, [artworks.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  }, [artworks.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  if (!currentArtwork) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-center justify-center overflow-hidden animate-in fade-in duration-500">
      {/* Botón Cerrar */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md border border-white/10"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Flechas Navegación */}
      <button 
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-white/5 text-white/30 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md border border-white/10 group"
      >
        <svg className="w-8 h-8 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-white/5 text-white/30 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md border border-white/10 group"
      >
        <svg className="w-8 h-8 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Imagen Principal */}
      <div 
        className="w-full h-full flex items-center justify-center p-4 md:p-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          key={currentArtwork.id}
          src={currentArtwork.imageUrl} 
          alt={currentArtwork.title} 
          className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-700 shadow-2xl"
        />
        
        {/* Info Overlay on Hover */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black via-black/80 to-transparent transition-all duration-500 transform ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
          }`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl text-amber-50 mb-2 drop-shadow-2xl">{currentArtwork.title}</h2>
            <p className="text-xl text-amber-200/70 italic drop-shadow-lg">
              {currentArtwork.artist}{currentArtwork.year ? `, ${currentArtwork.year}` : ''}
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-white/30 text-[10px] uppercase tracking-[0.3em]">
              <span>Capítulo {currentArtwork.chapter}</span>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <span>{currentArtwork.museumName || "Museo del Prado"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contador */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/20 text-xs font-mono tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
        {currentIndex + 1} / {artworks.length}
      </div>
    </div>
  );
};

export default ImmersiveGallery;
