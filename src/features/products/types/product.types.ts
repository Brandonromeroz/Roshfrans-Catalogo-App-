export interface Product {
  id: number;
  marca: string;
  productoOriginal: string;
  productoEquivalente: string;
  aplicacion: string;
  [key: string]: string | number;
}

export interface SearchIndexEntry {
  id: number;
  keywords: string[];
}

export interface ProductCatalog {
  version: string;
  generatedAt: string;
  totalProducts: number;
  columns: string[];
  products: Product[];
}

export interface SearchIndex {
  version: string;
  generatedAt: string;
  totalEntries: number;
  entries: SearchIndexEntry[];
}
