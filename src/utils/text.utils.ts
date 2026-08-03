export const removeAccents = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const normalizeText = (text: string): string =>
  removeAccents(String(text ?? ''))
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

export const tokenize = (text: string): string[] => {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  return normalized
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
};

export const generateKeywords = (values: string[]): string[] => {
  const keywords = new Set<string>();

  for (const value of values) {
    if (!value?.trim()) continue;

    const normalized = normalizeText(value);
    if (normalized) keywords.add(normalized);

    for (const token of tokenize(value)) {
      keywords.add(token);
    }
  }

  return Array.from(keywords).sort();
};

export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export const highlightSearch = (text: string, query: string): HighlightSegment[] => {
  if (!query.trim()) {
    return [{ text, highlighted: false }];
  }

  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return [{ text, highlighted: false }];
  }

  const pattern = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi',
  );
  const parts = text.split(pattern).filter(Boolean);

  return parts.map((part) => ({
    text: part,
    highlighted: tokens.some((token) => normalizeText(part).includes(token)),
  }));
};
