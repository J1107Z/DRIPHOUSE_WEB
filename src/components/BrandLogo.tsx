import React from 'react';
import { Brand } from '@/types/product';

interface BrandLogoProps {
  brand: Brand;
  className?: string;
}

const BRAND_LOGO_IMAGES: Partial<Record<Brand, string>> = {
  Godspeed: '/Logos Marcas/GODSPEED.jpg',
  Jordan: '/Logos Marcas/JORDAN.jpg',
  Nike: '/Logos Marcas/NIKE.jpg',
  'Life Hustlers': '/Logos Marcas/LIFE_HUSTLERS.png',
  'Mixed Emotion': '/Logos Marcas/MIXED_EMOTION.png',
  Prestige: '/Logos Marcas/PRESTIGE.png',
  Sprayground: '/Logos Marcas/SPRAYGROUND.png',
};

export default function BrandLogo({ brand, className = '' }: BrandLogoProps) {
  const logoSrc = BRAND_LOGO_IMAGES[brand];

  if (logoSrc) {
    return (
      <div className={`flex h-full w-full items-center justify-center select-none ${className}`}>
        <img
          src={logoSrc}
          alt={`Logo ${brand}`}
          className="max-h-24 w-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback para Sneakers (categoría especial de calzado)
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 200 85" className="w-40 h-20 fill-current" aria-hidden="true">
        {/* Silueta High-Top Sneaker */}
        <path
          d="M35 62 L168 62 C172 62 174 56 170 51 L138 42 L110 20 L84 20 L80 34 L56 38 L44 26 L35 30 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <line x1="33" y1="68" x2="172" y2="68" stroke="currentColor" strokeWidth="4" />
        <path d="M75 46 Q98 54 132 45" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <span className="text-xs font-black uppercase tracking-[0.38em] text-zinc-200 mt-1">
        SNEAKERS
      </span>
    </div>
  );
}
