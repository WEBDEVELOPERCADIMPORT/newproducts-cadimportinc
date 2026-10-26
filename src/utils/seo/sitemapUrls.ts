import { LANGUAGES, type Lang } from '../../i18n/config.i18n';
import newProductsData from '../../data/new-products/new-products.data.json';
import type { NewProductsData } from '../../types/product';

const BASE_URL = 'https://newproducts.cadimportinc.com';
const langs = Object.keys(LANGUAGES) as Lang[];

/**
 * Generate New Products URLs for all languages
 */
export const getNewProductsUrls = (): string[] => {
  const urls: string[] = [];
  const typedData = newProductsData as NewProductsData;

  for (const lang of langs) {
    // List page (Home)
    urls.push(`${BASE_URL}/${lang}/`);

    // Individual product proposal detail pages
    const products = typedData.products[lang] ?? typedData.products.es ?? [];
    for (const product of products) {
      if (product.slug) {
        urls.push(`${BASE_URL}/${lang}/nuevos-productos/${product.slug}`);
      }
    }
  }

  return [...new Set(urls)];
};

/**
 * Combine all URLs for the Astro sitemap configuration.
 */
export const getAllSitemapUrls = (): string[] => {
  return [
    ...getNewProductsUrls(),
  ];
};
