import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import newProductsData from '../../data/new-products/new-products.data.json';
import type { ProductProposal, NewProductsData } from '../../types/product';

export const getProductProposalBySlug = defineAction({
  input: z.object({
    slug: z.string(),
    lang: z.enum(['es', 'en']).optional(),
  }),
  handler: async ({ slug, lang }): Promise<{ message: string; data: ProductProposal }> => {
    const products = (newProductsData as NewProductsData).products;
    const targetLang = lang ?? 'es';
    let product = products[targetLang]?.find((p) => p.slug === slug);

    if (!product && targetLang !== 'es') {
      product = products.es?.find((p) => p.slug === slug);
    }

    if (!product) {
      throw new ActionError({
        code: 'NOT_FOUND',
        message: 'Product proposal not found',
      });
    }

    return {
      message: 'Product proposal retrieved successfully',
      data: product,
    };
  },
});
