export type Brand =
  | 'Godspeed'
  | 'Jordan'
  | 'Nike'
  | 'Life Hustlers'
  | 'Mixed Emotion'
  | 'Prestige'
  | 'Sneakers'
  | 'Sprayground';

export type Category = 'Bolso' | 'Zapatos' | 'Camisas' | 'Hoodie' | 'Gorras';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface Product {
  id: string;
  image: string;
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  sizes: Size[];
  inStock: boolean;
}

export const BRANDS: Brand[] = [
  'Godspeed',
  'Jordan',
  'Nike',
  'Life Hustlers',
  'Mixed Emotion',
  'Prestige',
  'Sneakers',
  'Sprayground',
];

export const CATEGORIES: Category[] = [
  'Bolso',
  'Zapatos',
  'Camisas',
  'Hoodie',
  'Gorras',
];

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL'];
