import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import newProductsData from '../../data/new-products/new-products.data.json';
import type { ProductProposal, NewProductsData } from '../../types/product';

export const getNewProducts = defineAction({
  input: z.object({
    lang: z.enum(['es', 'en']).optional(),
  }).default({}),
  handler: async (input): Promise<{ message: string; data: ProductProposal[] }> => {
    const lang = input?.lang ?? 'es';
    const products = (newProductsData as NewProductsData).products;
    const data = products[lang] ?? products.es;

    return {
      message: 'New products retrieved successfully',
      data,
    };
  },
});
