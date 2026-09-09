import type { ComponentType, CSSProperties } from "react";
import type { Landlord, Review } from "../types";

// Prototype-only metadata. The database Review type/schema stays unchanged.
export type CityReview = Review & { city_slug: string };
export type CityPage =
  | "landlord"
  | "addReview"
  | "editReview"
  | "addLandlord"
  | "login"
  | "register"
  | "contact"
  | "terms"
  | "admin"
  | "resources"
  | "resetPassword"
  | "verifyEmail"
  | "notFound";
export interface CityDefinition {
  slug: string;
  name: string;
  state: string;
  campuses: string;
  brand: string;
  description: string;
  accent: string;
  background: string;
  Home: ComponentType;
  // Optional full layout override; render children to retain shared routes.
  Layout?: ComponentType<{ children: React.ReactNode }>;
  pages?: Partial<Record<CityPage, ComponentType>>;
  landlords: Landlord[];
  reviews: CityReview[];
}
export const cityStyle = (city: CityDefinition): CSSProperties =>
  ({
    "--city-accent": city.accent,
    "--city-background": city.background,
  }) as CSSProperties;
