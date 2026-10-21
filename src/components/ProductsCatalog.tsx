'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  RotateCcw,
  Search,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Tag,
  Layers,
  Ruler,
} from 'lucide-react';
import {
  BRANDS,
  CATEGORIES,
  SIZES,
  Brand,
  Category,
  Size,
  Product,
} from '@/types/product';
import { PRODUCTS, formatCOP } from '@/data/products';

type PriceSort = 'default' | 'asc' | 'desc';
type StockFilter = 'all' | 'inStock' | 'outOfStock';

export default function ProductsCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Estados de React para los 5 filtros requeridos + búsqueda
  const [selectedBrand, setSelectedBrand] = useState<Brand | 'Todas'>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todas'>('Todas');
  const [priceSort, setPriceSort] = useState<PriceSort>('default');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [selectedSize, setSelectedSize] = useState<Size | 'Todas'>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Sincronizar el filtro de marca desde el query param ?brand= al entrar desde el Home
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam && BRANDS.includes(brandParam as Brand)) {
      setSelectedBrand(brandParam as Brand);
    } else if (!brandParam) {
      setSelectedBrand('Todas');
    }
  }, [searchParams]);

  const handleBrandChange = (brand: Brand | 'Todas') => {
    setSelectedBrand(brand);
    if (brand === 'Todas') {
      router.replace('/productos', { scroll: false });
    } else {
      router.replace(`/productos?brand=${encodeURIComponent(brand)}`, { scroll: false });
    }
  };

  const resetAllFilters = () => {
    setSelectedBrand('Todas');
    setSelectedCategory('Todas');
    setPriceSort('default');
    setStockFilter('all');
    setSelectedSize('Todas');
    setSearchQuery('');
    router.replace('/productos', { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Filtro por Marca
    if (selectedBrand !== 'Todas') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // 2. Filtro por Categoría
    if (selectedCategory !== 'Todas') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 4. Filtro por Disponibilidad (En existencia / Agotado)
    if (stockFilter === 'inStock') {
      result = result.filter((p) => p.inStock === true);
    } else if (stockFilter === 'outOfStock') {
      result = result.filter((p) => p.inStock === false);
    }

    // 5. Filtro por Talla (XS, S, M, L, XL)
    if (selectedSize !== 'Todas') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // Búsqueda opcional por texto
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    // 3. Ordenamiento por Precio (Menor a Mayor / Mayor a Menor)
    if (priceSort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    selectedBrand,
    selectedCategory,
    priceSort,
    stockFilter,
    selectedSize,
    searchQuery,
  ]);

  const hasActiveFilters =
    selectedBrand !== 'Todas' ||
    selectedCategory !== 'Todas' ||
    priceSort !== 'default' ||
    stockFilter !== 'all' ||
    selectedSize !== 'Todas' ||
    searchQuery.trim() !== '';

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto space-y-8">
      {/* Encabezado de la Bóveda de Productos */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
            Catálogo Oficial &bull; Filtros Dinámicos
          </p>
          <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-wide mt-1">
            {selectedBrand === 'Todas' ? 'Bóveda de Productos' : `Colección ${selectedBrand}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar prenda, marca o referencia..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition"
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-white hover:text-black text-xs font-semibold uppercase tracking-wider transition shrink-0"
              title="Restablecer todos los filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Panel de los 5 Filtros Dinámicos Requeridos */}
      <section
        aria-label="Filtros de productos"
        className="marble-card rounded-2xl border border-zinc-800/90 p-5 sm:p-6 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-zinc-200">
            <Filter className="w-4 h-4 text-white" />
            <span>Filtros del Catálogo</span>
          </div>
          <span className="text-xs text-zinc-400">
            Mostrando <strong className="text-white">{filteredProducts.length}</strong> de{' '}
            {PRODUCTS.length} piezas
          </span>
        </div>

        {/* 1. Filtro por Marca */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
            <Tag className="w-3.5 h-3.5 text-zinc-300" />
            <span>1. Marca</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleBrandChange('Todas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                selectedBrand === 'Todas'
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
              }`}
            >
              Todas
            </button>
            {BRANDS.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => handleBrandChange(brand)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                  selectedBrand === brand
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Fila de Filtros 2, 3, 4 y 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2 border-t border-zinc-900">
          {/* 2. Filtro por Categoría */}
          <div className="space-y-2">
            <label
              htmlFor="filter-category"
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-300" />
              <span>2. Categoría</span>
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | 'Todas')}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-white focus:outline-none focus:border-zinc-400 transition"
            >
              <option value="Todas">Todas las Categorías</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filtro por Precio (Ordenamiento) */}
          <div className="space-y-2">
            <label
              htmlFor="filter-price"
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-300" />
              <span>3. Ordenar por Precio</span>
            </label>
            <select
              id="filter-price"
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as PriceSort)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-white focus:outline-none focus:border-zinc-400 transition"
            >
              <option value="default">Orden Predeterminado</option>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
          </div>

          {/* 4. Filtro por Disponibilidad */}
          <div className="space-y-2">
            <label
              htmlFor="filter-stock"
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300" />
              <span>4. Disponibilidad</span>
            </label>
            <select
              id="filter-stock"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as StockFilter)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-white focus:outline-none focus:border-zinc-400 transition"
            >
              <option value="all">Todos (En existencia y Agotados)</option>
              <option value="inStock">En existencia</option>
              <option value="outOfStock">Agotado</option>
            </select>
          </div>

          {/* 5. Filtro por Talla (XS, S, M, L, XL) */}
          <div className="space-y-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
              <Ruler className="w-3.5 h-3.5 text-zinc-300" />
              <span>5. Talla</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedSize('Todas')}
                className={`px-2.5 py-2 rounded-lg text-[11px] font-bold uppercase transition border ${
                  selectedSize === 'Todas'
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                Todas
              </button>
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    setSelectedSize(selectedSize === size ? 'Todas' : size)
                  }
                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase transition border ${
                    selectedSize === size
                      ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cuadrícula de Productos */}
      {filteredProducts.length === 0 ? (
        <div className="marble-card rounded-2xl border border-zinc-800/80 p-12 text-center space-y-4">
          <p className="font-gothic text-3xl text-zinc-300">
            Sin coincidencias en la bóveda
          </p>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            No encontramos productos con la combinación actual de filtros. Prueba cambiando
            la marca, categoría, disponibilidad o talla.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mostrar Todo el Catálogo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const whatsappText = encodeURIComponent(
              `Hola DRIP HOUSE 🖤, me interesa la pieza "${product.name}" (${product.brand} - ${product.category}) con precio ${formatCOP(product.price)}. ¿Está disponible?`
            );

            return (
              <article
                key={product.id}
                className="group marble-card rounded-xl border border-zinc-800/90 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-[0_12px_35px_rgba(255,255,255,0.07)]"
              >
                <div>
                  {/* Imagen del Producto */}
                  <div
                    onClick={() => setActiveProductModal(product)}
                    className="relative aspect-square w-full overflow-hidden bg-zinc-950 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
                        !product.inStock ? 'opacity-50 grayscale' : ''
                      }`}
                    />

                    {/* Badges superiores: Marca y Categoría */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 rounded bg-black/85 backdrop-blur-xs border border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-white">
                        {product.brand}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-zinc-900/90 backdrop-blur-xs border border-zinc-800 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                        {product.category}
                      </span>
                    </div>

                    {/* Badge de Disponibilidad */}
                    <div className="absolute bottom-3 left-3 pointer-events-none">
                      {product.inStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/85 border border-zinc-600 text-[10px] font-semibold uppercase tracking-wider text-zinc-100">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          En existencia
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-950/95 border border-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          <XCircle className="w-3 h-3 text-zinc-500" />
                          Agotado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Información del Producto */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                        REF: {product.id.toUpperCase()}
                      </p>
                      <h2
                        onClick={() => setActiveProductModal(product)}
                        className="text-sm font-bold text-zinc-100 group-hover:text-white line-clamp-2 mt-0.5 cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h2>
                    </div>

                    {/* Tallas disponibles */}
                    <div className="flex items-center flex-wrap gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 mr-1">
                        Tallas:
                      </span>
                      {product.sizes.map((sz) => (
                        <span
                          key={sz}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            selectedSize === sz
                              ? 'bg-white text-black border-white'
                              : 'bg-zinc-900/90 text-zinc-300 border-zinc-800'
                          }`}
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pie de Tarjeta: Precio y Acción */}
                <div className="px-4 pb-4 pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-500">
                      Precio
                    </span>
                    <span className="text-base font-black tracking-tight text-white">
                      {formatCOP(product.price)}
                    </span>
                  </div>

                  {product.inStock ? (
                    <a
                      href={`https://wa.me/573017600570?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 text-[11px] font-bold uppercase tracking-wider transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Comprar</span>
                    </a>
                  ) : (
                    <span className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 cursor-not-allowed">
                      Sin Stock
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Vista Rápida de Producto */}
      {activeProductModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveProductModal(null)}
        >
          <div
            className="marble-card max-w-2xl w-full rounded-2xl border border-zinc-700 overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square bg-black relative">
              <img
                src={activeProductModal.image}
                alt={activeProductModal.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-white">
                    {activeProductModal.brand}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveProductModal(null)}
                    className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white"
                  >
                    Cerrar ✕
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {activeProductModal.name}
                </h3>
                <p className="text-2xl font-black text-white">
                  {formatCOP(activeProductModal.price)}
                </p>
                <div className="text-xs text-zinc-400 space-y-1 pt-2 border-t border-zinc-800">
                  <p>
                    <strong className="text-zinc-200">Categoría:</strong>{' '}
                    {activeProductModal.category}
                  </p>
                  <p>
                    <strong className="text-zinc-200">Estado:</strong>{' '}
                    {activeProductModal.inStock ? 'En existencia (Envío inmediato)' : 'Agotado'}
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                    Tallas disponibles:
                  </p>
                  <div className="flex gap-2">
                    {activeProductModal.sizes.map((sz) => (
                      <span
                        key={sz}
                        className="px-3 py-1.5 rounded border border-zinc-700 bg-zinc-900 text-xs font-bold text-white"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-800">
                <a
                  href={`https://wa.me/573017600570?text=${encodeURIComponent(
                    `Hola DRIP HOUSE 🖤, quiero pedir "${activeProductModal.name}" (${activeProductModal.brand}) por ${formatCOP(activeProductModal.price)}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
