import type { Lang } from '../i18n/config.i18n';
import type { Product, ProductProposal } from '../types/product';

export const BACKEND_CONFIG = {
  baseUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.BACKEND_API_URL) ||
    (typeof process !== 'undefined' && process.env?.BACKEND_API_URL) ||
    'https://webadminsystem.cadimportinc.com/api/v1/content',
  apiKey:
    (typeof import.meta !== 'undefined' && import.meta.env?.BACKEND_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.BACKEND_API_KEY) ||
    '3ee4acb6-750d-429e-956f-0483b2d4efd6',
};

interface BackendItemWrapper {
  id: string;
  data: Product;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendApiResponse {
  status: string;
  message?: string;
  items?: BackendItemWrapper[];
  data?: BackendItemWrapper[] | BackendItemWrapper;
}

/**
 * Realiza una petición GET al backend central de contenido para una colección (products-es o products-en)
 * aplicando los filtros dinámicos mediante query params.
 */
export async function fetchFromBackend(
  lang: Lang,
  queryParams: Record<string, string | number | boolean | undefined> = {}
): Promise<Product[]> {
  const collectionName = `products-${lang}`;
  const cleanBase = (BACKEND_CONFIG.baseUrl || 'https://webadminsystem.cadimportinc.com/api/v1/content').replace(/\/+$/, '');
  const url = new URL(`${cleanBase}/${collectionName}`);

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': BACKEND_CONFIG.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[Backend API] Request to ${url.toString()} failed with status ${response.status}`);
      return [];
    }

    const json: BackendApiResponse = await response.json();
    const rawItems: BackendItemWrapper[] = json.items || (Array.isArray(json.data) ? json.data : []);

    return rawItems
      .map((item) => {
        if (!item) return null;
        const data = (item.data && typeof item.data === 'object') ? item.data : (item as unknown as Product);
        return {
          ...data,
          id: item.id || data.id,
        };
      })
      .filter((p): p is Product => Boolean(p && typeof p === 'object' && (p.slug || p.nombre_marca_del_producto)));
  } catch (error) {
    console.error(`[Backend API] Error fetching from ${url.toString()}:`, error);
    return [];
  }
}

/**
 * Obtiene todos los productos directamente desde el backend central.
 */
export async function getProductsFromBackend(lang: Lang): Promise<Product[]> {
  return await fetchFromBackend(lang);
}

/**
 * Obtiene los productos por categoría directamente desde el backend central
 * enviando clase_categoria en query params.
 */
export async function getProductsByCategoryFromBackend(
  lang: Lang,
  category: string
): Promise<Product[]> {
  return await fetchFromBackend(lang, {
    clase_categoria: category,
  });
}

/**
 * Obtiene un producto por su id mediante query params (?id=...)
 * directamente desde la API central.
 */
export async function getProductByIdFromBackend(
  lang: Lang,
  id: number | string
): Promise<Product | null> {
  const products = await fetchFromBackend(lang, { id });
  return products[0] ?? null;
}

/**
 * Obtiene un producto por slug (o id numérico) mediante query params
 * directamente desde la API central.
 */
export async function getProductBySlugFromBackend(
  lang: Lang,
  productSlug: string,
  category?: string
): Promise<Product | null> {
  // Si el parámetro recibido es un ID numérico, buscar usando query params ?id=
  if (!isNaN(Number(productSlug)) && String(productSlug).trim() !== '') {
    return getProductByIdFromBackend(lang, Number(productSlug));
  }

  // Si es un slug de texto, buscar por ?slug= en el backend
  const products = await fetchFromBackend(lang, { slug: productSlug });

  if (products.length > 0) {
    return products[0];
  }

  // Si no se encontró por slug directamente y se tiene categoría, probar buscar por categoría
  if (category) {
    const categoryProducts = await fetchFromBackend(lang, { clase_categoria: category });
    const matched = categoryProducts.find((p) => p.slug === productSlug);
    if (matched) {
      return matched;
    }
  }

  return null;
}

// Backward-compatible named exports
export const getProducts = getProductsFromBackend;
export const getProductsByCategory = getProductsByCategoryFromBackend;
export const getProductBySlug = getProductBySlugFromBackend;
export const getProductById = getProductByIdFromBackend;
