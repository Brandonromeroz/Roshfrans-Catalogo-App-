import { SEARCH_CONFIG } from '@/constants/config';
import type {
  Product,
  SearchIndex,
  SearchIndexEntry,
} from '@/features/products/types/product.types';
import { normalizeText, tokenize } from '@/utils/text.utils';

export interface SearchResult {
  product: Product;
  score: number;
}

export class SearchService {
  private productsById = new Map<number, Product>();
  private indexById = new Map<number, SearchIndexEntry>();
  private keywordToIds = new Map<string, Set<number>>();

  initialize(products: Product[], searchIndex: SearchIndex): void {
    this.productsById.clear();
    this.indexById.clear();
    this.keywordToIds.clear();

    for (const product of products) {
      this.productsById.set(product.id, product);
    }

    for (const entry of searchIndex.entries) {
      this.indexById.set(entry.id, entry);
      for (const keyword of entry.keywords) {
        if (!this.keywordToIds.has(keyword)) {
          this.keywordToIds.set(keyword, new Set());
        }
        this.keywordToIds.get(keyword)?.add(entry.id);
      }
    }
  }

  search(query: string, limit = SEARCH_CONFIG.MAX_RESULTS): Product[] {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery || normalizedQuery.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
      return [];
    }

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
      return this.fallbackSearch(normalizedQuery, limit);
    }

    let candidateIds: Set<number> | null = null;

    for (const token of queryTokens) {
      const matchingIds = this.findIdsForToken(token);
      if (matchingIds.size === 0) {
        return [];
      }

      if (!candidateIds) {
        candidateIds = new Set(matchingIds);
      } else {
        candidateIds = new Set<number>(
          [...candidateIds].filter((id: number) => matchingIds.has(id)),
        );
      }

      if (candidateIds.size === 0) return [];
    }

    const results: SearchResult[] = [];

    for (const id of candidateIds ?? []) {
      const product = this.productsById.get(id);
      if (!product) continue;

      results.push({
        product,
        score: this.calculateScore(id, queryTokens, normalizedQuery),
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.product);
  }

  getProductById(id: number): Product | undefined {
    return this.productsById.get(id);
  }

  private findIdsForToken(token: string): Set<number> {
    const direct = this.keywordToIds.get(token);
    if (direct) return new Set(direct);

    const partialMatches = new Set<number>();
    for (const [keyword, ids] of this.keywordToIds) {
      if (keyword.includes(token)) {
        ids.forEach((id) => partialMatches.add(id));
      }
    }
    return partialMatches;
  }

  private calculateScore(id: number, tokens: string[], fullQuery: string): number {
    const entry = this.indexById.get(id);
    if (!entry) return 0;

    let score = 0;
    const keywords = entry.keywords;

    for (const token of tokens) {
      if (keywords.includes(token)) score += 10;
      else if (keywords.some((k) => k.includes(token))) score += 5;
    }

    if (keywords.some((k) => k.startsWith(fullQuery))) score += 15;
    if (keywords.includes(fullQuery)) score += 20;

    return score;
  }

  private fallbackSearch(query: string, limit: number): Product[] {
    const results: Product[] = [];
    for (const product of this.productsById.values()) {
      const searchable = Object.values(product)
        .filter((v) => typeof v === 'string')
        .join(' ');
      if (normalizeText(searchable).includes(query)) {
        results.push(product);
        if (results.length >= limit) break;
      }
    }
    return results;
  }
}

export const searchService = new SearchService();
