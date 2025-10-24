// components/brands.ts
import rawBrands from "./brands.json";

export type BrandSchema = {
  placeholders: string[];
  counts: Record<string, number>;
};

export type BrandsSchema = {
  generated_at: string;

  brands: Record<string, BrandSchema>;
};

const brandsSchema = rawBrands as BrandsSchema;

export default brandsSchema;
