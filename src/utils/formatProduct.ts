import type { Product } from '@/features/products/types/product.types';

const CANONICAL_FIELDS = [
  'marca',
  'productoOriginal',
  'productoEquivalente',
  'aplicacion',
] as const;

export const formatProduct = (product: Product): Record<string, string> => {
  const formatted: Record<string, string> = {};

  for (const [key, value] of Object.entries(product)) {
    if (key === 'id') continue;
    if (value === null || value === undefined) continue;
    formatted[key] = String(value).trim();
  }

  return formatted;
};

export const getProductDisplayFields = (
  product: Product,
): { label: string; value: string; key: string }[] => {
  const formatted = formatProduct(product);
  const entries = Object.entries(formatted);

  const canonical = CANONICAL_FIELDS.filter((field) => formatted[field]).map((field) => ({
    key: field,
    label: getFieldLabel(field),
    value: formatted[field] ?? '',
  }));

  const additional = entries
    .filter(([key]) => !CANONICAL_FIELDS.includes(key as (typeof CANONICAL_FIELDS)[number]))
    .map(([key, value]) => ({
      key,
      label: formatFieldLabel(key),
      value,
    }));

  return [...canonical, ...additional];
};

const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    marca: 'Marca',
    productoOriginal: 'Producto Original',
    productoEquivalente: 'Producto Equivalente',
    aplicacion: 'Aplicación',
  };
  return labels[field] ?? formatFieldLabel(field);
};

const formatFieldLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());

export const getProductSearchableValues = (product: Product): string[] =>
  Object.entries(product)
    .filter(([key]) => key !== 'id')
    .map(([, value]) => String(value ?? ''))
    .filter(Boolean);
