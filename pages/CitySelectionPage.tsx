import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cities } from "../cities/registry";
import { cityStyle } from "../cities/types";

export default function CitySelectionPage() {
  const [search, setSearch] = useState("");
  const matches = cities.filter((city) =>
    `${city.name} ${city.state} ${city.campuses}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  return (
    <div className="city-selection">
      <header className="network-header">
        <Link to="/" className="network-brand">
          <span className="network-mark">r.</span>Rate My Landlord
        </Link>
        <span className="network-label">Local knowledge. Better renting.</span>
      </header>
      <main className="network-main">
        <div className="network-intro">
          <p className="city-eyebrow">A community for every city</p>
          <h1>
            Your next place.
            <br />
            <span>Your city’s perspective.</span>
          </h1>
          <p>
            Get to know your landlord before you get the keys.
            <br className="desktop-break" /> Choose your city to hear from the
            renters who came before you.
          </p>
        </div>
        <div className="network-search-row">
          <h2>
            Find your community <span>{cities.length} cities</span>
          </h2>
          <label className="network-search">
            <span className="sr-only">Search cities or campuses</span>
            <input
              type="search"
              placeholder="Search a city or campus"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
        <div className="network-grid">
          {matches.map((city, index) => (
            <Link
              key={city.slug}
              to={`/${city.slug}`}
              className="network-card"
              style={cityStyle(city)}
            >
              <div className="network-card-art" aria-hidden="true">
                <span className="city-number">
                  0{index + 1} / {city.state}
                </span>
                <div className="town-buildings">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span className="city-monogram">
                  {city.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </span>
              </div>
              <div className="network-card-body">
                <p>{city.campuses}</p>
                <div>
                  <h3>{city.name}</h3>
                  <span aria-hidden="true">↗</span>
                </div>
                <span>
                  {city.slug === "pittsburgh"
                    ? "The original Pittsburgh experience"
                    : city.brand}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {!matches.length && (
          <p role="status" className="network-empty">
            No matching cities yet. Try a nearby city or a campus name.
          </p>
        )}
        <aside className="network-invitation">
          <div>
            <p className="city-eyebrow">Made local, together</p>
            <h2>Every town has its own story.</h2>
            <p>
              Each community has room for its own identity, design, and local
              voice.
            </p>
          </div>
          <span>One network. Many neighborhoods.</span>
        </aside>
      </main>
      <footer className="network-footer">
        <span>Rate My Landlord</span>
        <p>
          Concept preview · All landlords, addresses, and reviews are fictional.
        </p>
      </footer>
    </div>
  );
}
