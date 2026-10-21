import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { BRANDS, Brand } from '@/types/product';
import { PRODUCTS } from '@/data/products';
import BrandLogo from '@/components/BrandLogo';

export default function HomePage() {
  const getCountByBrand = (brand: Brand) =>
    PRODUCTS.filter((p) => p.brand === brand).length;

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto space-y-14">
      {/* Hero Banner con estética de mármol clásico y oscuro */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-black shadow-2xl">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src="/LOGO_1_%20TipoLetra.png"
            alt="DRIP HOUSE Monumento de Mármol"
            className="h-full w-full object-cover object-center opacity-75 scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        <div className="relative -mt-28 sm:-mt-32 px-6 pb-8 sm:px-10 sm:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900/90 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              Luxury Streetwear Sanctuary
            </span>
            <h1 className="font-gothic text-5xl sm:text-6xl md:text-7xl text-white tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              Drip House
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
              Arquitectura clásica en mármol oscuro y la curaduría más exclusiva de ropa,
              gorras, bolsos y sneakers importados. Selecciona una casa o marca para
              explorar su bóveda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-[0.25em] hover:bg-zinc-200 transition shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              <span>Ver Catálogo General</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Responsivo de Logotipos de las Marcas */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
              Casas Oficiales &amp; Colecciones
            </p>
            <h2 className="font-gothic text-3xl sm:text-4xl text-white tracking-wide mt-1">
              Selecciona tu Marca
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Haz clic en cualquier logotipo para abrir el catálogo filtrado por esa marca.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANDS.map((brand) => {
            const count = getCountByBrand(brand);
            return (
              <Link
                key={brand}
                href={`/productos?brand=${encodeURIComponent(brand)}`}
                className="group marble-card relative flex flex-col justify-between rounded-xl border border-zinc-800/90 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_10px_35px_rgba(255,255,255,0.08)] overflow-hidden"
              >
                {/* Brillo sutil superior en hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  <span>{count} Piezas</span>
                  <span className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-white transition">
                    Explorar
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                {/* Logotipo oficial de la marca */}
                <div className="my-6 flex h-32 items-center justify-center overflow-hidden rounded-lg border border-zinc-800/70 bg-black p-3 text-zinc-200 group-hover:border-zinc-600 group-hover:text-white transition-all">
                  <BrandLogo
                    brand={brand}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="border-t border-zinc-800/70 pt-4 text-center">
                  <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white">
                    {brand}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sellos de Garantía DRIP HOUSE */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        <div className="marble-card rounded-xl border border-zinc-800/80 p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              100% Exclusividad Garantizada
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Piezas importadas seleccionadas una a una para garantizar autenticidad y estado impecable.
            </p>
          </div>
        </div>

        <div className="marble-card rounded-xl border border-zinc-800/80 p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Envíos Seguros a Todo el País
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Despachos rápidos y protegidos con seguimiento directo a través de nuestras líneas de WhatsApp.
            </p>
          </div>
        </div>

        <div className="marble-card rounded-xl border border-zinc-800/80 p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Atención Personalizada VIP
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Asesoría de tallas, disponibilidad en tiempo real y pedidos directos con nuestro equipo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
