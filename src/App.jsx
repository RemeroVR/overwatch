import React, { useEffect, useState } from "react";
import NewsFeed from "./components/NewsFeed.jsx";
import MapView from "./components/MapView.jsx";
import "./App.css";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "UA", name: "Ukraine" },
  { code: "CN", name: "China" },
  { code: "RU", name: "Russia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SY", name: "Syria" },
  { code: "IL", name: "Israel" },
];

const IMPACT_LEVELS = ["All", "High", "Medium", "Low"];
const CATEGORIES = ["All", "Security", "Diplomacy", "Infrastructure", "Public Safety"];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [watchlist, setWatchlist] = useState([]);
  const [impactFilter, setImpactFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [intelSource, setIntelSource] = useState("all");
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("overwatch_watchlist");
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("overwatch_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  function toggleWatchlist(code) {
    setWatchlist((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  const isWatched = watchlist.includes(selectedCountry.code);

  function handleRefresh() {
    setRefreshToken((t) => t + 1);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-dot" />
          <div>
            <h1>Overwatch</h1>
            <p>Global intel console · GDELT + GNews</p>
          </div>
        </div>

        <div className="header-controls">
          <div className="control-group">
            <label>Country</label>
            <select
              value={selectedCountry.code}
              onChange={(e) => {
                const c = COUNTRIES.find((c) => c.code === e.target.value);
                setSelectedCountry(c);
              }}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Impact</label>
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
            >
              {IMPACT_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Intel Source</label>
            <select
              value={intelSource}
              onChange={(e) => setIntelSource(e.target.value)}
            >
              <option value="all">All</option>
              <option value="military">Military</option>
              <option value="threats">Threats</option>
              <option value="crime">Crime</option>
              <option value="history">History</option>
              <option value="education">Education</option>
              <option value="republican">Republican</option>
              <option value="democratic">Democratic</option>
            </select>
          </div>

          <button
            className={`watch-btn ${isWatched ? "watched" : ""}`}
            onClick={() => toggleWatchlist(selectedCountry.code)}
          >
            {isWatched ? "★ Watching" : "☆ Watch"}
          </button>

          <button className="watch-btn" onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2>Watchlist</h2>
            {watchlist.length === 0 && (
              <p className="sidebar-empty">No countries pinned yet.</p>
            )}
            <ul>
              {watchlist.map((code) => {
                const c = COUNTRIES.find((c) => c.code === code);
                if (!c) return null;
                return (
                  <li key={code}>
                    <button onClick={() => setSelectedCountry(c)}>
                      {c.name} <span>({c.code})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="sidebar-section">
            <h2>Context</h2>
            <p className="sidebar-text">
              Overwatch fuses GDELT events and GNews RSS headlines into a single
              country‑scoped intel feed.
            </p>
          </div>
        </aside>

        <main className="main-panel">
          <section className="panel-top">
            <NewsFeed
              countryObj={selectedCountry}
              impactFilter={impactFilter}
              categoryFilter={categoryFilter}
              intelSource={intelSource}
              refreshToken={refreshToken}
            />
          </section>

          <section className="panel-bottom">
            <MapView
              country={selectedCountry}
              countries={COUNTRIES}
              watchlist={watchlist}
              onSelectCountry={(code) => {
                const c = COUNTRIES.find((c) => c.code === code);
                if (c) setSelectedCountry(c);
              }}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
