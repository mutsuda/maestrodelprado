
import React from 'react';
import { Artwork } from '../types';

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onExpand: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose, onExpand }) => {
  if (!artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 cursor-zoom-out" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div 
          className="relative h-64 md:h-auto md:w-3/5 overflow-hidden bg-black group cursor-zoom-in"
          onClick={onExpand}
        >
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title} 
            className="w-full h-full object-cover md:object-contain transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-amber-600/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Ver en Detalle
            </div>
          </div>
        </div>

        <div className="p-8 md:w-2/5 overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              <span>Orden #{artwork.order}</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span>Capítulo {artwork.chapter}</span>
            </div>
            <h2 className="font-serif text-3xl text-amber-50 mb-1 leading-tight">{artwork.title}</h2>
            <p className="text-xl text-amber-200/60 italic font-light">{artwork.artist}{artwork.year ? `, ${artwork.year}` : ''}</p>
          </div>

          {artwork.description && (
            <div className="mb-8">
              <p className="text-slate-400 leading-relaxed italic text-sm border-l border-amber-900/30 pl-4 py-1">
                {artwork.description}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {artwork.museumUrl && (
              <a 
                href={artwork.museumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20"
              >
                Visitar Museo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            
            <div className="text-center">
              <span className="text-slate-600 text-[9px] uppercase tracking-widest">Procedencia: {artwork.museumName || "Desconocida"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;
