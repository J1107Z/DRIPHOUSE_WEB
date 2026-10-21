'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  Phone,
  Users,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isHovered || mobileOpen;
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Barra superior móvil */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3"
        >
          <img
            src="/LOGO_2_(boton-ome).jpg"
            alt="DRIP HOUSE Home"
            className="h-10 w-10 object-cover rounded border border-zinc-700"
          />
          <span className="font-gothic text-2xl tracking-wider text-white">
            Drip House
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md border border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:text-white hover:border-zinc-600 transition"
          aria-label="Abrir menú de navegación"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay móvil */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Fijo a la Izquierda (Auto-replegable y desplegable con hover) */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 z-50 h-screen bg-zinc-950/95 border-r border-zinc-800/80 flex flex-col justify-between overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out marble-sidebar ${
          mobileOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'
        } ${
          isHovered
            ? 'lg:w-80 lg:shadow-[12px_0_45px_rgba(0,0,0,0.9)]'
            : 'lg:w-20'
        }`}
      >
        <div className={isExpanded ? 'p-6 space-y-7' : 'p-3 py-6 space-y-6'}>
          {/* 1. Botón Home con ./LOGO_2_(boton-ome).jpg */}
          <div className="flex flex-col items-center border-b border-zinc-800/80 pb-6">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`group relative block overflow-hidden rounded-lg border border-zinc-800 bg-black transition-all duration-300 hover:border-zinc-400 hover:shadow-[0_0_25px_rgba(255,255,255,0.12)] ${
                isExpanded ? 'w-full p-2' : 'w-12 h-12 p-1 flex items-center justify-center'
              }`}
              title="Ir al Inicio - DRIP HOUSE"
            >
              <div className="flex items-center justify-center overflow-hidden rounded bg-black w-full h-full">
                <img
                  src="/LOGO_2_(boton-ome).jpg"
                  alt="DRIP HOUSE Botón Home"
                  className={`object-contain transition-transform duration-500 group-hover:scale-105 ${
                    isExpanded ? 'h-28 w-full' : 'h-10 w-10'
                  }`}
                />
              </div>
              {isExpanded && (
                <div className="mt-2 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.28em] text-zinc-400 group-hover:text-zinc-200 whitespace-nowrap">
                  <span>Luxury Streetwear</span>
                  <span>HOME</span>
                </div>
              )}
            </Link>
          </div>

          {/* 2. Navegación Principal */}
          <nav className="space-y-2" aria-label="Navegación Principal">
            {isExpanded && (
              <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-3 whitespace-nowrap">
                Navegación
              </p>
            )}

            {/* Inicio */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              title="Inicio"
              className={`flex items-center rounded-lg text-sm font-medium tracking-wider uppercase transition-all ${
                isExpanded ? 'gap-3.5 px-4 py-3' : 'justify-center p-3'
              } ${
                isActive('/')
                  ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'text-zinc-300 hover:bg-zinc-900 hover:text-white border border-transparent hover:border-zinc-800'
              }`}
            >
              <Home className={isExpanded ? 'w-4 h-4 shrink-0' : 'w-5 h-5 shrink-0'} />
              {isExpanded && <span className="whitespace-nowrap">Inicio</span>}
            </Link>

            {/* Productos */}
            <Link
              href="/productos"
              onClick={() => setMobileOpen(false)}
              title="Productos"
              className={`flex items-center rounded-lg text-sm font-medium tracking-wider uppercase transition-all ${
                isExpanded ? 'justify-between px-4 py-3' : 'justify-center p-3'
              } ${
                isActive('/productos')
                  ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'text-zinc-300 hover:bg-zinc-900 hover:text-white border border-transparent hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <ShoppingBag className={isExpanded ? 'w-4 h-4 shrink-0' : 'w-5 h-5 shrink-0'} />
                {isExpanded && <span className="whitespace-nowrap">Productos</span>}
              </div>
              {isExpanded && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-widest ${
                    isActive('/productos')
                      ? 'bg-black text-white'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Catálogo
                </span>
              )}
            </Link>

            {/* Contacto */}
            <Link
              href="/contacto"
              onClick={() => setMobileOpen(false)}
              title="Contacto"
              className={`flex items-center rounded-lg text-sm font-medium tracking-wider uppercase transition-all ${
                isExpanded ? 'gap-3.5 px-4 py-3' : 'justify-center p-3'
              } ${
                isActive('/contacto')
                  ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'text-zinc-300 hover:bg-zinc-900 hover:text-white border border-transparent hover:border-zinc-800'
              }`}
            >
              <Phone className={isExpanded ? 'w-4 h-4 shrink-0' : 'w-5 h-5 shrink-0'} />
              {isExpanded && <span className="whitespace-nowrap">Contacto</span>}
            </Link>

            {/* Clientes */}
            <Link
              href="/clientes"
              onClick={() => setMobileOpen(false)}
              title="Clientes"
              className={`flex items-center rounded-lg text-sm font-medium tracking-wider uppercase transition-all ${
                isExpanded ? 'gap-3.5 px-4 py-3' : 'justify-center p-3'
              } ${
                isActive('/clientes')
                  ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'text-zinc-300 hover:bg-zinc-900 hover:text-white border border-transparent hover:border-zinc-800'
              }`}
            >
              <Users className={isExpanded ? 'w-4 h-4 shrink-0' : 'w-5 h-5 shrink-0'} />
              {isExpanded && <span className="whitespace-nowrap">Clientes</span>}
            </Link>
          </nav>
        </div>

        {/* Pie del Sidebar */}
        <div className={`border-t border-zinc-900/90 bg-black/50 ${isExpanded ? 'p-6' : 'p-3 py-5 flex justify-center'}`}>
          <div className="flex items-center gap-3">
            <img
              src="/ICONOAPP.png?v=2"
              alt="Drip House Monograma"
              className="w-9 h-9 rounded object-cover border border-zinc-800 shrink-0"
            />
            {isExpanded && (
              <div className="whitespace-nowrap">
                <p className="font-gothic text-lg leading-none text-zinc-200">Drip House</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-1">
                  100% Exclusividad
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
