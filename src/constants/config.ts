export const STORAGE_KEYS = {
  FAVORITES: '@catalogo/favorites',
  SEARCH_HISTORY: '@catalogo/search-history',
  SETTINGS: '@catalogo/settings',
} as const;

export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 200,
  MIN_QUERY_LENGTH: 1,
  MAX_HISTORY_ITEMS: 20,
  MAX_RESULTS: 500,
} as const;

export const PAGINATION_CONFIG = {
  PAGE_SIZE: 25,
  LOAD_MORE_THRESHOLD: 0.4,
} as const;

export const IMPORT_CONFIG = {
  DEFAULT_EXCEL_PATH: 'data/source/catalogo.xlsm',
  PRODUCTS_OUTPUT: 'src/data/productos.json',
  SEARCH_INDEX_OUTPUT: 'src/data/searchIndex.json',
} as const;
