import type { CityDefinition } from "./types";

const modules = import.meta.glob<{ default: CityDefinition }>("./*/city.ts", {
  eager: true,
});
export const cities = Object.entries(modules)
  .filter(([path]) => !path.startsWith("./_template/"))
  .map(([path, module]) => {
    const city = module.default;
    if (
      !/^[a-z]+(?:-[a-z]+)*$/.test(city.slug) ||
      path !== `./${city.slug}/city.ts`
    ) {
      throw new Error(`City folder must match its lowercase URL slug: ${path}`);
    }
    if (
      city.reviews.some(
        (review) =>
          review.city_slug !== city.slug ||
          !city.landlords.some((l) => l.id === review.landlord_id),
      )
    ) {
      throw new Error(`Invalid city review fixtures: ${city.slug}`);
    }
    return city;
  })
  .sort((a, b) =>
    a.slug === "pittsburgh"
      ? -1
      : b.slug === "pittsburgh"
        ? 1
        : a.name.localeCompare(b.name),
  );

export const findCity = (slug: string) =>
  cities.find((city) => city.slug === slug);
