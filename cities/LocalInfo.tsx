import React from "react";
import { useCity } from "./context";

export default function LocalInfo({
  kind,
}: {
  kind: "resources" | "contact" | "terms";
}) {
  const city = useCity()!;
  return (
    <section className="city-results">
      <p className="city-eyebrow">{city.name} community preview</p>
      <h1 className="text-3xl font-bold mb-4">
        {kind === "resources"
          ? "Local renter resources"
          : kind === "contact"
            ? "Your local team"
            : "About this demo"}
      </h1>
      <p>
        {kind === "resources"
          ? `This is where the ${city.name} team can add campus housing guides, tenant organizations, and local support.`
          : kind === "contact"
            ? `A future ${city.name} team can publish their own contact information here. No local team or support inbox is active in this demo.`
            : "All listings and reviews are fictional. Guest reviews are held in memory and disappear when you leave this city or refresh. Accounts, verification, and moderation are not active in this preview."}
      </p>
    </section>
  );
}
