import React from "react";
import { Link } from "react-router-dom";
import { cities } from "./registry";
import { useCity } from "./context";

export default function CityNavigation() {
  const city = useCity()!;
  return (
    <nav className="city-sites-nav" aria-label="City sites">
      <div className="city-sites-inner">
        <span className="city-sites-label">City sites</span>
        <div className="city-sites-links">
          {cities.map((item) => (
            <Link
              key={item.slug}
              to={`/${item.slug}`}
              aria-current={item.slug === city.slug ? "page" : undefined}
              title={`${item.name} · ${item.campuses}`}
            >
              {item.name}
              {item.slug === city.slug && (
                <span className="city-current-dot" aria-hidden="true" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
