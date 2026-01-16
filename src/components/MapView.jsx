import React from "react";

export default function MapView({ country, countries, watchlist, onSelectCountry }) {
  return (
    <div className="map-view">
      <h2>Map · {country.name}</h2>
      <p className="muted">
        (Map placeholder) — hook in a real map later. Click a country below to switch.
      </p>
      <div className="map-country-list">
        {countries.map((c) => (
          <button
            key={c.code}
            className={`map-country-btn ${
              c.code === country.code ? "active" : ""
            }`}
            onClick={() => onSelectCountry(c.code)}
          >
            {c.name} {watchlist.includes(c.code) ? "★" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
