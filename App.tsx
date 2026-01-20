
import React, { useState, useMemo, useEffect } from 'react';
import { ARTWORKS as INITIAL_DATA } from './data';
import { Artwork } from './types';
import { fetchNotionArtworks } from './services/notionService';
import ArtworkCard from './components/ArtworkCard';
import ArtworkModal from './components/ArtworkModal';
import ImmersiveGallery from './components/ImmersiveGallery';

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChapter, setActiveChapter] = useState<number | 'all'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchNotionArtworks();
        if (data && data.length > 0) {
          setArtworks(data);
          setError(null);
        } else {
          setError("Catálogo sincronizado.");
        }
      } catch (err: any) {
        console.warn("Error en la carga:", err);
        setError("Error de red. Mostrando catálogo local.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const chapters = useMemo(() => {
    const uniqueChapters = Array.from(new Set(artworks.map(a => a.chapter)))
      .filter((ch): ch is number => typeof ch === 'number' && !isNaN(ch))
      .sort((a: number, b: number) => a - b);
    return uniqueChapters;
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    const query = String(searchQuery || "").toLowerCase().trim();
    return artworks.filter(artwork => {
      const title = String(artwork.title || "").toLowerCase();
      const artist = String(artwork.artist || "").toLowerCase();
      const matchesSearch = title.includes(query) || artist.includes(query);
      const matchesChapter = activeChapter === 'all' || artwork.chapter === activeChapter;
      return matchesSearch && matchesChapter;
    });
  }, [searchQuery, activeChapter, artworks]);

  const selectedIndex = useMemo(() => {
    if (!selectedArtwork) return -1;
    return filteredArtworks.findIndex(a => a.id === selectedArtwork.id);
  }, [selectedArtwork, filteredArtworks]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-600/30">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => {setActiveChapter('all'); setSearchQuery('');}}>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-900 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-amber-900/40 transition-all">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-amber-50 tracking-tight">Prado Companion</h1>
                <p className="text-[9px] text-amber-600 tracking-[0.3em] uppercase font-black opacity-80 leading-none mt-1">El Maestro del Prado</p>
              </div>
            </div>

            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Busca por obra o artista..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm backdrop-blur-sm placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-16 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center justify-center gap-2 min-w-max">
            <button
              onClick={() => setActiveChapter('all')}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeChapter === 'all' 
                  ? 'bg-amber-600 text-white shadow-lg' 
                  : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              Catálogo
            </button>
            {chapters.map(ch => (
              <button
                key={ch}
                onClick={() => setActiveChapter(ch)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeChapter === ch 
                    ? 'bg-amber-600 text-white shadow-lg' 
                    : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
              >
                Cap. {ch}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-2 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="font-serif italic text-lg text-slate-500 mt-6 animate-pulse">Abriendo los archivos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredArtworks.map(artwork => (
              <ArtworkCard 
                key={artwork.id} 
                artwork={artwork} 
                onClick={setSelectedArtwork} 
              />
            ))}
          </div>
        )}

        {!loading && filteredArtworks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-serif text-slate-500 italic">No se encontraron obras con ese criterio</h3>
            <button 
              onClick={() => {setSearchQuery(''); setActiveChapter('all');}}
              className="mt-6 text-amber-500 text-xs font-bold uppercase tracking-widest hover:text-amber-400 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </main>

      <footer className="mt-20 py-20 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-serif text-slate-500 text-lg italic max-w-xl mx-auto leading-relaxed">
            "Para quien sabe mirar, el Prado no es un museo, es una revelación."
          </p>
        </div>
      </footer>

      <ArtworkModal 
        artwork={selectedArtwork} 
        onClose={() => setSelectedArtwork(null)} 
        onExpand={() => setIsGalleryOpen(true)}
      />

      {isGalleryOpen && selectedIndex !== -1 && (
        <ImmersiveGallery 
          artworks={filteredArtworks}
          initialIndex={selectedIndex}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
