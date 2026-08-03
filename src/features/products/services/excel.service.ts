/**
 * Excel import is handled by scripts/importExcel.ts at build time.
 * This service documents the import contract and validates catalog metadata at runtime.
 */
import type { ProductCatalog } from '@/features/products/types/product.types';

export class ExcelService {
  static validateCatalog(catalog: ProductCatalog): boolean {
    if (!catalog?.products || !Array.isArray(catalog.products)) return false;
    if (catalog.products.length === 0) return false;
    return catalog.products.every(
      (p) =>
        typeof p.id === 'number' &&
        typeof p.marca === 'string' &&
        typeof p.productoOriginal === 'string',
    );
  }

  static getCatalogStats(catalog: ProductCatalog) {
    return {
      total: catalog.totalProducts,
      columns: catalog.columns,
      generatedAt: catalog.generatedAt,
      version: catalog.version,
    };
  }
}
