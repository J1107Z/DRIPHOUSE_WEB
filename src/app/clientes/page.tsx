'use client';

import React, { useState } from 'react';
import { CheckCircle2, Sparkles, ZoomIn } from 'lucide-react';
import { CLIENTES_GALLERY, ClienteTestimonio } from '@/data/clientes';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ClientesPage() {
  const [selectedItem, setSelectedItem] = useState<ClienteTestimonio | null>(null);

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto space-y-10">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Comunidad Verificada &bull; Testimonios Reales
          </span>
          <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-wide mt-1">
            Clientes Drip House
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
            Galería de testimonios reales de clientes que ya recibieron sus prendas y
            accesorios exclusivos.
          </p>
        </div>

        <a
          href="https://www.instagram.com/driphouse_imports/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition shrink-0"
        >
          <InstagramIcon className="w-4 h-4" />
          <span>Etiquétanos en @driphouse_imports</span>
        </a>
      </div>

      {/* Galería estilo testimonios mapeada desde ./Clientes/ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLIENTES_GALLERY.map((cliente) => (
          <article
            key={cliente.id}
            onClick={() => setSelectedItem(cliente)}
            className="group marble-card rounded-2xl border border-zinc-800/90 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-[0_12px_35px_rgba(255,255,255,0.08)] flex flex-col justify-between"
          >
            <div className="relative aspect-3/4 w-full overflow-hidden bg-black">
              <img
                src={cliente.image}
                alt={`Testimonio ${cliente.handle}`}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-xs border border-zinc-700 text-[11px] font-semibold text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  {cliente.handle}
                </span>
                <span className="p-2 rounded-full bg-black/75 border border-zinc-700 text-zinc-300 group-hover:text-white">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-300">
                  {cliente.verifiedPiece}
                </span>
                <p className="text-sm font-medium text-white leading-snug">
                  &ldquo;{cliente.quote}&rdquo;
                </p>
              </div>
            </div>

            <div className="px-4 py-3 bg-zinc-950/90 border-t border-zinc-800/80 flex items-center justify-center text-[11px] text-zinc-400">
              <span className="inline-flex items-center gap-1.5 uppercase tracking-widest font-semibold text-zinc-300 group-hover:text-white transition">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                Compra Verificada ✓
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="max-w-lg w-full marble-card rounded-2xl border border-zinc-700 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
              <div>
                <p className="text-xs font-bold text-white">{selectedItem.handle}</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                  {selectedItem.verifiedPiece}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 hover:text-white"
              >
                Cerrar ✕
              </button>
            </div>
            <div className="bg-black max-h-[75vh] flex items-center justify-center overflow-hidden">
              <img
                src={selectedItem.image}
                alt={selectedItem.quote}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 text-center text-xs text-zinc-300 border-t border-zinc-800">
              &ldquo;{selectedItem.quote}&rdquo;
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
