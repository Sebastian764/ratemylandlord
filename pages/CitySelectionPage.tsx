import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cities } from "../cities/registry";
import { cityStyle } from "../cities/types";

// This directory previews local sites; every profile link enters its city's routes.
export default function CitySelectionPage() {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const groups = cities
    .map((city) => {
      const cityMatches = `${city.name} ${city.state} ${city.campuses}`
        .toLowerCase()
        .includes(query);
      const landlords = city.landlords.filter(
        (landlord) => !landlord.is_deleted && landlord.status === "approved",
      );
      const matches = landlords.filter(
        (landlord) =>
          cityMatches ||
          `${landlord.name} ${landlord.addresses?.join(" ") ?? ""}`
            .toLowerCase()
            .includes(query),
      );
      return { city, landlords, matches };
    })
    .filter((group) => group.matches.length > 0);
  return (
    <div className="city-selection landlord-directory">
      <header className="network-header">
        <Link to="/" className="network-brand">
          <span className="network-mark">r.</span>RateYinzLandlord
        </Link>
        <span className="directory-demo">
          Concept preview · Fictional landlords & reviews
        </span>
      </header>
      <main className="network-main">
        <section className="directory-search" aria-label="Find a landlord">
          <div>
            <h1>Look up your landlord.</h1>
            <p>Ratings and reviews from renters, city by city.</p>
          </div>
          <label>
            <span className="sr-only">
              Search landlords, addresses, cities or campuses
            </span>
            <span aria-hidden="true" className="search-symbol">
              ⌕
            </span>
            <input
              type="search"
              placeholder="Landlord, address, city or campus"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </section>
        <nav className="directory-cities" aria-label="Local sites">
          <span>Local sites</span>
          {cities.map((city) => (
            <Link key={city.slug} to={`/${city.slug}`}>
              {city.name} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <div className="directory-results-heading">
          <h2>{query ? "Matching landlords" : "Landlords & tenant reviews"}</h2>
          <span role="status">
            {query
              ? `${groups.reduce((sum, group) => sum + group.matches.length, 0)} results in ${groups.length} cities`
              : "Browse a local site for all reviews"}
          </span>
        </div>
        <div className="directory-grid">
          {groups.map(({ city, landlords, matches }) => (
            <section
              key={city.slug}
              className="directory-city"
              style={cityStyle(city)}
              aria-label={`${city.name} landlords`}
            >
              <header className="directory-city-header">
                <div>
                  <Link to={`/${city.slug}`} className="directory-city-title">
                    {city.name}
                    <span aria-hidden="true"> ↗</span>
                  </Link>
                  <p>{city.campuses}</p>
                </div>
                <Link
                  to={`/${city.slug}`}
                  className="directory-browse"
                  aria-label={`Browse all ${city.name} landlords`}
                >
                  View local site →
                </Link>
              </header>
              {(query ? matches : matches.slice(0, 2)).map((landlord) => {
                const reviews = city.reviews.filter(
                  (review) =>
                    review.landlord_id === landlord.id &&
                    review.city_slug === city.slug &&
                    !review.is_deleted,
                );
                const average = reviews.length
                  ? (
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : null;
                const latest = [...reviews].sort((a, b) =>
                  b.created_at.localeCompare(a.created_at),
                )[0];
                return (
                  <Link
                    key={landlord.id}
                    to={`/${city.slug}/landlord/${landlord.id}`}
                    className="directory-landlord"
                    aria-label={`${landlord.name.replace(/^Demo: /, "")} in ${city.name}, ${average ? `${average} out of 5, ` : ""}${reviews.length} reviews`}
                  >
                    <div className="directory-landlord-top">
                      <div>
                        <h3>{landlord.name.replace(/^Demo: /, "")}</h3>
                        <p className="directory-address">
                          {landlord.addresses?.join(" · ")} · {city.name}
                        </p>
                      </div>
                      <div className="directory-score">
                        <span aria-hidden="true">★ </span>
                        {average ?? "New"}
                        {average && <small> / 5</small>}
                      </div>
                    </div>
                    <div className="directory-review-meta">
                      <span>
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"} in{" "}
                        {city.name}
                      </span>
                      {latest && <span>Latest review · {latest.rating}/5</span>}
                    </div>
                    {latest ? (
                      <blockquote>
                        “
                        {latest.comment.replace(
                          /^\[(?:FICTIONAL [^\]]+|DEMO REVIEW)\]\s*/,
                          "",
                        )}
                        ”
                      </blockquote>
                    ) : (
                      <p className="directory-no-review">
                        No reviews yet. View this landlord.
                      </p>
                    )}
                    <span className="directory-read">
                      Read reviews <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                );
              })}
              {!query && landlords.length > 2 && (
                <Link to={`/${city.slug}`} className="directory-more">
                  See all {landlords.length} landlords in {city.name} →
                </Link>
              )}
            </section>
          ))}
        </div>
        {!groups.length && (
          <div className="directory-empty" role="status">
            <h2>No landlords found</h2>
            <p>Try a different landlord, address, city or campus.</p>
            <button onClick={() => setSearch("")}>Clear search</button>
          </div>
        )}
      </main>
      <footer className="network-footer">
        <span>RateYinzLandlord</span>
        <p>
          Concept preview · All landlords, addresses, and reviews are fictional.
        </p>
      </footer>
    </div>
  );
}
