import React, { useEffect, useState } from "react";
import { getIntel } from "../api/intelClient";

function impactColor(level) {
  switch (level) {
    case "High":
      return "#f97373";
    case "Medium":
      return "#facc6b";
    case "Low":
      return "#4ade80";
    default:
      return "#9ca3af";
  }
}

export default function NewsFeed({
  countryObj,
  impactFilter,
  categoryFilter,
  intelSource,
  refreshToken,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const data = await getIntel(countryObj, intelSource);
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [countryObj, intelSource, refreshToken]);

  const filtered = items.filter((item) => {
    const impactOk = impactFilter === "All" || item.impact === impactFilter;
    const categoryOk =
      categoryFilter === "All" || item.category === categoryFilter;
    return impactOk && categoryOk;
  });

  return (
    <div className="news-feed">
      <div className="news-feed-header">
        <h2>Briefings · {countryObj.code}</h2>
        <span className="count-pill">{filtered.length} reports</span>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="muted">No reports match current filters.</p>
      )}

      <ul>
        {filtered.map((item) => (
          <li key={item.id} className="news-item">
            <div className="news-header">
              <span
                className="impact-pill"
                style={{ backgroundColor: impactColor(item.impact) }}
              >
                {item.impact}
              </span>
              <span className="news-category">{item.category}</span>
              <span className="news-time">
                {new Date(item.time).toLocaleString()}
              </span>
            </div>

            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <div className="news-footer">
              <span className="news-source">{item.source}</span>
              <span className="news-country">{item.country}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
