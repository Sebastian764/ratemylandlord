import type { Landlord } from "../types";
import type { CityReview } from "./types";

export const SHARED_LANDLORD_ID = 900;
// One identity across cities; addresses and scores are local projections.
export function makeDemoData(slug: string, name: string, seed: number) {
  const landlords: Landlord[] = [
    "Demo: Lantern Housing Group",
    `Demo: ${name} Maple Rentals`,
    `Demo: ${name} Juniper Homes`,
  ].map((landlordName, i) => ({
    id: i === 0 ? SHARED_LANDLORD_ID : seed * 10 + i,
    name: landlordName,
    city: name,
    addresses: [`${100 + i} Fictional Lane`],
    status: "approved",
    is_deleted: false,
    created_at: "2026-01-01T12:00:00Z",
  }));
  const comments = [
    "The repair request was handled the next day, and move-in instructions were clear.",
    "Communication was friendly, but the heating repair took several follow-ups.",
    "A quiet apartment and a straightforward deposit return. I would rent here again.",
    "The apartment was ready on time. Getting an answer about parking took a week.",
    "Maintenance arrived when promised and gave advance notice before entering.",
    "The location worked well for classes, though the shared laundry needed attention.",
  ];
  const reviews: CityReview[] = landlords.flatMap((landlord, i) =>
    [0, 1].map((j) => {
      const rating = 2 + ((seed + i + j) % 4);
      return {
        id: seed * 100 + i * 2 + j,
        landlord_id: landlord.id,
        city_slug: slug,
        rating,
        communication: rating,
        maintenance: Math.max(1, rating - j),
        respect: Math.min(5, rating + 1),
        comment: `[FICTIONAL ${name.toUpperCase()} REVIEW] ${comments[i * 2 + j]}`,
        property_address: `${landlord.addresses![0]}, ${name} (fictional address)`,
        rent_amount: 800 + seed * 100 + i * 75 + j * 50,
        would_rent_again: rating >= 4,
        verification_status: "unverified",
        created_by_student: false,
        is_deleted: false,
        created_at: `2026-0${j + 5}-12T12:00:00Z`,
        updated_at: `2026-0${j + 5}-12T12:00:00Z`,
      };
    }),
  );
  return { landlords, reviews };
}
