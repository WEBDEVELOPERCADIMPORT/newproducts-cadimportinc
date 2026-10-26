import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { LANGUAGES, type Lang } from '../../i18n/config.i18n';
import type { Product, NewProductsData } from '../../types/product';
import {
  getProductsFromBackend,
  getProductsByCategoryFromBackend,
  getProductBySlugFromBackend,
  getProductByIdFromBackend,
} from '../../services/products.service';
import newProductsData from '../../data/new-products/new-products.data.json';

const langKeys = Object.keys(LANGUAGES) as [Lang, ...Lang[]];

export const getProducts = defineAction({
  input: z
    .object({
      lang: z.enum(langKeys).optional(),
    })
    .default({}),
  handler: async (input): Promise<{ message: string; data: Product[] }> => {
    const lang = (input?.lang ?? 'es') as Lang;
    let products = await getProductsFromBackend(lang);

    if (!products || products.length === 0) {
      const localData = (newProductsData as NewProductsData).products;
      products = localData[lang] ?? localData.es ?? [];
    }

    return {
      message: 'Products retrieved successfully',
      data: products,
    };
  },
});

export const getProductsByCategory = defineAction({
  input: z.object({
    lang: z.enum(langKeys),
    categorySlug: z.string().optional(),
    category: z.string().optional(),
  }),
  handler: async (input): Promise<{ message: string; data: Product[] }> => {
    const { lang } = input;
    const cat = input.categorySlug || input.category || '';
    let filtered = await getProductsByCategoryFromBackend(lang, cat);

    if (!filtered || filtered.length === 0) {
      const localData = (newProductsData as NewProductsData).products;
      const all = localData[lang] ?? localData.es ?? [];
      filtered = all.filter((p) => p.clase_categoria.toLowerCase() === cat.toLowerCase());
    }

    return {
      message: 'Products retrieved successfully',
      data: filtered,
    };
  },
});

export const getProductBySlug = defineAction({
  input: z.object({
    lang: z.enum(langKeys),
    categorySlug: z.string().optional(),
    productSlug: z.string().optional(),
    slug: z.string().optional(),
    id: z.union([z.number(), z.string()]).optional(),
  }),
  handler: async (input): Promise<{ message: string; data: Product | null }> => {
    const { lang, categorySlug, id } = input;
    const targetSlug = input.productSlug || input.slug || '';

    let product: Product | null = null;

    if (id !== undefined && id !== null) {
      product = await getProductByIdFromBackend(lang, id);
    } else if (targetSlug) {
      product = await getProductBySlugFromBackend(lang, targetSlug, categorySlug);
    }

    // Fallback to local dataset if not found online
    if (!product && targetSlug) {
      const localData = (newProductsData as NewProductsData).products;
      const all = localData[lang] ?? localData.es ?? [];
      product = all.find((p) => p.slug === targetSlug) ?? null;
      if (!product && lang !== 'es') {
        product = localData.es?.find((p) => p.slug === targetSlug) ?? null;
      }
    }

    return {
      message: product ? 'Product retrieved successfully' : 'Product not found',
      data: product,
    };
  },
});

export const getProductById = defineAction({
  input: z.object({
    lang: z.enum(langKeys),
    id: z.union([z.number(), z.string()]),
  }),
  handler: async (input): Promise<{ message: string; data: Product | null }> => {
    const { lang, id } = input;
    let product = await getProductByIdFromBackend(lang, id);

    if (!product) {
      const localData = (newProductsData as NewProductsData).products;
      const all = localData[lang] ?? localData.es ?? [];
      product = all.find((p) => String(p.id) === String(id)) ?? null;
    }

    return {
      message: product ? 'Product retrieved successfully' : 'Product not found',
      data: product,
    };
  },
});

// Backward compatibility aliases
export const getNewProducts = getProducts;
export const getProductsForCategory = getProductsByCategory;
export const getProdcutBySlug = getProductBySlug;
export const getProductProposalBySlug = getProductBySlug;
