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
  ChevronDown,
  ChevronUp,
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
type FilterSectionKey = 'marca' | 'categoria' | 'orden' | 'disponibilidad' | 'tallas';

export default function ProductsCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Control de apertura del panel general de filtros y de cada acordeón interno
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<FilterSectionKey, boolean>>({
    marca: false,
    categoria: false,
    orden: false,
    disponibilidad: false,
    tallas: false,
  });

  // Estados de React para los filtros (soporte multi-selección en Marcas y Tallas)
  // Un arreglo vacío [] representa la opción "Todas" activa.
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todas'>('Todas');
  const [priceSort, setPriceSort] = useState<PriceSort>('default');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [modalSelectedSize, setModalSelectedSize] = useState<Size | null>(null);
  const [siteOrigin, setSiteOrigin] = useState<string>('');

  const toggleSection = (key: FilterSectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteOrigin(window.location.origin);
    }
  }, []);

  // Sincronizar el filtro de marca (?brand=) y apertura directa de producto (?product=)
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam && BRANDS.includes(brandParam as Brand)) {
      setSelectedBrands([brandParam as Brand]);
    } else if (!brandParam) {
      setSelectedBrands([]);
    }

    const productParam = searchParams.get('product');
    if (productParam) {
      const found = PRODUCTS.find((p) => p.id === productParam);
      if (found) {
        setActiveProductModal(found);
        setModalSelectedSize(found.sizes[0] ?? null);
      }
    }
  }, [searchParams]);

  const openProductModal = (product: Product) => {
    setActiveProductModal(product);
    setModalSelectedSize(product.sizes[0] ?? null);
  };

  const buildProductWhatsAppUrl = (product: Product, chosenSize?: Size | null) => {
    const origin =
      siteOrigin || (typeof window !== 'undefined' ? window.location.origin : '');
    const productUrl = `${origin}/productos?product=${encodeURIComponent(product.id)}`;
    const imageUrl = `${origin}${encodeURI(product.image)}`;
    const sizeLine = chosenSize ? `\n• Talla: ${chosenSize}` : '';
    const message =
      `Hola DRIP HOUSE 🖤, estoy interesado en este producto:\n` +
      `• Producto: ${product.name} (${product.brand})\n` +
      `• Referencia: ${product.id.toUpperCase()}${sizeLine}\n` +
      `• Precio: ${formatCOP(product.price)}\n` +
      `• Ver producto: ${productUrl}\n` +
      `• Imagen: ${imageUrl}`;
    return `https://wa.me/573017600570?text=${encodeURIComponent(message)}`;
  };

  // Selección de marcas: si se elige "Todas", se limpian las marcas individuales.
  // Si se eligen marcas individuales, "Todas" queda desactivado automáticamente.
  const handleSelectAllBrands = () => {
    setSelectedBrands([]);
    router.replace('/productos', { scroll: false });
  };

  const handleToggleBrand = (brand: Brand) => {
    setSelectedBrands((prev) => {
      const exists = prev.includes(brand);
      const next = exists ? prev.filter((b) => b !== brand) : [...prev, brand];
      return next;
    });
  };

  // Selección de tallas: permite múltiples tallas al mismo tiempo o "Todas"
  const handleSelectAllSizes = () => {
    setSelectedSizes([]);
  };

  const handleToggleSize = (size: Size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategory('Todas');
    setPriceSort('default');
    setStockFilter('all');
    setSelectedSizes([]);
    setSearchQuery('');
    router.replace('/productos', { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Filtro por Marca (múltiples marcas o Todas si está vacío)
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
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

    // 5. Filtro por Tallas (múltiples tallas o Todas si está vacío)
    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((sz) => selectedSizes.includes(sz)));
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
    selectedBrands,
    selectedCategory,
    priceSort,
    stockFilter,
    selectedSizes,
    searchQuery,
  ]);

  const activeFiltersCount =
    (selectedBrands.length > 0 ? 1 : 0) +
    (selectedCategory !== 'Todas' ? 1 : 0) +
    (priceSort !== 'default' ? 1 : 0) +
    (stockFilter !== 'all' ? 1 : 0) +
    (selectedSizes.length > 0 ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0 || searchQuery.trim() !== '';

  const headerTitle =
    selectedBrands.length === 0
      ? 'Bóveda de Productos'
      : selectedBrands.length === 1
        ? `Colección ${selectedBrands[0]}`
        : `Colección (${selectedBrands.length} Marcas)`;

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto space-y-6">
      {/* Encabezado de la Bóveda de Productos */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
            Catálogo Oficial &bull; Mostrando{' '}
            <strong className="text-white">{filteredProducts.length}</strong> de{' '}
            {PRODUCTS.length} piezas
          </p>
          <h1 className="font-gothic text-4xl sm:text-5xl text-white tracking-wide mt-1">
            {headerTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Buscador */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar prenda, marca o referencia..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition"
            />
          </div>

          {/* Botón para desplegar/ocultar el apartado de filtros */}
          <button
            type="button"
            onClick={() => setFiltersPanelOpen((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition shrink-0 ${
              filtersPanelOpen || activeFiltersCount > 0
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.18)]'
                : 'bg-zinc-950 text-zinc-200 border-zinc-800 hover:border-zinc-500 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none font-black ${
                  filtersPanelOpen || activeFiltersCount > 0
                    ? 'bg-black text-white'
                    : 'bg-zinc-800 text-white'
                }`}
              >
                {activeFiltersCount}
              </span>
            )}
            {filtersPanelOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

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

      {/* Panel de Filtros Desplegable por Acción del Usuario */}
      {filtersPanelOpen && (
        <section
          aria-label="Filtros de productos"
          className="marble-card rounded-2xl border border-zinc-800/90 divide-y divide-zinc-800/80 overflow-hidden"
        >
          {/* 1. Acordeón: Marca (Multi-selección o Todas) */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection('marca')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-zinc-300" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white">
                  Marca
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-400">
                  {selectedBrands.length === 0
                    ? 'Todas'
                    : selectedBrands.join(', ')}
                </span>
                {openSections.marca ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {openSections.marca && (
              <div className="px-5 pb-5 pt-1 space-y-2.5">
                <p className="text-[11px] text-zinc-400">
                  Puedes seleccionar varias marcas al mismo tiempo, o elegir{' '}
                  <strong className="text-zinc-200">Todas</strong> para mostrar todo el catálogo.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllBrands}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                      selectedBrands.length === 0
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    Todas
                  </button>
                  {BRANDS.map((brand) => {
                    const isSelected = selectedBrands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleToggleBrand(brand)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                            : 'bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Acordeón: Categoría */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection('categoria')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-zinc-300" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white">
                  Categoría
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-400">{selectedCategory}</span>
                {openSections.categoria ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {openSections.categoria && (
              <div className="px-5 pb-5 pt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Todas')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                    selectedCategory === 'Todas'
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                  }`}
                >
                  Todas
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                      selectedCategory === category
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Acordeón: Orden */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection('orden')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <ArrowUpDown className="w-4 h-4 text-zinc-300" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white">
                  Orden
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-400">
                  {priceSort === 'default'
                    ? 'Predeterminado'
                    : priceSort === 'asc'
                      ? 'Menor a Mayor'
                      : 'Mayor a Menor'}
                </span>
                {openSections.orden ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {openSections.orden && (
              <div className="px-5 pb-5 pt-1 flex flex-wrap gap-2">
                {[
                  { value: 'default', label: 'Orden Predeterminado' },
                  { value: 'asc', label: 'Precio: Menor a Mayor' },
                  { value: 'desc', label: 'Precio: Mayor a Menor' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriceSort(opt.value as PriceSort)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                      priceSort === opt.value
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Acordeón: Disponibilidad */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection('disponibilidad')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-zinc-300" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white">
                  Disponibilidad
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-400">
                  {stockFilter === 'all'
                    ? 'Todos'
                    : stockFilter === 'inStock'
                      ? 'En existencia'
                      : 'Agotado'}
                </span>
                {openSections.disponibilidad ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {openSections.disponibilidad && (
              <div className="px-5 pb-5 pt-1 flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Todos (En existencia y Agotados)' },
                  { value: 'inStock', label: 'En existencia' },
                  { value: 'outOfStock', label: 'Agotado' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStockFilter(opt.value as StockFilter)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition border ${
                      stockFilter === opt.value
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'bg-zinc-950/90 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Acordeón: Tallas (Multi-selección o Todas) */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection('tallas')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <Ruler className="w-4 h-4 text-zinc-300" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white">
                  Tallas
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-400">
                  {selectedSizes.length === 0 ? 'Todas' : selectedSizes.join(', ')}
                </span>
                {openSections.tallas ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {openSections.tallas && (
              <div className="px-5 pb-5 pt-1 space-y-2.5">
                <p className="text-[11px] text-zinc-400">
                  Selecciona una o varias tallas simultáneamente.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllSizes}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition border ${
                      selectedSizes.length === 0
                        ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    Todas
                  </button>
                  {SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition border ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-500 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

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
            return (
              <article
                key={product.id}
                className="group marble-card rounded-xl border border-zinc-800/90 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-[0_12px_35px_rgba(255,255,255,0.07)]"
              >
                <div>
                  {/* Imagen del Producto */}
                  <div
                    onClick={() => openProductModal(product)}
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
                        onClick={() => openProductModal(product)}
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
                            selectedSizes.includes(sz)
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
                      href={buildProductWhatsAppUrl(product)}
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
                    <strong className="text-zinc-200">Referencia:</strong>{' '}
                    {activeProductModal.id.toUpperCase()}
                  </p>
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
                    Selecciona tu talla:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeProductModal.sizes.map((sz) => {
                      const isPicked = modalSelectedSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setModalSelectedSize(sz)}
                          className={`px-3 py-1.5 rounded border text-xs font-bold transition ${
                            isPicked
                              ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                              : 'border-zinc-700 bg-zinc-900 text-white hover:border-zinc-400'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-800">
                <a
                  href={buildProductWhatsAppUrl(activeProductModal, modalSelectedSize)}
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
