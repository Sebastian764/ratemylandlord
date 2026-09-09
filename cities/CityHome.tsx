import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useCity } from "./context";
import { Link } from "./routing";
import LandlordCard from "../components/LandlordCard";

export default function CityHome({
  heading,
  note,
}: {
  heading: string;
  note?: string;
}) {
  const city = useCity()!;
  const { landlords, loading } = useData();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const matches = landlords.filter((l) =>
    `${l.name} ${l.addresses?.join(" ")}`.toLowerCase().includes(query),
  );
  return (
    <div className="city-home">
      <section className="city-hero">
        <p className="city-eyebrow">
          {city.campuses} / {city.state}
        </p>
        <h1>{heading}</h1>
        <p>{city.description}</p>
        <label className="city-search">
          Find your next landlord
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by landlord or address"
          />
        </label>
        {note && <p className="city-note">{note}</p>}
      </section>
      <section className="city-results" aria-label="Local landlords">
        <div className="city-results-heading">
          <div>
            <p className="city-eyebrow">The local picture</p>
            <h2>Landlords in {city.name}</h2>
          </div>
          <Link to="/add-landlord">Add a landlord →</Link>
        </div>
        <p className="city-local-note">
          Ratings and reviews on this site reflect {city.name} only.
        </p>
        {loading ? (
          <p>Loading landlords…</p>
        ) : matches.length ? (
          <div className="city-card-grid">
            {matches.map((landlord) => (
              <LandlordCard key={landlord.id} landlord={landlord} />
            ))}
          </div>
        ) : (
          <p role="status">No landlords found. Try another name or address.</p>
        )}
      </section>
    </div>
  );
}
