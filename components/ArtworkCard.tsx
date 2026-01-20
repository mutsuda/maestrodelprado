
import React from 'react';
import { Artwork } from '../types';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onClick }) => {
  return (
    <div 
      onClick={() => onClick(artwork)}
      className="group relative overflow-hidden rounded-lg bg-slate-900/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer border border-slate-800/50"
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="font-serif text-lg text-amber-50 leading-tight mb-1 drop-shadow-lg">
          {artwork.title}
        </h3>
        <p className="text-slate-400 text-xs italic tracking-wide uppercase font-medium group-hover:text-amber-200/70 transition-colors">
          {artwork.artist}
        </p>
      </div>
    </div>
  );
};

export default ArtworkCard;
