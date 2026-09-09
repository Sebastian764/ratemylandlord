import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cities } from "./registry";
import { useCity } from "./context";

export default function CityNavigation() {
  const city = useCity()!;
  const { pathname } = useLocation();
  const landlordId = pathname.match(/\/landlord\/(\d+)\/?$/)?.[1];
  return (
    <nav className="city-switcher" aria-label="Choose a city">
      <Link to="/">← All cities</Link>
      <span aria-hidden="true">/</span>
      {cities.map((item) => {
        const sameLandlord =
          landlordId && item.landlords.some((l) => l.id === Number(landlordId));
        return (
          <Link
            key={item.slug}
            to={`/${item.slug}${sameLandlord ? `/landlord/${landlordId}` : ""}`}
            aria-current={item.slug === city.slug ? "page" : undefined}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
