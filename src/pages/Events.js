import { useMemo, useState } from "react";
import Event from "../components/Event";
import { useData } from "../context/DataContext";

const Events = () => {
  const { events = [], loading } = useData() || {};
  const [filters, setFilters] = useState({ q: "" });

  const filtered = useMemo(() => {
    let list = Array.isArray(events) ? [...events] : [];
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }
    return list.reverse();
  }, [events, filters]);

  const MobileCard = ({ ev, index }) => {
    return (
      <div key={ev.id} className="card mb-3 shadow-sm">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start">
            <h3 className="h6 fw-semibold mb-1 me-2">{ev.title}</h3>
            <span className="badge bg-light text-dark">{index + 1}</span>
          </div>
          <div className="text-muted small mb-2">
            {ev.description?.slice(0, 90) || ""}
            {(ev.description?.length ?? 0) > 90 ? "…" : ""}
          </div>

          <ul className="list-unstyled small text-muted mb-3">
            <li className="mb-1">
              <i className="bi bi-calendar-event me-2"></i>
              {ev.date || "—"} <span className="mx-1">•</span>{" "}
              <i className="bi bi-clock me-2"></i>
              {ev.time || "—"}
            </li>
            <li className="mb-1 text-break">
              <i className="bi bi-geo-alt me-2"></i>
              {ev.location || "—"}
            </li>
            <li className="mb-1">
              <i className="bi bi-people me-2"></i>Capacity:{" "}
              {Number(ev.capacity) || 0}
            </li>
          </ul>

          <div className="d-grid">
            <a href={`/event/${ev.id}`} className="btn btn-primary btn-sm">
              Details
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 align-items-stretch align-items-md-center justify-content-between mb-3 mb-md-4">
        <div>
          <h1 className="h3 h2-md fw-bold mb-1 text-uppercase">
            Explore All Events
          </h1>
          <div className="text-muted small">
            Click “Details” for full event information.
          </div>
        </div>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
          <input
            className="form-control"
            placeholder="Search events"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 mb-0">Loading events…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-info">No events found.</div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="d-md-none">
            {filtered.map((ev, idx) => (
              <MobileCard key={ev.id} ev={ev} index={idx} />
            ))}
          </div>

          {/* Desktop: table */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-sm table-hover align-middle">
              <thead
                className="table-light position-sticky top-0"
                style={{ zIndex: 1 }}
              >
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ev, index) => (
                  <Event key={ev.id} event={ev} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Events;
