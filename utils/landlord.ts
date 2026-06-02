import type { Landlord } from '../types';

/**
 * Returns the full list of cities a landlord has properties in.
 *
 * A landlord may own/manage properties across multiple cities. The database
 * (and `Landlord`) keeps a single primary `city` for backward-compat plus an
 * optional `cities` array with the complete set. When `cities` is missing or
 * empty we fall back to `[city]` so callers can always rely on a non-empty list.
 */
export function getLandlordCities(landlord: Pick<Landlord, 'city' | 'cities'>): string[] {
  if (landlord.cities && landlord.cities.length > 0) {
    return landlord.cities;
  }
  return landlord.city ? [landlord.city] : [];
}

/**
 * True if the landlord has at least one property in `city` (case-insensitive).
 */
export function landlordHasCity(landlord: Pick<Landlord, 'city' | 'cities'>, city: string): boolean {
  const target = city.trim().toLowerCase();
  return getLandlordCities(landlord).some((c) => c.toLowerCase() === target);
}

/**
 * Distinct, alphabetically-sorted list of every city across the given landlords.
 * Used to populate the city filter dropdown on the search page.
 */
export function getAllCities(landlords: Landlord[]): string[] {
  const seen = new Set<string>();
  for (const landlord of landlords) {
    for (const city of getLandlordCities(landlord)) {
      if (city) seen.add(city);
    }
  }
  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}
