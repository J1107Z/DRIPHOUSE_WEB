import productsData from './products.json';
import { Product } from '@/types/product';

export const PRODUCTS: Product[] = productsData as Product[];

export function formatCOP(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);
}
