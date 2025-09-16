import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { isEventClosed } from "../utils/EventExpired";

// Local helpers (unchanged)
const toLocalDate = (dateStr, timeStr = "00:00") => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const hhmm = String(timeStr || "00:00")
    .slice(0, 5)
    .padStart(5, "0");
  const d = new Date(`${dateStr}T${hhmm}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};
const compareEventsDesc = (a, b) => {
  const ad = toLocalDate(a?.date, a?.time)?.getTime() ?? -Infinity;
  const bd = toLocalDate(b?.date, b?.time)?.getTime() ?? -Infinity;
  return bd - ad;
};

const MyEvents = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { events, handleDeleteEvent } = useData();

  const myEvents = useMemo(() => {
    const list = (events || []).filter(
      (e) => e.organizerId === currentUser?.id
    );
    return list.sort(compareEventsDesc);
  }, [events, currentUser?.id]);

  const onDelete = async (ev) => {
    const ok = window.confirm(`Delete "${ev.title}"? This cannot be undone.`);
    if (!ok) return;
    try {
      await handleDeleteEvent?.(ev.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const StatusBadge = ({ ev }) => {
    const closed = isEventClosed(ev.date, ev.time);
    const cap = Number(ev.capacity) || 0;
    const booked = Number(ev.bookedUsers?.length || 0);
    const remaining = Math.max(cap - booked, 0);
    if (closed) return <span className="badge bg-secondary">Closed</span>;
    if (cap === 0) return <span className="badge bg-danger">No capacity</span>;
    if (remaining === 0) return <span className="badge bg-danger">Full</span>;
    if (remaining < 15)
      return (
        <span className="badge bg-warning text-dark">
          Only {remaining} left
        </span>
      );
    return <span className="badge bg-success">{remaining} left</span>;
  };

  const MobileCard = ({ ev }) => (
    <div key={ev.id} className="card mb-3 shadow-sm">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h3 className="h6 fw-semibold mb-0 me-2">{ev.title}</h3>
          <StatusBadge ev={ev} />
        </div>
        <div className="text-muted small mb-2">
          {ev.date} • {String(ev.time || "").padStart(5, "0")}
        </div>
        <div className="text-muted small mb-3">
          <i className="bi bi-geo-alt me-2"></i>
          <span className="text-break">{ev.location}</span>
        </div>
        <div className="d-grid gap-2">
          <Link
            to={`/event/${ev.id}`}
            className="btn btn-outline-primary btn-sm"
          >
            View
          </Link>
          <div className="d-flex gap-2">
            <Link
              className="btn btn-outline-info btn-sm w-100"
              to={`/event/edit/${ev.id}`}
            >
              Edit
            </Link>
            <button
              className="btn btn-outline-danger btn-sm w-100"
              onClick={() => onDelete(ev)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!events) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading your events…</p>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 align-items-stretch align-items-md-center justify-content-between mb-3 mb-md-4">
        <div>
          <h1 className="h3 h2-md fw-bold mb-1 text-uppercase">My Events</h1>
          <div className="text-muted small">
            Manage the events you’ve created.
          </div>
        </div>
        <div className="d-grid d-md-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/create")}
          >
            + Create Event
          </button>
        </div>
      </div>

      {myEvents.length === 0 ? (
        <div className="alert alert-info d-flex align-items-center justify-content-between">
          <div>You haven’t created any events yet.</div>
          <Link to="/create" className="btn btn-primary btn-sm">
            Create One
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="d-md-none">
            {myEvents.map((ev) => (
              <MobileCard key={ev.id} ev={ev} />
            ))}
          </div>

          {/* Desktop table */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-sm table-hover align-middle">
              <thead
                className="table-light position-sticky top-0"
                style={{ zIndex: 1 }}
              >
                <tr>
                  <th style={{ width: "34%" }}>Title</th>
                  <th
                    style={{ width: "12%" }}
                    className="d-none d-md-table-cell"
                  >
                    Date
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="d-none d-lg-table-cell"
                  >
                    Time
                  </th>
                  <th style={{ width: "20%" }}>Location</th>
                  <th
                    style={{ width: "8%" }}
                    className="text-center d-none d-lg-table-cell"
                  >
                    Capacity
                  </th>
                  <th
                    style={{ width: "8%" }}
                    className="text-center d-none d-lg-table-cell"
                  >
                    Booked
                  </th>
                  <th style={{ width: "8%" }}>Status</th>
                  <th style={{ width: "10%" }} className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {myEvents.map((ev) => (
                  <tr key={ev.id}>
                    <td className="text-break fw-semibold">
                      <Link
                        to={`/event/${ev.id}`}
                        className="text-decoration-none"
                      >
                        {ev.title}
                      </Link>
                      <div className="text-muted small d-md-none">
                        {ev.date} • {String(ev.time || "").padStart(5, "0")}
                      </div>
                    </td>
                    <td className="text-nowrap d-none d-md-table-cell">
                      {ev.date}
                    </td>
                    <td className="text-nowrap d-none d-lg-table-cell">
                      {ev.time}
                    </td>
                    <td className="text-break">{ev.location}</td>
                    <td className="text-center d-none d-lg-table-cell">
                      {Number(ev.capacity) || 0}
                    </td>
                    <td className="text-center d-none d-lg-table-cell">
                      {Number(ev.bookedUsers?.length || 0)}
                    </td>
                    <td>
                      <StatusBadge ev={ev} />
                    </td>
                    <td className="text-end">
                      <div className="btn-group gap-3">
                        <Link
                          to={`/event/${ev.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View
                        </Link>
                        <Link
                          to={`/event/edit/${ev.id}`}
                          className="btn btn-outline-info btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDelete(ev)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MyEvents;
