import { create } from 'zustand';
import type { Product, ProductCatalog, SearchIndex } from '@/features/products/types/product.types';
import { ExcelService } from '@/features/products/services/excel.service';
import { searchService } from '@/features/products/services/search.service';

interface ProductsState {
  products: Product[];
  catalog: ProductCatalog | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  getProductById: (id: number) => Product | undefined;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  catalog: null,
  isLoading: false,
  isReady: false,
  error: null,

  loadProducts: async () => {
    if (get().isReady) return;

    set({ isLoading: true, error: null });

    try {
      const catalog = (await import('@/data/productos.json')).default as ProductCatalog;
      const searchIndex = (await import('@/data/searchIndex.json')).default as SearchIndex;

      if (!ExcelService.validateCatalog(catalog)) {
        throw new Error('Catálogo de productos inválido');
      }

      searchService.initialize(catalog.products, searchIndex);

      set({
        products: catalog.products,
        catalog,
        isLoading: false,
        isReady: true,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        isReady: false,
        error: error instanceof Error ? error.message : 'Error al cargar productos',
      });
    }
  },

  getProductById: (id: number) => searchService.getProductById(id),
}));
