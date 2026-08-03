import { useMemo } from 'react';
import { useProductsStore } from '@/store/productsStore';

export const useBrands = () => {
  const products = useProductsStore((s) => s.products);

  const brands = useMemo(() => {
    const unique = new Set(products.map((p) => p.marca.trim()).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }, [products]);

  return { brands, total: brands.length };
};
