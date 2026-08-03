import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { generateKeywords, normalizeText } from '../src/utils/text.utils';
import type { Product, ProductCatalog, SearchIndex } from '../src/types';

const HEADER_KEYWORDS = [
  'marca',
  'producto',
  'productos',
  'recomendacion',
  'recomendación',
  'equivalente',
  'aplicacion',
  'aplicación',
  'especificacion',
  'especificación',
];

const CANONICAL_COLUMN_MAP: Record<string, string> = {
  marca: 'marca',
  productos: 'productoOriginal',
  producto: 'productoOriginal',
  productooriginal: 'productoOriginal',
  'producto original': 'productoOriginal',
  recomendacion: 'productoEquivalente',
  recomendación: 'productoEquivalente',
  'producto equivalente': 'productoEquivalente',
  productoequivalente: 'productoEquivalente',
  equivalente: 'productoEquivalente',
  aplicacion: 'aplicacion',
  aplicación: 'aplicacion',
  'aplicacion especificacion': 'aplicacion',
  'aplicación especificación': 'aplicacion',
  'aplicacion // especificacion': 'aplicacion',
  'aplicación // especificación': 'aplicacion',
  especificacion: 'aplicacion',
  especificación: 'aplicacion',
};

interface ParsedRow {
  [key: string]: string;
}

const projectRoot = path.resolve(__dirname, '..');

const resolveExcelPath = (): string => {
  const cliPath = process.argv[2];
  if (cliPath) return path.resolve(cliPath);

  const envPath = process.env.EXCEL_PATH;
  if (envPath) return path.resolve(envPath);

  const defaultPaths = [
    path.join(projectRoot, 'data', 'source', 'catalogo.xlsm'),
    path.join(projectRoot, 'data', 'source', 'catalogo.xlsx'),
    path.join(projectRoot, 'data', 'source', 'Buscador productos.xlsm'),
  ];

  for (const p of defaultPaths) {
    if (fs.existsSync(p)) return p;
  }

  throw new Error(
    'No se encontró archivo Excel. Proporciona la ruta:\n  npm run import-excel -- "ruta/al/archivo.xlsm"',
  );
};

const cleanCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
};

const normalizeHeaderKey = (header: string): string => normalizeText(header);

const toCamelCase = (header: string): string => {
  const normalized = header.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑüÜ\s/]/g, ' ').trim();

  return normalized
    .split(/[\s/]+/)
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
};

const resolveCanonicalKey = (header: string): string => {
  const normalized = normalizeHeaderKey(header);
  if (CANONICAL_COLUMN_MAP[normalized]) {
    return CANONICAL_COLUMN_MAP[normalized];
  }
  return toCamelCase(header);
};

const getMergedCellValue = (
  sheet: XLSX.WorkSheet,
  row: number,
  col: number,
  merges: XLSX.Range[] = [],
): string => {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  const cell = sheet[cellAddress];
  if (cell?.v !== undefined && cell.v !== null && String(cell.v).trim()) {
    return cleanCellValue(cell.v);
  }

  for (const merge of merges) {
    if (row >= merge.s.r && row <= merge.e.r && col >= merge.s.c && col <= merge.e.c) {
      const masterAddress = XLSX.utils.encode_cell({ r: merge.s.r, c: merge.s.c });
      const masterCell = sheet[masterAddress];
      if (masterCell?.v !== undefined) {
        return cleanCellValue(masterCell.v);
      }
    }
  }

  return '';
};

const buildSheetMatrix = (sheet: XLSX.WorkSheet): string[][] => {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const merges = sheet['!merges'] || [];
  const matrix: string[][] = [];

  for (let r = range.s.r; r <= range.e.r; r++) {
    const row: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      row.push(getMergedCellValue(sheet, r, c, merges));
    }
    matrix.push(row);
  }

  return matrix;
};

const isHeaderCandidate = (row: string[]): boolean => {
  const nonEmpty = row.filter((c) => c.trim()).length;
  if (nonEmpty < 2) return false;

  const rowText = normalizeText(row.join(' '));
  const matchCount = HEADER_KEYWORDS.filter((kw) => rowText.includes(kw)).length;
  return matchCount >= 2;
};

const detectHeaderRowIndex = (matrix: string[][]): number => {
  let bestIndex = -1;
  let bestScore = 0;

  for (let i = 0; i < Math.min(30, matrix.length); i++) {
    const row = matrix[i] ?? [];
    const nonEmpty = row.filter((c) => c.trim()).length;
    if (nonEmpty < 2) continue;

    const rowText = normalizeText(row.join(' '));
    const keywordMatches = HEADER_KEYWORDS.filter((kw) => rowText.includes(kw)).length;

    const score = keywordMatches * 10 + nonEmpty;

    if (keywordMatches >= 2 && score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  if (bestIndex === -1) {
    for (let i = 0; i < Math.min(30, matrix.length); i++) {
      const row = matrix[i] ?? [];
      const nonEmpty = row.filter((c) => c.trim()).length;
      if (nonEmpty >= 3 && nonEmpty > bestScore) {
        bestScore = nonEmpty;
        bestIndex = i;
      }
    }
  }

  if (bestIndex === -1) {
    throw new Error('No se pudo detectar la fila de encabezados automáticamente');
  }

  return bestIndex;
};

const detectBestSheet = (workbook: XLSX.WorkBook): { name: string; matrix: string[][] } => {
  let bestSheet: string = workbook.SheetNames[0] ?? '';
  let bestMatrix: string[][] = [];
  let bestDataRows = 0;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet?.['!ref']) continue;

    const matrix = buildSheetMatrix(sheet);
    const headerIndex = detectHeaderRowIndex(matrix);
    const dataRows = matrix.slice(headerIndex + 1).filter((r) => r.some((c) => c.trim())).length;

    if (dataRows > bestDataRows) {
      bestDataRows = dataRows;
      bestSheet = sheetName;
      bestMatrix = matrix;
    }
  }

  if (!bestMatrix.length) {
    throw new Error('No se encontraron datos en el archivo Excel');
  }

  return { name: bestSheet, matrix: bestMatrix };
};

const parseHeaders = (headerRow: string[]): { keys: string[]; originalHeaders: string[] } => {
  const keys: string[] = [];
  const originalHeaders: string[] = [];
  const usedKeys = new Set<string>();

  for (const header of headerRow) {
    const cleaned = cleanCellValue(header);
    if (!cleaned) {
      keys.push('');
      originalHeaders.push('');
      continue;
    }

    const canonical = resolveCanonicalKey(cleaned);
    let finalKey = canonical;

    let counter = 2;
    while (usedKeys.has(finalKey)) {
      finalKey = `${canonical}${counter}`;
      counter++;
    }

    usedKeys.add(finalKey);
    keys.push(finalKey);
    originalHeaders.push(cleaned);
  }

  return { keys, originalHeaders };
};

const parseProducts = (
  matrix: string[][],
  headerIndex: number,
): { products: Product[]; columns: string[] } => {
  const headerRow = matrix[headerIndex] ?? [];
  const { keys, originalHeaders } = parseHeaders(headerRow);
  const columns = keys.filter(Boolean);

  const products: Product[] = [];
  const seen = new Set<string>();
  let id = 1;

  for (let i = headerIndex + 1; i < matrix.length; i++) {
    const row = matrix[i] ?? [];
    const hasData = row.some((cell) => cell.trim());
    if (!hasData) continue;

    const product: ParsedRow = {};
    let hasRequiredField = false;

    for (let col = 0; col < keys.length; col++) {
      const key = keys[col];
      if (!key) continue;

      const value = cleanCellValue(row[col] ?? '');
      if (!value) continue;

      product[key] = value;

      if (['marca', 'productoOriginal', 'productoEquivalente', 'aplicacion'].includes(key)) {
        hasRequiredField = true;
      }
    }

    if (!hasRequiredField) continue;

    const dedupeKey = Object.values(product).join('|||').toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const fullProduct: Product = {
      id,
      marca: product.marca ?? '',
      productoOriginal: product.productoOriginal ?? '',
      productoEquivalente: product.productoEquivalente ?? '',
      aplicacion: product.aplicacion ?? '',
      ...Object.fromEntries(
        Object.entries(product).filter(
          ([key]) =>
            !['marca', 'productoOriginal', 'productoEquivalente', 'aplicacion'].includes(key),
        ),
      ),
    };

    products.push(fullProduct);
    id++;
  }

  return { products, columns };
};

const buildSearchIndex = (products: Product[]): SearchIndex => {
  const entries = products.map((product) => {
    const values = Object.entries(product)
      .filter(([key]) => key !== 'id' && !key.startsWith('_col_'))
      .map(([, value]) => String(value));

    return {
      id: product.id,
      keywords: generateKeywords(values),
    };
  });

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalEntries: entries.length,
    entries,
  };
};

const writeJson = (filePath: string, data: unknown): void => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

const main = (): void => {
  console.log('📊 Iniciando importación de Excel...\n');

  const excelPath = resolveExcelPath();
  console.log(`📁 Archivo: ${excelPath}`);

  const workbook = XLSX.readFile(excelPath, { cellDates: true, cellNF: false, cellText: true });
  const { name: sheetName, matrix } = detectBestSheet(workbook);
  const headerIndex = detectHeaderRowIndex(matrix);

  console.log(`📋 Hoja detectada: "${sheetName}"`);
  console.log(`📌 Fila de encabezados: ${headerIndex + 1} (índice ${headerIndex})`);
  console.log(`📝 Encabezados: ${JSON.stringify(matrix[headerIndex])}`);

  const { products, columns } = parseProducts(matrix, headerIndex);

  const catalog: ProductCatalog = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalProducts: products.length,
    columns,
    products,
  };

  const searchIndex = buildSearchIndex(products);

  const productsOutput = path.join(projectRoot, 'src', 'data', 'productos.json');
  const indexOutput = path.join(projectRoot, 'src', 'data', 'searchIndex.json');

  writeJson(productsOutput, catalog);
  writeJson(indexOutput, searchIndex);

  console.log(`\n✅ Productos importados: ${products.length}`);
  console.log(`✅ Columnas detectadas: ${columns.join(', ')}`);
  console.log(`✅ Índice de búsqueda: ${searchIndex.entries.length} entradas`);
  console.log(`\n📦 Guardado en:`);
  console.log(`   - ${productsOutput}`);
  console.log(`   - ${indexOutput}`);
  console.log('\n🎉 Importación completada exitosamente.');
};

main();
