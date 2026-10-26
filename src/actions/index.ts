// src/actions/index.ts
import { getReviews } from './reviews/getReviews.action';
import {
  getProducts,
  getNewProducts,
  getProductsByCategory,
  getProductBySlug,
  getProductById,
  getProductsForCategory,
  getProdcutBySlug,
  getProductProposalBySlug,
} from './products/products.action';

export const server = {
  getReviews,
  getProducts,
  getNewProducts,
  getProductsByCategory,
  getProductBySlug,
  getProductById,
  getProductsForCategory,
  getProdcutBySlug,
  getProductProposalBySlug,
};
