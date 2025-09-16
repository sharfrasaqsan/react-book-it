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

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">
            Explore All Events
          </h1>
          <div className="text-muted">
            Click “Details” for full event information.
          </div>
        </div>
        <div className="input-group w-auto">
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
        <div className="table-responsive">
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
      )}
    </div>
  );
};

export default Events;
