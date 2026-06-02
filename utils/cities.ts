// ---------------------------------------------------------------------------
// City model
//
// A city is always represented as a canonical "City, ST" string, where ST is a
// USPS state/territory code. This lets ANYONE in the US add a landlord in ANY
// city: the state comes from a fixed, finite list (below), while the city name
// is free text. The set of "known" cities is NOT hard-coded — it is derived
// from the data (see IApiService.getCities) and grows automatically as people
// add landlords. The helpers here keep that set clean by normalizing and
// de-duplicating near-identical spellings.
// ---------------------------------------------------------------------------

export interface StateOption {
  code: string;
  name: string;
}

// 50 states + DC + the 5 inhabited US territories. This list is stable and
// finite (unlike cities), so hard-coding it is appropriate.
export const US_STATES: StateOption[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  // Territories
  { code: 'AS', name: 'American Samoa' },
  { code: 'GU', name: 'Guam' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'VI', name: 'U.S. Virgin Islands' },
];

const STATE_CODES = new Set(US_STATES.map((s) => s.code));

export function isValidStateCode(code: string): boolean {
  return STATE_CODES.has(code.trim().toUpperCase());
}

export const MAX_CITY_NAME_LENGTH = 85; // longest real US place name (~45) with comfortable headroom

// Allowed city characters: letters (incl. accented via \p{L}), marks (é etc.),
// spaces, apostrophes (straight + curly), hyphens, and periods. Must start with
// a letter and (if longer than one character) end with a letter, so trailing
// punctuation/space is rejected while single-letter names (e.g. "Y, AK") pass.
// Covers "St. Louis", "Winston-Salem", "O'Fallon", "Coeur d'Alene", "Española".
const CITY_NAME_REGEX = /^\p{L}([\p{L}\p{M} '’.\-]*\p{L})?$/u;

/** Collapse whitespace, trim, normalize unicode and curly apostrophes. */
export function cleanCityName(raw: string): string {
  return raw
    .normalize('NFC')
    .replace(/[’]/g, "'") // unify curly → straight apostrophe
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Match key used to detect that two city spellings are "the same place" so the
 * tracked set doesn't accumulate near-duplicates. Case-insensitive, ignores
 * periods (St Louis == St. Louis) and apostrophes. NOTE: it deliberately does
 * NOT try to equate abbreviations like "St." vs "Saint" or "Mt" vs "Mount" —
 * that is a data-cleaning problem out of scope here.
 */
export function cityMatchKey(city: string, state: string): string {
  const c = cleanCityName(city)
    .toLowerCase()
    .replace(/[.']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return `${c}|${state.trim().toUpperCase()}`;
}

export interface CanonicalCity {
  city: string; // cleaned display name, e.g. "St. Louis"
  state: string; // USPS code, e.g. "MO"
  display: string; // "St. Louis, MO"
  key: string; // dedup key
}

/**
 * Validate + build a canonical city from a raw city name and state code.
 * Returns null if the city name is empty/too long/invalid or the state is not a
 * recognized US state/territory.
 */
export function buildCity(rawCity: string, rawState: string): CanonicalCity | null {
  const city = cleanCityName(rawCity ?? '');
  const state = (rawState ?? '').trim().toUpperCase();
  if (!city || city.length > MAX_CITY_NAME_LENGTH) return null;
  if (!CITY_NAME_REGEX.test(city)) return null;
  if (!STATE_CODES.has(state)) return null;
  return {
    city,
    state,
    display: `${city}, ${state}`,
    key: cityMatchKey(city, state),
  };
}

/** Parse a canonical "City, ST" string back into its parts (or null if malformed). */
export function parseCity(value: string): CanonicalCity | null {
  if (!value) return null;
  const idx = value.lastIndexOf(',');
  if (idx === -1) return null;
  return buildCity(value.slice(0, idx), value.slice(idx + 1));
}

/**
 * Reconcile a newly-entered city against the set of already-known cities so we
 * reuse an existing canonical spelling instead of creating a near-duplicate.
 * Falls back to the candidate's own display when it's genuinely new.
 */
export function reconcileCity(candidate: CanonicalCity, knownCities: string[]): string {
  for (const known of knownCities) {
    const parsed = parseCity(known);
    if (parsed && parsed.key === candidate.key) return known;
  }
  return candidate.display;
}

/** City names already known for a given state (used for add-form suggestions). */
export function knownCityNamesInState(knownCities: string[], stateCode: string): string[] {
  const state = stateCode.trim().toUpperCase();
  const names = new Set<string>();
  for (const known of knownCities) {
    const parsed = parseCity(known);
    if (parsed && parsed.state === state) names.add(parsed.city);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}
