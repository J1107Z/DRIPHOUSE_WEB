import React, { Suspense } from 'react';
import ProductsCatalog from '@/components/ProductsCatalog';

export default function ProductosPage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-16 text-center text-sm uppercase tracking-[0.3em] text-zinc-400">
          Cargando bóveda de productos...
        </div>
      }
    >
      <ProductsCatalog />
    </Suspense>
  );
}
