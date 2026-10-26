import { defineAction } from 'astro:actions';
import { getReviews } from './reviews/getReviews.action';
import { getNewProducts } from './products/getNewProducts.action';
import { getProductProposalBySlug } from './products/getProductProposalBySlug.action';

export const server = {
  miAccion: defineAction({
    handler: async () => {
      return { success: true };
    },
  }),
  getReviews,
  getNewProducts,
  getProductProposalBySlug,
};
